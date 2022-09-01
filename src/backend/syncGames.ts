import bggXmlApiClient from "bgg-xml-api-client";
import { getCollections } from "./collection";
import { addToGames, Game, getGames } from "./game";
import { addGameToRating as addGamesToRating, getRatingById, removeGameFromRating } from "./rating";
import { getCurrentUser, User } from "./user";

const getGamesByCollection =  async (username: string) => {
  const { data } = await bggXmlApiClient.get('collection', { username, excludesubtype: 'boardgameexpansion', own: 1});

  return data.item as Game[];
}

const existingGamesSet = new Set<string>();

const getExistsGamesSet = async () => {
  if(existingGamesSet.size === 0) {
    const existingGames = await getGames();
    for(const game of existingGames) {
      existingGamesSet.add(game.objectid);
    }
  }
  return existingGamesSet;
}

const syncGamesByCollection = async (username: string) => {
  const user = getCurrentUser();
  const existingGamesSet = await getExistsGamesSet();
  const games = await getGamesByCollection(username);
  for(const game of games) {
    if(existingGamesSet.has(game.objectid) === false) {
      addToGames(game); //Optimize: make one request instead on n+1
    }
  }


}

export const syncGamesLibrary = async () => {
  const collections = await getCollections();
  for(const collection of collections) {
    syncGamesByCollection(collection.username);
  }
}

const userGamesSet = new Set<string>();

const getUserGamesSet = async ({uid, username}: User) => {
  if(userGamesSet.size === 0) {
    const userRating = await getRatingById(uid);
    if(userRating) {
      const allUserGames = userRating.unrated.concat(userRating.lupa, userRating.pupa, userRating.normas, userRating.xorosh, userRating.masthave);
      for(const gameId of allUserGames) {
        userGamesSet.add(gameId);
      }
    }
  }
  return userGamesSet;
}

export const syncCurrentUserUnratedGames = async () => {
  const user = getCurrentUser();
  
  const userGamesSet = await getUserGamesSet(user);
  const existingGamesSet = await getExistsGamesSet();

  const gamesAddToRaging = [];
  for(const game of existingGamesSet) {
    if(!userGamesSet.has(game)) {
      gamesAddToRaging.push(game);
    }
  }
  if(gamesAddToRaging.length > 0) {
    addGamesToRating({id: user.uid, username: user.username, gameIds: gamesAddToRaging, box: 'unrated' }); 
  }

  const gamesRemoveFromRating = [];
  for(const game of userGamesSet.values()) {
    if(!existingGamesSet.has(game)) {
      gamesRemoveFromRating.push(game);
    }
  }
  if(gamesRemoveFromRating.length > 0) {
    removeGameFromRating({id: user.uid, username: user.username, gameIds: gamesRemoveFromRating, box: 'unrated' });
  }
}
