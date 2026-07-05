import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { appApi, DailyQuestion, UserSettings } from '@/services/api/app-api';
import { ApiError, isApiConfigured } from '@/services/api/client';
import { useAuth } from '@/contexts/auth-context';

type AppSettings = {
    notificationEnabled: boolean;
    soundEnabled: boolean;
    emailEnabled: boolean;
};

type AppStateContextValue = {
    points: number;
    nickname: string;
    settings: AppSettings;
    claimedRewards: boolean[];
    foodQuantities: number[];
    question: DailyQuestion | null;
    isApiConnected: boolean;
    isLoading: boolean;
    isQuestionLoading: boolean;
    errorMessage: string | null;
    toggleSetting: (setting: keyof AppSettings) => Promise<void>;
    claimReward: (index: number) => Promise<void>;
    submitAnswer: (answer: string) => Promise<void>;
    loadQuestion: () => Promise<void>;
    refresh: () => Promise<void>;
};

const DEFAULT_SETTINGS: AppSettings = {
    notificationEnabled: true,
    soundEnabled: true,
    emailEnabled: false,
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
    const [points, setPoints] = useState(11205);
    const [nickname, setNickname] = useState('사용자');
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [claimedRewards, setClaimedRewards] = useState(
        Array.from({ length: 6 }, () => false)
    );
    const [foodQuantities, setFoodQuantities] = useState([5, 5, 5]);
    const [question, setQuestion] = useState<DailyQuestion | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isQuestionLoading, setIsQuestionLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { isAuthenticated, signOut } = useAuth();

    const loadQuestion = useCallback(async () => {
        if (!isApiConfigured || !isAuthenticated) return;

        setIsQuestionLoading(true);
        setErrorMessage(null);

        try {
            setQuestion(await appApi.generateQuestion());
        } catch (error) {
            setQuestion(null);
            setErrorMessage(getErrorMessage(error));
            await signOutIfUnauthorized(error, signOut);
        } finally {
            setIsQuestionLoading(false);
        }
    }, [isAuthenticated, signOut]);

    const refresh = useCallback(async () => {
        if (!isApiConfigured || !isAuthenticated) return;

        setIsLoading(true);
        setErrorMessage(null);

        const results = await Promise.allSettled([
            appApi.getCurrentUser(),
            appApi.getSettings(),
            appApi.getAttendances(),
            appApi.getFoodInventory(),
        ]);

        const [
            userResult,
            settingsResult,
            attendanceResult,
            inventoryResult,
        ] = results;

        if (userResult.status === 'fulfilled') {
            setNickname(userResult.value.userName || '사용자');
            setPoints(
                Number.isFinite(userResult.value.userPoints)
                    ? userResult.value.userPoints
                    : 0
            );
        }

        if (settingsResult.status === 'fulfilled') {
            setSettings(mapServerSettings(settingsResult.value));
        }

        if (attendanceResult.status === 'fulfilled') {
            const count = Math.min(attendanceResult.value.length, 6);
            setClaimedRewards(
                Array.from({ length: 6 }, (_, index) => index < count)
            );
        }

        if (inventoryResult.status === 'fulfilled') {
            setFoodQuantities(
                inventoryResult.value
                    .slice(0, 3)
                    .map((inventory) => inventory.quantity)
            );
        }

        const failed = results.find(
            (result): result is PromiseRejectedResult =>
                result.status === 'rejected'
        );

        if (failed) {
            setErrorMessage(getErrorMessage(failed.reason));
            await signOutIfUnauthorized(failed.reason, signOut);
        }

        setIsLoading(false);
    }, [isAuthenticated, signOut]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    const value = useMemo<AppStateContextValue>(
        () => ({
            points,
            nickname,
            settings,
            claimedRewards,
            foodQuantities,
            question,
            isApiConnected: isApiConfigured,
            isLoading,
            isQuestionLoading,
            errorMessage,
            toggleSetting: async (setting) => {
                const previous = settings;
                const next = {
                    ...settings,
                    [setting]: !settings[setting],
                };

                setSettings(next);

                if (!isApiConfigured) return;

                try {
                    const updated = await appApi.updateSettings(
                        mapClientSettings(next)
                    );
                    setSettings(mapServerSettings(updated));
                    setErrorMessage(null);
                } catch (error) {
                    setSettings(previous);
                    setErrorMessage(getErrorMessage(error));
                    await signOutIfUnauthorized(error, signOut);
                }
            },
            claimReward: async (index) => {
                const nextRewardIndex = claimedRewards.findIndex(
                    (claimed) => !claimed
                );

                if (index !== nextRewardIndex || claimedRewards[index]) return;

                if (!isApiConfigured) {
                    setClaimedRewards((claimed) =>
                        claimed.map((value, rewardIndex) =>
                            rewardIndex === index ? true : value
                        )
                    );
                    return;
                }

                try {
                    await appApi.checkAttendance();
                    setClaimedRewards((claimed) =>
                        claimed.map((value, rewardIndex) =>
                            rewardIndex === index ? true : value
                        )
                    );
                    void refresh();
                    setErrorMessage(null);
                } catch (error) {
                    setErrorMessage(getErrorMessage(error));
                    await signOutIfUnauthorized(error, signOut);
                }
            },
            submitAnswer: async (answer) => {
                if (!question?.questionCode || !isApiConfigured) {
                    throw new Error('제출할 오늘의 질문이 없습니다.');
                }

                try {
                    await appApi.submitAnswer(question.questionCode, answer);
                    setQuestion({ ...question, isAnswered: true });
                    setErrorMessage(null);
                } catch (error) {
                    setErrorMessage(getErrorMessage(error));
                    await signOutIfUnauthorized(error, signOut);
                    throw error;
                }
            },
            loadQuestion,
            refresh,
        }),
        [
            claimedRewards,
            errorMessage,
            foodQuantities,
            isLoading,
            isQuestionLoading,
            nickname,
            points,
            question,
            loadQuestion,
            refresh,
            settings,
            signOut,
        ]
    );

    return (
        <AppStateContext.Provider value={value}>
            {children}
        </AppStateContext.Provider>
    );
}

export function useAppState() {
    const context = useContext(AppStateContext);

    if (!context) {
        throw new Error('useAppState must be used within AppStateProvider');
    }

    return context;
}

function mapServerSettings(settings: UserSettings): AppSettings {
    return {
        notificationEnabled: settings.userNotificationEnabled,
        soundEnabled: settings.userSoundEnabled,
        emailEnabled: settings.userEmailEnabled,
    };
}

function mapClientSettings(settings: AppSettings): UserSettings {
    return {
        userNotificationEnabled: settings.notificationEnabled,
        userSoundEnabled: settings.soundEnabled,
        userEmailEnabled: settings.emailEnabled,
    };
}

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : '서버 연결에 실패했습니다.';
}

async function signOutIfUnauthorized(
    error: unknown,
    signOut: () => Promise<void>
) {
    if (error instanceof ApiError && error.status === 401) {
        await signOut();
    }
}
