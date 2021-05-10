import React, { useContext } from 'react'
import { useFonts } from '@expo-google-fonts/inter';
import { View, FlatList, Alert, StyleSheet, Text, ActivityIndicator } from 'react-native'
import HeaderComponent from '../components/HeaderComponent'
import { ListItem, Button } from'react-native-elements';
import { StateContext } from '../state/index'
import { deleteId } from '../state/actions';
import * as Animatable from 'react-native-animatable';
import TouchableScale from 'react-native-touchable-scale';
import { AntDesign } from '@expo/vector-icons';

export default function Favourites({ navigation }) {

    const { state, dispatch } = useContext(StateContext)
    const favourites = [...state.favourites]

    const AnimatableIcon = Animatable.createAnimatableComponent(AntDesign)

    let font = require('../assets/fonts/Questrial.ttf')
    let [fontsLoaded] = useFonts({
        font
    });

    const renderItem = ({item}) => (
        <ListItem 
            Component={TouchableScale} 
            friction={90}
            tension={100}
            activeScale={0.95}
            underlayColor='#f3f3f3' 
            onPress={() => navigation.navigate('Modal', { id: item.idDrink })} 
            style={{width: '100%'}} 
            containerStyle={styles.item} 
            bottomDivider
        >
            <ListItem.Content>
                <ListItem.Title adjustsFontSizeToFit={true} numberOfLines={1} style={{color: '#000000', fontSize: 25}}>{item.strDrink}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron name='trash' onPress={() => deleteDrink(item)} size={25} color='red'/>
        </ListItem>
    )

    const deleteDrink = (drink) => {
        Alert.alert(
            "Confirmation",
            `Are you sure you want to delete "${drink.strDrink}" from your favourites?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => dispatch(deleteId(drink.idDrink))
                }
            ]
        );
    }

    if(!fontsLoaded) {
        return(
            <View style={styles.safeArea}>
                <ActivityIndicator size={80} color='#000000'/>
            </View>
        )
    }

    if(!favourites.length > 0) {
        return (
            <View style={styles.safeArea}>
                <HeaderComponent />
                <View style={styles.container}>
                    <AnimatableIcon name="exception1" size={100} color="black" animation='rubberBand' iterationDelay={1500} iterationCount='infinite'/>
                    <Text style={styles.placeholderText}>It is empty in here!</Text>
                    <Button
                        raised
                        titleStyle={{ fontFamily: 'font', fontSize: 20 }}
                        title='EXPLORE'
                        onPress={() => navigation.navigate('Home')}
                        containerStyle={styles.button}
                        buttonStyle={{ backgroundColor: '#FF0000' }}
                    />
                </View>
            </View>
        )
    }

    return(
        <View style={styles.safeArea}>
            <HeaderComponent />
            <View style={styles.container}>
                <FlatList 
                    style={{width: '100%', marginTop: 10}}
                    keyExtractor={item => item.idDrink} 
                    data={state.favourites}
                    renderItem={renderItem} 
                    contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    safeArea: {
        display: 'flex',
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        width: 100,
        height: 500
    },
    item: {
        width: '95%' ,
        shadowColor: '#000',
        marginTop: 10,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        borderRadius: 26,
    },
    button: {
        width: '55%',
        marginTop: '5%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    placeholderText: { 
        fontSize: 25, 
        fontFamily: 'font', 
        marginTop: 10 
    }
});
