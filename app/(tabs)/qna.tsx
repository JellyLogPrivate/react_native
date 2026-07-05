import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { AppTopBar } from '@/components/layout/app-top-bar';
import { CatRoomScene } from '@/components/layout/cat-room-scene';
import Paw from '@/components/paw';
import { DefaultTheme } from '@/constants/theme';
import { useAppState } from '@/contexts/app-state-context';
import { rem, s } from '@/ui/units';

const QUESTION = 'Q. 질문을 불러오는 중이에요.';
const COMPLETED_QUESTION = 'Q. 오늘도 답해줘서 고마워요!';
const COMPLETED_ANSWER = '이미 오늘의 질문에 답변하였습니다.';

export default function QNAScreen() {
    const [answer, setAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        errorMessage,
        isQuestionLoading,
        loadQuestion,
        question,
        submitAnswer,
    } = useAppState();
    const isCompleted = Boolean(question?.isAnswered);

    useFocusEffect(
        useCallback(() => {
            if (!question && !isQuestionLoading) {
                void loadQuestion();
            }
        }, [isQuestionLoading, loadQuestion, question])
    );

    const handleSubmit = async () => {
        if (isSubmitting || isCompleted || !answer.trim()) return;

        Keyboard.dismiss();
        setIsSubmitting(true);

        try {
            await submitAnswer(answer.trim());
            setAnswer('');
        } catch {
            // Error state is exposed by AppStateProvider.
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <QuestionCard
                isCompleted={isCompleted}
                isLoading={isQuestionLoading}
                question={question?.questionContent}
            />
            <CatRoomScene />

            <AnswerPanel
                answer={answer}
                isCompleted={isCompleted}
                isSubmitting={isSubmitting}
                onAnswerChange={setAnswer}
                onSubmit={handleSubmit}
            />

            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <AppTopBar />
        </View>
    );
}

type QuestionCardProps = {
    isCompleted: boolean;
    isLoading: boolean;
    question?: string;
};

function QuestionCard({ isCompleted, isLoading, question }: QuestionCardProps) {
    return (
        <View style={styles.questionCard}>
            <Text style={styles.questionText}>
                {getQuestionText({ isCompleted, isLoading, question })}
            </Text>

            <View style={styles.questionPaw}>
                <Paw
                    width={s(34)}
                    height={s(31)}
                    startColor={DefaultTheme.sub2Color}
                    endColor={DefaultTheme.sub2Color}
                />
            </View>
        </View>
    );
}

type AnswerPanelProps = {
    answer: string;
    isCompleted: boolean;
    isSubmitting: boolean;
    onAnswerChange: (answer: string) => void;
    onSubmit: () => Promise<void>;
};

function AnswerPanel({
    answer,
    isCompleted,
    isSubmitting,
    onAnswerChange,
    onSubmit,
}: AnswerPanelProps) {
    return (
        <View style={styles.answerPanel}>
            <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: isCompleted || isSubmitting }}
                disabled={isCompleted || isSubmitting}
                style={({ pressed }) => [
                    styles.submitButton,
                    pressed && styles.submitButtonPressed,
                ]}
                onPress={onSubmit}
            >
                <Text style={styles.submitText}>
                    {isSubmitting ? '전송 중' : '답하기'}
                </Text>

                <Paw
                    width={s(28)}
                    height={s(25)}
                    startColor={DefaultTheme.sub1Color}
                    endColor={DefaultTheme.sub1Color}
                />
            </Pressable>

            <Text style={styles.answerLabel}>A.</Text>

            <TextInput
                multiline
                editable={!isCompleted}
                value={isCompleted ? COMPLETED_ANSWER : answer}
                onChangeText={onAnswerChange}
                placeholder="사용자 답변"
                placeholderTextColor="#1E1D1C"
                style={[
                    styles.answerInput,
                    isCompleted && styles.completedAnswerInput,
                ]}
                textAlignVertical="top"
                maxLength={500}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: DefaultTheme.backGroundColor,
    },

    questionCard: {
        position: 'absolute',
        top: s(137),
        zIndex: 4,

        width: '100%',
        height: s(126),

        borderBottomWidth: s(5),
        borderRightWidth: s(5),
        borderLeftWidth: s(5),
        borderBottomColor: DefaultTheme.sub2Color,
        borderRightColor: DefaultTheme.sub2Color,
        borderLeftColor: DefaultTheme.sub2Color,
        borderBottomLeftRadius: s(31),
        borderBottomRightRadius: s(31),

        justifyContent: 'center',

        paddingHorizontal: s(29),
        paddingBottom: s(5),

        backgroundColor: DefaultTheme.main2Color,
    },

    questionText: {
        fontSize: rem(1.65),
        fontWeight: '400',
        color: '#050505',
    },

    questionPaw: {
        position: 'absolute',
        right: s(21),
        bottom: s(20),
    },

    answerPanel: {
        position: 'absolute',
        top: s(545),
        bottom: 0,
        zIndex: 5,

        width: '100%',

        borderTopWidth: s(5),
        borderRightWidth: s(5),
        borderLeftWidth: s(5),
        borderColor: DefaultTheme.sub2Color,
        borderTopLeftRadius: s(31),
        borderTopRightRadius: s(31),

        paddingTop: s(49),
        paddingRight: s(21),
        paddingBottom: s(20),
        paddingLeft: s(53),

        backgroundColor: DefaultTheme.main2Color,
    },

    submitButton: {
        position: 'absolute',
        top: s(-15),
        right: s(33),

        height: s(52),

        borderWidth: s(5),
        borderColor: DefaultTheme.sub1Color,
        borderRadius: s(8),

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: s(8),
        gap: s(5),

        backgroundColor: DefaultTheme.main1Color,
    },

    submitButtonPressed: {
        opacity: 0.75,
        transform: [{ scale: 0.98 }],
    },

    submitText: {
        fontSize: rem(1.25),
        fontWeight: '600',
        color: DefaultTheme.sub1Color,
    },

    answerLabel: {
        position: 'absolute',
        top: s(54),
        left: s(25),

        fontSize: rem(1.6),
        fontWeight: '400',
        color: '#050505',
    },

    answerInput: {
        flex: 1,

        borderWidth: s(5),
        borderColor: DefaultTheme.sub1Color,
        borderRadius: s(10),

        paddingTop: s(14),
        paddingHorizontal: s(13),

        backgroundColor: DefaultTheme.main1Color,

        fontSize: rem(1.25),
        fontWeight: '400',
        color: '#1E1D1C',
    },

    completedAnswerInput: {
        color: DefaultTheme.sub2Color,
    },

    errorText: {
        position: 'absolute',
        left: s(28),
        right: s(28),
        bottom: s(18),
        zIndex: 6,

        textAlign: 'center',
        fontSize: rem(0.9),
        color: '#B94A48',
    },
});

function getQuestionText({
    isCompleted,
    isLoading,
    question,
}: {
    isCompleted: boolean;
    isLoading: boolean;
    question?: string;
}) {
    if (isCompleted) return COMPLETED_QUESTION;
    if (question) return formatQuestion(question);
    if (isLoading) return QUESTION;

    return QUESTION;
}

function formatQuestion(question: string) {
    return question.trim().startsWith('Q.') ? question : `Q. ${question}`;
}
