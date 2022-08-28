import { collection, deleteDoc, onSnapshot, doc, setDoc, FirestoreDataConverter, getDocs, query, orderBy } from "firebase/firestore";
import { getFirestore } from "firebase/firestore"
import { createSignal } from "solid-js";

const db = getFirestore();

export type Game = {
  "objectid": string;
  "subtype": 'boardgame' | 'boardgameexpansion' | 'boardgameaccessory' | 'boardgameintegration' | 'boardgamecompilation' | 'boardgameimplementation' | 'rpg' | 'rpgitem' | 'videogame';
  "collid": string;
  "name": {
      "text": string;
      "sortindex": string;
  },
  "yearpublished": number;
  "image": string,
  "thumbnail": string,
  "status": {
      "own": '1' | '0';
      "prevowned": '1' | '0';
      "fortrade": '1' | '0';
      "want": '1' | '0';
      "wanttoplay": '1' | '0';
      "wanttobuy": '1' | '0';
      "wishlist": '1' | '0';
      "preordered": '1' | '0';
  },
  "numplays": number
}


const tableName = 'games';

const converter: FirestoreDataConverter<Game> = {toFirestore: item => item, fromFirestore: item => {
  const data = item.data();
  return ({
    objectid: item.id,
    subtype: data.subtype,
    collid: data.collid,
    name: data.name,
    yearpublished: data.yearpublished,
    image: data.image,
    thumbnail: data.thumbnail,
    status: data.status,
    numplays: data.numplays
  });
}}

export const getGamesCollection = () => {
  return query(collection(db, tableName).withConverter<Game>(converter), orderBy('name.sortindex'));
}

export const subscribeOnGames = () => {
  const [games, setGames] = createSignal<Game[]>([]);
  const request = getGamesCollection();
  const unsubscribe = onSnapshot<Game>(request, (games) => {
    setGames(games.docs.map(item => item.data()));
  });

  return {
    unsubscribe, games
  }
}

export const getGames = async () => {
  const request = getGamesCollection();
  const snapshot = await getDocs<Game>(request);
  return snapshot.docs.map(item => item.data())
}

export const removeFromGames = (id: string) => {
  return deleteDoc(doc(db, tableName, id));
}

export const addToGames = (game: Game) => {
  return setDoc(doc(db, tableName, game.objectid), game);
}