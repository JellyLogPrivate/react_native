import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    completeLoginFromPayload,
    completeLoginFromUrl,
    getStoredSession,
    logoutStoredSession,
    refreshStoredSession,
    startGoogleLogin,
} from '@/services/auth/session';

type AuthContextValue = {
    isAuthenticated: boolean;
    isRestoring: boolean;
    isSigningIn: boolean;
    errorMessage: string | null;
    completeSignInFromPayload: (payload: unknown) => Promise<boolean>;
    completeSignInFromUrl: (url: string) => Promise<boolean>;
    signInWithGoogle: () => Promise<boolean>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRestoring, setIsRestoring] = useState(true);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        async function restore() {
            const stored = await getStoredSession();

            if (!stored) {
                setIsRestoring(false);
                return;
            }

            const refreshed = await refreshStoredSession();
            setIsAuthenticated(Boolean(refreshed));
            setIsRestoring(false);
        }

        void restore();
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            isAuthenticated,
            isRestoring,
            isSigningIn,
            errorMessage,
            completeSignInFromPayload: async (payload) => {
                setErrorMessage(null);

                try {
                    await completeLoginFromPayload(payload);
                    setIsAuthenticated(true);
                    return true;
                } catch (error) {
                    setErrorMessage(getErrorMessage(error));
                    setIsAuthenticated(false);
                    return false;
                }
            },
            completeSignInFromUrl: async (url) => {
                setErrorMessage(null);

                try {
                    await completeLoginFromUrl(url);
                    setIsAuthenticated(true);
                    return true;
                } catch (error) {
                    setErrorMessage(getErrorMessage(error));
                    setIsAuthenticated(false);
                    return false;
                }
            },
            signInWithGoogle: async () => {
                setIsSigningIn(true);
                setErrorMessage(null);

                try {
                    const session = await startGoogleLogin();
                    const signedIn = Boolean(session);
                    setIsAuthenticated(signedIn);
                    return signedIn;
                } catch (error) {
                    setErrorMessage(getErrorMessage(error));
                    return false;
                } finally {
                    setIsSigningIn(false);
                }
            },
            signOut: async () => {
                await logoutStoredSession();
                setIsAuthenticated(false);
                setErrorMessage(null);
            },
        }),
        [errorMessage, isAuthenticated, isRestoring, isSigningIn]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
}

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Google 로그인에 실패했습니다.';
}
