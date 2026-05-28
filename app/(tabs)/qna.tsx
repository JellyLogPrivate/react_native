import { StyleSheet, Text, View } from 'react-native';

export default function QNAScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Q&A</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontSize: 32,
    },
});
