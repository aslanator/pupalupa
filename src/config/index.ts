import { FirebaseApp } from "firebase/app";
import { initializaBackendConfig } from "./backend"

type AppConfig = {
  firebase: FirebaseApp | null;
}

const config: AppConfig = {
  firebase: null,
}

export const initializeConfig = () => {
  config.firebase = initializaBackendConfig();
  console.log('init')
}

export const getFirebaseConfig = () => {
  if(!config.firebase) {
    throw new Error('access to firebase config before initialization');
  }
  return config.firebase;
}