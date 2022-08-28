import { Component, Show } from 'solid-js';
import { Game as GameType } from '../../../../backend/game';
import { DropField } from '../DropField/DropField';
import style from './Game.module.css';
import { RatingBox } from '../../../../backend/rating';
import { DropArgs } from '../RatingsContainer/RagingContainer';

type GamesProps = {
    game: GameType;
    drop?: (args: DropArgs) => void;
    ratingBox: RatingBox;
}

export const Game: Component<GamesProps> = (props) => {

  const onDragStart = (event: DragEvent) => {
    event.dataTransfer?.setData("id", props.game.objectid);
    event.dataTransfer?.setData("box", props.ratingBox);
  }
        
  return (
    <div draggable={!!props.drop} class={style.game} onDragStart={onDragStart} style={{"background-image": `url("${props.game.thumbnail}")`}} title={props.game.name.text}>
      <Show when={props.drop}>
        <DropField position="LEFT" gameId={props.game.objectid} drop={props.drop!} ratingBox={props.ratingBox}/>
        <DropField position="RIGHT" gameId={props.game.objectid} drop={props.drop!} ratingBox={props.ratingBox}/>
      </Show>
    </div>
  )
}