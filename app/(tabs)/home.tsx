import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import Calendar from '@/assets/images/Calendar.svg';
import Cat from '@/assets/images/cat.png';
import CushionSvg from '@/assets/images/cushion.svg';
import Floor from '@/assets/images/floor.svg';
import Heart from '@/assets/images/heart.png';
import Point from '@/assets/images/Point.svg';
import Setting from '@/assets/images/Setting.svg';
import Tuna from '@/assets/images/tuna.svg';

import { DefaultTheme } from '@/constants/theme';
import { rem, s } from '@/ui/units';

export default function MainScreen() {
    return (
        <View style={styles.container}>
            {/* 배경 */}
            <View style={styles.background} />

            {/* 바닥 */}
            <Floor width={s(402)} height={s(264)} style={styles.floor} />

            {/* 쿠션 */}
            <CushionSvg width={s(242)} height={s(140)} style={styles.cushion} />

            {/* 고양이 */}
            <Image source={Cat} style={styles.cat} resizeMode="contain" />

            {/* 상단바 */}
            <View style={styles.topBar}>
                <View style={styles.pointBar}>
                    <View style={styles.pointIconBox}>
                        <Point width={s(30)} height={s(21)} />
                    </View>

                    <Text style={styles.pointText}>11,205 P</Text>
                </View>

                <View style={styles.topButton}>
                    <Calendar width={s(20)} height={s(20)} />
                </View>

                <View style={styles.topButton}>
                    <Setting width={s(20)} height={s(20)} />
                </View>
            </View>

            {/* 하단 패널 */}
            <View style={styles.bottomPanel}>
                {/* 성장바 */}
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

                {/* 상품목록 */}
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

    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: DefaultTheme.backGroundColor,
    },

    floor: {
        position: 'absolute',
        bottom: s(43),

        width: s(402),
        height: s(264),

        alignSelf: 'center',
    },

    cushion: {
        position: 'absolute',
        left: s(82),
        top: s(431),
    },

    cat: {
        position: 'absolute',
        left: s(77),
        top: s(322),
        width: s(216),
        height: s(248),
    },

    topBar: {
        position: 'absolute',
        top: 0,

        width: '100%',
        height: s(137),

        backgroundColor: DefaultTheme.backGroundColor,

        borderBottomWidth: s(5),
        borderBottomColor: DefaultTheme.sub1Color,

        flexDirection: 'row',
        alignItems: 'flex-start',

        paddingTop: s(62),
        paddingHorizontal: s(10),

        gap: s(15),
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
        borderTopLeftRadius: 0,
        borderTopRightRadius: s(24),
        borderBottomLeftRadius: 0,
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

    topButton: {
        width: s(51),
        height: s(49),

        borderWidth: s(5),
        borderColor: DefaultTheme.sub2Color,
        borderRadius: s(9),

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: DefaultTheme.main2Color,
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
