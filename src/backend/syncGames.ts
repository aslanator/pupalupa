import bggXmlApiClient from "bgg-xml-api-client";
import { getCollections } from "./collection";
import { addToGames, Game, getGames } from "./game";
import { addGameToRating as addGamesToRating, getRatingsByUsername } from "./rating";
import { getCurrentUser } from "./user";

const getGamesByUserName =  async (username: string) => {
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

const userGamesSet = new Set<string>();

const getUserGamesSet = async () => {
  const user = getCurrentUser();
  if(userGamesSet.size === 0) {
    const userRatings = await getRatingsByUsername(user().username);
    if(userRatings) {
      const allUserGames = userRatings.unrated.concat(userRatings.lupa, userRatings.pupa, userRatings.normas, userRatings.xorosh, userRatings.masthave);
      for(const gameId of allUserGames) {
        userGamesSet.add(gameId);
      }
    }
  }
  return userGamesSet;
}

const syncGamesByUserName = async (username: string) => {
  const user = getCurrentUser();
  const existingGamesSet = await getExistsGamesSet();
  const userGamesSet = await getUserGamesSet();
  console.log({userGamesSet})
  const games = await getGamesByUserName(username);
  const gamesAddToRaging = [];
  for(const game of games) {
    if(existingGamesSet.has(game.objectid) === false) {
      addToGames(game); //Optimize: make one request instead on n+1
    }
    if(userGamesSet.has(game.objectid) === false) {
      gamesAddToRaging.push(game.objectid);
    }
  }

  if(gamesAddToRaging.length > 0) {
    addGamesToRating({username: user().username, gameIds: gamesAddToRaging, box: 'unrated' }); //Optimize: make one request instead on n+1
  }
}

export const syncGames = async () => {
  const collections = await getCollections();
  for(const collection of collections) {
    syncGamesByUserName(collection.username);
  }
}