import { AppEvent, AppEventStream, mapState, to } from "../simple-redux";
import { AddressPrediction } from "../stateless-components/google-map";
import { RootAppState } from "../states/RootAppState";
import { PostShortSummaryData } from "../types/min-combinators";

export class SitePostEditorOpenDialogAppEvent extends AppEvent<RootAppState> {
  constructor(
    public props: {
      initialText?: string;
      original?: PostShortSummaryData;
      quote?: PostShortSummaryData;
      findCollaborator?: {
        idea: string;
        city: AddressPrediction;
      };
    }
  ) {
    super();
  }
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      sitePostEditor: mapState({
        openDialog: to(true),
        initialText: to(this.props.initialText ?? ""),
        repost: to(this.props.original ?? null),
        quote: to(this.props.quote ?? null),
        findCollaborator: to(this.props.findCollaborator ?? null),
      }),
    });
  }
  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}

export class SitePostEditorCloseDialogAppEvent extends AppEvent<RootAppState> {
  reducer(state: RootAppState): RootAppState {
    return state.mapState({
      sitePostEditor: mapState({
        openDialog: to(false),
      }),
    });
  }
  async *run(state: RootAppState): AppEventStream<RootAppState> {}
}
