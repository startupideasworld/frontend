import { AppEvent, AppEventStream, mapState, to } from "../simple-redux";
import {
  CompanyDetailAppState,
  CompanyDetailLoadingStatus,
} from "../states/CompanyDetailAppState";
import { RootAppState } from "../states/RootAppState";

export class CompanyDetailLoadAppEvent extends AppEvent<RootAppState> {
  constructor(protected props: { slug: string }) {
    super();
  }
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      companyDetail: mapState({
        loadingStatus: to(CompanyDetailLoadingStatus.loading),
      }),
    });
  }
  async *run(state: RootAppState): AppEventStream<RootAppState> {
    yield new CompanyDetailLoadSuccessAppEvent({
      newData: CompanyDetailAppState.random(),
    });
  }
}

export class CompanyDetailLoadSuccessAppEvent extends AppEvent<RootAppState> {
  constructor(protected props: { newData: CompanyDetailAppState }) {
    super();
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      companyDetail: to(
        this.props.newData.mapState({
          loadingStatus: to(CompanyDetailLoadingStatus.loaded),
        })
      ),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}
