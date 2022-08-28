import { collection, deleteDoc, onSnapshot, doc, setDoc, FirestoreDataConverter, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore"
import { createSignal } from "solid-js";

const db = getFirestore();

export type Collection = {
  username: string;
}

const tableName = 'collections';

const converter: FirestoreDataConverter<Collection> = {toFirestore: item => item, fromFirestore: item => {
  return ({username: item.id});
}}

export const getCollectionsCollection = () => {
  return collection(db, tableName).withConverter<Collection>(converter);
}

export const subscribeOnCollections = () => {
  const [collections, setCollections] = createSignal<Collection[]>([]);
  const request = getCollectionsCollection();
  const ubsubscribe = onSnapshot<Collection>(request, (collections) => {
    setCollections(collections.docs.map(item => item.data()));
  });

  return {
    ubsubscribe, collections
  }
}

export const getCollections = async () => {
  const request = getCollectionsCollection();
  const query = await getDocs<Collection>(request);
  return query.docs.map(item => item.data())
}

export const removeFromCollections = (id: string) => {
  return deleteDoc(doc(db, tableName, id));
}

export const addToColelections = (username: string) => {
  return setDoc(doc(db, tableName, username), {});
}