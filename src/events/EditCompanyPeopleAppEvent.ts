import {
  AppEvent,
  AppEventStream,
  immlsModifyItem,
  ImmuList,
  mapState,
  to,
} from "../simple-redux";
import {
  EditCompanyPeopleAppState,
  EditCompanyPeopleLoadingStatus,
  EditCompnayPeoplePersonAppState,
} from "../states/EditCompanyPeopleAppState";
import { RootAppState } from "../states/RootAppState";
import { simulateDelay } from "./helpers";

export class EditCompanyPeopleInitialLoadAppEvent extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    return state;
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(1000);
    yield new EditCompanyPeopleInitialLoadSuccessAppEvent({
      state: EditCompanyPeopleAppState.random(),
    });
  }
}

export class EditCompanyPeopleInitialLoadSuccessAppEvent extends AppEvent<RootAppState> {
  constructor(public props: { state: EditCompanyPeopleAppState }) {
    super();
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      editCompany: mapState({
        editPeople: to(this.props.state),
      }),
    });
  }

  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}

export class EditCompanyPeopleRemoveUserAppEvent extends AppEvent<RootAppState> {
  constructor(public props: { userId: string }) {
    super();
  }

  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      editCompany: mapState({
        editPeople: mapState({
          loadingStatus: to(EditCompanyPeopleLoadingStatus.saving),
          companyPeople: immlsModifyItem(this.props.userId, {
            isSaving: to(true),
          }),
        }),
      }),
    });
  }
  async *run(state: RootAppState): AppEventStream<RootAppState> {
    await simulateDelay(1000);
    yield new EditCompanyPeopleRemoveUserSuccessAppEvent({
      newPeopleList: state.editCompany.editPeople.companyPeople.remove(
        this.props.userId
      ),
    });
  }
}

export class EditCompanyPeopleRemoveUserSuccessAppEvent extends AppEvent<RootAppState> {
  constructor(
    public props: { newPeopleList: ImmuList<EditCompnayPeoplePersonAppState> }
  ) {
    super();
  }
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      editCompany: mapState({
        editPeople: mapState({
          loadingStatus: to(EditCompanyPeopleLoadingStatus.idle),
          companyPeople: to(this.props.newPeopleList),
        }),
      }),
    });
  }
  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}
