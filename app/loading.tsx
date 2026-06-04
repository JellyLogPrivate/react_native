import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import Paw from '@/components/paw';
import { ThemedText } from '@/components/themed-text';

import { Asset } from 'expo-asset';

import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

import { SvgUri, type SvgProps } from 'react-native-svg';

import { DefaultTheme } from '@/constants/theme';

const DESIGN_W = 402;
const DESIGN_H = 874;

type RequireResult = number | string | Record<string, unknown>;

type SvgComponent = (props: SvgProps) => React.ReactElement | null;

function resolveSvgUri(mod: RequireResult): string | null {
    if (typeof mod === 'string') return mod;

    if (typeof mod === 'number') {
        const asset = Asset.fromModule(mod);
        return asset.localUri ?? asset.uri ?? null;
    }

    if (mod && typeof mod === 'object') {
        const anyMod = mod as Record<string, unknown>;

        if (typeof anyMod.uri === 'string') return anyMod.uri;
        if (typeof anyMod.url === 'string') return anyMod.url;

        const d = anyMod.default;

        if (typeof d === 'string') return d;

        if (d && typeof d === 'object') {
            const dd = d as Record<string, unknown>;

            if (typeof dd.uri === 'string') return dd.uri;
            if (typeof dd.url === 'string') return dd.url;
        }
    }

    return null;
}

function resolveSvgComponent(mod: RequireResult): SvgComponent | null {
    if (typeof mod === 'function') {
        return mod as unknown as SvgComponent;
    }

    if (mod && typeof mod === 'object') {
        const d = (mod as Record<string, unknown>).default;

        if (typeof d === 'function') {
            return d as unknown as SvgComponent;
        }
    }

    return null;
}

export default function LoadingScreen() {
    const { width, height } = useWindowDimensions();

    const scale = Math.min(width / DESIGN_W, height / DESIGN_H);

    const canvasW = DESIGN_W * scale;
    const canvasH = DESIGN_H * scale;

    const cushionMod = useMemo(
        () => require('@/assets/images/cushion.svg') as RequireResult,
        []
    );

    const [cushionUri, setCushionUri] = useState<string | null>(() =>
        resolveSvgUri(cushionMod)
    );

    const CushionComp = useMemo(
        () => resolveSvgComponent(cushionMod),
        [cushionMod]
    );

    const [loadingDots, setLoadingDots] = useState<1 | 2 | 3>(1);

    const pawProgress = useSharedValue(0);

    // paw animation
    useEffect(() => {
        pawProgress.value = 0;

        pawProgress.value = withRepeat(
            withTiming(1, {
                duration: 1200,
            }),
            -1,
            false
        );
    }, [pawProgress]);

    // 2초 뒤 홈 이동
    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/home');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // loading ...
    useEffect(() => {
        const id = setInterval(() => {
            setLoadingDots((d) => ((d % 3) + 1) as 1 | 2 | 3);
        }, 350);

        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const mods: RequireResult[] = [cushionMod];

        const ids = mods.filter((m): m is number => typeof m === 'number');

        if (ids.length === 0) return;

        let cancelled = false;

        async function load() {
            try {
                await Asset.loadAsync(ids);

                if (cancelled) return;

                setCushionUri(resolveSvgUri(cushionMod));
            } catch {
                // ignore
            }
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, [cushionMod]);

    const usePawStyle = (index: 0 | 1 | 2 | 3) =>
        useAnimatedStyle(() => {
            const start = index * 0.2;
            const end = start + 0.12;

            const opacity = interpolate(
                pawProgress.value,
                [start, end],
                [0, 1],
                Extrapolation.CLAMP
            );

            const lift = interpolate(
                pawProgress.value,
                [start, end],
                [6, 0],
                Extrapolation.CLAMP
            );

            return {
                opacity,
                transform: [
                    {
                        translateY: lift,
                    },
                ],
            };
        });

    const paw1Style = usePawStyle(0);
    const paw2Style = usePawStyle(1);
    const paw3Style = usePawStyle(2);
    const paw4Style = usePawStyle(3);

    return (
        <View style={styles.screen}>
            <View
                style={[
                    styles.canvas,
                    {
                        width: canvasW,
                        height: canvasH,
                    },
                ]}
            >
                <View style={styles.bg} />

                <ThemedText
                    style={[
                        styles.loadingText,
                        {
                            top: 0.3799 * canvasH,
                            width: 161 * scale,
                            left: ((DESIGN_W - 161) / 2) * scale,

                            fontSize: 32 * scale,
                            lineHeight: 39 * scale,

                            fontFamily: 'IM_Hyemin-Bold',
                        },
                    ]}
                >
                    {`loading${'.'.repeat(loadingDots)}`}
                </ThemedText>

                {/* paw 1 */}
                <Animated.View
                    style={[
                        paw1Style,
                        {
                            position: 'absolute',
                            left: 154 * scale,
                            top: 722 * scale,
                        },
                    ]}
                >
                    <Paw
                        width={47 * scale}
                        height={42 * scale}
                        startColor={DefaultTheme.sub1Color}
                        endColor={DefaultTheme.sub1Color}
                    />
                </Animated.View>

                {/* paw 2 */}
                <Animated.View
                    style={[
                        paw2Style,
                        {
                            position: 'absolute',
                            left: 214 * scale,
                            top: 625 * scale,
                        },
                    ]}
                >
                    <Paw
                        width={47 * scale}
                        height={42 * scale}
                        startColor={DefaultTheme.sub1Color}
                        endColor={DefaultTheme.sub1Color}
                    />
                </Animated.View>

                {/* paw 3 */}
                <Animated.View
                    style={[
                        paw3Style,
                        {
                            position: 'absolute',
                            left: 131 * scale,
                            top: 233 * scale,
                        },
                    ]}
                >
                    <Paw
                        width={47 * scale}
                        height={42 * scale}
                        startColor={DefaultTheme.sub1Color}
                        endColor={DefaultTheme.sub1Color}
                    />
                </Animated.View>

                {/* paw 4 */}
                <Animated.View
                    style={[
                        paw4Style,
                        {
                            position: 'absolute',
                            left: 191 * scale,
                            top: 136 * scale,
                        },
                    ]}
                >
                    <Paw
                        width={47 * scale}
                        height={42 * scale}
                        startColor={DefaultTheme.sub1Color}
                        endColor={DefaultTheme.sub1Color}
                    />
                </Animated.View>

                {/* cushion */}
                <View
                    style={{
                        position: 'absolute',
                        left: 82 * scale,
                        top: 428 * scale,
                    }}
                >
                    {CushionComp ? (
                        <CushionComp width={242 * scale} height={140 * scale} />
                    ) : cushionUri ? (
                        <SvgUri
                            uri={cushionUri}
                            width={242 * scale}
                            height={140 * scale}
                        />
                    ) : null}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: DefaultTheme.main1Color,

        alignItems: 'center',
        justifyContent: 'center',
    },

    canvas: {
        position: 'relative',
        backgroundColor: DefaultTheme.main1Color,

        overflow: 'hidden',
    },

    bg: {
        ...StyleSheet.absoluteFillObject,

        backgroundColor: DefaultTheme.main1Color,
    },

    loadingText: {
        position: 'absolute',

        color: DefaultTheme.sub1Color,

        fontWeight: '700',
        textAlign: 'center',
    },
});
