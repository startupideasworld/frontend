import { random } from "lodash";
import { AppState, ImmuList, uuid4 } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";
import { nameLorem, Random } from "./random-generation";

export enum CompanyPermissionRole {
  admin = "Admin",
  member = "Member",
  none = "none",
}
export class EditCompnayPeoplePersonAppState extends AppState {
  id = "";
  avatar = "";
  name = "";
  title = "";
  permissionRole = CompanyPermissionRole.none;
  isSaving = false;

  constructor(props: PartialProps<EditCompnayPeoplePersonAppState>) {
    super();
    this.assignProps(props);
  }

  get key() {
    return this.id;
  }

  static random(): EditCompnayPeoplePersonAppState {
    return new EditCompnayPeoplePersonAppState({
      id: uuid4(),
      avatar: "https://picsum.photos/100/100",
      name: nameLorem.generateWords(),
      title: nameLorem.generateWords(2),
      permissionRole: Random.choice([
        CompanyPermissionRole.admin,
        CompanyPermissionRole.member,
      ]),
    });
  }
}

export enum EditCompanyPeopleLoadingStatus {
  initialLoading,
  saving,
  idle,
}
export class EditCompanyPeopleAppState extends AppState {
  loadingStatus = EditCompanyPeopleLoadingStatus.idle;
  companyPeople = new ImmuList<EditCompnayPeoplePersonAppState>([]);

  constructor(props: PartialProps<EditCompanyPeopleAppState>) {
    super();
    this.assignProps(props);
  }

  static random(): EditCompanyPeopleAppState {
    return new EditCompanyPeopleAppState({
      companyPeople: ImmuList.build(random(1, 3), () =>
        EditCompnayPeoplePersonAppState.random()
      ),
    });
  }
}
