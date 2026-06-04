import { Tabs } from 'expo-router';

import { AppTabBar } from '@/components/layout/app-tab-bar';
import { AppStateProvider } from '@/contexts/app-state-context';

export default function TabLayout() {
    return (
        <AppStateProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                }}
                tabBar={(props) => <AppTabBar {...props} />}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        href: null,
                    }}
                />

                <Tabs.Screen name="home" />
                <Tabs.Screen name="qna" />
                <Tabs.Screen name="report" />
                <Tabs.Screen name="profile" />
            </Tabs>
        </AppStateProvider>
    );
}
