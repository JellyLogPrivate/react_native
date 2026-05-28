import Animated from 'react-native-reanimated';

import { rem, s } from '@/ui/units';

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: rem(1.75),
        lineHeight: rem(2),
        marginTop: -s(6),
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}>
      👋
    </Animated.Text>
  );
}
