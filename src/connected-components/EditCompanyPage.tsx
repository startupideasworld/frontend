import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Link,
  Container,
  Box,
  Paper,
} from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { Row } from "../layouts/Row";
import {
  buildRoutePath,
  EditCompanyChildPage,
  EditCompanyUrlType,
  RoutePath,
} from "../route-config";
import { RootAppState } from "../states/RootAppState";
import { UrlAppState } from "../states/UrlAppState";
import { EditCompanyContentPage } from "./EditCompanyContentPage";
import { EditCompanyPeoplePage } from "./EditCompanyPeoplePage";
import { EditCompanyProfilePage } from "./EditCompanyProfilePage";
import { SiteAppBar } from "./SiteAppBar";

type _Props = {
  urlAppState: UrlAppState<EditCompanyUrlType>;
};
type _State = {};

class _EditCompanyProfile extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }

  get urlAppState() {
    return this.props.urlAppState.as<EditCompanyUrlType>();
  }

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <SiteAppBar></SiteAppBar>
        <Container maxWidth='xl'>
          <Row mt={5}>
            {renderPageSidebar({
              slug: this.urlAppState.params.slug,
              currentPage: this.urlAppState.search.page,
            })}
            <Container maxWidth='lg'>
              {renderPageContent({
                currentPage: this.urlAppState.search.page,
              })}
            </Container>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

function renderPageSidebar(props: {
  slug: string;
  currentPage: EditCompanyChildPage;
}) {
  const links: [string, EditCompanyChildPage][] = [
    ["Business Profile", EditCompanyChildPage.profile],
    ["Contents & Articles", EditCompanyChildPage.content],
    ["People", EditCompanyChildPage.people],
  ];
  return (
    <List sx={{ width: 300 }}>
      {links.map(([title, page], index) => (
        <ListItem key={index}>
          <ListItemButton
            selected={props.currentPage === page}
            component={Link}
            href={buildRoutePath<EditCompanyUrlType>(
              RoutePath.editCompany,
              { slug: props.slug },
              { page: page }
            )}>
            <ListItemText>{title}</ListItemText>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

function renderPageContent(props: { currentPage: EditCompanyChildPage }) {
  switch (props.currentPage) {
    case EditCompanyChildPage.profile:
      return <EditCompanyProfilePage />;
    case EditCompanyChildPage.people:
      return <EditCompanyPeoplePage />;
    case EditCompanyChildPage.content:
      return <EditCompanyContentPage />;
    default:
      return <EditCompanyProfilePage />;
  }
}

export const EditCompanyPage = connect<_Props, {}, {}, RootAppState>(
  (state) => {
    return {
      urlAppState: state.url.as<EditCompanyUrlType>(),
    };
  }
)(_EditCompanyProfile);
