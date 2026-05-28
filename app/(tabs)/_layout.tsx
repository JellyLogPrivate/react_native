import { Tabs } from 'expo-router';

import { CustomTabBar } from '@/components/customTabBar';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => <CustomTabBar {...props} />}
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
    );
}
