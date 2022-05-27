import { AppState, ImmuList } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";
import { AppBarStateAppState } from "./AppBarState";
import { HomeAppState } from "./HomeAppState";
import { SearchResultAppState } from "./SearchResultAppState";
import { UrlAppState } from "./UrlAppState";
import { CompanyDetailAppState } from "./CompanyDetailAppState";
import { CreateCompanyAppState } from "./CreateCompanyAppState";
import { EditCompanyAppState } from "./EditCompanyAppState";
import { RoutePath, _BaseUrlType } from "../route-config";
import { TimelineListAppState } from "./TimelineListAppState";
import { TimelinePostAppState } from "./TimelinePostAppState";
import { FriendActivitiesAppState } from "./FriendActivitiesAppState";
import { TimelineAppState } from "./TimelineAppState";
import { SessionAppState } from "./SessionAppState";
import { SitePostEditorAppState } from "./SitePostEditorAppState";
import { MyCompaniesAppState } from "./MyCompaniesAppState";
import { TagAppState } from "./TagAppState";
import { SiteSearchFieldAppState } from "./SiteSearchField";

export class RootAppState extends AppState {
  url = new UrlAppState<_BaseUrlType>({
    path: RoutePath.home,
    params: {},
    search: {},
  });
  session = SessionAppState.random();
  home = new HomeAppState({});
  searchResult = new SearchResultAppState({});
  appBar = new AppBarStateAppState({});
  companyDetail = new CompanyDetailAppState({});
  createCompany = new CreateCompanyAppState({});
  editCompany = new EditCompanyAppState({});
  timeline = new TimelineAppState({});
  timelineList = new TimelineListAppState({});
  timelinePost = new TimelinePostAppState({});
  friendActivities = new FriendActivitiesAppState({});
  sitePostEditor = new SitePostEditorAppState({});
  myCompanies = new MyCompaniesAppState({});
  siteSearchField = new SiteSearchFieldAppState({});

  constructor(props: PartialProps<RootAppState>) {
    super();
    this.assignProps(props);
  }
}

// export class _RootAppState extends AppStateWrapper<{
//   home: HomeAppState;
//   searchResult: SearchResultAppState;
// }> {
//   static initial(): RootAppState {
//     return appState(_RootAppState, {
//       home: _HomeAppState.initial(),
//       searchResult: _SearchResultAppState.initial(),
//     });
//   }
// }

// export type RootAppState = PropsForwarded<_RootAppState>;
