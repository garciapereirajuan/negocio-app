const { initializeApp } = require('firebase/app')
const { getFirestore } = require('firebase/firestore')

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrQNY5EkP0b_aQ0weNvmYK2PefBME1-5A",
  authDomain: "la-rotiseria-pepitos.firebaseapp.com",
  projectId: "la-rotiseria-pepitos",
  storageBucket: "la-rotiseria-pepitos.appspot.com",
  messagingSenderId: "624635264475",
  appId: "1:624635264475:web:b55c5a08870e58fc983bfe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore()

module.exports = { db }