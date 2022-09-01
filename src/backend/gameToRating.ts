import { createEffect, createSignal } from "solid-js";
import { Game, subscribeOnGames } from "./game";
import { subscribeOnRatingById } from "./rating";


type GamesRating = {
  unrated: Game[];
  lupa: Game[];
  pupa: Game[];
  normas: Game[];
  xorosh: Game[];
  masthave: Game[];
}

type FillGameRatingArgs = {gameIds: string[], gamesRating: Game[], games: Game[]}

const fillGameRating = ({gameIds, gamesRating, games}: FillGameRatingArgs) => {
  for(const gameId of gameIds) {
    const game = games.find(game => game.objectid === gameId);
    if(game) {
      gamesRating.push(game)
    } else {
      throw Error(`Game collection didnt have game with id ${gameId}`);
    }
  }
}

export const subscribeOnGamesRating = (id: string) => {
  const {unsubscribe: unsubscribeFromRating, rating} = subscribeOnRatingById(id);
  const {unsubscribe: unsubscribeFromGames, games} = subscribeOnGames();
  const [gamesRating, setGamesRating] = createSignal<GamesRating>({unrated: [], lupa: [], pupa: [], normas: [], xorosh: [], masthave: []});
  createEffect(() => {
    if(games().length === 0) {
      return;
    }
    const gamesRating: GamesRating = {
      unrated: [],
      lupa: [],
      pupa: [],
      normas: [],
      xorosh: [],
      masthave: []
    }
    const {unrated, lupa, pupa, normas, xorosh, masthave} = rating();
    fillGameRating({gameIds: unrated, gamesRating: gamesRating.unrated, games: games()});
    fillGameRating({gameIds: lupa, gamesRating: gamesRating.lupa, games: games()});
    fillGameRating({gameIds: pupa, gamesRating: gamesRating.pupa, games: games()});
    fillGameRating({gameIds: normas, gamesRating: gamesRating.normas, games: games()});
    fillGameRating({gameIds: xorosh, gamesRating: gamesRating.xorosh, games: games()});
    fillGameRating({gameIds: masthave, gamesRating: gamesRating.masthave, games: games()});

    setGamesRating(gamesRating);
  });

  const unsubscribe = () => {
    unsubscribeFromRating();
    unsubscribeFromGames();
  }

  return {
    unsubscribe, gamesRating
  }
}

