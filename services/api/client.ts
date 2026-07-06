import {
    getStoredSession,
    refreshStoredSession,
} from '@/services/auth/session';

const DEFAULT_API_BASE_URL =
    'https://portia-nonrepressed-unperfectively.ngrok-free.dev';
const API_BASE_URL = (
    process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, '');
const DEVELOPMENT_ACCESS_TOKEN = getDevelopmentAccessToken();

export const isApiConfigured = Boolean(API_BASE_URL);

type ApiRequestOptions = RequestInit & {
    authenticated?: boolean;
    timeout?: number;
};

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

export async function apiRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
) {
    if (!API_BASE_URL) {
        throw new ApiError('EXPO_PUBLIC_API_BASE_URL이 설정되지 않았습니다.', 0);
    }

    const { authenticated = true, headers, timeout, ...requestOptions } = options;
    const method = requestOptions.method ?? 'GET';
    const url = `${API_BASE_URL}${normalizeEndpoint(endpoint)}`;
    console.info(`[API] ${method} ${url}`);

    const session = authenticated ? await getSessionWithTimeout() : null;
    const accessToken = session?.accessToken ?? DEVELOPMENT_ACCESS_TOKEN;
    console.info(
        `[API] auth=${authenticated ? 'on' : 'off'} token=${accessToken ? 'present' : 'missing'} source=${session?.accessToken ? 'session' : DEVELOPMENT_ACCESS_TOKEN ? 'env' : 'none'}`
    );
    const response = await fetchWithTimeout(url, {
        ...requestOptions,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(authenticated && accessToken
                ? { Authorization: `Bearer ${accessToken}` }
                : {}),
            ...headers,
        },
    }, timeout);
    console.info(`[API] ${response.status} ${method} ${url}`);

    if (authenticated && session && response.status === 401) {
        const refreshed = await refreshStoredSession();

        if (refreshed) {
            return apiRequest<T>(endpoint, {
                ...options,
                authenticated: false,
                headers: {
                    ...headers,
                    Authorization: `Bearer ${refreshed.accessToken}`,
                },
            });
        }
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const payload = await parseResponse(response);

    if (!response.ok) {
        const message =
            getString(payload, 'message') ??
            (response.status === 401
                ? '로그인이 만료되었습니다. 다시 로그인해 주세요.'
                : undefined) ??
            `서버 요청에 실패했습니다. (${response.status})`;

        throw new ApiError(message, response.status);
    }

    if (isApiResponse<T>(payload)) {
        if (!payload.success) {
            throw new ApiError(payload.message || '서버 요청에 실패했습니다.', response.status);
        }

        return payload.data;
    }

    return payload as T;
}

function getDevelopmentAccessToken() {
    const token = process.env.EXPO_PUBLIC_ACCESS_TOKEN?.trim();

    if (!token || token === '개발용_ACCESS_TOKEN') return undefined;

    return token;
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 10000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await fetch(url, {
            ...options,
            signal: controller.signal,
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new ApiError('서버 응답 시간이 초과되었습니다.', 0);
        }

        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

async function getSessionWithTimeout() {
    return Promise.race([
        getStoredSession(),
        new Promise<null>((resolve) => {
            setTimeout(() => resolve(null), 1500);
        }),
    ]);
}

function normalizeEndpoint(endpoint: string) {
    const trimmed = endpoint.trim();
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

async function parseResponse(response: Response): Promise<unknown> {
    const text = await response.text();

    if (!text) return undefined;

    try {
        return JSON.parse(text) as unknown;
    } catch {
        return text;
    }
}

function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
    return (
        typeof value === 'object' &&
        value !== null &&
        'success' in value &&
        'data' in value
    );
}

function getString(value: unknown, key: string) {
    if (typeof value !== 'object' || value === null || !(key in value)) {
        return undefined;
    }

    const field = value[key as keyof typeof value];
    return typeof field === 'string' ? field : undefined;
}
