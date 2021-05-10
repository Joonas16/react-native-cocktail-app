import React, {useEffect, useState} from 'react'
import { StatusBar } from 'expo-status-bar';
import { useFonts } from '@expo-google-fonts/inter';
import { Text, StyleSheet, View, ActivityIndicator, FlatList, Animated, TouchableHighlight } from 'react-native'
import HeaderComponent from '../components/HeaderComponent'
import { ListItem, Avatar } from 'react-native-elements'
import cocktailApi from '../services/cocktailApi'
import TouchableScale from 'react-native-touchable-scale';
import Loading from '../components/Loading'
import { Octicons } from '@expo/vector-icons';

export default function Home({ navigation }) {

    const [drinkList, setDrinkList] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    let font = require('../assets/fonts/Questrial.ttf')
    let [fontsLoaded] = useFonts({
        font
    });

    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableHighlight)

    const fetchRandomDrinks = async (count) => {

        // Initial fetching
        if(!count) {
            // getRandomCocktail gets count as parameter, how many cocktails you want to get
            const response = await cocktailApi.getRandomCocktail(10);
            setDrinkList(response);
            setIsRefreshing(false)

        // onRefresh    
        } else {
            const response = await cocktailApi.getRandomCocktail(count);
            setDrinkList([...drinkList, ...response]);
            setIsRefreshing(false)
        }
    };

    // First fetch
    useEffect(() => {
        fetchRandomDrinks();
    }, []);

    const onRefresh = () => {
        setIsRefreshing(true)
        fetchRandomDrinks()
    }

    const handleGetMore = () => {
        setIsRefreshing(true)
        fetchRandomDrinks(1)
    }
    
    const renderFooter = () => {
        try {
            if (isRefreshing) {
                return (
                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                        <ActivityIndicator size={80} color="#000000" />
                    </View>
                )
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }

    const renderItem = ({ item, index }) => {
        // If drink title longer than 9, render text on two lines, otherwise 1 line
        let length = item.drinks[0].strDrink.length
        if (length > 9) {
            length = 2
        } else {
            length = 1
        }
        return (
            <ListItem 
                Component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95} 
                underlayColor='#f3f3f3' 
                onPress={() => navigation.navigate('Modal', { id: item.drinks[0].idDrink })} 
                containerStyle={styles.listItem}
            >
                <Avatar size={150} avatarStyle={{ borderRadius: 16, marginLeft: 10 }} source={{ uri: item.drinks[0].strDrinkThumb }} renderPlaceholderContent={<Loading />}/>
                <ListItem.Content>
                    <ListItem.Title adjustsFontSizeToFit={true} numberOfLines={2} style={styles.listItemText}>{item.drinks[0].strDrink}</ListItem.Title>
                    <ListItem.Subtitle adjustsFontSizeToFit={true} numberOfLines={1} style={styles.listItemSub}>{item.drinks[0].strCategory}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron color='#000000' size={30} />
            </ListItem>
        )
    }

    if(!fontsLoaded) {
        return(
            <View style={styles.container}>
                <ActivityIndicator size={80} color='#000000'/>
            </View>
        )
    }

    return(
        <View style={styles.safeArea}>
            <StatusBar style='dark' />
            <HeaderComponent />
            <View style={styles.container}>
                <View style={styles.top}>
                    <View style={styles.title}>
                        <Text style={styles.textTitle}>popular drinks</Text>
                        <Octicons style={{ marginLeft: 10 }} name="flame" size={24} color="#FF0000" />
                    </View>
                    <FlatList 
                        contentContainerStyle={{alignSelf: 'stretch'}}
                        data={drinkList}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${item.drinks[0].idDrink} + ${index}`}
                        onRefresh={() => onRefresh()}
                        refreshing={isRefreshing}
                        onEndReached={handleGetMore}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={renderFooter}
                    />
                </View>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        margin: 10,
        borderRadius: 26,
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    title: {
        paddingLeft: 10,
        display: 'flex',
        flexDirection: 'row'
    },
    textTitle: {
        fontSize: 25,
        fontFamily: 'font',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    listItemText: {
        fontSize: 20,
        fontFamily: 'font',
    },
    listItemSub: {
        fontFamily: 'font',
        fontSize: 15
    }
});
  