import { apiRequest } from '@/services/api/client';

export type UserInfo = {
    userCode: number;
    userName: string;
    userPoints: number;
    userAuthProvider: 'GOOGLE' | string;
};

export type UserSettings = {
    userNotificationEnabled: boolean;
    userSoundEnabled: boolean;
    userEmailEnabled: boolean;
};

export type UserProfile = {
    userNickname: string;
};

export type Attendance = {
    attendenceCode: number;
    userCode: number;
    attendenceDate: string;
};

export type DailyQuestion = {
    questionCode: string | null;
    questionContent: string;
    isAnswered: boolean;
};

export type Food = {
    foodCode: number;
    foodName: string;
    foodImage: string;
    foodPrice: number;
    foodExp: number;
};

export type FoodInventory = {
    userFoodCode: number;
    userCode: number;
    foodCode: number;
    quantity: number;
    updatedAt: string;
};

export type Pet = {
    petCode: number;
    petName: string;
    petDefaultImage: string;
    petActiveImage1: string;
    petActiveImage2: string;
    petActiveImage3: string;
    petActiveImage4: string;
    petActiveImage5: string;
    petActiveImage6: string;
    petActiveImage7: string;
    petActiveImage8: string;
};

export type UserPet = {
    userCode: number;
    petCode: number;
    level: number;
    exp: number;
    emotion: string;
    createdAt: string;
    updatedAt: string;
};

export type Furniture = {
    furnitureCode: number;
    furnitureName: string;
    furnitureImage: string;
    furniturePrice: number;
    furnitureGroup: number;
};

export type UserFurniture = {
    userFurnitureCode: number;
    userCode: number;
    furnitureCode: number;
    isPlaced: boolean;
    updatedAt: string;
};

export type PointReasonType = 'BUY' | 'ATTENDENCE' | 'ANSWER' | 'LEVEL_UP';

export type PointLog = {
    pointLogCode: number;
    userCode: number;
    pointLogPointAmount: number;
    pointLogReason: string;
    pointLogReasonType: PointReasonType;
    pointLogCreatedAt: string;
};

export type AiReport = {
    id: number;
    userCode: number;
    content: string;
    yearMonth: string;
    scoreStability: number;
    scoreActivity: number;
    scoreHappiness: number;
    scoreStress: number;
    scoreAchievement: number;
    createdAt: string;
};

export type PageRequest = {
    page?: number;
    size?: number;
    sort?: string | string[];
};

export type PageResponse<T> = {
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    size: number;
    content: T[];
    number: number;
    empty: boolean;
};

export type UserPetCreateRequest = {
    userCode: number;
    petCode: number;
    level: number;
    exp: number;
    emotion: string;
};

export type UserPetUpdateRequest = Partial<
    Pick<UserPetCreateRequest, 'level' | 'exp' | 'emotion'>
>;

export type UserFoodCreateRequest = {
    userCode: number;
    foodCode: number;
    quantity: number;
};

export type UserFurnitureCreateRequest = {
    userCode: number;
    furnitureCode: number;
    isPlaced: boolean;
};

export type FeedPetRequest = {
    userCode: number;
    petCode: number;
    foodCode: number;
    quantity: number;
};

export type PointCreateRequest = {
    userCode: number;
    pointLogPointAmount: number;
    pointLogReason: string;
    pointLogReasonType: PointReasonType;
};

