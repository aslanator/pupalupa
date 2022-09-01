
import { getAuth, onAuthStateChanged } from "firebase/auth";

export type User = {
  uid: string;
  username: string;
  permissions: {'basic': boolean};
}

export type AuthUser = User & {
  permissions: {'basic': true};
}

const guest: User = {
  uid: 'guest',
  username: 'guest',
  permissions: {basic: false},
}

let user: User;

export const initAuth = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(reject, 10000);

    const auth = getAuth();
        
    onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        user = {
          uid: userInfo.uid,
          username: userInfo.displayName ?? 'My Name Is Giovanni Giorgio',
          permissions: {'basic': true}
        };

      } else {
        user = guest;
      }
      resolve(user);
    });
  });
}

export const getCurrentUser = () => {
  return user;
}