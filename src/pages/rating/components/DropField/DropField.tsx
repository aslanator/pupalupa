import style from './DropField.module.css';
import { Component, createSignal } from 'solid-js';
import { RatingBox } from '../../../../backend/rating';
import { DropArgs } from '../RatingsContainer/RagingContainer';

type DropFieldProps = {
  position: 'LEFT' | 'RIGHT';
  gameId: string;
  drop: (args: DropArgs) => void;
  ratingBox: RatingBox;
}

export const DropField: Component<DropFieldProps> = ({position, gameId, drop, ratingBox}) => {
  const [dragOver, setDragOver] = createSignal(false);

  const onDrop = (event: DragEvent) => {
    const id = event.dataTransfer?.getData("id");
    const box = event.dataTransfer?.getData("box") as RatingBox;
    if(id && id !== gameId) {
      drop({ dropped: {id, box}, droppedOn: {id: gameId, box: ratingBox}, position})
    }
    setDragOver(false);
  }

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }

  const onDragLeave = (event: DragEvent) => {
    setDragOver(false);
  }

  return <div class={`${style.drop} ${position === 'RIGHT' ? style.right : ''} ${dragOver() ? style.dragOver : ''}`} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}/>
}