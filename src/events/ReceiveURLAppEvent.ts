import { RoutePath } from "../route-config";
import { AppEvent, AppEventStream, mapState, to } from "../simple-redux";
import { RootAppState } from "../states/RootAppState";

export class ReceiveUrlAppEvent extends AppEvent<RootAppState> {
  constructor(
    public props: {
      path: RoutePath;
      params: any;
      search: any;
    }
  ) {
    super();
  }
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      url: mapState<any>({
        path: to(this.props.path),
        params: to(this.props.params),
        search: to(this.props.search),
      }),
    });
  }
  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}

// export class ReceiveUrlSuccessAppEvent extends AppEvent<RootAppState> {
//   reducer(state: RootAppState): RootAppState {
//     let params = Router.useParams();
//     let search = Router.useSearchParams();
//     return state.copyWith({
//       url: modified({
//         params: to(params),
//         search: to(Object.fromEntries(search.entries())),
//       }),
//     });
//   }
//   async *run(state: RootAppState): AppEventStream<RootAppState> {}
// }
