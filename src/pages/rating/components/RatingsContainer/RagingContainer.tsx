import { Component, onCleanup, Show} from 'solid-js';
import { subscribeOnGamesRating } from '../../../../backend/gameToRating';
import { changeRatings, RatingBox } from '../../../../backend/rating';
import { GamesBox } from '../../components/GamesBox/GamesBox';
import { RatingTitle } from '../../components/RatingTitle/RatingTitle';


export type DropArgs = {dropped: {id: string, box: RatingBox}, droppedOn: {id: string, box: RatingBox}, position: 'LEFT' | 'RIGHT'};

type RatingContainerProps = {
  username: string;
  viewMode?: boolean;
}

export const RatingContainer: Component<RatingContainerProps> = ({username, viewMode = false}) => {

  const  { unsubscribe, gamesRating } = subscribeOnGamesRating(username);

  onCleanup(() => {
    unsubscribe();
  });

  const drop = viewMode ? undefined : ({dropped, droppedOn, position}: DropArgs) => {
    const droppedGames = gamesRating()[dropped.box];
    const droppedOnGames = gamesRating()[droppedOn.box];

    const droppedGameIds = droppedGames.map(game => game.objectid);
    const droppedOnGameIds = dropped.box === droppedOn.box ? droppedGameIds : droppedOnGames.map(game => game.objectid);

    const droppedIndex = droppedGameIds.findIndex(gameId => gameId === dropped.id);

    if(droppedIndex === -1) {
      new Error(`Can't find dropped game with id ${droppedOn}`);
    }

    droppedGameIds.splice(droppedIndex, 1);

    let droppedOnIndex = droppedOnGameIds.findIndex(gameId => gameId === droppedOn.id);

    if(droppedOnIndex === -1) {
      new Error(`Can't find droppedOn game with id ${droppedOn}`);
    }

    if(position === 'RIGHT') {
      droppedOnIndex++;
    }

    droppedOnGameIds.splice(droppedOnIndex, 0, dropped.id);

    changeRatings(username, [{box: dropped.box, gameIds: droppedGameIds}, {box: droppedOn.box, gameIds: droppedOnGameIds}]);
  }
       
  
  return (
    <div>
        Rating
        <Show when={gamesRating().lupa} fallback={<div>loading...</div>}>
          <>
            <GamesBox games={gamesRating().masthave} ratingBox="masthave" drop={drop}>
              <RatingTitle color="#2d76b5" title="MustHave!" />
            </GamesBox>
            <GamesBox games={gamesRating().xorosh} ratingBox="xorosh" drop={drop}>
              <RatingTitle color="#67cd27" title="Xorosh" />
            </GamesBox>
            <GamesBox games={gamesRating().normas} ratingBox="normas" drop={drop}>
              <RatingTitle color="#d5b048" title="Normas" />
            </GamesBox>
            <GamesBox games={gamesRating().pupa} ratingBox="pupa" drop={drop}>
              <RatingTitle color="#e18231" title="Pupa" />
            </GamesBox>
            <GamesBox games={gamesRating().lupa} ratingBox="lupa" drop={drop}>
              <RatingTitle color="#e13131" title="Lupa" />
            </GamesBox>
            <Show when={viewMode === false}>
              <GamesBox games={gamesRating().unrated} ratingBox="unrated" drop={drop} />
            </Show>
          </>
        </Show>
    </div>
  );
};