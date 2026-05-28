import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { rem } from '@/ui/units';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: rem(1),
    lineHeight: rem(1.5),
  },
  defaultSemiBold: {
    fontSize: rem(1),
    lineHeight: rem(1.5),
    fontWeight: '600',
  },
  title: {
    fontSize: rem(2),
    fontWeight: 'bold',
    lineHeight: rem(2),
  },
  subtitle: {
    fontSize: rem(1.25),
    fontWeight: 'bold',
  },
  link: {
    lineHeight: rem(1.875),
    fontSize: rem(1),
    color: '#0a7ea4',
  },
});
