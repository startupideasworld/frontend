import { simulateDelay } from "./helpers";
import { AppEvent, AppEventStream } from "../simple-redux";
import { RootAppState } from "../states/RootAppState";

export class EditCompanyInitialLoadAppEvent extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    return state;
  }
  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(1000);
    yield new EditCompanyInitialLoadSucceedAppEvent();
  }
}

export class EditCompanyInitialLoadSucceedAppEvent extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    throw new Error("Method not implemented.");
  }
  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}
