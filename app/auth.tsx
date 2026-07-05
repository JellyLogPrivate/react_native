import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { DefaultTheme } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';

export default function AuthCallbackScreen() {
    const params = useLocalSearchParams();
    const linkingUrl = Linking.useLinkingURL();
    const handledRef = useRef(false);
    const { completeSignInFromPayload, completeSignInFromUrl } = useAuth();

    const payload = useMemo(() => normalizeParams(params), [params]);

    useEffect(() => {
        if (handledRef.current) return;
        if (!hasAuthToken(linkingUrl, payload)) return;

        async function completeSignIn() {
            handledRef.current = true;

            const signedIn = linkingUrl
                ? await completeSignInFromUrl(linkingUrl)
                : await completeSignInFromPayload(payload);

            router.replace(signedIn ? '/home' : '/');
        }

        void completeSignIn();
    }, [completeSignInFromPayload, completeSignInFromUrl, linkingUrl, payload]);

    return (
        <View style={styles.container}>
            <ActivityIndicator color={DefaultTheme.sub2Color} size="large" />
        </View>
    );
}

function normalizeParams(params: Record<string, string | string[]>) {
    return Object.fromEntries(
        Object.entries(params).map(([key, value]) => [
            key,
            Array.isArray(value) ? value[0] : value,
        ])
    );
}

function hasAuthToken(
    url: string | null,
    payload: Record<string, string | undefined>
) {
    if (hasPayloadToken(payload)) return true;
    if (!url) return false;

    try {
        const parsed = new URL(url);
        const params = new URLSearchParams(parsed.search);
        const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ''));

        hashParams.forEach((value, key) => params.set(key, value));

        return Boolean(
            params.get('userAccessToken') ??
                params.get('accessToken') ??
                params.get('access_token')
        );
    } catch {
        return false;
    }
}

function hasPayloadToken(payload: Record<string, string | undefined>) {
    return Boolean(
        payload.userAccessToken ?? payload.accessToken ?? payload.access_token
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DefaultTheme.backGroundColor,
    },
});
