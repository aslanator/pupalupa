import { collection, onSnapshot, FirestoreDataConverter, getDocs, query, orderBy, where, updateDoc, limit, arrayUnion, runTransaction, addDoc, arrayRemove, doc, getDoc, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore"
import { createSignal } from "solid-js";

const db = getFirestore();

export type RatingBox = 'unrated' | 'lupa' | 'pupa' | 'normas' | 'xorosh' | 'masthave';

export type Rating = {
  id: string;
  username: string;
  unrated: string[];
  lupa: string[];
  pupa: string[];
  normas: string[];
  xorosh: string[];
  masthave: string[];
}


const tableName = 'rating';

const converter: FirestoreDataConverter<Rating> = {toFirestore: item => item, fromFirestore: item => {
  const data = item.data();
  return ({
    id: item.id,
    username: data.username,
    unrated: data.unrated ?? [],
    lupa: data.lupa ?? [],
    pupa: data.pupa ?? [],
    normas: data.normas ?? [],
    xorosh: data.xorosh ?? [],
    masthave: data.masthave ?? []
  });
}}

export const getRatingsCollection = () => {
  return collection(db, tableName).withConverter<Rating>(converter);
}

export const getRatingDocumentById = (id: string) => {
  return doc(getRatingsCollection(), id);
}

export const subscribeOnRatingById = (id: string) => {
  const [rating, setRating] = createSignal<Rating>({
    id: '',
    username: '',
    unrated: [],
    lupa: [],
    pupa: [],
    normas: [],
    xorosh: [],
    masthave: []
  });
  const request = getRatingDocumentById(id);
  const unsubscribe = onSnapshot<Rating>(request, (rating) => {
    if(rating.exists()) {
      setRating(rating.data()!);
    }
    else {
      throw new Error(`Dont find rating with id ${id}`);
    }
  });

  return {
    unsubscribe, rating
  }
}

export const getRatings = async () => {
  const request = getRatingsCollection();
  const ratings = await getDocs<Rating>(request);
  return ratings.docs.map(rating => rating.data());
}

export const getRatingById = async (id: string) => {
  const doc = getRatingDocumentById(id);
  const rating = await getDoc<Rating>(doc);
  return rating.data();
}

type ChangeRatingParmas = {gameIds: string[], box: RatingBox};

export const changeRatings = async (id: string, params: ChangeRatingParmas[]) => {
  try {
    await runTransaction(db, async transaction => {
      for(const {gameIds, box} of params) {
        const gameIdsSet = new Set(gameIds);
        const uniqGameIds = Array.from(gameIdsSet.values());
        const document = (await getDoc(getRatingDocumentById(id)));
        if(document.exists()) {
          transaction.update(document.ref, box, uniqGameIds);
        }
        else {
          throw new Error(`Did't find rating of user with id - ${id}`)
        }
      }
    })
  } catch (e) {
    console.log("Transaction changeRatings failed: ", e);
  }
}

type GameToRatingArgs = {id: string, username: string, gameIds: string[], box: RatingBox};

export const addGameToRating = async ({id, username, gameIds, box}: GameToRatingArgs) => {
  const document = (await getDoc(getRatingDocumentById(id)));
  if(document.exists()) {
    updateDoc(document.ref, box, arrayUnion(...gameIds));
  } else {
    setDoc(doc(db, tableName, id), {
      username,
      unrated: gameIds,
      lupa: [],
      pupa: [],
      normas: [],
      xorosh: [],
      masthave: []
    })
  }
}

export const removeGameFromRating = async ({id, gameIds, box}: GameToRatingArgs) => {
  const doc = await getDoc(getRatingDocumentById(id));
  if(doc) {
    updateDoc(doc.ref, box, arrayRemove(...gameIds));
  }
}