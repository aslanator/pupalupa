import { For, ParentComponent, Show } from 'solid-js';
import { Game as GameType } from '../../../../backend/game';
import { RatingBox } from '../../../../backend/rating';
import { DropArgs } from '../RatingsContainer/RagingContainer';
import { DropField } from '../DropField/DropField';
import { Game } from '../Game/Game';
import style from './GamesBox.module.css';

type GamesBoxProps = {
    games: GameType[];
    ratingBox: RatingBox; 
    drop?: (args: DropArgs) => void;
}


export const GamesBox: ParentComponent<GamesBoxProps> = (props) => {
 
  return (
      <div class={style.container}>
        <div class={style.title}>
          {props.children}
        </div>
        <div class={style.games}>
          <For each={props.games}>
            {(game) => <Game game={game} drop={props.drop} ratingBox={props.ratingBox}  />}
          </For>
          <Show when={props.games.length === 0 && props.drop} >
            <DropField drop={props.drop!} ratingBox={props.ratingBox} position="LEFT" gameId="0" />
          </Show>
        </div>
      </div>
  )
}