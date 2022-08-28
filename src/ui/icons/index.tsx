import feather from 'feather-icons';
import { Component } from "solid-js";

type IconProps = {
  name: string;
}

export const Icon: Component<IconProps> = ({name}) => {
  
  return <span innerHTML={feather.icons[name].toSvg()}/>
}