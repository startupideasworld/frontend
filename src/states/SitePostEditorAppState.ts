import { AppState } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";
import { AddressPrediction } from "../stateless-components/google-map";
import { PostShortSummaryData } from "../types/min-combinators";

export class SitePostEditorAppState extends AppState {
  repost: PostShortSummaryData | null = null;
  quote: PostShortSummaryData | null = null;
  findCollaborator: null | {
    idea: string;
    city: AddressPrediction;
  } = null;
  initialText = "";
  openDialog = false;

  constructor(props: PartialProps<SitePostEditorAppState>) {
    super();
    this.assignProps(props);
  }
}
