import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

export default function Loading() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator color='#000000' size={'50%'}/>
    </View>
  )
}
const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
})