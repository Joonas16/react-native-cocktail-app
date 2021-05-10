import React, { useState, useEffect } from 'react'
import { useFonts } from '@expo-google-fonts/inter';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Keyboard } from 'react-native'
import { Input, CheckBox, Icon, Button, ListItem, Avatar } from 'react-native-elements';
import HeaderComponent from '../components/HeaderComponent';
import cocktailApi from '../services/cocktailApi'
import TouchableScale from 'react-native-touchable-scale';
import Loading from '../components/Loading'

export default function Search({navigation, route}) {
    const [name, setName] = useState(true)
    const [ingredient, setIngredient] = useState(false)
    const [input, setInput] = useState('')
    const [type, setType] = useState('name')
    const [drinkList, setDrinkList] = useState([])
    const [drinkListByIngredient, setDrinkListByIngredient] = useState([])
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if(!route.params?.search) return

        try {
            setInput(route.params.search)
            handleCheck('ingredient')
        } catch (error) {
            console.log(error)
        }
    }, [route.params?.search])

    let FONT_SIZE = 15
    let font = require('../assets/fonts/Questrial.ttf')
    let [fontsLoaded] = useFonts({
        font
    });

    const handleCheck = (type) => {
        // CHECK
        setDrinkList([])
        setDrinkListByIngredient([])
        if(type === "name") {
            setType('name')
            setName(true)
            setIngredient(false)
        } else {
            setType('ingredient')
            setIngredient(true)
            setName(false)
        }
    }

    const fetchItems = async (type) => {
        setIsLoading(true)
        Keyboard.dismiss()

        if(input === '') return

        if(type === 'name') {
            const response = await cocktailApi.searchByName(input);
            if(!response || !response.drinks) {
                setError(`"${input}" was not found`)
                console.log('No object was found using type name')
            } else {
                setDrinkList(response);
                console.log('results found using type name')
            }
            setIsLoading(false)
        } else {
            const response = await cocktailApi.searchByIngredient(input);
            if(response) {
                setDrinkListByIngredient(response);
                console.log('results found using type ingredient')
            } else {
                setError(`No drinks were found by ingredient: ${input}`)
                console.log('No object was found using type ingredient')
            }
            setIsLoading(false)
        }
        setInput('')
    }

    const renderItem = ({ item }) => {
        // If drink title longer than 9, render text on two lines, otherwise 1 line
        let length = item.strDrink.length
        if(length > 9) {
            length = 2
        } else {
            length = 1
        }
        if(type === 'name') {
            return (
                <ListItem 
                    Component={TouchableScale}
                    friction={90}
                    tension={100}
                    activeScale={0.95} 
                    underlayColor='#f3f3f3' 
                    onPress={() => navigation.navigate('Modal', { id: item.idDrink })} 
                    containerStyle={styles.listItem}
                >
                    <Avatar size={150} avatarStyle={{ borderRadius: 16 }} source={{ uri: item.strDrinkThumb }} renderPlaceholderContent={<Loading />} />
                    <ListItem.Content>
                        <ListItem.Title adjustsFontSizeToFit={true} numberOfLines={length} style={styles.listItemText}>{item.strDrink}</ListItem.Title>
                        <ListItem.Subtitle adjustsFontSizeToFit={true} numberOfLines={1} style={styles.listItemSub}>{item.strCategory}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron color='#000000' size={30} />
                </ListItem>
            )
        } else {
            return(
                <ListItem 
                    Component={TouchableScale}
                    friction={90}
                    tension={100}
                    activeScale={0.95}
                    underlayColor='#f3f3f3' 
                    containerStyle={styles.listItem} 
                    bottomDivider 
                    onPress={() => navigation.navigate('Modal', { id: item.idDrink })}
                >
                    <Avatar size={150} avatarStyle={{ borderRadius: 16 }} source={{ uri: item.strDrinkThumb }} renderPlaceholderContent={<Loading />} />
                    <ListItem.Content>
                        <ListItem.Title style={styles.listItemText} adjustsFontSizeToFit={true} numberOfLines={length}>{item.strDrink}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron color='#000000' size={30} />
                </ListItem>
            )
        }
    }

    const ErrorDisplay = () => {
        return(
            <View style={styles.error}>
                <Text style={styles.errorMsg}>{error}</Text>
            </View>
        )
    }

    if (!fontsLoaded) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size={80} color='#000000' />
            </View>
        )
    }
    
    return(
        <View style={styles.safeArea}>
            <HeaderComponent />
            <View style={styles.container}>
                <View style={styles.search}>
                    <Input
                        containerStyle={{ width: '60%', paddingTop: 15}}
                        style={{fontFamily: 'font'}}
                        placeholder='Search...'
                        label={`Search by ${type}`}
                        labelProps={{ adjustsFontSizeToFit: true, numberOfLines: 1 }}
                        labelStyle={{ fontFamily: 'font', fontSize: FONT_SIZE }}
                        leftIcon={<Icon name='search' size={20} />}
                        onChangeText={(text) => setInput(text)}
                        onFocus={() => setError('')}
                        onSubmitEditing={() => fetchItems(type)}
                        value={input}
                        rightIcon={<Icon name='highlight-off' style={{marginLeft: 10}} size={15} onPress={() => setInput('')} />}
                    />
                    <View style={styles.buttonGroup}>
                        <CheckBox
                            containerStyle={styles.checkBox}
                            title='Name'
                            fontFamily='font'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checkedColor='#FF0000'
                            textStyle={FONT_SIZE}
                            checked={name}
                            onPress={() => handleCheck('name')}
                        />
                        <CheckBox
                            containerStyle={styles.checkBox}
                            title='Ingredient'
                            fontFamily='font'
                            textStyle={FONT_SIZE}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checkedColor='#FF0000'
                            checked={ingredient}
                            onPress={() => handleCheck('ingredient')}
                        />
                    </View>
                </View>
                <Button 
                    raised
                    titleStyle={{ fontFamily: 'font', fontSize: FONT_SIZE + 8}}
                    title='Search' 
                    onPress={() => fetchItems(type)} 
                    containerStyle={styles.button}
                    buttonStyle={{ backgroundColor: '#FF0000'}}
                />
                {
                    error.length > 0 ?

                    <ErrorDisplay /> :
                    <FlatList
                        data={type === 'name' ? drinkList.drinks : drinkListByIngredient.drinks}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.strDrink}
                        style={{ width: '90%'}}
                        extraData={drinkList}
                        ListEmptyComponent={isLoading && <ActivityIndicator color='#000000' size={50} />}
                    />
                }
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
        alignItems: 'center'
    },
    search: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '95%'
        
    },
    buttonGroup: {
        display: 'flex',
    },
    listItem: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        borderRadius: 26,
        marginHorizontal: 2,
        marginVertical: 10,
    },
    scrollView: {
        marginTop: 10,
        width: '100%'
    },
    button: { 
        width: '90%', 
        marginBottom: '5%' ,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    textTitle: {
        fontSize: 20,
        fontWeight: '300',
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
    },
    error: {
        height: '30%',
        justifyContent: 'center'
    },
    errorMsg: {
        fontSize: 21
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    checkBox: { 
        padding: 3, 
        margin: 0, 
        backgroundColor: '#fff',
        borderWidth: 0
    }
});
