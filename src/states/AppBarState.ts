import { AppState } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";

export class AppBarStateAppState extends AppState {
  showSearchBar = true;
  constructor(props: PartialProps<AppBarStateAppState>) {
    super();
    this.assignProps(props);
  }
}
