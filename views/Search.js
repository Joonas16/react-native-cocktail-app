import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderComponent from '../components/HeaderComponent'

export default function Search() {

    return(
        <View style={styles.safeArea}>
            <HeaderComponent />
            <View style={styles.container}>
                <Text>Search</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    safeArea: {
        display: 'flex',
        flex: 1,
    },
    container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
