import { StyleSheet, Text, View } from 'react-native';

import { AppTopBar } from '@/components/layout/app-top-bar';
import { DefaultTheme } from '@/constants/theme';

export default function ReportScreen() {
    return (
        <View style={styles.container}>
            <AppTopBar />
            <Text style={styles.title}>Report</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DefaultTheme.backGroundColor,
    },

    title: {
        fontSize: 32,
    },
});
