import {
  AppEvent,
  AppEventStream,
  immlsConcat,
  immlsFilter,
  immlsRemoveSkeletonConcat,
  ImmuList,
  mapState,
  to,
} from "../simple-redux";
import { RootAppState } from "../states/RootAppState";
import {
  SearchResultIdeaItemAppState,
  SearchResultLoadingStatus,
} from "../states/SearchResultAppState";
import { SearchResultCompanyItemAppState } from "../states/SearchResultAppState";
import { PostData, TimelinePostAppState } from "../states/TimelinePostAppState";
import { simulateDelay } from "./helpers";

class InitialLoad extends AppEvent<RootAppState> {
  constructor(public props: { isInitialLoad: boolean; searchText: string }) {
    super();
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      searchResult: mapState({
        loadingStatus: to(SearchResultLoadingStatus.loading),
        companiesList: (x) =>
          this.props.isInitialLoad
            ? ImmuList.build(10, (x) =>
                SearchResultCompanyItemAppState.skeleton()
              )
            : x,
        relatedIdeasList: (x) =>
          this.props.isInitialLoad
            ? ImmuList.build(10, (x) => SearchResultIdeaItemAppState.skeleton())
            : x,
        communityPosts: (x) =>
          this.props.isInitialLoad
            ? ImmuList.build(10, (x) =>
                TimelinePostAppState.skeleton().asPostData()
              )
            : x,
        collaboratorPosts: (x) =>
          this.props.isInitialLoad
            ? ImmuList.build(10, (x) =>
                TimelinePostAppState.skeleton().asPostData()
              )
            : x,
        currentSearchText: to(this.props.searchText),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    yield new LoadMoreCompanies();
    yield new SearchResultLoadMoreIdeasAppEvent();
    yield new LoadMoreCommunityPosts();
    yield new LoadMoreCollaboratorPosts();
    yield new SearchResultInitialLoadSuccessAppEvent();
  }
}

export class SearchResultInitialLoadSuccessAppEvent extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      searchResult: mapState({
        loadingStatus: to(SearchResultLoadingStatus.loaded),
      }),
    });
  }
  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}

// Companies

class LoadMoreCompanies extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      searchResult: mapState({
        companiesList: immlsRemoveSkeletonConcat(
          ImmuList.build(5, (x) => SearchResultCompanyItemAppState.skeleton())
        ),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(3000);
    yield new SearchResultLoadMoreCompaniesSuccessAppEvent({
      moreData: ImmuList.build(5, SearchResultCompanyItemAppState.random),
    });
  }
}

export class SearchResultLoadMoreCompaniesSuccessAppEvent extends AppEvent<RootAppState> {
  public moreData: ImmuList<SearchResultCompanyItemAppState>;
  constructor(props: { moreData: ImmuList<SearchResultCompanyItemAppState> }) {
    super();
    this.moreData = props.moreData;
  }
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      searchResult: mapState({
        companiesList: immlsRemoveSkeletonConcat(this.moreData),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}

// Ideas

export class SearchResultLoadMoreIdeasAppEvent extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    return state;
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(3000);
    yield new SearchResultLoadMoreIdeasAppEventSucceed({
      moreData: ImmuList.build(10, SearchResultIdeaItemAppState.random),
    });
  }
}

export class SearchResultLoadMoreIdeasAppEventSucceed extends AppEvent<RootAppState> {
  public moreData: ImmuList<SearchResultIdeaItemAppState>;
  constructor(props: { moreData: ImmuList<SearchResultIdeaItemAppState> }) {
    super();
    this.moreData = props.moreData;
  }
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      searchResult: mapState({
        relatedIdeasList: immlsRemoveSkeletonConcat(this.moreData),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}

// Community posts

class LoadMoreCommunityPosts extends AppEvent<RootAppState> {
  reducer = mapState<RootAppState>({
    searchResult: mapState({
      communityPosts: immlsRemoveSkeletonConcat(
        ImmuList.build(5, (x) => TimelinePostAppState.skeleton().asPostData())
      ),
    }),
  });

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(3000);
    yield new SearchResultLoadMoreCommunityPostsSuccessAppEvent({
      moreData: ImmuList.build(5, () =>
        TimelinePostAppState.random().asPostData()
      ),
    });
  }
}

export class SearchResultLoadMoreCommunityPostsSuccessAppEvent extends AppEvent<RootAppState> {
  public moreData: ImmuList<PostData>;
  constructor(props: { moreData: ImmuList<PostData> }) {
    super();
    this.moreData = props.moreData;
  }
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      searchResult: mapState({
        communityPosts: immlsRemoveSkeletonConcat(this.moreData),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}

// Collaborators

class LoadMoreCollaboratorPosts extends AppEvent<RootAppState> {
  reducer = mapState<RootAppState>({});

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(3000);
    yield new SearchResultLoadMoreCollaboratorPostsSuccessAppEvent({
      moreData: ImmuList.build(5, () =>
        TimelinePostAppState.random().asPostData()
      ),
    });
  }
}

export class SearchResultLoadMoreCollaboratorPostsSuccessAppEvent extends AppEvent<RootAppState> {
  public moreData: ImmuList<PostData>;
  constructor(props: { moreData: ImmuList<PostData> }) {
    super();
    this.moreData = props.moreData;
  }
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      searchResult: mapState({
        collaboratorPosts: immlsRemoveSkeletonConcat(this.moreData),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}

export const SearchResultAppEvent = {
  InitialLoad,
  LoadMoreCompanies,
  LoadMoreCommunityPosts,
  LoadMoreCollaboratorPosts,
};
