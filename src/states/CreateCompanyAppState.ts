import { AppState } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";

export enum CreateCompanyLoadingStatus {
  idle,
  saving,
  saveSucceed,
  saveFailed,
}

export class CreateCompanyAppState extends AppState {
  loadingStatus = CreateCompanyLoadingStatus.idle;
  constructor(props: PartialProps<CreateCompanyAppState>) {
    super();
    this.assignProps(props);
  }
}
