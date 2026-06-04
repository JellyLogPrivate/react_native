import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import Point from '@/assets/images/Point.svg';
import Tuna from '@/assets/images/tuna.svg';
import { DialogCloseButton } from '@/components/dialogs/dialog-close-button';
import { DefaultTheme } from '@/constants/theme';
import { useAppState } from '@/contexts/app-state-context';
import { rem, s } from '@/ui/units';

const REWARDS = [100, 100, 200, 200, 300, 300];

type AttendanceDialogProps = {
    visible: boolean;
    onClose: () => void;
};

export function AttendanceDialog({
    visible,
    onClose,
}: AttendanceDialogProps) {
    const { claimedRewards, claimReward } = useAppState();

    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.backdrop}>
                <View style={styles.dialog}>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>일주일 연속 출석 체크</Text>
                    </View>

                    <DialogCloseButton
                        accessibilityLabel="출석 보상 닫기"
                        onPress={onClose}
                    />

                    <View style={styles.rewardGrid}>
                        {REWARDS.map((point, index) => (
                            <RewardCard
                                key={`${point}-${index}`}
                                point={point}
                                claimed={Boolean(claimedRewards[index])}
                                available={index === 1}
                                onPress={() => claimReward(index)}
                            />
                        ))}
                    </View>

                    <FinalRewardCard />
                </View>
            </View>
        </Modal>
    );
}

type RewardCardProps = {
    point: number;
    claimed: boolean;
    available: boolean;
    onPress: () => void;
};

function RewardCard({
    point,
    claimed,
    available,
    onPress,
}: RewardCardProps) {
    const actionLabel = claimed
        ? '수령 완료'
        : available
          ? '수령'
          : '수령 불가';

    return (
        <Pressable
            accessibilityRole="button"
            disabled={claimed || !available}
            style={[
                styles.rewardCard,
                !available && !claimed && styles.unavailableRewardCard,
            ]}
            onPress={onPress}
        >
            <View style={styles.rewardCardContent}>
                <Text style={styles.rewardPoint}>{point} P</Text>
                <Point width={s(50)} height={s(35)} />
            </View>

            <RewardAction label={actionLabel} />
        </Pressable>
    );
}

function FinalRewardCard() {
    return (
        <View style={styles.finalRewardCard}>
            <View style={styles.finalRewardContent}>
                <View style={styles.finalRewardItem}>
                    <Text style={styles.rewardPoint}>500 P</Text>
                    <Point width={s(50)} height={s(35)} />
                </View>

                <Text style={styles.plusText}>+</Text>

                <View style={styles.tunaReward}>
                    <Tuna width={s(55)} height={s(48)} />
                    <Text style={styles.tunaCount}>X 3</Text>
                </View>
            </View>

            <RewardAction label="수령" />
        </View>
    );
}

function RewardAction({ label }: { label: string }) {
    return (
        <View style={styles.rewardAction}>
            <Text style={styles.rewardActionText}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        paddingHorizontal: s(18),

        backgroundColor: 'rgba(255, 254, 250, 0.32)',
    },

    dialog: {
        width: '100%',
        maxWidth: s(370),

        borderWidth: s(5),
        borderColor: DefaultTheme.sub2Color,
        borderRadius: s(20),

        paddingTop: s(56),
        paddingRight: s(18),
        paddingBottom: s(17),
        paddingLeft: s(18),

        backgroundColor: DefaultTheme.main2Color,
    },

    titleBox: {
        position: 'absolute',
        top: s(-15),
        left: s(14),

        height: s(44),

        borderWidth: s(5),
        borderColor: DefaultTheme.sub1Color,
        borderRadius: s(8),

        justifyContent: 'center',

        paddingHorizontal: s(15),

        backgroundColor: DefaultTheme.main1Color,
    },

    title: {
        fontSize: rem(1.2),
        color: '#050505',
    },

    rewardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',

        rowGap: s(12),
    },

    rewardCard: {
        width: s(101),
        height: s(106),

        borderWidth: s(5),
        borderColor: DefaultTheme.sub2Color,
        borderRadius: s(15),

        overflow: 'hidden',

        backgroundColor: DefaultTheme.main2Color,
    },

    unavailableRewardCard: {
        backgroundColor: DefaultTheme.sub2_2Color,
    },

    rewardCardContent: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',

        gap: s(2),
    },

    rewardPoint: {
        fontSize: rem(1.05),
        color: '#050505',
    },

    rewardAction: {
        height: s(31),

        borderTopWidth: s(5),
        borderTopColor: DefaultTheme.sub2Color,

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: DefaultTheme.main2Color,
    },

    rewardActionText: {
        fontSize: rem(1.05),
        color: '#050505',
    },

    finalRewardCard: {
        height: s(105),

        borderWidth: s(5),
        borderColor: DefaultTheme.sub2Color,
        borderRadius: s(15),

        marginTop: s(12),

        overflow: 'hidden',

        backgroundColor: DefaultTheme.sub2_2Color,
    },

    finalRewardContent: {
        flex: 1,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        gap: s(15),
    },

    finalRewardItem: {
        alignItems: 'center',
        gap: s(1),
    },

    plusText: {
        fontSize: rem(1.35),
        fontWeight: '600',
        color: '#050505',
    },

    tunaReward: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(4),
    },

    tunaCount: {
        fontSize: rem(1.05),
        color: '#050505',
    },
});
