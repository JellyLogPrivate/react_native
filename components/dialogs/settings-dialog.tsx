import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { DialogCloseButton } from '@/components/dialogs/dialog-close-button';
import { DefaultTheme } from '@/constants/theme';
import { useAppState } from '@/contexts/app-state-context';
import { useAuth } from '@/contexts/auth-context';
import { rem, s } from '@/ui/units';

type SettingsDialogProps = {
    visible: boolean;
    onClose: () => void;
};

export function SettingsDialog({ visible, onClose }: SettingsDialogProps) {
    const { nickname, settings, toggleSetting } = useAppState();
    const { signOut } = useAuth();

    const handleLogout = async () => {
        onClose();
        await signOut();
        router.replace('/');
    };

    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.backdrop}>
                <View style={styles.dialog}>
                    <DialogCloseButton
                        accessibilityLabel="설정 닫기"
                        onPress={onClose}
                    />

                    <View style={styles.nicknameRow}>
                        <Text style={styles.nicknameLabel}>별명</Text>
                        <Text style={styles.nicknameValue}>{nickname}</Text>

                        <MaterialCommunityIcons
                            name="pencil-outline"
                            size={s(29)}
                            color={DefaultTheme.sub2Color}
                        />
                    </View>

                    <View style={styles.settingList}>
                        <SettingRow
                            label="알림 설정"
                            type="notification"
                            value={settings.notificationEnabled}
                            onToggle={() =>
                                void toggleSetting('notificationEnabled')
                            }
                        />
                        <SettingRow
                            label="소리 설정"
                            type="sound"
                            value={settings.soundEnabled}
                            onToggle={() =>
                                void toggleSetting('soundEnabled')
                            }
                        />
                        <SettingRow
                            label="메일 송신"
                            type="email"
                            value={settings.emailEnabled}
                            onToggle={() =>
                                void toggleSetting('emailEnabled')
                            }
                        />
                    </View>

                    <View style={styles.linkList}>
                        <DialogLink label="개인정보처리방침" />
                        <DialogLink label="도움말" />
                        <DialogLink label="문의" />
                    </View>

                    <Pressable
                        accessibilityRole="button"
                        onPress={() => void handleLogout()}
                    >
                        <Text style={styles.logoutText}>로그아웃</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

type SettingType = 'notification' | 'sound' | 'email';

type SettingRowProps = {
    label: string;
    type: SettingType;
    value: boolean;
    onToggle: () => void;
};

function SettingRow({ label, type, value, onToggle }: SettingRowProps) {
    const iconName = {
        notification: value ? 'bell' : 'bell-off',
        sound: value ? 'volume-high' : 'volume-off',
        email: value ? 'email' : 'email-off',
    } as const;

    return (
        <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: value }}
            style={({ pressed }) => [
                styles.settingRow,
                pressed && styles.pressed,
            ]}
            onPress={onToggle}
        >
            <Text style={styles.settingBullet}>•</Text>
            <Text style={styles.settingLabel}>{label}</Text>

            <View style={styles.settingIcon}>
                <MaterialCommunityIcons
                    name={iconName[type]}
                    size={s(30)}
                    color={DefaultTheme.sub2Color}
                />
            </View>
        </Pressable>
    );
}

function DialogLink({ label }: { label: string }) {
    return (
        <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
                styles.dialogLink,
                pressed && styles.pressed,
            ]}
        >
            <Text style={styles.dialogLinkText}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        paddingHorizontal: s(18),

        backgroundColor: 'rgba(255, 254, 250, 0.32)',
    },

    dialog: {
        width: '100%',
        maxWidth: s(370),

        borderWidth: s(5),
        borderColor: DefaultTheme.sub2Color,
        borderRadius: s(20),

        paddingTop: s(60),
        paddingRight: s(28),
        paddingBottom: s(20),
        paddingLeft: s(28),

        backgroundColor: DefaultTheme.main2Color,
    },

    nicknameRow: {
        height: s(45),

        borderBottomWidth: s(3),
        borderBottomColor: DefaultTheme.sub2Color,
        borderStyle: 'dashed',

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: s(14),
        gap: s(16),
    },

    nicknameLabel: {
        fontSize: rem(1.15),
        color: '#050505',
    },

    nicknameValue: {
        flex: 1,

        fontSize: rem(1.4),
        color: '#050505',
    },

    settingList: {
        marginTop: s(4),
        marginBottom: s(12),
    },

    settingRow: {
        height: s(42),

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: s(28),
        gap: s(9),
    },

    settingBullet: {
        width: s(14),

        fontSize: rem(1.2),
        color: '#050505',
    },

    settingLabel: {
        flex: 1,

        fontSize: rem(1.3),
        color: '#050505',
    },

    settingIcon: {
        width: s(34),
        height: s(34),

        justifyContent: 'center',
        alignItems: 'center',
    },

    linkList: {
        gap: s(8),
    },

    dialogLink: {
        height: s(42),

        borderWidth: s(3),
        borderColor: DefaultTheme.sub2Color,
        borderRadius: s(14),

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: DefaultTheme.main2Color,
    },

    dialogLinkText: {
        fontSize: rem(1.25),
        color: '#050505',
    },

    logoutText: {
        marginTop: s(13),

        textAlign: 'center',

        fontSize: rem(1.2),
        color: DefaultTheme.sub2Color,
    },

    pressed: {
        opacity: 0.62,
    },
});
