import { AppEvent, AppEventStream, mapState, to } from "../simple-redux";
import { RootAppState } from "../states/RootAppState";
import { SessionAppState } from "../states/SessionAppState";
import { simulateDelay } from "./helpers";

export class SessionLoginAppEvent extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    return state;
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(1000);
    yield new SessionLoginSuccessAppEvent({
      initialState: SessionAppState.random(),
    });
  }
}

export class SessionLoginSuccessAppEvent extends AppEvent<RootAppState> {
  constructor(public props: { initialState: SessionAppState }) {
    super();
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      session: to(this.props.initialState),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}

export class SessionLogoutAppEvent extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      session: mapState({
        user: to(null),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}
