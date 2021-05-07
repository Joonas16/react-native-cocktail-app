export const setDrink = (drink) => {
  return {
    type: 'SET_DRINK',
    payload: drink,
  }
}

export const addToFavourites = (drink) => {
  return {
    type: 'ADD_DRINK',
    payload: drink,
  }
}

export const deleteId = (id) => {
  console.log('Delete id: ', id)
  return {
    type: 'DELETE_ID',
    payload: id,
  }
}