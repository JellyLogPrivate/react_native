import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const DEFAULT_API_BASE_URL =
    'https://portia-nonrepressed-unperfectively.ngrok-free.dev';
const API_BASE_URL = (
    process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, '');
const CALLBACK_URL = 'jellylog://auth';

const ACCESS_TOKEN_KEY = 'jellylog.accessToken';
const REFRESH_TOKEN_KEY = 'jellylog.refreshToken';
const USER_CODE_KEY = 'jellylog.userCode';

export type AuthSession = {
    accessToken: string;
    refreshToken: string;
    userCode: number | null;
};

export async function getStoredSession(): Promise<AuthSession | null> {
    const [accessToken, refreshToken, userCode] = await Promise.all([
        SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.getItemAsync(USER_CODE_KEY),
    ]);

    if (!accessToken || !refreshToken) return null;

    return {
        accessToken,
        refreshToken,
        userCode: userCode ? Number(userCode) : null,
    };
}

export async function startGoogleLogin() {
    if (!API_BASE_URL) {
        throw new Error('EXPO_PUBLIC_API_BASE_URL이 설정되지 않았습니다.');
    }

    const loginUrl = new URL(`${API_BASE_URL}/oauth2/authorization/google`);
    loginUrl.searchParams.set('redirect_uri', CALLBACK_URL);

    const result = await WebBrowser.openAuthSessionAsync(
        loginUrl.toString(),
        CALLBACK_URL
    );

    if (result.type === 'cancel' || result.type === 'dismiss') return null;

    if (result.type !== 'success') {
        throw new Error('Google 로그인을 완료하지 못했습니다.');
    }

    const session = parseSessionUrl(result.url);
    await saveSession(session);
    return session;
}

export async function completeLoginFromUrl(url: string) {
    const session = parseSessionUrl(url);
    await saveSession(session);
    return session;
}

export async function completeLoginFromPayload(payload: unknown) {
    const session = parseSessionPayload(payload);
    await saveSession(session);
    return session;
}

export async function refreshStoredSession() {
    const session = await getStoredSession();
    if (!session || !API_BASE_URL) return null;

    console.info('[Auth] refreshing session');
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userRefreshToken: session.refreshToken }),
    });

    if (!response.ok) {
        console.info(`[Auth] refresh failed ${response.status}`);
        await clearStoredSession();
        return null;
    }

    const refreshed = parseSessionPayload(await response.json());
    console.info('[Auth] refresh succeeded');
    await saveSession(refreshed);
    return refreshed;
}

export async function logoutStoredSession() {
    const session = await getStoredSession();

    if (session && API_BASE_URL) {
        try {
            await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });
        } catch {
            // Local logout must still complete when the server is unreachable.
        }
    }

    await clearStoredSession();
}

async function saveSession(session: AuthSession) {
    await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, session.accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, session.refreshToken),
        session.userCode === null
            ? SecureStore.deleteItemAsync(USER_CODE_KEY)
            : SecureStore.setItemAsync(USER_CODE_KEY, String(session.userCode)),
    ]);
    console.info(
        `[Auth] session saved access=${session.accessToken ? 'present' : 'missing'} refresh=${session.refreshToken ? 'present' : 'missing'}`
    );
}

async function clearStoredSession() {
    await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_CODE_KEY),
    ]);
}

function parseSessionUrl(url: string) {
    const parsed = new URL(url);
    const params = new URLSearchParams(parsed.search);
    const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ''));

    hashParams.forEach((value, key) => params.set(key, value));

    const error = params.get('error') ?? params.get('message');
    if (error && !getToken(params, 'access')) throw new Error(error);

    return parseSessionPayload(Object.fromEntries(params.entries()));
}

function parseSessionPayload(payload: unknown): AuthSession {
    const record = unwrapPayload(payload);
    const accessToken =
        getString(record, 'userAccessToken') ??
        getString(record, 'accessToken') ??
        getString(record, 'access_token');
    const refreshToken =
        getString(record, 'userRefreshToken') ??
        getString(record, 'refreshToken') ??
        getString(record, 'refresh_token');
    const rawUserCode = record.userCode;

    if (!accessToken || !refreshToken) {
        throw new Error(
            '로그인 콜백에 토큰이 없습니다. 서버 OAuth 성공 리디렉션을 jellylog://auth로 설정해 주세요.'
        );
    }

    return {
        accessToken,
        refreshToken,
        userCode:
            typeof rawUserCode === 'number'
                ? rawUserCode
                : typeof rawUserCode === 'string'
                  ? Number(rawUserCode)
                  : null,
    };
}

function unwrapPayload(payload: unknown): Record<string, unknown> {
    if (typeof payload !== 'object' || payload === null) return {};

    const record = payload as Record<string, unknown>;
    return typeof record.data === 'object' && record.data !== null
        ? (record.data as Record<string, unknown>)
        : record;
}

function getString(record: Record<string, unknown>, key: string) {
    const value = record[key];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function getToken(params: URLSearchParams, type: 'access' | 'refresh') {
    const title = type === 'access' ? 'Access' : 'Refresh';
    return (
        params.get(`user${title}Token`) ??
        params.get(`${type}Token`) ??
        params.get(`${type}_token`)
    );
}
