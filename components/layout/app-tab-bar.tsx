import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';

import HomeTab from '@/assets/images/Home.svg';
import ProfileTab from '@/assets/images/Profile.svg';
import QnaTab from '@/assets/images/Qna.svg';
import ReportTab from '@/assets/images/Report.svg';

import { s } from '@/ui/units';

const TAB_HEIGHT = s(62);

const iconMap: Record<string, FC<SvgProps>> = {
    home: HomeTab,
    qna: QnaTab,
    report: ReportTab,
    profile: ProfileTab,
};

export function AppTabBar({ state, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    const bottomInset = Math.max(insets.bottom, s(8));

    return (
        <View
            style={[
                styles.container,
                {
                    height: TAB_HEIGHT + bottomInset,
                    paddingBottom: bottomInset,
                },
            ]}
        >
            {state.routes.map((route, index) => {
                const focused = state.index === index;

                const Icon = iconMap[route.name];

                if (!Icon) return null;

                return (
                    <Pressable
                        key={route.key}
                        style={styles.item}
                        onPress={() => navigation.navigate(route.name)}
                    >
                        <View style={focused ? styles.focused : undefined}>
                            <Icon width={s(48)} height={s(48)} />
                        </View>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',

        backgroundColor: '#FFFCF5',

        borderTopWidth: s(5),
        borderTopColor: '#B39C8D',
    },

    item: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
    },

    focused: {
        transform: [{ scale: 1.08 }],
        marginBottom: s(4),
    },
});
