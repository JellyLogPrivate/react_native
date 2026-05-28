/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const DefaultTheme = {
    tintColorLight: '#0a7ea4',
    tintColorDark: '#fff',
    main1Color: '#FFFCF5',
    main2Color: '#FDFDFD',
    sub1Color: '#B39C8D',
    sub2Color: '#7B7876',
    sub2_2Color: '#E4E3E3',
    growthColor: '#B0F398',
    heart1Color: '#FFCED0',
    heart2Color: '#F3989C',
    backGroundColor: '#FFFEFA',
};

export const Colors = {
    light: {
        text: '#11181C',
        background: DefaultTheme.backGroundColor,
        tint: DefaultTheme.tintColorLight,
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: DefaultTheme.tintColorLight,
    },
    dark: {
        text: '#ECEDEE',
        background: DefaultTheme.backGroundColor,
        tint: DefaultTheme.tintColorDark,
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: DefaultTheme.tintColorDark,
    },
};

export const Fonts = Platform.select({
    ios: {
        /** iOS `UIFontDescriptorSystemDesignDefault` */
        sans: 'system-ui',
        /** iOS `UIFontDescriptorSystemDesignSerif` */
        serif: 'ui-serif',
        /** iOS `UIFontDescriptorSystemDesignRounded` */
        rounded: 'ui-rounded',
        /** iOS `UIFontDescriptorSystemDesignMonospaced` */
        mono: 'ui-monospace',
    },
    default: {
        sans: 'normal',
        serif: 'serif',
        rounded: 'normal',
        mono: 'monospace',
    },
    web: {
        sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        serif: "Georgia, 'Times New Roman', serif",
        rounded:
            "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
        mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
});
