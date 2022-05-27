import { AppStore } from "./simple-redux";
import * as Redux from "@reduxjs/toolkit";
import { RootAppState } from "./states/RootAppState";

function rootReducer(state: RootAppState | undefined, action: Redux.AnyAction) {
  return state ?? new RootAppState({});
}

export const reduxStore = Redux.configureStore({
  preloadedState: new RootAppState({}),
  reducer: AppStore.wrapReducer(rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().prepend(routingMiddleware),
});

// type AsyncAction = any;
// type Dispatch = (a: Redux.Action | AsyncAction) => any;
// type MiddlewareAPI = {
//   dispatch: Dispatch;
//   getState: () => RootAppState;
// };
// type Middleware = (api: MiddlewareAPI) => (next: any) => Redux.Dispatch;

export const appStore = new AppStore<RootAppState>({
  reduxStore: reduxStore,
});
