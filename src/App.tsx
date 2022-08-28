import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import { useRoutes } from '@solidjs/router';
import {basicRuleRoutes, anyRuleRoutes} from './routes';
import { AuthAccess } from './features/AuthAcess/AuthAcess';
import { getCurrentUser } from './backend/user';

const App: Component = () => {
  const BasicRuleRoutes = useRoutes(basicRuleRoutes);
  const AnyRuleRoutes = useRoutes(anyRuleRoutes);
  const user = getCurrentUser();

  return (
    <div class={styles.App}>
      <div>username: {user().username}</div>
      <AuthAccess>
        <BasicRuleRoutes />
      </AuthAccess>
      <AnyRuleRoutes />
    </div>
  );
};

export default App;
