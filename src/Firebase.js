import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const settings = {timestampsInSnapshots: true};

const config = {
/*
  apiKey: "AIzaSyDhYSQ5R3oy477wPd-K18c2UGPnlB8yj9s",
  authDomain: "qbeleza-b64cc.firebaseapp.com",
  databaseURL: "https://qbeleza-b64cc.firebaseio.com",
  projectId: "qbeleza-b64cc",
  storageBucket: "qbeleza-b64cc.appspot.com",
  messagingSenderId: "82516912376"
*/

  apiKey: "AIzaSyAN5WaVQRM6gs6Jsk8bkqBeTSpI2Flrjo8",
  authDomain: "enquetepop.firebaseapp.com",
  databaseURL: "https://enquetepop.firebaseio.com",
  projectId: "enquetepop",
  storageBucket: "enquetepop.appspot.com",
  messagingSenderId: "142641136743",
  appId: "1:142641136743:web:9cb987d9dd05a24a8800c2"  

};
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;
