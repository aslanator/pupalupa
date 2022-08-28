import { Component, onMount } from "solid-js";
import * as firebaseui from 'firebaseui'
import firebase from 'firebase/compat/app';
import 'firebaseui/dist/firebaseui.css'

export const Auth: Component = () => {
  onMount (() => {
    const uiConfig = {
      signInSuccessUrl: '/rating',
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    };

    // Initialize the FirebaseUI Widget using Firebase.
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
  });
  return <div id="firebaseui-auth-container"></div>
}