export const appApi = {
    async getCurrentUser() {
        return normalizeUserInfo(await apiRequest<unknown>('/api/auth/me'));
    },

    getProfile() {
        return apiRequest<UserProfile>('/api/user/profile');
    },

    updateProfile(userNickname: string) {
        return apiRequest<UserProfile>('/api/user/profile', {
            method: 'PUT',
            body: JSON.stringify({ userNickname }),
        });
    },

    getSettings() {
        return apiRequest<UserSettings>('/api/user/settings');
    },

    updateSettings(settings: UserSettings) {
        return apiRequest<UserSettings>('/api/user/settings', {
            method: 'PUT',
            body: JSON.stringify(settings),
        });
    },

    getAttendances() {
        return apiRequest<Attendance[]>('/api/attendances/me');
    },

    getAttendancesPage(pageable?: PageRequest) {
        return apiRequest<PageResponse<Attendance>>(
            withPageable('/api/attendances', pageable)
        );
    },

    getAttendance(attendenceCode: number) {
        return apiRequest<Attendance>(`/api/attendances/${attendenceCode}`);
    },

    checkAttendance(attendenceDate = getLocalDateString()) {
        return apiRequest<Attendance>('/api/attendances', {
            method: 'POST',
            body: JSON.stringify({ attendenceDate }),
        });
    },

    getFoodInventory() {
        return apiRequest<FoodInventory[]>('/api/inventory');
    },

    getFoodInventoryItem(foodCode: number) {
        return apiRequest<FoodInventory>(`/api/inventory/${foodCode}`);
    },

    createFoodInventory(request: UserFoodCreateRequest) {
        return apiRequest<FoodInventory>('/api/inventory', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },

    updateFoodInventory(foodCode: number, quantity: number) {
        return apiRequest<FoodInventory>(`/api/inventory/${foodCode}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        });
    },

    deleteFoodInventory(foodCode: number) {
        return apiRequest<void>(`/api/inventory/${foodCode}`, {
            method: 'DELETE',
        });
    },

    getFoods(pageable?: PageRequest) {
        return apiRequest<PageResponse<Food>>(withPageable('/api/foods', pageable));
    },

    getFood(foodCode: number) {
        return apiRequest<Food>(`/api/foods/${foodCode}`);
    },

    getPets(pageable?: PageRequest) {
        return apiRequest<PageResponse<Pet>>(withPageable('/api/pets', pageable));
    },

    getPet(petCode: number) {
        return apiRequest<Pet>(`/api/pets/${petCode}`);
    },

    getUserPets() {
        return apiRequest<UserPet[]>('/api/user-pets/users');
    },

    getUserPet(petCode: number) {
        return apiRequest<UserPet>(`/api/user-pets/${petCode}`);
    },

    createUserPet(request: UserPetCreateRequest) {
        return apiRequest<UserPet>('/api/user-pets', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },

    updateUserPet(petCode: number, request: UserPetUpdateRequest) {
        return apiRequest<UserPet>(`/api/user-pets/${petCode}`, {
            method: 'PUT',
            body: JSON.stringify(request),
        });
    },

    feedPet(request: FeedPetRequest) {
        return apiRequest<UserPet>('/feed', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },

    getFurnitures() {
        return apiRequest<Furniture[]>('/api/furnitures_all');
    },

    getFurniture(furnitureCode: number) {
        return apiRequest<Furniture>(
            `/api/furnitures_single/${furnitureCode}`
        );
    },

    getFurnitureInventory() {
        return apiRequest<UserFurniture[]>('/api/furnitures-inventory');
    },

    getFurnitureInventoryItem(furnitureCode: number) {
        return apiRequest<UserFurniture>(
            `/api/furnitures-inventory/${furnitureCode}`
        );
    },

    createFurnitureInventory(request: UserFurnitureCreateRequest) {
        return apiRequest<UserFurniture>('/api/furnitures-inventory', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },

    updateFurnitureInventory(furnitureCode: number, isPlaced: boolean) {
        return apiRequest<UserFurniture>(
            `/api/furnitures-inventory/${furnitureCode}`,
            {
                method: 'PUT',
                body: JSON.stringify({ isPlaced }),
            }
        );
    },

    deleteFurnitureInventory(furnitureCode: number) {
        return apiRequest<void>(`/api/furnitures-inventory/${furnitureCode}`, {
            method: 'DELETE',
        });
    },

    getPoints(pageable?: PageRequest) {
        return apiRequest<PageResponse<PointLog>>(
            withPageable('/api/points', pageable)
        );
    },

    getUserPoints() {
        return apiRequest<PointLog[]>('/api/points/users');
    },

    getPoint(pointLogCode: number) {
        return apiRequest<PointLog>(`/api/points/${pointLogCode}`);
    },

    createPoint(request: PointCreateRequest) {
        return apiRequest<PointLog>('/api/points', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },

    getReports() {
        return apiRequest<AiReport[]>('/api/reports');
    },

    generateReport(yearMonth?: string) {
        const endpoint = yearMonth
            ? `/api/reports/generate?yearMonth=${encodeURIComponent(yearMonth)}`
            : '/api/reports/generate';

        return apiRequest<AiReport>(endpoint, {
            method: 'POST',
            timeout: 60000,
        });
    },

    async generateQuestion() {
        const data = await apiRequest<unknown>('/api/quest/generate');
        return normalizeQuestion(data);
    },

    submitAnswer(questionCode: string, answerContent: string) {
        return apiRequest<string>('/api/answer', {
            method: 'POST',
            body: JSON.stringify({ questionCode, answerContent }),
        });
    },
};

function normalizeUserInfo(data: unknown): UserInfo {
    const record = getRecord(data);

    return {
        userCode: getNumber(record, 'userCode') ?? 0,
        userName:
            getString(record, 'userName') ??
            getString(record, 'nickname') ??
            '사용자',
        userPoints:
            getNumber(record, 'userPoints') ??
            getNumber(record, 'points') ??
            0,
        userAuthProvider:
            getString(record, 'userAuthProvider') ??
            getString(record, 'authProvider') ??
            'GOOGLE',
    };
}

function normalizeQuestion(data: unknown): DailyQuestion {
    if (typeof data === 'string') {
        return {
            questionCode: data,
            questionContent: data,
            isAnswered: false,
        };
    }

    const record = getRecord(data);
    const questionCode =
        getString(record, 'questionCode') ??
        getString(record, 'questCode') ??
        getString(record, 'code');
    const questionContent =
        getString(record, 'questionContent') ??
        getString(record, 'questContent') ??
        getString(record, 'question') ??
        getString(record, 'content');

    if (!questionContent) {
        throw new Error('질문 응답에 내용이 없습니다.');
    }

    return {
        questionCode: questionCode ?? null,
        questionContent,
        isAnswered: !questionCode,
    };
}

function withPageable(endpoint: string, pageable: PageRequest = {}) {
    const params = new URLSearchParams();
    const page = pageable.page ?? 0;
    const size = pageable.size ?? 20;
    const sort = Array.isArray(pageable.sort)
        ? pageable.sort
        : pageable.sort
          ? [pageable.sort]
          : [];

    params.set('page', String(page));
    params.set('size', String(size));
    sort.forEach((value) => params.append('sort', value));

    return `${endpoint}?${params.toString()}`;
}

function getRecord(value: unknown): Record<string, unknown> {
    if (typeof value !== 'object' || value === null) return {};

    const record = value as Record<string, unknown>;
    return typeof record.data === 'object' && record.data !== null
        ? (record.data as Record<string, unknown>)
        : record;
}

function getString(record: Record<string, unknown>, key: string) {
    const value = record[key];
    return typeof value === 'string' ? value : undefined;
}

function getNumber(record: Record<string, unknown>, key: string) {
    const value = record[key];

    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim()) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }

    return undefined;
}

function getLocalDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
