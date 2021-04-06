import React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList, Alert } from 'react-native'
import HeaderComponent from '../components/HeaderComponent'
import { ListItem } from'react-native-elements';
import * as SQLite from 'expo-sqlite';
import cocktailApi from '../services/cocktailApi'

export default function Favourites({navigation, route}) {
    const [favouritesList, setFavouritesList] = useState([])
    const [drinkToModal, setDrinkToModal] = useState(null)
    let drinks = []

    const db = SQLite.openDatabase('favouritesdb.db');

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql('create table if not exists drink (id text);');
        });
        updateList();   
    }, [])
    useEffect(() => {
        if(route.params)  {
            saveItem(route.params.drink.idDrink)
        }
    }, [route.params])

    const dropDatabaseTablesAsync = async () => {
        return new Promise((resolve, reject) => {
          db.transaction(tx => {
            tx.executeSql(
              'drop table drink',
              [],
              (_, result) => { resolve(result) },
              (_, error) => { console.log("error dropping drink table"); reject(error)
              }
            )
          })
        })
      }

    const saveItem = (id) => {
        if(favouritesList.some(e => e.id === id)) {
            Alert.alert('', "Cocktail is already in favourites")
        } else {
            
            db.transaction((tx) => {
                tx.executeSql('insert into drink (id) values (?);', [id]);    
                }, null, updateList
            )
        }
    }
    const updateList = () => {
        db.transaction((tx) => {
            tx.executeSql('select * from drink;', [], (_, { rows }) =>
                setFavouritesList(rows._array)
            ); 
        });
    }
    const deleteItem = (id) => {
        db.transaction(
            tx => {
                tx.executeSql(`delete from drink where id = ?;`, [id]);
            }, null, updateList
        )    
    }

    const renderItem = ({item}) => (
        <ListItem onPress={() => fetchDrinkById(item.id)} style={{backgroundColor: 'blue', width: '100%'}} bottomDivider>
            <ListItem.Content>
                <ListItem.Title style={{color: 'black', fontSize: 10}}>{item.id}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron name='delete' onPress={() => deleteItem(item.id)} size={25} color='red'/>
        </ListItem>
    )

    const fetchDrinkById = async (id) => {
        const response = await cocktailApi.searchById(id);
        setDrinkToModal(response.drinks[0]);
        handleNavigation()
    };

    const handleNavigation = () => {
        navigation.navigate('Modal', {drink: drinkToModal})
    }

    return(
        <View style={styles.safeArea}>
            <HeaderComponent />
            <View style={styles.container}>        
                <FlatList 
                    style={{width: '100%', marginTop: 16}}
                    keyExtractor={item => item.id} 
                    data={favouritesList}
                    renderItem={renderItem} 
                />   
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
});
