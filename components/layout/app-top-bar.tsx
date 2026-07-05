import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Calendar from '@/assets/images/Calendar.svg';
import Point from '@/assets/images/Point.svg';
import Setting from '@/assets/images/Setting.svg';
import { AttendanceDialog } from '@/components/dialogs/attendance-dialog';
import { SettingsDialog } from '@/components/dialogs/settings-dialog';
import { DefaultTheme } from '@/constants/theme';
import { useAppState } from '@/contexts/app-state-context';
import { rem, s } from '@/ui/units';

export function AppTopBar() {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { points } = useAppState();
    const displayPoints = Number.isFinite(points) ? points : 0;

    return (
        <>
            <View style={styles.container}>
                <View style={styles.pointBar}>
                    <View style={styles.pointIconBox}>
                        <Point width={s(30)} height={s(21)} />
                    </View>

                    <Text style={styles.pointText}>
                        {displayPoints.toLocaleString()} P
                    </Text>
                </View>

                <TopBarButton
                    accessibilityLabel="출석 보상 열기"
                    onPress={() => setIsCalendarOpen(true)}
                >
                    <Calendar width={s(30)} height={s(30)} />
                </TopBarButton>

                <TopBarButton
                    accessibilityLabel="설정 열기"
                    onPress={() => setIsSettingsOpen(true)}
                >
                    <Setting width={s(30)} height={s(29)} />
                </TopBarButton>
            </View>

            <AttendanceDialog
                visible={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
            />

            <SettingsDialog
                visible={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
}

type TopBarButtonProps = {
    accessibilityLabel: string;
    children: React.ReactNode;
    onPress: () => void;
};

function TopBarButton({
    accessibilityLabel,
    children,
    onPress,
}: TopBarButtonProps) {
    return (
        <Pressable
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
            ]}
            onPress={onPress}
        >
            {children}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        zIndex: 10,

        width: '100%',
        height: s(137),

        borderBottomWidth: s(5),
        borderBottomColor: DefaultTheme.sub1Color,

        flexDirection: 'row',
        alignItems: 'flex-start',

        paddingTop: s(62),
        paddingHorizontal: s(10),
        gap: s(15),

        backgroundColor: DefaultTheme.backGroundColor,
    },

    pointBar: {
        flex: 1,
        height: s(49),

        borderWidth: s(5),
        borderColor: DefaultTheme.sub2Color,
        borderRadius: s(9),

        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',

        backgroundColor: DefaultTheme.main2Color,
    },

    pointIconBox: {
        width: s(65),
        height: s(49),

        marginLeft: s(-5),

        borderWidth: s(5),
        borderColor: DefaultTheme.sub2Color,
        borderTopRightRadius: s(24),
        borderBottomRightRadius: s(24),

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: DefaultTheme.main2Color,
    },

    pointText: {
        flex: 1,
        marginLeft: s(10),

        textAlign: 'center',

        fontSize: rem(1.75),
        fontWeight: '400',
        color: DefaultTheme.sub2Color,
    },

    button: {
        width: s(51),
        height: s(49),

        borderWidth: s(5),
        borderColor: DefaultTheme.sub2Color,
        borderRadius: s(9),

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: DefaultTheme.main2Color,
    },

    buttonPressed: {
        opacity: 0.72,
    },
});
