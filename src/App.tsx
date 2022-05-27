import { HomePage } from "./connected-components/HomePage";
import CssBaseline from "@mui/material/CssBaseline";
import { Route, Routes } from "react-router-dom";
import { SearchResult } from "./connected-components/SearchResultPage";
import * as Router from "react-router-dom";
import { appStore } from "./store-config";
import { BeforeEventOfType } from "./simple-redux/schedule";
import { PushRouteAppEvent } from "./events/PushRouteAppEvent";
import { buildRoutePath, matchHref, RoutePath } from "./route-config";
import { CompanyDetailPage } from "./connected-components/CompanyDetailPage";
import { ReceiveUrlAppEvent } from "./events/ReceiveURLAppEvent";
import { CreateCompanyPage } from "./connected-components/CreateCompanyPage";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { EditCompanyPage } from "./connected-components/EditCompanyPage";
import { TimelineListPage } from "./connected-components/TimelineListPage";
import React from "react";
import TimelinePostPage from "./connected-components/TimelinePostPage";
import { ThemeProvider } from "@mui/system";
import { appTheme } from "./theme";
import { dispatchReceiveUrlAppEvent } from "./states/UrlAppState";
import { MyCompaniesListPage } from "./connected-components/MyCompaniesPage";
import { MyAccountPage } from "./connected-components/MyAccountPage";
import { CreateCompanySuccessPage } from "./connected-components/CreateCompanySuccessPage";
import { MyProfilePage } from "./connected-components/MyProfilePage";

function App() {
  const navigate = Router.useNavigate();
  const location = Router.useLocation();
  const [prevLocation, setPrevLocation] =
    React.useState<Router.Location | null>(null);

  React.useEffect(() => {
    // On location changed, scroll webpage to top unless the user is returning
    // to the previous page.
    if (location !== prevLocation) {
      window.scrollTo({ top: 0 });
    }
    setPrevLocation(location);
    dispatchReceiveUrlAppEvent();
  }, [location]);

  appStore.addSchedule(
    new BeforeEventOfType(PushRouteAppEvent, {
      id: "observe push route event",
      once: false,
      onTriggered: (event: PushRouteAppEvent<any>) => {
        const destination = buildRoutePath<any>(
          event.path,
          event.params,
          event.search
        );
        console.log("Navigate to", destination);
        navigate(destination);
      },
    })
  );
  const helmetContext = {};
  let routes: [string, React.ReactNode][] = [
    [RoutePath.searchResult, <SearchResult />],
    [RoutePath.companyDetail, <CompanyDetailPage />],
    [RoutePath.createCompany, <CreateCompanyPage />],
    [RoutePath.createCompanySuccess, <CreateCompanySuccessPage />],
    [RoutePath.editCompany, <EditCompanyPage />],
    [RoutePath.timelineList, <TimelineListPage />],
    [RoutePath.timelinePost, <TimelinePostPage />],
    [RoutePath.timelinePublic, <TimelineListPage />],
    [RoutePath.timelineTopic, <TimelineListPage />],
    [RoutePath.myCompanies, <MyCompaniesListPage />],
    [RoutePath.myAccount, <MyAccountPage />],
    [RoutePath.myProfile, <MyProfilePage />],
    ["*", <HomePage />],
  ];
  return (
    <React.Fragment>
      <HelmetProvider context={helmetContext}>
        <Helmet>
          <meta charSet='utf-8' />
          <title>My Title</title>
          <style>{`body {
            background-color: ${appTheme.palette.background.default}
          }
          `}</style>
        </Helmet>{" "}
        <Helmet>
          <script
            async
            src='https://maps.googleapis.com/maps/api/js?key=AIzaSyBnA7JKXzu7R1pLbZ3W_hOe7JUnjhAuVj0&libraries=places'
          />
        </Helmet>
        <CssBaseline />
        <ThemeProvider theme={appTheme}>
          <Routes>
            {routes.map((x, idx) => (
              <Route path={x[0]} key={x[0]} element={x[1]} />
            ))}
          </Routes>
        </ThemeProvider>
      </HelmetProvider>
    </React.Fragment>
  );
}

export default App;
