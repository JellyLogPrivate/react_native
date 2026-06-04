import { Image, StyleSheet, View } from 'react-native';

import Cat from '@/assets/images/cat.png';
import Cushion from '@/assets/images/cushion.svg';
import Floor from '@/assets/images/floor.svg';
import { s } from '@/ui/units';

export function CatRoomScene() {
    return (
        <View pointerEvents="none" style={styles.container}>
            <Floor width={s(402)} height={s(264)} style={styles.floor} />
            <Cushion width={s(242)} height={s(140)} style={styles.cushion} />
            <Image source={Cat} style={styles.cat} resizeMode="contain" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },

    floor: {
        position: 'absolute',
        bottom: s(43),
        zIndex: 1,

        width: s(402),
        height: s(264),

        alignSelf: 'center',
    },

    cushion: {
        position: 'absolute',
        left: s(82),
        top: s(431),
        zIndex: 2,
    },

    cat: {
        position: 'absolute',
        left: s(77),
        top: s(322),
        zIndex: 2,

        width: s(216),
        height: s(248),
    },
});
