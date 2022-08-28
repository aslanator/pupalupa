import style from 'Collection.module.css';
import { Component } from 'solid-js';
import { Icon } from '../../../../ui/icons';
import { removeFromCollections } from '../../../../backend/collection';
import { Button } from '../../../../ui/pupa-compnents/Button/Button';

type CollectionProps = {
  username: string;
}

export const Collection: Component<CollectionProps> = ({username}) => {
  const deleteCollection = () => {
    removeFromCollections(username);
  }
  return <div><span>{username}</span> <Button type="button" onClick={deleteCollection}><Icon name="trash-2" /></Button></div>
}