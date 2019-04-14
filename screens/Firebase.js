//Primer paso para integrar nuestro app a firebase
import * as firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDIZ1HStn-gjtbzBbssr5P2JqnMueB_7Z0",
    authDomain: "apppxv-220020.firebaseapp.com",
    databaseURL: "https://apppxv-220020.firebaseio.com",
    projectId: "apppxv-220020",
    storageBucket: "apppxv-220020.appspot.com",
    messagingSenderId: "199813341131"
};

firebase.initializeApp(firebaseConfig);
// Fin primer paso 

//haciendo que firebase retorne Timestamp en lugar de Date.
/* export const fireStoreDataBase = firebase.firestore();
const settings = { timestampsInSnapshots: true };
fireStoreDataBase.settings(settings);

export const fireStoreStorage = firebase.storage(); */

export default firebase;


