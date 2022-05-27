import {
  AppEvent,
  AppEventStream,
  immlsConcat,
  immlsPreconcat,
  immlsRemoveSkeletonConcat,
  immlsRemoveSkeletonPreconcat,
  ImmuList,
  mapState,
  to,
} from "../simple-redux";
import { TimelinePostAppState, PostData } from "../states/TimelinePostAppState";
import {
  TimelineListAppState,
  TimelineListLoadingStatus,
} from "../states/TimelineListAppState";
import { RootAppState } from "../states/RootAppState";
import { simulateDelay } from "./helpers";

export class TimelineListInitialLoadAppEvent extends AppEvent<RootAppState> {
  constructor(
    public props: {
      userSlug?: string;
      topicSlug?: string;
      currentUrlHash: string;
    }
  ) {
    super();
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      timelineList: mapState({
        loadingStatus: to(TimelineListLoadingStatus.loading),
        currentUserSlug: to(this.props.userSlug ?? ""),
        currentTopicSlug: to(this.props.topicSlug ?? ""),
        currentUrlHash: to(this.props.currentUrlHash),
        posts: to(
          ImmuList.build(10, (x) =>
            TimelinePostAppState.skeleton().asPostData()
          )
        ),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    yield new TimelineListLoadMoreAppEvent({ clearList: true });
    await simulateDelay(3000);
    yield new TimelineListInitialLoadSuceeedAppEvent();
  }
}

export class TimelineListInitialLoadSuceeedAppEvent extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      timelineList: mapState({
        loadingStatus: to(TimelineListLoadingStatus.loaded),
      }),
    });
  }
  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}

export class TimelineListLoadMoreAppEvent extends AppEvent<RootAppState> {
  length: number;
  constructor(public props?: { clearList?: boolean; length?: number }) {
    super();
    this.length = props?.length ?? 10;
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      timelineList: mapState({
        posts: (x) =>
          immlsRemoveSkeletonConcat(
            ImmuList.build(this.length!, (x) =>
              TimelinePostAppState.skeleton().asPostData()
            )
          )(this.props?.clearList ? new ImmuList([]) : x),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(3000);
    yield new TimelineListLoadMoreSuccessAppEvent({
      data: ImmuList.build(this.length!, (x) =>
        TimelinePostAppState.random().asPostData()
      ),
    });
  }
}

export class TimelineListLoadMoreSuccessAppEvent extends AppEvent<RootAppState> {
  constructor(public props: { data: ImmuList<PostData> }) {
    super();
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      timelineList: mapState({
        posts: immlsRemoveSkeletonConcat(this.props.data),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}

export class TimelineListRefreshAppEvent extends AppEvent<RootAppState> {
  length: number;
  constructor(public props?: { clearList?: boolean; length?: number }) {
    super();
    this.length = 10;
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      timelineList: mapState({
        loadingStatus: to(TimelineListLoadingStatus.loading),
        posts: immlsRemoveSkeletonPreconcat(
          ImmuList.build(this.length, (x) =>
            TimelinePostAppState.skeleton().asPostData()
          )
        ),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(3000);
    yield new TimelineListRefreshSuccessAppEvent({
      data: ImmuList.build(this.length, (x) =>
        TimelinePostAppState.random().asPostData()
      ),
    });
  }
}

export class TimelineListRefreshSuccessAppEvent extends AppEvent<RootAppState> {
  constructor(public props: { data: ImmuList<PostData> }) {
    super();
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      timelineList: mapState({
        loadingStatus: to(TimelineListLoadingStatus.loaded),
        posts: immlsRemoveSkeletonPreconcat(this.props.data),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}
