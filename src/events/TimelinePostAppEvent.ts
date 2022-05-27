import {
  AppEvent,
  AppEventStream,
  immlsConcat,
  immlsRemoveSkeletonConcat,
  ImmuList,
  mapState,
  to,
} from "../simple-redux";
import {
  CommentData,
  TimelinePostAppState,
  TimelinePostLoadingStatus,
} from "../states/TimelinePostAppState";
import { RootAppState } from "../states/RootAppState";
import { simulateDelay } from "./helpers";
import { TimelineListLoadingStatus } from "../states/TimelineListAppState";
import { Random } from "../states/random-generation";

export class TimelinePostLoadInitialContentAppEvent extends AppEvent<RootAppState> {
  constructor(public props: { timelinePostSlug: string }) {
    super();
  }
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      timelinePost: mapState({
        postSlug: to(this.props.timelinePostSlug),
        loadingStatus: to(TimelinePostLoadingStatus.loading),
        comments: immlsRemoveSkeletonConcat(
          ImmuList.build(1, TimelinePostAppState.skeleton)
        ),
        isSkeleton: to(true),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(3000);
    let newData = TimelinePostAppState.random();
    yield new TimelinePostLoadInitialContentSuccessAppEvent({
      initialState: newData.mapState({
        postSlug: to(state.timelinePost.postSlug),
        loadingStatus: to(TimelinePostLoadingStatus.loaded),
      }),
    });
  }
}

export class TimelinePostLoadInitialContentSuccessAppEvent extends AppEvent<RootAppState> {
  constructor(public props: { initialState: TimelinePostAppState }) {
    super();
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      timelinePost: to(this.props.initialState),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}

export class TimelinePostLoadMoreCommentsAppEvent extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      timelinePost: mapState({
        loadingStatus: to(TimelinePostLoadingStatus.loading),
        comments: immlsRemoveSkeletonConcat(
          ImmuList.build(10, TimelinePostAppState.skeleton)
        ),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(3000);
    let currentState = state.timelinePost;
    yield new TimelinePostLoadMoreCommentsSuccessAppEvent({
      moreComments: ImmuList.build(10, (x) =>
        TimelinePostAppState.random({
          quote: Random.choice([null, currentState.asPostShortSummaryData()]),
        })
      ),
    });
  }
}

export class TimelinePostLoadMoreCommentsSuccessAppEvent extends AppEvent<RootAppState> {
  constructor(public props: { moreComments: ImmuList<TimelinePostAppState> }) {
    super();
  }
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      timelinePost: mapState({
        loadingStatus: to(TimelinePostLoadingStatus.loaded),
        comments: immlsRemoveSkeletonConcat(this.props.moreComments),
      }),
    });
  }
  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}
