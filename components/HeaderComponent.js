import React from 'react'
import { Header, Text } from 'react-native-elements'
import { useFonts } from '@expo-google-fonts/inter';

export default function HeaderComponent() {
    let font1 = require('../assets/fonts/Questrial.ttf')
    let [fontsLoaded] = useFonts({
        font1
    });
    if(!fontsLoaded) {
        return <Text>Loading...</Text>
    }
    return (
        <Header 
            backgroundColor='#fff'
            centerComponent={{text: 'Cocktailz', style: { fontSize: 30, fontFamily: 'font1', color: '#FF0000' }}}
        />
    )
}