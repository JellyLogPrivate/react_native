import {
    createContext,
    PropsWithChildren,
    useContext,
    useMemo,
    useState,
} from 'react';

type AppSettings = {
    notificationEnabled: boolean;
    soundEnabled: boolean;
    emailEnabled: boolean;
};

type AppStateContextValue = {
    settings: AppSettings;
    toggleSetting: (setting: keyof AppSettings) => void;
    claimedRewards: boolean[];
    claimReward: (index: number) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
    const [settings, setSettings] = useState<AppSettings>({
        notificationEnabled: true,
        soundEnabled: true,
        emailEnabled: false,
    });
    const [claimedRewards, setClaimedRewards] = useState([true, false]);

    const value = useMemo<AppStateContextValue>(
        () => ({
            settings,
            toggleSetting: (setting) => {
                setSettings((current) => ({
                    ...current,
                    [setting]: !current[setting],
                }));
            },
            claimedRewards,
            claimReward: (index) => {
                if (index !== 1) return;

                setClaimedRewards((claimed) => {
                    const next = [...claimed];
                    next[index] = true;
                    return next;
                });
            },
        }),
        [claimedRewards, settings]
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
