import { collection, onSnapshot, FirestoreDataConverter, getDocs, query, orderBy, where, updateDoc, limit, arrayUnion, runTransaction, addDoc, arrayRemove } from "firebase/firestore";
import { getFirestore } from "firebase/firestore"
import { createSignal } from "solid-js";

const db = getFirestore();

export type RatingBox = 'unrated' | 'lupa' | 'pupa' | 'normas' | 'xorosh' | 'masthave';

export type Rating = {
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

export const getRatingsCollectionByUsername = (username: string) => {
  return query(getRatingsCollection(), where("username", "==", username), limit(1));
}

export const subscribeOnRatingByUserName = (username: string) => {
  const [rating, setRating] = createSignal<Rating>({
    username,
    unrated: [],
    lupa: [],
    pupa: [],
    normas: [],
    xorosh: [],
    masthave: []
  });
  const request = getRatingsCollectionByUsername(username);
  const unsubscribe = onSnapshot<Rating>(request, (ratings) => {
    if(ratings.empty) {
      throw new Error(`Dont find user with name ${username}`);
    }
    setRating(ratings.docs[0].data());
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

export const getRatingsByUsername = async (username: string) => {
  const request = getRatingsCollectionByUsername(username);
  const snapshot = await getDocs<Rating>(request);
  if(snapshot.empty) {
    return null;
  }
  return snapshot.docs[0].data();
}

type ChangeRatingParmas = {gameIds: string[], box: RatingBox};

export const changeRatings = async (username: string, params: ChangeRatingParmas[]) => {
  try {
    await runTransaction(db, async transaction => {
      for(const {gameIds, box} of params) {
        const gameIdsSet = new Set(gameIds);
        const uniqGameIds = Array.from(gameIdsSet.values());
        const doc = (await getDocs(getRatingsCollectionByUsername(username))).docs[0];
        if(doc) {
          transaction.update(doc.ref, box, uniqGameIds);
        }
        else {
          throw new Error(`Did't find rating of user - ${username}`)
        }
      }
    })
  } catch (e) {
    console.log("Transaction changeRatings failed: ", e);
  }
}

type GameToRatingArgs = {username: string, gameIds: string[], box: RatingBox};

export const addGameToRating = async ({username, gameIds, box}: GameToRatingArgs) => {
  const doc = (await getDocs(getRatingsCollectionByUsername(username))).docs[0];
  if(doc) {
    updateDoc(doc.ref, box, arrayUnion(...gameIds));
  } else {
    addDoc(getRatingsCollection(), {
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

export const removeGameFromRating = async ({username, gameIds, box}: GameToRatingArgs) => {
  const doc = (await getDocs(getRatingsCollectionByUsername(username))).docs[0];
  if(doc) {
    updateDoc(doc.ref, box, arrayRemove(...gameIds));
  }
}