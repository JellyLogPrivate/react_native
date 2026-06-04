import { useState } from 'react';
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
import { rem, s } from '@/ui/units';

const QUESTION = 'Q. 오늘은 행복한 하루였나요?';
const COMPLETED_QUESTION = 'Q. 오늘도 답해줘서 고마워요!';
const COMPLETED_ANSWER = '이미 오늘의 질문에 답변하였습니다.';

export default function QNAScreen() {
    const [answer, setAnswer] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const handleSubmit = () => {
        Keyboard.dismiss();
        setIsCompleted(true);
    };

    return (
        <View style={styles.container}>
            <QuestionCard isCompleted={isCompleted} />
            <CatRoomScene />

            <AnswerPanel
                answer={answer}
                isCompleted={isCompleted}
                onAnswerChange={setAnswer}
                onSubmit={handleSubmit}
            />

            <AppTopBar />
        </View>
    );
}

function QuestionCard({ isCompleted }: { isCompleted: boolean }) {
    return (
        <View style={styles.questionCard}>
            <Text style={styles.questionText}>
                {isCompleted ? COMPLETED_QUESTION : QUESTION}
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
    onAnswerChange: (answer: string) => void;
    onSubmit: () => void;
};

function AnswerPanel({
    answer,
    isCompleted,
    onAnswerChange,
    onSubmit,
}: AnswerPanelProps) {
    return (
        <View style={styles.answerPanel}>
            <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: isCompleted }}
                disabled={isCompleted}
                style={({ pressed }) => [
                    styles.submitButton,
                    pressed && styles.submitButtonPressed,
                ]}
                onPress={onSubmit}
            >
                <Text style={styles.submitText}>답하기</Text>

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
});
