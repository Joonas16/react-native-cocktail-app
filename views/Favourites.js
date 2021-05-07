import React, { useContext } from 'react'
import { useFonts } from '@expo-google-fonts/inter';
import { StyleSheet, View, FlatList } from 'react-native'
import HeaderComponent from '../components/HeaderComponent'
import { ListItem } from'react-native-elements';
import { StateContext } from '../state/index'
import { deleteId } from '../state/actions';
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';

export default function Favourites({navigation, route}) {

    const { state, dispatch } = useContext(StateContext)
    const favourites = [...state.favourites]

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
            <ListItem.Chevron name='trash' onPress={() => deleteItem(item.idDrink)} size={25} color='red'/>
        </ListItem>
    )

    const deleteItem = (id) => {
        dispatch(deleteId(id))
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
                    <Animatable.Text style={{fontSize: 25, fontFamily: 'font'}} animation='rubberBand' delay={2500} iterationDelay={2000} iterationCount='infinite'>It is empty in here!</Animatable.Text>
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
    }
});
