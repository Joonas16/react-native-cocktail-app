import React, { useEffect, useState, useContext } from 'react'
import { useFonts } from '@expo-google-fonts/inter';
import { Text, View, ActivityIndicator, StyleSheet, ScrollView} from 'react-native'
import { Image, Card, Button } from 'react-native-elements'
import ModalHeaderComponent from '../components/ModalHeaderComponent'
import { StateContext } from '../state/index'
import { addToFavourites } from '../state/actions'
import cocktailApi from '../services/cocktailApi'
import { Alert } from 'react-native';
import { deleteId } from '../state/actions';

export default function DrinkModal({navigation, route}) {

    const { state, dispatch } = useContext(StateContext)
    const [drink, setDrink] = useState(null)
    const ingredients = []

    let font = require('../assets/fonts/Questrial.ttf')
    let [fontsLoaded] = useFonts({
        font
    });

    const fetchDrink = async () => {
        const response = await cocktailApi.searchById(route.params.id);
        setDrink(response.drinks[0]);
    };

    useEffect(() => {
        fetchDrink() 
    }, [route.params])

    if (!drink) {
        return <ActivityIndicator size='large' />
    }
    const handleAddingToFavourites = () => {
        dispatch(addToFavourites(drink))
        Alert.alert('Success', 'Drink added to favourites')
    }
    const raiseAlert = () => {
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
                    onPress: () => handleDelete() 
                }
            ]
        );
    }
    const handleDelete = () => {
        dispatch(deleteId(drink.idDrink))
        navigation.goBack()
    }
    var i = 1
    const getIngredients = (obj) => {
        while (obj['strIngredient'+i]) {
            ingredients.push(obj['strIngredient'+i])
            i++
        }
    }
    getIngredients(drink)

    if(!fontsLoaded) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size={80} color='#000000'/>
            </View>
        )
    }

    return(
        <View style={styles.container}>
            <ModalHeaderComponent drink={drink} navigation={navigation} />
            <ScrollView 
                showsVerticalScrollIndicator={false}
                style={styles.scrollView} 
                contentContainerStyle={{alignItems: 'center'}}
            >
                <Image 
                    source={{uri: drink.strDrinkThumb}}
                    style={{height: 380, width: 450, resizeMode: 'contain', borderRadius: 16}}
                    containerStyle={{marginTop: 20}}
                />
                <Card containerStyle={styles.card}>
                    <Card.Title style={styles.cardTitle}>Ingredients</Card.Title>
                    <Card.Divider/>
                    <View style={styles.ingredientsWrapper}>
                        {
                            ingredients.length > 0 &&
                            ingredients.map((item, index) => (
                                <View key={index} style={{flexBasis: '45%', marginTop: 10, width: 180, alignItems: 'center'}}>
                                    <View style={{width: '90%'}}>
                                        <Button
                                            titleProps={{adjustsFontSizeToFit: true}}
                                            title={item} 
                                            titleStyle={styles.buttonTitle} 
                                            buttonStyle={{ backgroundColor: '#FF0000', height: 35}}
                                            containerStyle={{borderRadius: 7, width: '100%'}}
                                            onPress={() => navigation.navigate('Search', { search: item })}
                                        />
                                    </View>
                                    
                                </View>
                            ))
                        }
                    </View>
                </Card>
                <Card containerStyle={styles.card}>
                    <Card.Title style={styles.cardTitle}>Instructions</Card.Title>
                    <Card.Divider/>
                    <View>
                        <Text style={styles.instructions}>{drink.strInstructions}</Text>
                    </View>
                </Card>
                {
                    !(state.favourites.filter(e => e.idDrink === drink.idDrink).length > 0) ?
                     <Button 
                        title='ADD TO FAVOURITES' 
                        titleStyle={{color: '#fff'}}
                        buttonStyle={{ backgroundColor: '#FF0000'}}
                        containerStyle={{width: '100%', marginVertical: 10, borderRadius: 7}}
                        onPress={() => handleAddingToFavourites()}
                    />
                    :
                    <Button
                        title='DELETE FROM FAVOURITES'
                        titleStyle={{ color: '#fff' }}
                        buttonStyle={{ backgroundColor: '#FF0000' }}
                        containerStyle={{ width: '100%', marginVertical: 10, borderRadius: 7, marginBottom: 10 }}
                        onPress={() => raiseAlert()}
                    />
                }
               
      </ScrollView>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 20,
      backgroundColor: '#fff'
    },
    scrollView: {
      marginHorizontal: 20,
    },
    text: {
      fontSize: 42,
      fontFamily: 'font'
    },
    ingredientsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap'
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 26
    },
    cardTitle: {
        fontSize: 20,
        fontFamily: 'font'
    },
    buttonTitle: {
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 15,
        fontFamily: 'font',
        margin: 2
    },
    instructions: {
        fontSize: 15,
        textTransform: 'capitalize',
        fontFamily: 'font'
    },
  });