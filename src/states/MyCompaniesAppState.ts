import { AppState, ImmuList, uuid4 } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";
import { CompanyShortSummaryData } from "../types/min-combinators";
import { Random } from "./random-generation";

export class MyCompaniesItemAppState
  extends AppState
  implements CompanyShortSummaryData
{
  companyId = "";
  companySlug = "";
  companyName = "";
  homepageUrl = "";
  thumbnail = "";
  summary = "";
  headline = "";
  memberAvatars: string[] = [];
  memberNames: string[] = [];
  isConceptual = false;
  isProject = false;
  isSkeleton = false;

  constructor(props: PartialProps<MyCompaniesItemAppState>) {
    super();
    this.assignProps(props);
  }

  get key() {
    return this.companyId;
  }

  static random(): MyCompaniesItemAppState {
    return new MyCompaniesItemAppState({
      companyId: Random.id(),
      companySlug: Random.slug(),
      companyName: Random.companyName(),
      summary: Random.comment(),
      thumbnail: Random.image(300, 300),
      isConceptual: Random.boolean(),
      isProject: Random.boolean(),
      headline: Random.idea(),
      memberAvatars: Random.subset([
        Random.avatar(),
        Random.avatar(),
        Random.avatar(),
      ]),
      memberNames: Random.subset([
        Random.personName(),
        Random.personName(),
        Random.personName(),
      ]),
      homepageUrl: Random.choice(["google.ca", ""]),
    });
  }

  static skeleton(): MyCompaniesItemAppState {
    return new MyCompaniesItemAppState({
      companyId: uuid4(),
      isSkeleton: true,
    });
  }
}

export class MyCompaniesAppState extends AppState {
  companies = new ImmuList<MyCompaniesItemAppState>([]);
  constructor(props: PartialProps<MyCompaniesAppState>) {
    super();
    this.assignProps(props);
  }

  static random(): MyCompaniesAppState {
    return new MyCompaniesAppState({
      companies: ImmuList.build(10, (x) => MyCompaniesItemAppState.random()),
    });
  }
}
