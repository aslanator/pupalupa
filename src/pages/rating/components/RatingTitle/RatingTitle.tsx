import { Component } from 'solid-js';

import style from './RatingTitle.module.css';

type RatingTitleProps = {
  color: string;
  title: string;
}

export const RatingTitle: Component<RatingTitleProps> = ({color, title}) => {

  return <div class={style.container} style={{background: color}}>{title}</div>
}