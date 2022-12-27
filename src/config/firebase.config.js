import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAUEH_f3Kr-4XGbcq59eNS0XkPX5Gu06U4',
  authDomain: 'cosmos-nft.firebaseapp.com',
  projectId: 'cosmos-nft',
  storageBucket: 'cosmos-nft.appspot.com',
  messagingSenderId: '105734152700',
  appId: '1:105734152700:web:fbd1b9565d5dbc49075279'
}

const app = initializeApp(firebaseConfig)
export const database = getFirestore(app)
