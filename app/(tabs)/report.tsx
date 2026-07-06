import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { AppTopBar } from '@/components/layout/app-top-bar';
import Paw from '@/components/paw';
import { DefaultTheme } from '@/constants/theme';
import { AiReport, appApi } from '@/services/api/app-api';
import { rem, s } from '@/ui/units';

export default function ReportScreen() {
    const [reports, setReports] = useState<AiReport[]>([]);
    const [selectedReport, setSelectedReport] = useState<AiReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const data = await appApi.getReports();
            const sorted = [...data].sort((a, b) => b.yearMonth.localeCompare(a.yearMonth));
            setReports(sorted);
            
            if (sorted.length > 0) {
                setSelectedReport((prev) => {
                    if (prev) {
                        const found = sorted.find(r => r.id === prev.id);
                        return found || sorted[0];
                    }
                    return sorted[0];
                });
            } else {
                setSelectedReport(null);
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : '리포트를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void fetchReports();
        }, [fetchReports])
    );

    const handleGenerateReport = async () => {
        if (isGenerating) return;
        setIsGenerating(true);
        setErrorMessage(null);
        try {
            const now = new Date();
            const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            
            const newReport = await appApi.generateReport(currentYearMonth);
            
            const data = await appApi.getReports();
            const sorted = [...data].sort((a, b) => b.yearMonth.localeCompare(a.yearMonth));
            setReports(sorted);
            
            const found = sorted.find(r => r.yearMonth === currentYearMonth) || sorted[0];
            setSelectedReport(found || newReport);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : '리포트 생성 중 오류가 발생했습니다.');
        } finally {
            setIsGenerating(false);
        }
    };

    function formatYearMonth(ymString: string) {
        if (!ymString) return '';
        const parts = ymString.split('-');
        if (parts.length === 2) {
            return `${parts[0]}년 ${parts[1]}월`;
        }
        return ymString;
    }

    function formatDate(dateString: string) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}.${month}.${day}`;
        } catch {
            return dateString;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                {isLoading && reports.length === 0 ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color={DefaultTheme.sub1Color} />
                        <Text style={styles.loadingText}>리포트를 불러오는 중입니다... 🐾</Text>
                    </View>
                ) : isGenerating ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color={DefaultTheme.sub1Color} />
                        <Text style={styles.loadingText}>고양이가 일기와 활동을 열심히 분석하고 있어요...</Text>
                        <Text style={styles.loadingSubText}>잠시만 기다려 주세요! 🐾</Text>
                    </View>
                ) : reports.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconBox}>
                            <Paw
                                width={s(80)}
                                height={s(73)}
                                startColor={DefaultTheme.sub2_2Color}
                                endColor={DefaultTheme.sub2_2Color}
                            />
                        </View>
                        <Text style={styles.emptyTitle}>아직 생성된 고양이 리포트가 없어요</Text>
                        <Text style={styles.emptyDescription}>
                            매달 성실하게 작성한 일기와 질문 답변 데이터를{'\n'}고양이가 정밀하게 분석하여 맞춤 리포트를 드려요.
                        </Text>
                        <Pressable style={styles.generateButton} onPress={handleGenerateReport}>
                            <Text style={styles.generateButtonText}>이번 달 고양이 리포트 생성하기</Text>
                        </Pressable>
                        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <View style={styles.monthSelectorWrapper}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.monthScrollContent}
                            >
                                {reports.map((report) => {
                                    const isSelected = selectedReport?.id === report.id;
                                    return (
                                        <Pressable
                                            key={report.id}
                                            style={[
                                                styles.monthCapsule,
                                                isSelected && styles.monthCapsuleSelected,
                                            ]}
                                            onPress={() => setSelectedReport(report)}
                                        >
                                            <Text
                                                style={[
                                                    styles.monthCapsuleText,
                                                    isSelected && styles.monthCapsuleTextSelected,
                                                ]}
                                            >
                                                {formatYearMonth(report.yearMonth)}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>

                            <Pressable style={styles.smallGenerateButton} onPress={handleGenerateReport}>
                                <Text style={styles.smallGenerateButtonText}>새로 생성</Text>
                            </Pressable>
                        </View>

                        {selectedReport && (
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                            >
                                {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

                                <View style={styles.reportHeaderCard}>
                                    <View style={styles.headerTitleBox}>
                                        <Text style={styles.reportTitle}>
                                            {formatYearMonth(selectedReport.yearMonth)} 고양이 일기 분석
                                        </Text>
                                        <Text style={styles.reportDate}>
                                            분석일: {formatDate(selectedReport.createdAt)}
                                        </Text>
                                    </View>
                                    <View style={styles.headerPaw}>
                                        <Paw
                                            width={s(34)}
                                            height={s(31)}
                                            startColor={DefaultTheme.sub1Color}
                                            endColor={DefaultTheme.sub1Color}
                                        />
                                    </View>
                                </View>

                                <View style={styles.sectionContainer}>
                                    <Text style={styles.sectionTitle}>정서 지표 분석</Text>
                                    <View style={styles.scoresCard}>
                                        <ProgressBar
                                            label="정서적 안정감"
                                            value={selectedReport.scoreStability}
                                            color="#B0F398"
                                        />
                                        <ProgressBar
                                            label="활동성"
                                            value={selectedReport.scoreActivity}
                                            color="#FFD180"
                                        />
                                        <ProgressBar
                                            label="행복도"
                                            value={selectedReport.scoreHappiness}
                                            color="#FFCEF2"
                                        />
                                        <ProgressBar
                                            label="스트레스 지수"
                                            value={selectedReport.scoreStress}
                                            color="#F3989C"
                                        />
                                        <ProgressBar
                                            label="일기 성취도"
                                            value={selectedReport.scoreAchievement}
                                            color="#B2EBF2"
                                        />
                                    </View>
                                </View>

                                <View style={styles.sectionContainer}>
                                    <Text style={styles.sectionTitle}>젤리로그 고양이 일기 총평</Text>
                                    <View style={styles.analysisCard}>
                                        <Text style={styles.analysisText}>
                                            {selectedReport.content}
                                        </Text>
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                )}
            </View>

            <AppTopBar />
        </View>
    );
}

function ProgressBar({
    label,
    value,
    max = 100,
    color,
}: {
    label: string;
    value: number;
    max?: number;
    color: string;
}) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    return (
        <View style={styles.scoreRow}>
            <View style={styles.scoreInfo}>
                <Text style={styles.scoreLabel}>{label}</Text>
                <Text style={styles.scoreValue}>{value}점</Text>
            </View>
            <View style={styles.progressBg}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${percentage}%`, backgroundColor: color },
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DefaultTheme.backGroundColor,
    },

    contentContainer: {
        flex: 1,
        marginTop: s(137),
        backgroundColor: DefaultTheme.backGroundColor,
    },

    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: s(20),
    },

    loadingText: {
        marginTop: s(15),
        fontSize: rem(1.4),
        color: DefaultTheme.sub2Color,
        textAlign: 'center',
        fontWeight: '500',
    },

    loadingSubText: {
        marginTop: s(5),
        fontSize: rem(1.2),
        color: DefaultTheme.sub1Color,
        textAlign: 'center',
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: s(40),
    },

    emptyIconBox: {
        marginBottom: s(20),
    },

    emptyTitle: {
        fontSize: rem(1.8),
        fontWeight: 'bold',
        color: DefaultTheme.sub2Color,
        marginBottom: s(10),
    },

    emptyDescription: {
        fontSize: rem(1.3),
        color: DefaultTheme.sub2Color,
        textAlign: 'center',
        lineHeight: rem(2),
        marginBottom: s(30),
    },

    generateButton: {
        backgroundColor: DefaultTheme.sub1Color,
        paddingHorizontal: s(24),
        paddingVertical: s(14),
        borderRadius: s(12),
        borderWidth: s(3),
        borderColor: DefaultTheme.sub2Color,
    },

    generateButtonText: {
        color: '#fff',
        fontSize: rem(1.4),
        fontWeight: 'bold',
    },

    monthSelectorWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: s(12),
        paddingHorizontal: s(16),
        borderBottomWidth: s(2),
        borderBottomColor: DefaultTheme.sub2_2Color,
        backgroundColor: DefaultTheme.main1Color,
    },

    monthScrollContent: {
        alignItems: 'center',
        paddingRight: s(10),
    },

    monthCapsule: {
        paddingHorizontal: s(14),
        paddingVertical: s(8),
        borderRadius: s(20),
        borderWidth: s(2),
        borderColor: DefaultTheme.sub2_2Color,
        marginRight: s(8),
        backgroundColor: DefaultTheme.main2Color,
    },

    monthCapsuleSelected: {
        backgroundColor: DefaultTheme.sub1Color,
        borderColor: DefaultTheme.sub2Color,
    },

    monthCapsuleText: {
        fontSize: rem(1.25),
        color: DefaultTheme.sub2Color,
        fontWeight: '600',
    },

    monthCapsuleTextSelected: {
        color: '#fff',
    },

    smallGenerateButton: {
        backgroundColor: DefaultTheme.main2Color,
        borderWidth: s(2),
        borderColor: DefaultTheme.sub1Color,
        paddingHorizontal: s(10),
        paddingVertical: s(8),
        borderRadius: s(12),
        justifyContent: 'center',
        alignItems: 'center',
    },

    smallGenerateButtonText: {
        fontSize: rem(1.15),
        color: DefaultTheme.sub1Color,
        fontWeight: 'bold',
    },

    scrollContent: {
        padding: s(16),
        paddingBottom: s(30),
    },

    reportHeaderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: s(4),
        borderColor: DefaultTheme.sub2Color,
        borderRadius: s(16),
        padding: s(16),
        marginBottom: s(16),
        backgroundColor: DefaultTheme.main2Color,
    },

    headerTitleBox: {
        flex: 1,
    },

    reportTitle: {
        fontSize: rem(1.7),
        fontWeight: 'bold',
        color: '#1E1D1C',
        marginBottom: s(4),
    },

    reportDate: {
        fontSize: rem(1.15),
        color: DefaultTheme.sub2Color,
    },

    headerPaw: {
        marginLeft: s(10),
    },

    sectionContainer: {
        marginBottom: s(20),
    },

    sectionTitle: {
        fontSize: rem(1.4),
        fontWeight: 'bold',
        color: DefaultTheme.sub2Color,
        marginBottom: s(8),
        paddingLeft: s(4),
    },

    scoresCard: {
        borderWidth: s(4),
        borderColor: DefaultTheme.sub2Color,
        borderRadius: s(16),
        padding: s(16),
        backgroundColor: DefaultTheme.main2Color,
        gap: s(14),
    },

    scoreRow: {
        width: '100%',
    },

    scoreInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: s(6),
    },

    scoreLabel: {
        fontSize: rem(1.3),
        fontWeight: '600',
        color: '#1E1D1C',
    },

    scoreValue: {
        fontSize: rem(1.3),
        fontWeight: 'bold',
        color: DefaultTheme.sub2Color,
    },

    progressBg: {
        height: s(12),
        backgroundColor: DefaultTheme.sub2_2Color,
        borderRadius: s(6),
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        borderRadius: s(6),
    },

    analysisCard: {
        borderWidth: s(4),
        borderColor: DefaultTheme.sub2Color,
        borderRadius: s(16),
        padding: s(18),
        backgroundColor: DefaultTheme.main2Color,
    },

    analysisText: {
        fontSize: rem(1.35),
        color: '#1E1D1C',
        lineHeight: rem(2.1),
    },

    errorText: {
        color: '#FF6B6B',
        fontSize: rem(1.2),
        textAlign: 'center',
        marginTop: s(10),
        fontWeight: '500',
    },
});
