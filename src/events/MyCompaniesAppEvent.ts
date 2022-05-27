import {
  AppEvent,
  AppEventStream,
  immlsRemoveSkeletonConcat,
  ImmuList,
  mapState,
  to,
} from "../simple-redux";
import {
  MyCompaniesAppState,
  MyCompaniesItemAppState,
} from "../states/MyCompaniesAppState";
import { RootAppState } from "../states/RootAppState";
import { simulateDelay } from "./helpers";

export class MyCompaniesInitialLoadAppEvent extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      myCompanies: mapState({
        companies: to(
          ImmuList.build(10, (x) => MyCompaniesItemAppState.skeleton())
        ),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(1000);
    yield new MyCompaniesInitialLoadSuccessAppEvent({
      initialState: MyCompaniesAppState.random().mapState({
        companies: immlsRemoveSkeletonConcat(
          ImmuList.build(10, (x) => MyCompaniesItemAppState.random())
        ),
      }),
    });
  }
}

export class MyCompaniesInitialLoadSuccessAppEvent extends AppEvent<RootAppState> {
  constructor(public props: { initialState: MyCompaniesAppState }) {
    super();
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      myCompanies: to(this.props.initialState),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}
