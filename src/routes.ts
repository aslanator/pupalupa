import { lazy } from "solid-js";

//Split routes becouse we dont have middlewares :(
export const basicRuleRoutes = [
  {
    path: "/rating/:username?",
    component: lazy(() => import("./pages/rating/Rating").then(module => ({ default: module.Rating })))
  },
  {
    path: "/collections-manager",
    component: lazy(() => import("./pages/collections-manager/CollectionsManager").then(module => ({ default: module.CollectionsManager })))
  }
];

export const anyRuleRoutes = [
  {
    path: "/auth",
    component: lazy(() => import("./pages/auth/Auth").then(module => ({ default: module.Auth })))
  }
];