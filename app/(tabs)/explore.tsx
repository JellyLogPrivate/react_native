import {Image} from 'expo-image';
import {Platform, StyleSheet} from 'react-native';

import {Collapsible} from '@/components/ui/collapsible';
import {ExternalLink} from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {IconSymbol} from '@/components/ui/icon-symbol';
import {Fonts} from '@/constants/theme';
import {StatusBar} from "expo-status-bar";

export default function TabTwoScreen() {
    return (
        <ThemedView style={{ flex: 1 }}>
            {/*<StatusBar hidden />*/}
            {/* 배경 이미지 */}
            <Image
                source={require('@/assets/images/home.png')}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        width: '100%',
        height: '100%',
        position: 'absolute', // Parallax 안에서는 거의 필수
    },
});
