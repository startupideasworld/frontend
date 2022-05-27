import { AppState } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";
import { EditCompanyContentAppState } from "./EditCompanyContentAppState";
import { EditCompanyPeopleAppState } from "./EditCompanyPeopleAppState";
import { EditCompanyProfileAppState } from "./EditCompanyProfileAppState";

export class EditCompanyAppState extends AppState {
  editProfile = new EditCompanyProfileAppState({});
  editContent = new EditCompanyContentAppState({});
  editPeople = new EditCompanyPeopleAppState({});

  constructor(props: PartialProps<EditCompanyAppState>) {
    super();
    this.assignProps(props);
  }
}
