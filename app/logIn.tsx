import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import Cat from '@/assets/images/cat.png';
import Cushion from '@/assets/images/cushion.svg';
import Floor from '@/assets/images/floor.svg';
import Google from '@/assets/images/google.svg';
import Logo from '@/assets/images/logo.svg';
import Paw from '@/components/paw';
import { DefaultTheme } from '@/constants/theme';
import { rem, s } from '@/ui/units';

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <Logo width={s(292)} height={s(100)} style={styles.logo} />

            <LinearGradient
                colors={['#DDAB97', '#BD877C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.divider}
            />

            <LinearGradient
                colors={['#DDAB97', '#BD877C']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.badge}
            >
                <View style={styles.badgeInner}>
                    <Paw width={s(38.31)} height={s(34.19)} />
                </View>
            </LinearGradient>

            <Floor width={s(402)} height={s(363)} style={styles.floor} />
            <Cushion width={s(242)} height={s(140)} style={styles.cushion} />
            <Image source={Cat} style={styles.cat} resizeMode="contain" />

            <Pressable
                style={styles.googleButton}
                onPress={() => router.push('/loading')}
            >
                <Text style={styles.googleText}>Start with google</Text>
                <Google width={s(32)} height={s(32)} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: DefaultTheme.backGroundColor,
    },

    logo: {
        position: 'absolute',
        top: s(114),
    },

    cat: {
        position: 'absolute',
        top: s(424),

        width: s(216),
        height: s(248),
    },

    cushion: {
        position: 'absolute',
        top: s(530),
    },

    floor: {
        position: 'absolute',
        bottom: 0,

        width: s(402),
        height: s(363),

        alignSelf: 'center',
    },

    googleButton: {
        position: 'absolute',
        top: s(737),

        width: s(272),
        height: s(66),

        borderWidth: s(5),
        borderColor: DefaultTheme.sub2Color,
        borderRadius: s(15),

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        gap: s(10),

        backgroundColor: DefaultTheme.main2Color,
    },

    googleText: {
        fontSize: rem(1.5),
        fontWeight: '700',
        color: DefaultTheme.sub2Color,
    },

    divider: {
        position: 'absolute',
        top: s(283),
        zIndex: 1,

        width: '100%',
        height: s(5),
    },

    badge: {
        position: 'absolute',
        top: s(253),
        zIndex: 2,

        width: s(60),
        height: s(60),

        borderRadius: s(30),

        alignSelf: 'center',

        padding: s(5),
    },

    badgeInner: {
        flex: 1,

        borderRadius: s(25),

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: DefaultTheme.backGroundColor,
    },
});
