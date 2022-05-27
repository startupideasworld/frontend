import { ReceiveUrlAppEvent } from "../events/ReceiveURLAppEvent";
import { matchHref, RoutePath, _BaseUrlType } from "../route-config";
import { AppState } from "../simple-redux";
import { appStore } from "../store-config";

export class UrlAppState<R extends _BaseUrlType = never> extends AppState {
  path: RoutePath;
  params: R["params"];
  search: R["search"];

  constructor(props: {
    path: RoutePath;
    params: R["params"];
    search: R["search"];
  }) {
    super();
    this.path = props.path;
    this.params = props.params;
    this.search = props.search;
  }

  as<R extends _BaseUrlType = never>(): UrlAppState<R> {
    let match = matchHref(document.location.href);
    let { router, routePath, params, search } = match!;
    return new UrlAppState({
      params: params,
      search: search,
      path: routePath,
    });
  }

  hash(): string {
    return btoa(JSON.stringify([this.path, this.params, this.search]));
  }
}

export function dispatchReceiveUrlAppEvent() {
  let match = matchHref(document.location.href);
  if (match) {
    let { router, routePath, params, search } = match;
    appStore.dispatch(
      new ReceiveUrlAppEvent({
        path: routePath,
        params: params,
        search: search,
      })
    );
  }
}
