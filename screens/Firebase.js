//Primer paso para integrar nuestro app a firebase
import * as firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD5prd8PUweBKsng65VZt4yCKkbyIQBwQc",
    authDomain: "byvapp2019.firebaseapp.com",
    databaseURL: "https://byvapp2019.firebaseio.com",
    projectId: "byvapp2019",
    storageBucket: "byvapp2019.appspot.com",
    messagingSenderId: "319509726739"
};

firebase.initializeApp(firebaseConfig);
// Fin primer paso 

//haciendo que firebase retorne Timestamp en lugar de Date.
/* export const fireStoreDataBase = firebase.firestore();
const settings = { timestampsInSnapshots: true };
fireStoreDataBase.settings(settings);

export const fireStoreStorage = firebase.storage(); */

export default firebase;


