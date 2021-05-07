export default reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DRINK':
      return {
        ...state,
        drink: action.payload
      }
    case 'DELETE_ID':
      return {
        ...state,
        favourites: state.favourites.filter(drink => drink.idDrink !== action.payload)
      }
    case 'ADD_DRINK':
      if(state.favourites.includes(action.payload)) {
        return {
          ...state,
          error: 'Drink already in favourites'
        }
      } else {
        return {
          ...state,
          favourites: state.favourites.concat(action.payload),
          error: ''
        }
      }
    default:
      break;
  }
}