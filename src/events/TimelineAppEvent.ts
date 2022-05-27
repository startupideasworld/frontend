import {
  AppEvent,
  AppEventStream,
  immlsRemoveSkeletonConcat,
  ImmuList,
  mapState,
  to,
} from "../simple-redux";
import { RootAppState } from "../states/RootAppState";
import { TimelineAppState } from "../states/TimelineAppState";
import { TagAppState } from "../states/TagAppState";
import { simulateDelay } from "./helpers";

export class TimelineLoadWatchedTopicsAppEvent extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      timeline: mapState({
        watchedTopics: to(ImmuList.build(10, (x) => TagAppState.skeleton())),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(1000);
    let newTopics = TimelineAppState.random().watchedTopics;
    yield new TimelineLoadWatchedTopicsSuccessAppEvent({
      watchedTopics: newTopics,
    });
  }
}

export class TimelineLoadWatchedTopicsSuccessAppEvent extends AppEvent<RootAppState> {
  constructor(public props: { watchedTopics: ImmuList<TagAppState> }) {
    super();
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      timeline: mapState({
        watchedTopics: immlsRemoveSkeletonConcat(this.props.watchedTopics),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}
