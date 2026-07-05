import { router, Tabs } from 'expo-router';
import { useEffect } from 'react';

import { AppTabBar } from '@/components/layout/app-tab-bar';
import { AppStateProvider } from '@/contexts/app-state-context';
import { useAuth } from '@/contexts/auth-context';

export default function TabLayout() {
    const { isAuthenticated, isRestoring } = useAuth();

    useEffect(() => {
        if (!isRestoring && !isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, isRestoring]);

    if (isRestoring || !isAuthenticated) return null;

    return (
        <AppStateProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                }}
                tabBar={(props) => <AppTabBar {...props} />}
            >
                <Tabs.Screen name="home" />
                <Tabs.Screen name="qna" />
                <Tabs.Screen name="report" />
                <Tabs.Screen name="profile" />
            </Tabs>
        </AppStateProvider>
    );
}
