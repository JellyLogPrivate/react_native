import { Image, StyleSheet, Text, View } from 'react-native';

import Heart from '@/assets/images/heart.png';
import Tuna from '@/assets/images/tuna.svg';

import { AppTopBar } from '@/components/layout/app-top-bar';
import { CatRoomScene } from '@/components/layout/cat-room-scene';
import { DefaultTheme } from '@/constants/theme';
import { rem, s } from '@/ui/units';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <CatRoomScene />
            <AppTopBar />

            <View style={styles.bottomPanel}>
                <View style={styles.growthRow}>
                    <Image
                        source={Heart}
                        style={styles.heart}
                        resizeMode="contain"
                    />

                    <View style={styles.progressBar}>
                        <View style={styles.progressFill} />
                    </View>
                </View>

                <View style={styles.productList}>
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                </View>
            </View>
        </View>
    );
}

function ProductCard() {
    return (
        <View style={styles.productCard}>
            <View style={styles.productImage}>
                <Tuna width={s(55)} height={s(48)} />
            </View>

            <View style={styles.priceBox}>
                <Text style={styles.priceText}>X 5</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: DefaultTheme.backGroundColor,
    },

    bottomPanel: {
        position: 'absolute',
        bottom: 0,

        width: '100%',
        height: s(204),

        backgroundColor: DefaultTheme.main2Color,

        borderTopWidth: s(5),
        borderRightWidth: s(5),
        borderLeftWidth: s(5),
        borderColor: DefaultTheme.sub2Color,

        borderTopLeftRadius: s(24),
        borderTopRightRadius: s(24),

        paddingTop: s(20),
        paddingBottom: s(26),
        paddingHorizontal: s(32),
    },

    growthRow: {
        flexDirection: 'row',
        alignItems: 'center',

        gap: s(19),

        marginBottom: s(29),
    },

    heart: {
        width: s(42),
        height: s(39),
    },

    progressBar: {
        flex: 1,
        height: s(37),

        borderWidth: s(5),
        borderColor: '#7B7876',
        borderRadius: s(17),

        overflow: 'hidden',

        backgroundColor: DefaultTheme.main2Color,
    },

    progressFill: {
        width: '50%',
        height: '100%',

        backgroundColor: DefaultTheme.growthColor,
    },

    productList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    productCard: {
        width: s(104),
        height: s(99),

        borderWidth: s(5),
        borderColor: '#7B7876',
        borderRadius: s(15),

        justifyContent: 'space-between',
        alignItems: 'center',

        paddingTop: s(12),

        overflow: 'hidden',

        backgroundColor: DefaultTheme.main2Color,
    },

    productImage: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
    },

    priceBox: {
        width: '100%',
        height: s(26),

        borderTopWidth: s(5),
        borderColor: '#7B7876',

        justifyContent: 'center',
        alignItems: 'center',
    },

    priceText: {
        fontSize: rem(1.45),
        fontWeight: '400',
    },
});
