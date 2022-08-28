/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { Router } from "@solidjs/router";
import { initializeConfig } from './config';

initializeConfig();

render(() => <Router><App /></Router>, document.getElementById('root') as HTMLElement);
