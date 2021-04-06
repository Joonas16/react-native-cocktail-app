import axios from 'axios';

let BASEURL = 'https://www.thecocktaildb.com/api/json/v1/1/';

const searchByName = async (name) => {
    const response = await axios.get(`${BASEURL}/search.php?s=${name}`);
    return response.data;
};
const searchByIngredient = async (ingredient) => {
    const response = await axios.get(`${BASEURL}/search.php?i=${ingredient}`);
    return response.data;
};
const searchById = async (id) => {
    const response = await axios.get(`${BASEURL}/lookup.php?i=${id}`);
    console.log(response.data)
    return response.data;
};
const getRandomCocktail = async (count) => {
    var drinkArray = []
    for (let index = 0; index < count; index++) {
        const response = await axios.get(`${BASEURL}/random.php`);
        drinkArray.push(response.data)
    }
    return drinkArray;
};
const getCategories = async () => {
    const response = await axios.get(`${BASEURL}/list.php?c=list`);
    return response.data;
};

export default {
    searchByName,
    searchByIngredient,
    searchById,
    getRandomCocktail,
    getCategories
};