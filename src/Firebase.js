import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const settings = {timestampsInSnapshots: true};

const config = {
  apiKey: "AIzaSyDhYSQ5R3oy477wPd-K18c2UGPnlB8yj9s",
  authDomain: "qbeleza-b64cc.firebaseapp.com",
  databaseURL: "https://qbeleza-b64cc.firebaseio.com",
  projectId: "qbeleza-b64cc",
  storageBucket: "qbeleza-b64cc.appspot.com",
  messagingSenderId: "82516912376"
};
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;
