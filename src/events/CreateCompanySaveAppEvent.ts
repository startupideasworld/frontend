import { CreateCompanyPageTabIndex } from "../connected-components/CreateCompanyPage";
import {
  CompanyDetailUrlType,
  CreateCompanySuccessUrlType,
  RoutePath,
} from "../route-config";
import { AppEvent, AppEventStream, mapState, to } from "../simple-redux";
import { CompanyDetailAppState } from "../states/CompanyDetailAppState";
import { CreateCompanyLoadingStatus } from "../states/CreateCompanyAppState";
import { RootAppState } from "../states/RootAppState";
import { TagAppState } from "../states/TagAppState";
import {
  CompanyShortSummaryData,
  TagData,
  TagType,
} from "../types/min-combinators";
import { simulateDelay } from "./helpers";
import { PushRouteAppEvent } from "./PushRouteAppEvent";

export class CreateCompanySaveAppEvent extends AppEvent<RootAppState> {
  constructor(
    public props: { company?: { isProject: boolean }; idea?: string }
  ) {
    super();
  }
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      createCompany: mapState({
        loadingStatus: to(CreateCompanyLoadingStatus.saving),
      }),
    });
  }
  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(1000);
    if (this.props?.company) {
      yield new CreateCompanySaveSucceedAppEvent({
        idea: TagAppState.random({ type: TagType.idea }).asTagData(),
        company: CompanyDetailAppState.random()
          .mapState({
            companyIsProject: to(this.props.company.isProject),
          })
          .asCompanyShortSummaryData(),
      });
    } else {
      yield new CreateCompanySaveSucceedAppEvent({
        idea: TagAppState.random({ type: TagType.idea }).asTagData(),
      });
    }
  }
}

class CreateCompanySaveSucceedAppEvent extends AppEvent<RootAppState> {
  constructor(
    public props: { idea?: TagData; company?: CompanyShortSummaryData }
  ) {
    super();
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      createCompany: mapState({
        loadingStatus: to(CreateCompanyLoadingStatus.saveSucceed),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    if (this.props.company) {
      yield new PushRouteAppEvent<CreateCompanySuccessUrlType>(
        RoutePath.createCompanySuccess,
        {},
        {
          idea: this.props.idea,
          companyData: this.props.company,
          create: this.props.company.isProject
            ? CreateCompanyPageTabIndex.createProject
            : CreateCompanyPageTabIndex.createStartup,
        }
      );
    } else {
      yield new PushRouteAppEvent<CreateCompanySuccessUrlType>(
        RoutePath.createCompanySuccess,
        {},
        {
          idea: this.props.idea,
          create: CreateCompanyPageTabIndex.onlyIdea,
        }
      );
    }
  }
}
