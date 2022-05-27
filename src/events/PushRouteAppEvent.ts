import { AppEvent, mapState, to } from "../simple-redux";
import { RootAppState } from "../states/RootAppState";
import { _BaseUrlType } from "../route-config";

export class PushRouteAppEvent<
  R extends _BaseUrlType = never
> extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      url: mapState({
        path: to(this.path),
        params: to(this.params),
        search: to(this.search),
      }),
    });
  }

  async *run(state: RootAppState) {
    //nothing
  }

  constructor(
    public path: R["path"],
    public params: R["params"],
    public search: R["search"]
  ) {
    super();
  }
}

// export class PushRouteHomeAppEvent extends PushRouteAppEvent {
//   path = RoutePath.home;
// }

// export class PushRouteSearchResultAppEvent extends PushRouteAppEvent {
//   path = RoutePath.searchResult;
//   constructor(public search: { q: string }) {
//     super();
//   }
// }

// export class PushRouteCompanyDetailAppEvent extends PushRouteAppEvent {
//   path = RoutePath.companyDetail;
//   constructor(public params: HomeUrlType["params"]) {
//     super();
//   }
// }
