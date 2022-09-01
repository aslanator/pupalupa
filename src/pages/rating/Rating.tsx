import { useParams } from '@solidjs/router';
import { Component, createEffect, createSignal, Show } from 'solid-js';
import { syncCurrentUserUnratedGames } from '../../backend/syncGames';
import { getCurrentUser } from '../../backend/user';
import { RatingContainer } from './components/RatingsContainer/RagingContainer';

export const Rating: Component = () => {
 const user = getCurrentUser();
 const [synced, setSynced] = createSignal(false);
 const params = useParams();

 createEffect(async () => {
  await syncCurrentUserUnratedGames();
  setSynced(true)
  console.log({synced: synced()})
 })

 return <Show when={synced()} fallback={<div>loading...</div>}><RatingContainer userId={user.uid} viewMode={!!params.username}/></Show>
};