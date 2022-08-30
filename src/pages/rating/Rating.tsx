import { useParams } from '@solidjs/router';
import { Component, createEffect, createSignal, Show } from 'solid-js';
import { syncGamesLibrary } from '../../backend/syncGames';
import { getCurrentUser } from '../../backend/user';
import { RatingContainer } from './components/RatingsContainer/RagingContainer';

export const Rating: Component = () => {
 const user = getCurrentUser();
 const [username, setUsername] = createSignal('');

 const params = useParams();

 createEffect(() => {
  const username = user().username;
  if(params.username) {
    setUsername(params.username);
  }
  if(username) {
    syncGamesLibrary().then(() => {
      setUsername(username);
    })
  }
 })

 return <Show when={username()}><RatingContainer username={username()} viewMode={!!params.username}/></Show>
};