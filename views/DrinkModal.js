import React, { useEffect, useState, useContext } from 'react'
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
                {
                    !(state.favourites.filter(e => e.idDrink === drink.idDrink).length > 0) ?
                     <Button 
                        title='ADD TO FAVOURITES' 
                        titleStyle={{color: '#FF0000'}}
                        buttonStyle={{backgroundColor: 'black'}}
                        containerStyle={{width: '100%', marginVertical: 10, borderRadius: 7}}
                        onPress={() => handleAddingToFavourites()}
                    />
                    :
                    <Button
                        title='DELETE FROM FAVOURITES'
                        titleStyle={{ color: '#FF0000' }}
                        buttonStyle={{ backgroundColor: 'black' }}
                        containerStyle={{ width: '100%', marginVertical: 10, borderRadius: 7 }}
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