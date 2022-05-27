import { AppEvent, AppEventStream, to } from "../simple-redux";
import { RootAppState } from "../states/RootAppState";
import { SiteSearchFieldAppState } from "../states/SiteSearchField";
import { simulateDelay } from "./helpers";

class LoadInitialContent extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    return state;
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(1000);
    yield new LoadInitialContentSuccess({
      initialState: SiteSearchFieldAppState.random(),
    });
  }
}

class LoadInitialContentSuccess extends AppEvent<RootAppState> {
  constructor(public props: { initialState: SiteSearchFieldAppState }) {
    super();
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      siteSearchField: to(this.props.initialState),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}

export const SiteSearchFieldAppEvent = {
  LoadInitialContent,
};
