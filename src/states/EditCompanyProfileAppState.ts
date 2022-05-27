import { AppState } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";

export class EditCompanyProfileAppState extends AppState {
  companyStartDate = new Date();
  companyName = "";
  isConceptualCompany = false;

  constructor(props: PartialProps<EditCompanyProfileAppState>) {
    super();
    this.assignProps(props);
  }
}
