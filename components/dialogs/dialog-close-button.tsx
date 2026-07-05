import { Pressable, StyleSheet, Text } from 'react-native';

import Paw from '@/components/paw';
import { DefaultTheme } from '@/constants/theme';
import { rem, s } from '@/ui/units';

type DialogCloseButtonProps = {
    accessibilityLabel: string;
    onPress: () => void;
};

export function DialogCloseButton({
    accessibilityLabel,
    onPress,
}: DialogCloseButtonProps) {
    return (
        <Pressable
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
            ]}
            onPress={onPress}
        >
            <Paw
                width={s(42)}
                height={s(38)}
                startColor={DefaultTheme.sub1Color}
                endColor={DefaultTheme.sub1Color}
            />

            <Text style={styles.icon}>×</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: s(-16),
        right: s(18),

        width: s(64),
        height: s(58),

        borderWidth: s(5),
        borderColor: DefaultTheme.sub1Color,
        borderRadius: s(8),

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: DefaultTheme.main1Color,
    },

    pressed: {
        opacity: 0.72,
    },

    icon: {
        position: 'absolute',
        top: s(10),

        color: DefaultTheme.main1Color,
        fontSize: rem(1.45),
        fontWeight: '300',
    },
});
