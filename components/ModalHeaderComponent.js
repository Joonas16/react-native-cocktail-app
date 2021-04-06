import React from 'react'
import { Header, Text, Icon } from 'react-native-elements'
import { useFonts } from '@expo-google-fonts/inter';
import { ActivityIndicator } from 'react-native'

export default function ModalHeaderComponent(props) {

    const { navigation } = props
    const title = props.drink.strDrink

    let font1 = require('../assets/fonts/Questrial.ttf')
    let [fontsLoaded] = useFonts({
        font1
    });
    if(!fontsLoaded) {
        return <ActivityIndicator color='#FF0000' size='large' />
    }

    return (
        <Header
            backgroundColor='#fff'
            leftComponent={() => <Icon name='chevron-left' color='#FF0000' size={32} onPress={() => navigation.navigate('Main')} />}
            centerComponent={{text: `${title}`, style: { fontSize: 30, fontFamily: 'font1', color: '#FF0000'}}}
        />
    )
}