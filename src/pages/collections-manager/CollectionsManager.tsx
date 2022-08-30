import { subscribeOnCollections } from '../../backend/collection';
import { For } from 'solid-js';
import style from './CollectionsManager.module.css';
import { AddToCollection } from './components/AddToCollection/AddToCollection';
import { Collection } from './components/Collection/Collection';
import { Button } from '../../ui/pupa-compnents/Button/Button';
import { syncGamesLibrary } from '../../backend/syncGames';

export const CollectionsManager = () => {
  const { collections } = subscribeOnCollections();

  return <div>
    <h1>Collection manager</h1>
    <For each={collections()}>
      {(collection) => <Collection username={collection.username} />}
    </For>
    <AddToCollection />
    <Button onClick={syncGamesLibrary}>Sync games</Button>
  </div>
}