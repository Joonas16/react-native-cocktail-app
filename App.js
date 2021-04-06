import React, {useEffect} from 'react';
import { ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements'
import { useFonts } from '@expo-google-fonts/inter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Device from 'expo-device';

import Home from './views/Home';
import Favourites from './views/Favourites';
import Search from './views/Search';
import DrinkModal from './views/DrinkModal'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomTabNavigator() {
  let font1 = require('./assets/fonts/Questrial.ttf')
  let [fontsLoaded] = useFonts({
        font1
  });
  
  if(!fontsLoaded) {
      return <ActivityIndicator size='large' />
  }

  return(
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({focused}) => {
            if (route.name === 'Home') {
              return <Icon name='home' size={30} color={focused ? '#FF0000' : '#000000'}/>
            } else if (route.name === 'Favourites') {
              return <Icon name='star' size={30} color={focused ? '#FF0000' : '#000000'}/>
            } else {
              return <Icon name='search' size={30} color={focused ? '#FF0000' : '#000000'}/>
            }
          },
        }
      )}
      
      tabBarOptions={navBar}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Favourites" component={Favourites} />
        <Tab.Screen name="Search" component={Search} />
      </Tab.Navigator>
  )
}

function App() {

  return (
      <NavigationContainer>
        <Stack.Navigator headerMode='none'>
          <Stack.Screen name='Main' component={BottomTabNavigator} />
          <Stack.Screen  
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }} 
            name='Modal' 
            component={DrinkModal} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const config = {
  animation: 'spring',
  config: {
    stiffness: 500,
    damping: 1000,
    mass: 4,
    overshootClamping: true,
    restDisplacementThreshold: 1,
    restSpeedThreshold: 1,
  },
};

const navBar = {
  activeTintColor: '#FF0000', 
  inactiveTintColor: '#000000', 
  activeBackgroundColor: '#fff',
  inactiveBackgroundColor: '#fff',
  labelStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'font1'
  },
  safeAreaInsets: {
    bottom: Device.brand === 'Apple' ? 0 : 0
  },
  tabStyle: {
    paddingBottom: Device.brand === 'Apple' ? 20 : 10
  },
  style: {
    height: '10%',
    borderTopColor: '#c3c3c3',
  }
}


export default App;