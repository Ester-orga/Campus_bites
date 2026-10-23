/** CampusBites menu. Shared by the shop (browser) and the feature API (server). */
export const PRODUCTS = [
  {id:'burger',name:'The Classic Smash',detail:'Double patty · cheddar · house sauce',category:'Burgers',price:179,veg:false,spicy:false,calories:640,rating:'4.9',time:'20–25 min',tag:'BESTSELLER',asset:'burger.svg',bg:'#f4e3c8'},
  {id:'pizza',name:'Margherita Magic',detail:'Fresh basil · mozzarella · slow tomato',category:'Pizza',price:259,veg:true,spicy:false,calories:780,rating:'4.8',time:'25–30 min',tag:'MOST LOVED',asset:'pizza.svg',bg:'#f8dccf'},
  {id:'biryani',name:'Dum Biryani Bowl',detail:'Chicken · fragrant basmati · raita',category:'Indian',price:229,veg:false,spicy:true,calories:690,rating:'4.9',time:'30–35 min',tag:'HOT PICK',asset:'biryani.svg',bg:'#e8e9cf'},
  {id:'fries',name:'Peri Peri Fries',detail:'Crispy cut · signature peri seasoning',category:'Sides',price:129,veg:true,spicy:true,calories:410,rating:'4.7',time:'15–20 min',tag:'SNACK TIME',asset:'fries.svg',bg:'#f7e1cb'},
  {id:'roll',name:'Paneer Tikka Roll',detail:'Grilled paneer · mint chutney · onions',category:'Indian',price:169,veg:true,spicy:true,calories:520,rating:'4.8',time:'20–25 min',tag:'CAMPUS FAVE',asset:'roll.svg',bg:'#e5ead8'},
  {id:'brownie',name:'Midnight Brownie',detail:'Fudgy chocolate · roasted walnuts',category:'Desserts',price:119,veg:true,spicy:false,calories:450,rating:'4.9',time:'15–20 min',tag:'SWEET TOOTH',asset:'brownie.svg',bg:'#e6d7d3'},
];
export const CATEGORIES = ['All','Burgers','Pizza','Indian','Sides','Desserts'];
export const DELIVERY_FEE = 29;
export const FREE_DELIVERY_FROM = 399;
