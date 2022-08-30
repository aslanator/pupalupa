
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createSignal } from "solid-js";

type User = {
  username: string | null;
  permissions: {'basic': boolean};
  loaded: boolean;
}

export type AuthUser = {
  username: string;
  permissions: {'basic': true};
  loaded: true;
}

const guest: User = {
  username: null,
  permissions: {basic: false},
  loaded: true
}

const [user, setUser] = createSignal({...guest, loaded: false});
let firstTime = true;

export const getCurrentUser = () => {
  if(firstTime) {
    firstTime = false;
    const auth = getAuth();
    onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        setUser({
          username: userInfo.displayName,
          permissions: {'basic': true},
          loaded: true
        });
      } else {
        setUser(guest);
      }
    });
  }
  return user;
}