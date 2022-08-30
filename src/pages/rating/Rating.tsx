import { useParams } from '@solidjs/router';
import { Component, createEffect, createSignal, Show } from 'solid-js';
import { syncGamesLibrary, syncCurrentUserUnratedGames } from '../../backend/syncGames';
import { getCurrentUser } from '../../backend/user';
import { RatingContainer } from './components/RatingsContainer/RagingContainer';

export const Rating: Component = () => {
 const user = getCurrentUser();
 const [synced, setSynced] = createSignal(false);
 const params = useParams();

 createEffect(async () => {
  await syncCurrentUserUnratedGames();
  setSynced(true)
 })

 return <Show when={synced} fallback={<div>loading...</div>}><RatingContainer username={user.username} viewMode={!!params.username}/></Show>
};