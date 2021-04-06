import React, { useEffect, useState } from 'react'
import { Text, View, ActivityIndicator, StyleSheet, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Card, Button } from 'react-native-elements'
import ModalHeaderComponent from '../components/ModalHeaderComponent'
import {saveItem, openDatabase} from '../services/db'

export default function DrinkModal({navigation, route}) {

    const [drink, setDrink] = useState(null)
    const ingredients = []

    useEffect(() => {
        setDrink(route.params.drink)
    }, [route.params])

    if (!drink) {
        return <ActivityIndicator size='large' />
    }

    var i = 1
    const getIngredients = (obj) => {
        while (obj['strIngredient'+i]) {
            ingredients.push(obj['strIngredient'+i])
            i++
        }
    }
    getIngredients(drink)
    
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
                                <View key={index} style={{flexBasis: '45%', marginTop: 10}}>
                                    <Button 
                                        title={item} 
                                        titleStyle={
                                            item.length > 12 ? 
                                            styles.buttonTitleSmall : styles.buttonTitle
                                        } 
                                        buttonStyle={{backgroundColor: 'black', height: 35}}
                                        containerStyle={{borderRadius: 7, width: '100%'}}
                                    />
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
                <Button 
                    title='ADD TO FAVOURITES' 
                    titleStyle={{color: '#FF0000'}}
                    buttonStyle={{backgroundColor: 'black'}}
                    containerStyle={{width: '100%', marginVertical: 10, borderRadius: 7}}
                    onPress={() => navigation.navigate('Main', { screen: 'Favourites', params: {drink: drink}})}
                />
      </ScrollView>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 20
    },
    scrollView: {
      marginHorizontal: 20,
    },
    text: {
      fontSize: 42,
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
        backgroundColor: '#FFFFFF'
    },
    cardTitle: {
        fontSize: 20
    },
    buttonTitle: {
        color: '#FF0000', 
        fontWeight: 'bold', 
        fontSize: 15
    },
    buttonTitleSmall: {
        color: '#FF0000', 
        fontWeight: 'bold', 
        fontSize: 12
    },
    instructions: {
        fontSize: 15,
        textTransform: 'capitalize',
    },
  });