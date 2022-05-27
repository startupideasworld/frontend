import {
  Button,
  Card,
  CardActionArea,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { PushRouteAppEvent } from "../events/PushRouteAppEvent";
import { Column } from "../layouts/Column";
import { Row } from "../layouts/Row";
import {
  CompanyDetailUrlType,
  CreateCompanySuccessUrlType,
  RoutePath,
  SearchResultUrlType,
} from "../route-config";
import { CompanyCard } from "../stateless-components/CompanyCard";
import { IdeaCard } from "../stateless-components/IdeaCard";
import { RootAppState } from "../states/RootAppState";
import { UrlAppState } from "../states/UrlAppState";
import { appStore } from "../store-config";
import { CreateCompanyPageTabIndex } from "./CreateCompanyPage";
import { SiteAppBar } from "./SiteAppBar";

type _Props = {
  urlAppState: UrlAppState<CreateCompanySuccessUrlType>;
};
type _State = {};

class _CreateCompanySuccessPage extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }

  get urlAppState() {
    return this.props.urlAppState.as<CreateCompanySuccessUrlType>();
  }

  get createIndex() {
    return this.props.urlAppState.search.create;
  }

  //   renderIdeaPage() {
  //     return (
  //       <React.Fragment>
  //         <Typography gutterBottom variant='h2'>"Idea successfully created",
  //               [CreateCompanyPageTabIndex.createStartup]:
  //                 "Startup successfully created",
  //               [CreateCompanyPageTabIndex.createProject]:
  //                 "Project successfully created",
  //             }[this.props.urlAppState.search.create]
  //           }
  //         </Typography>
  //       </React.Fragment>
  //     );
  //   }
  //   renderStartupPage(props: { isProject: boolean }) {
  //     return (
  //       <React.Fragment>
  //         <Typography gutterBottom variant='h2'>
  //           {
  //             {
  //               [CreateCompanyPageTabIndex.onlyIdea]: "Idea successfully created",
  //               [CreateCompanyPageTabIndex.createStartup]:
  //                 "Startup successfully created",
  //               [CreateCompanyPageTabIndex.createProject]:
  //                 "Project successfully created",
  //             }[this.props.urlAppState.search.create]
  //           }
  //         </Typography>
  //       </React.Fragment>
  //     );
  //   }

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <SiteAppBar />
        <Container maxWidth='lg'>
          <Paper sx={{ padding: 5 }}>
            <Column spacing={3} mt={5}>
              <Typography gutterBottom variant='h2'>
                {
                  {
                    [CreateCompanyPageTabIndex.onlyIdea]:
                      "Idea successfully created",
                    [CreateCompanyPageTabIndex.createStartup]:
                      "Startup successfully created",
                    [CreateCompanyPageTabIndex.createProject]:
                      "Project successfully created",
                  }[this.props.urlAppState.search.create]
                }
              </Typography>
              <Typography variant='body2'>
                {
                  {
                    [CreateCompanyPageTabIndex.onlyIdea]: `The idea is successfully created. It can now be voted by users, referred by startups and projects, or Community posts by ${this.props.urlAppState.search.idea?.tagWithSymbol}.`,
                    [CreateCompanyPageTabIndex.createStartup]:
                      "Your startup has been successfully created. " +
                      "You can now visit the startup profile page to add more content, advertise your startup in the Community, or find potential co-founders and investers.",
                    [CreateCompanyPageTabIndex.createProject]:
                      "Your project has been successfully created. " +
                      "You can now visit the project profile page to add more content, advertise your project in the Community, and find collaborators.",
                  }[this.props.urlAppState.search.create]
                }
              </Typography>
              {this.props.urlAppState.search.idea && (
                <IdeaCard
                  ideaData={this.props.urlAppState.search.idea}
                  elevation={2}
                />
              )}
              {this.props.urlAppState.search.companyData && (
                <Card>
                  <CardActionArea
                    onClick={() => {
                      appStore.dispatch(
                        new PushRouteAppEvent<CompanyDetailUrlType>(
                          RoutePath.companyDetail,
                          {
                            slug: this.props.urlAppState.search.companyData!
                              .companySlug,
                          },
                          {}
                        )
                      );
                    }}>
                    <CompanyCard
                      companyData={this.props.urlAppState.search.companyData}
                    />
                  </CardActionArea>
                </Card>
              )}
              <Row spacing={2}>
                <Button
                  sx={{ textTransform: "none" }}
                  variant='contained'
                  onClick={() => {
                    appStore.dispatch(
                      new PushRouteAppEvent<SearchResultUrlType>(
                        RoutePath.searchResult,
                        {},
                        { q: this.props.urlAppState.search.idea?.humanText }
                      )
                    );
                  }}>
                  View in search result
                </Button>
                {this.props.urlAppState.search.companyData && (
                  <Button
                    sx={{ textTransform: "none" }}
                    variant='contained'
                    color='info'
                    onClick={() => {
                      appStore.dispatch(
                        new PushRouteAppEvent<CompanyDetailUrlType>(
                          RoutePath.companyDetail,
                          {
                            slug: this.props.urlAppState.search.companyData!
                              .companySlug,
                          },
                          {}
                        )
                      );
                    }}>
                    Go to startup profile
                  </Button>
                )}
              </Row>
            </Column>
          </Paper>
        </Container>
      </React.Fragment>
    );
  }
}

export const CreateCompanySuccessPage = connect<_Props, {}, {}, RootAppState>(
  (state) => {
    return {
      urlAppState: state.url.as<CreateCompanySuccessUrlType>(),
    };
  }
)(_CreateCompanySuccessPage);
