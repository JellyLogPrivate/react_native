import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

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
    // When svg transformer is active, `require()` may return a component (function),
    // or an object with `.default` being that component.
    if (typeof mod === 'function') return mod as unknown as SvgComponent;
    if (mod && typeof mod === 'object') {
        const d = (mod as Record<string, unknown>).default;
        if (typeof d === 'function') return d as unknown as SvgComponent;
    }
    return null;
}

export default function LoadingScreen() {
    const { width, height } = useWindowDimensions();
    const scale = Math.min(width / DESIGN_W, height / DESIGN_H);

    const canvasW = DESIGN_W * scale;
    const canvasH = DESIGN_H * scale;

    const pawMod = useMemo(
        () => require('@/assets/images/paw.svg') as RequireResult,
        []
    );
    const cushionMod = useMemo(
        () => require('@/assets/images/cushion.svg') as RequireResult,
        []
    );

    const [pawUri, setPawUri] = useState<string | null>(() =>
        resolveSvgUri(pawMod)
    );
    const [cushionUri, setCushionUri] = useState<string | null>(() =>
        resolveSvgUri(cushionMod)
    );

    const PawComp = useMemo(() => resolveSvgComponent(pawMod), [pawMod]);
    const CushionComp = useMemo(() => resolveSvgComponent(cushionMod), [cushionMod]);

    // 0..1 loop: controls sequential paw reveal
    const pawProgress = useSharedValue(0);

    useEffect(() => {
        // Native might need to download assets to get localUri.
        // On web, SVG `require()` often returns an object/string, so Asset.loadAsync is not applicable.
        const mods: Array<RequireResult> = [pawMod, cushionMod];
        const ids = mods.filter((m): m is number => typeof m === 'number');
        if (ids.length === 0) return;

        let cancelled = false;
        async function load() {
            try {
                await Asset.loadAsync(ids);
                if (cancelled) return;
                setPawUri(resolveSvgUri(pawMod));
                setCushionUri(resolveSvgUri(cushionMod));
            } catch {
                // ignore
            }
        }

        void load();
        return () => {
            cancelled = true;
        };
    }, [pawMod, cushionMod]);

    useEffect(() => {
        pawProgress.value = 0;
        pawProgress.value = withRepeat(
            withTiming(1, { duration: 1200 }),
            -1,
            false
        );
    }, [pawProgress]);

    const makePawStyle = (index: 0 | 1 | 2 | 3) =>
        useAnimatedStyle(() => {
            const start = index * 0.2; // 0, 0.2, 0.4, 0.6
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
            return { opacity, transform: [{ translateY: lift }] };
        });

    const paw1Style = makePawStyle(0);
    const paw2Style = makePawStyle(1);
    const paw3Style = makePawStyle(2);
    const paw4Style = makePawStyle(3);

    return (
        <View style={styles.screen}>
            <View style={[styles.canvas, { width: canvasW, height: canvasH }]}>
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
                        },
                    ]}
                >
                    Loading . . .
                </ThemedText>

                {/* paw: 아래에서부터 차례대로 */}
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
                    {PawComp ? (
                        <PawComp width={47 * scale} height={42 * scale} />
                    ) : pawUri ? (
                        <SvgUri uri={pawUri} width={47 * scale} height={42 * scale} />
                    ) : null}
                </Animated.View>

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
                    {PawComp ? (
                        <PawComp width={47 * scale} height={42 * scale} />
                    ) : pawUri ? (
                        <SvgUri uri={pawUri} width={47 * scale} height={42 * scale} />
                    ) : null}
                </Animated.View>

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
                    {PawComp ? (
                        <PawComp width={47 * scale} height={42 * scale} />
                    ) : pawUri ? (
                        <SvgUri uri={pawUri} width={47 * scale} height={42 * scale} />
                    ) : null}
                </Animated.View>

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
                    {PawComp ? (
                        <PawComp width={47 * scale} height={42 * scale} />
                    ) : pawUri ? (
                        <SvgUri uri={pawUri} width={47 * scale} height={42 * scale} />
                    ) : null}
                </Animated.View>

                {/* cushion.svg */}
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
                        <SvgUri uri={cushionUri} width={242 * scale} height={140 * scale} />
                    ) : null}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#E4FFE5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    canvas: {
        position: 'relative',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    bg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#E4FFE5',
    },
    loadingText: {
        position: 'absolute',
        color: '#B39C8D',
        fontWeight: '700',
        textAlign: 'center',
    },
});
