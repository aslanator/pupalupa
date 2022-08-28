import { createContext, ParentComponent, Show } from "solid-js";
import { getCurrentUser, AuthUser } from "../../backend/user";
import {Navigate } from "@solidjs/router"




export const AuthAccess: ParentComponent = ({children}) => {
  const user = getCurrentUser();

  return <>
    <Show when={user().loaded === false}>...Loading</Show>
    <Show when={user().loaded && user().permissions.basic === false}>
      <Navigate href={'/auth'}/>
    </Show>
    <Show when={user().loaded && user().permissions.basic}>
        {children}
    </Show>
  </>
}