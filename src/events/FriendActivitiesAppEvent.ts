import {
  AppEvent,
  AppEventStream,
  ImmuList,
  mapState,
  to,
} from "../simple-redux";
import {
  FriendActivitiesAppState,
  FriendActivityItemAppState,
} from "../states/FriendActivitiesAppState";
import { RootAppState } from "../states/RootAppState";
import { simulateDelay } from "./helpers";

export class FriendActivitiesRefreshAppEvent extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      friendActivities: mapState({
        activities: to(
          ImmuList.build(5, (x) => FriendActivityItemAppState.skeleton())
        ),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(1000);
    yield new FriendActivitiesRefreshSuccessAppEvent({
      newState: FriendActivitiesAppState.random(),
    });
  }
}

export class FriendActivitiesRefreshSuccessAppEvent extends AppEvent<RootAppState> {
  constructor(public props: { newState: FriendActivitiesAppState }) {
    super();
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      friendActivities: to(this.props.newState),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}
