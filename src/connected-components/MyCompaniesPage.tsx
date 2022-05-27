import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  ListItem,
  ListItemButton,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { MyCompaniesInitialLoadAppEvent } from "../events/MyCompaniesAppEvent";
import { PushRouteAppEvent } from "../events/PushRouteAppEvent";
import { Column } from "../layouts/Column";
import {
  CompanyDetailUrlType,
  EditCompanyChildPage,
  EditCompanyUrlType,
  MyCompaniesListUrlType,
  RoutePath,
} from "../route-config";
import { CompanyCard } from "../stateless-components/CompanyCard";
import {
  MyCompaniesAppState,
  MyCompaniesItemAppState,
} from "../states/MyCompaniesAppState";
import { RootAppState } from "../states/RootAppState";
import { UrlAppState } from "../states/UrlAppState";
import { appStore } from "../store-config";
import { MyAccountPage } from "./MyAccountPage";
import { SiteAppBar } from "./SiteAppBar";

type _Props = {
  urlAppState: UrlAppState<MyCompaniesListUrlType>;
  myCompaniesAppState: MyCompaniesAppState;
};
type _State = {};

class _MyCompaniesPage extends React.PureComponent<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }

  get urlAppState() {
    return this.props.urlAppState.as<MyCompaniesListUrlType>();
  }

  componentDidMount() {
    appStore.dispatch(new MyCompaniesInitialLoadAppEvent());
  }

  render(): React.ReactNode {
    return (
      <MyAccountPage>
        <Column spacing={2}>
          <Typography variant='h2' gutterBottom>
            My Startups / Projects
          </Typography>
          {this.props.myCompaniesAppState.companies
            .toArray()
            .map(this.renderCompanyItem)}
        </Column>
      </MyAccountPage>
    );
  }

  renderCompanyItem(item: MyCompaniesItemAppState, index: number) {
    return (
      <Card
        key={item.key || index}
        sx={{
          minWidth: 275,
          display: "flex",
          width: 1 / 1,
          marginBottom: 1,
          borderRadius: 2,
        }}
        variant='outlined'>
        <CardActionArea
          onClick={() => {
            appStore.dispatch(
              new PushRouteAppEvent<CompanyDetailUrlType>(
                RoutePath.companyDetail,
                { slug: item.companySlug },
                {}
              )
            );
          }}>
          <CompanyCard
            companyData={item}
            sx={{
              minHeight: 200,
            }}
          />
        </CardActionArea>
        {!item.isSkeleton && (
          <CardActions sx={{ padding: 0 }}>
            <Button
              sx={{ height: 1 }}
              onClick={() => {
                appStore.dispatch(
                  new PushRouteAppEvent<EditCompanyUrlType>(
                    RoutePath.editCompany,
                    { slug: item.companySlug },
                    { page: EditCompanyChildPage.profile }
                  )
                );
              }}>
              Edit
            </Button>
          </CardActions>
        )}
      </Card>
    );
  }
}

export const MyCompaniesListPage = connect((state: RootAppState) => {
  return {
    urlAppState: state.url.as<MyCompaniesListUrlType>(),
    myCompaniesAppState: state.myCompanies,
  };
})(_MyCompaniesPage);
