/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { Router } from "@solidjs/router";
import { initializeConfig } from './config';
import { createEffect, createSignal, Show } from 'solid-js';



render(() => {
  const [loaded, setLoaded] = createSignal(false);
  createEffect(async () => {
    await initializeConfig();
    setLoaded(true);
  });
  return <Show when={loaded()} fallback={<div>...loading</div>}>
          <Router><App /></Router>
        </Show>
  
}, document.getElementById('root') as HTMLElement);
