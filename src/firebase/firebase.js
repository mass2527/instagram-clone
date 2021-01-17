import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDd4KZzKnPnThg0Xd5XCnFXT84UMTf87G4',
  authDomain: 'instagram-clone-c3621.firebaseapp.com',
  projectId: 'instagram-clone-c3621',
  storageBucket: 'instagram-clone-c3621.appspot.com',
  messagingSenderId: '501407884468',
  appId: '1:501407884468:web:badd33a87ba2f6a5b7a3e1',
  measurementId: 'G-S9SNSYHBTW',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const storage = firebase.storage();
const db = firebaseApp.firestore();

export default db;
