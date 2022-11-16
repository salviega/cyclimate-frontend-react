import { database } from '../firebase.config'
import { collection, getDoc, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'

export function firebaseApi () {
  const eventsCollectionRef = collection(database, 'events')

  const getAllItems = async () => {
    const data = await getDocs(eventsCollectionRef)
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  }

  const getItem = async (id) => {
    const item = await getDoc(doc(database, 'events', id))
    if (item.exists()) {
      return item.data()
    } else {
      console.log("Note doesn't exist")
    }
  }

  const createItem = async (event) => {
    await addDoc(eventsCollectionRef, event)
    console.log('item created')
  }

  const updateItem = async (event) => {
    const userDoc = doc(database, 'events', event.id)
    await updateDoc(userDoc, event)
    console.log('item updated')
  }

  const deleteItem = async (id) => {
    const userDoc = doc(database, 'events', id)
    await deleteDoc(userDoc)
    console.log('item deleted')
  }

  return {
    getAllItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
  }
}
