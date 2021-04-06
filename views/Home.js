import React, {useEffect, useState} from 'react'
import { Text, StyleSheet, View, ScrollView, ActivityIndicator, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderComponent from '../components/HeaderComponent'
import { ListItem, Avatar } from 'react-native-elements'
import cocktailApi from '../services/cocktailApi'

export default function Home({ navigation }) {

    const [drinkList, setDrinkList] = useState([])
    const [categoryList, setCategoryList] = useState(null)


    useEffect(() => {
        const fetchRandomDrinks = async () => {
            // getRandomCocktail gets count as parameter, how many cocktails you want to get
            const response = await cocktailApi.getRandomCocktail(10);
            setDrinkList(response);
        };
        const fetchCategories = async () => {
            // getCategories fetches all categories
            const response = await cocktailApi.getCategories();
            setCategoryList(response);
        };
        fetchRandomDrinks();
        fetchCategories()
    }, []);
    
    return(
        <View style={styles.safeArea}>
            <HeaderComponent />
            <View style={styles.container}>
                <View style={styles.top}>
                    <View style={styles.title}>
                        <Text style={styles.textTitle}>popular drinks</Text>
                    </View>
                    <ScrollView 
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            drinkList.length > 0 ?
                            drinkList.map((item, index) => (
                                <ListItem containerStyle={styles.listItem} key={index} bottomDivider onPress={() => navigation.navigate('Modal', {drink: item.drinks[0]})}>
                                    <Avatar size={150} avatarStyle={{borderRadius: 16}} source={{uri: item.drinks[0].strDrinkThumb}} />
                                    <ListItem.Content>
                                        <ListItem.Title style={styles.listItemText}>{item.drinks[0].strDrink}</ListItem.Title>
                                        <ListItem.Subtitle>{item.drinks[0].strCategory}</ListItem.Subtitle>
                                    </ListItem.Content>
                                    <ListItem.Chevron color='#000000' size={30}/>
                                </ListItem>
                            ))
                            : <ActivityIndicator size='large' color='#FF0000' />
                        }
                    </ScrollView>
                </View>
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
    top: {
        display: 'flex',
        flex: 3,
        width: '90%',
        marginTop: 10
    },
    bottom: {
        display: 'flex',
        flex: 2,
        width: '90%',
        marginVertical: '5%'
    },
    listItem: {
        paddingHorizontal: 0,
        paddingVertical: 10,
    },
    scrollView: {
        marginTop: 10,

    },
    textTitle: {
        fontSize: 20,
        fontWeight: '300',
        marginBottom: 10,
        textTransform: 'uppercase',
        
    },
    listItemText: {
        fontSize: 20,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
});
  