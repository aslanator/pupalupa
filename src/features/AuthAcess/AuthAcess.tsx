import { createContext, ParentComponent, Show } from "solid-js";
import { getCurrentUser, AuthUser } from "../../backend/user";
import {Navigate } from "@solidjs/router"




export const AuthAccess: ParentComponent = ({children}) => {
  const user = getCurrentUser();

  return <>
    <Show when={user.permissions.basic === true} fallback={<Navigate href={'/auth'}/>}>
      {children}
    </Show>
  </>
}