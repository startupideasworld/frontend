import { AppState } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";
import { TagAppState } from "./TagAppState";

export class SiteSearchFieldAppState extends AppState {
  randomIdea?: TagAppState;
  constructor(props: PartialProps<SiteSearchFieldAppState>) {
    super();
    this.assignProps(props);
  }

  static random() {
    return new SiteSearchFieldAppState({
      randomIdea: TagAppState.random(),
    });
  }
}
