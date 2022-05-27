import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { appStore } from "../store-config";
import { CompanyDetailLoadAppEvent } from "../events/CompanyDetailLoadAppEvent";
import {
  buildRoutePath,
  CompanyDetailUrlType,
  EditCompanyChildPage,
  EditCompanyUrlType,
  RoutePath,
} from "../route-config";
import { Column } from "../layouts/Column";
import {
  AssociateData,
  CompanyDetailAppState,
  CompanyDetailLoadingStatus,
} from "../states/CompanyDetailAppState";
import { RootAppState } from "../states/RootAppState";
import { UrlAppState } from "../states/UrlAppState";
import { SiteAppBar, SiteAppBarButton } from "./SiteAppBar";
import HailIcon from "@mui/icons-material/Hail";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { Row } from "../layouts/Row";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { StandardPostCard } from "../stateless-components/StandardPostCard";
import { PostData } from "../states/TimelinePostAppState";
import SitePostEditor from "./SitePostEditor";
import { appTheme } from "../theme";
import { Center } from "../layouts/Center";
import {
  ArticleRoundedIcon,
  EditIcon,
  ImageRoundedIcon,
} from "../stateless-components/icons-collection";
import { SmartImage } from "../stateless-components/SmartImage";
import { FloatingWriteButton } from "../stateless-components/FloatingWriteButton";
import { PushRouteAppEvent } from "../events/PushRouteAppEvent";

type _Props = {
  companyDetailAppState: CompanyDetailAppState;
  urlAppState: UrlAppState<CompanyDetailUrlType>;
};
type _State = {
  headerImgBrightness: number;
};

class _CompanyDetailPage extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {
      headerImgBrightness: 0,
    };
  }

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <SitePostEditor />
        <SiteAppBar>
          <SiteAppBarButton
            href={buildRoutePath<EditCompanyUrlType>(
              RoutePath.editCompany,
              { slug: this.props.urlAppState.params.slug },
              { page: EditCompanyChildPage.default }
            )}
            sx={{ my: 2, color: "white" }}
            startIcon={<ModeEditIcon />}>
            Edit
          </SiteAppBarButton>
        </SiteAppBar>
        <Box sx={{ position: "absolute", width: 1 / 1, zIndex: 0 }}>
          {this.renderBanner()}
        </Box>
        <Container maxWidth='xl' sx={{ position: "relative", zIndex: 1 }}>
          <Row>
            <Column pt={20} spacing={10}>
              {/* The left column of the page */}
              {this.renderCompanyProfileCard()}
              {renderAssociates(
                this.companyDetailAppState.associates.toArray()
              )}
            </Column>
            <Container maxWidth='md'>
              {/* The right column of the page */}
              <Box mt={15} mb={20} ml={1}>
                <Typography
                  variant='h1'
                  noWrap
                  color='primary.contrastText'
                  sx={{
                    textTransform: "capitalize",
                    textShadow: "1px 1px 5px #000000aa",
                  }}>
                  {this.companyDetailAppState.companyTitle}
                </Typography>
                <Typography
                  variant='subtitle1'
                  noWrap
                  color='primary.contrastText'
                  sx={{
                    textTransform: "capitalize",
                    textShadow: "1px 1px 1px #000000dd",
                  }}>
                  {[
                    this.companyDetailAppState.companyAddress.line,
                    this.companyDetailAppState.companyAddress.city,
                    this.companyDetailAppState.companyAddress.state,
                    this.companyDetailAppState.companyAddress.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Typography>
              </Box>
              {this.renderContent()}
            </Container>
          </Row>
          <Box mt={20}></Box>
          <Container maxWidth='xl'>
            <Column spacing={20} horizCenter>
              {renderCritics(this.companyDetailAppState.critics.toArray())}
              {renderMentions(this.companyDetailAppState.mentions.toArray())}
            </Column>
          </Container>
          <Box mt={20}></Box>
        </Container>
        <Box sx={{ width: 1 / 1, zIndex: -1, bottom: 0 }}>
          {this.renderFooter()}
        </Box>
        {this.renderFloatingWriteButton()}
      </React.Fragment>
    );
  }

  renderFloatingWriteButton() {
    return (
      <FloatingWriteButton>
        <ListItem>
          <ListItemText disableTypography>
            <Divider textAlign='left'>
              <Typography variant='subtitle2' noWrap>
                {this.companyDetailAppState.companyTitle}
              </Typography>
            </Divider>
          </ListItemText>
        </ListItem>{" "}
        <ListItemButton
          onClick={() => {
            appStore.dispatch(
              new PushRouteAppEvent<EditCompanyUrlType>(
                RoutePath.editCompany,
                { slug: this.companyDetailAppState.companySlug },
                { page: EditCompanyChildPage.content }
              )
            );
          }}>
          <ListItemText inset primary='Edit page' />
        </ListItemButton>
      </FloatingWriteButton>
    );
  }

  renderCompanyProfileCard() {
    return (
      <Card sx={{ width: 375, borderRadius: 2 }} elevation={20}>
        <CardMedia>
          <SmartImage
            src={this.companyDetailAppState.companyThumbnail}
            height={400}
            width={1}
          />
        </CardMedia>
        <CardContent>
          <Box m={1} mb={2}>
            <Typography gutterBottom variant='h6' component='div'>
              {this.companyDetailAppState.companyTitle}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {this.companyDetailAppState.companyDescription}
            </Typography>
          </Box>
          <Box margin={1} mb={3}>
            <Button>Visit Website</Button>
          </Box>
          {/* <Alert severity='info'>
            {"This company currently has no admin. You can "}
            <Link>claim this business.</Link>
          </Alert> */}
          <Divider variant='middle' />
          <List sx={{ width: "100%", maxWidth: 360 }}>
            <ListItem>
              <ListItemIcon>
                <ScheduleOutlinedIcon />
              </ListItemIcon>
              <ListItemText secondary='Date Founded' primary='Jan 9, 2014' />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CurrencyExchangeIcon />
              </ListItemIcon>
              <ListItemText secondary='Progress' primary='Pre-seed' />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <HailIcon />
              </ListItemIcon>
              <ListItemText secondary='Employees' primary='10+' />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FmdGoodOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                secondary='Location'
                primary={`${this.companyDetailAppState.companyAddress.state}, ${this.companyDetailAppState.companyAddress.country}`}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    );
  }

  renderBanner() {
    return (
      <Box
        sx={{
          display: "flex",
          position: "relative",
          backgroundImage: `url(${this.companyDetailAppState.companyBanner})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          boxShadow: 1,
          height: 300,
        }}></Box>
    );
  }

  renderFooter() {
    return (
      <Box sx={{ overflow: "hidden" }}>
        <img
          alt=''
          height={300}
          width='100%'
          style={{
            display: "flex",
            position: "relative",
            backgroundImage: `url(${this.companyDetailAppState.companyBanner})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            filter: "contrast(0.1) blur(300px)",
            transform: "scale(3)",
          }}
        />
      </Box>
    );
  }

  renderFounders() {
    return (
      <Column spacing={8}>
        {this.companyDetailAppState.companyFounders.map((founder) => (
          <ListItem key={founder.id}>
            <Row spacing={5}>
              <Card
                sx={{
                  minWidth: 200,
                  flexShrink: 1,
                  bgcolor: "transparent",
                  overflow: "visible",
                }}
                elevation={0}>
                <Column horizCenter>
                  <CardMedia>
                    <Avatar
                      src={founder.avatar}
                      sx={{
                        width: 100,
                        height: 100,
                        boxShadow: appTheme.shadows[4],
                      }}
                    />
                  </CardMedia>
                  <Column horizCenter mt={2} mb={0}>
                    <Typography
                      variant='h6'
                      component='div'
                      noWrap
                      sx={{ textTransform: "capitalize" }}>
                      {founder.name}
                    </Typography>
                    <Typography
                      gutterBottom
                      textAlign='center'
                      variant='caption'
                      color='text.secondary'>
                      {founder.role}
                    </Typography>
                  </Column>
                  <CardActions>
                    <Button
                      variant='outlined'
                      size='small'
                      startIcon={<LinkedInIcon />}>
                      Connect
                    </Button>
                  </CardActions>
                </Column>
              </Card>
              <ListItemText>
                {founder.summary}
                <Typography
                  component='span'
                  variant='caption'
                  textAlign='end'
                  pl={1}
                  sx={{ textTransform: "capitalize" }}>
                  -- {founder.name}
                </Typography>
              </ListItemText>
            </Row>
          </ListItem>
        ))}
      </Column>
    );
  }

  renderBusinessTimeline() {
    return (
      <Column>
        <Typography variant='h2'>Timeline</Typography>
        <Box mt={5}>
          <Timeline>
            {this.companyDetailAppState.companyTimeline.map((p, i) => (
              <TimelineItem key={i}>
                <TimelineOppositeContent color='text.secondary'>
                  {p.time.toLocaleDateString("en-us", {
                    year: "numeric",
                    month: "short",
                  })}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>{p.label}</TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>
      </Column>
    );
  }
  renderBusinessModel() {
    return (
      <Column>
        <Typography variant='h2'>Business Model</Typography>
        <Box mt={5}>
          {this.companyDetailAppState.companyBusinessModel
            .split("\n")
            .map((p, i) => (
              <Typography key={i} mb={3} variant='body1'>
                {p}
              </Typography>
            ))}
        </Box>
      </Column>
    );
  }

  renderBusinessRisks() {
    return (
      <Column>
        <Typography variant='h2'>Risks {"&"} Challenges</Typography>
        <Box mt={5}>
          {this.companyDetailAppState.companyRisks.split("\n").map((p, i) => (
            <Typography key={i} mb={3} variant='body1'>
              {p}
            </Typography>
          ))}
        </Box>
      </Column>
    );
  }

  renderBusinessAnalysis() {
    return (
      <Column>
        <Typography variant='h2'>Why the Business Failed</Typography>
        <Box mt={5}>
          {this.companyDetailAppState.companyAnalysis
            .split("\n")
            .map((p, i) => (
              <Typography key={i} mb={3} variant='body1'>
                {p}
              </Typography>
            ))}
        </Box>
      </Column>
    );
  }

  renderBusinessCurrentState() {
    return (
      <Column>
        <Typography variant='h2'>Current State</Typography>
        <Box mt={5}>
          {this.companyDetailAppState.companyCurrentState
            .split("\n")
            .map((p, i) => (
              <Typography key={i} mb={3} variant='body1'>
                {p}
              </Typography>
            ))}
        </Box>
      </Column>
    );
  }

  renderContent() {
    return (
      <Column spacing={10}>
        {this.renderFounders()}
        {this.renderBusinessModel()}
        {this.renderBusinessRisks()}
        {this.renderBusinessTimeline()}
        {this.renderBusinessCurrentState()}
        {this.renderBusinessAnalysis()}
      </Column>
    );
  }

  ready() {
    return this.props.urlAppState.params;
  }

  get urlAppState(): UrlAppState<CompanyDetailUrlType> {
    return this.props.urlAppState;
  }

  get companyDetailAppState(): CompanyDetailAppState {
    return this.props.companyDetailAppState;
  }

  get companySlug(): string {
    return this.urlAppState.params.slug;
  }

  componentDidMount() {
    if (
      this.companyDetailAppState.loadingStatus ===
      CompanyDetailLoadingStatus.initial
    ) {
      appStore.dispatch(
        new CompanyDetailLoadAppEvent({ slug: this.companySlug })
      );
    }
  }
}

function renderCritics(critics: PostData[]) {
  return (
    <Column spacing={5}>
      <Divider>
        <Box mx={5}>
          <Typography variant='h3' textAlign='center'>
            Critics
          </Typography>
        </Box>
      </Divider>
      <Grid
        container
        spacing={{ xs: 1, md: 2, lg: 3 }}
        columns={{ xs: 1, md: Math.min(critics.length, 3) }}>
        {critics.map((critic, index) => (
          <Grid item xs={1} key={index} alignItems='center'>
            <Paper sx={{ minWidth: 100, flexShrink: 1 }}>
              <StandardPostCard postData={critic} smallLayout />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Column>
  );
}

function renderMentions(posts: PostData[]) {
  return (
    <Column spacing={5}>
      <Divider>
        <Box mx={5}>
          <Typography variant='h4' textAlign='center'>
            @Mentions
          </Typography>
        </Box>
      </Divider>
      <List>
        {posts.map((post, index) => (
          <ListItem key={index}>
            <StandardPostCard sx={{ width: 1 / 1 }} postData={post} />
          </ListItem>
        ))}
      </List>
    </Column>
  );
}

function renderAssociates(associates: AssociateData[]) {
  return (
    <Column>
      <List>
        <ListItem>
          <Typography variant='h6'>Team {"&"} Associates</Typography>
        </ListItem>
        {associates.map((person) => (
          <ListItem sx={{ alignItems: "start" }} key={person.id}>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar src={person.avatar} />
              </ListItemAvatar>
              <ListItemText primary={person.name} secondary={person.role} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Column>
  );
}

export const CompanyDetailPage = connect<_Props, {}, {}, RootAppState>(
  (state) => {
    return {
      companyDetailAppState: state.companyDetail,
      urlAppState: state.url.as<CompanyDetailUrlType>(),
    };
  }
)(_CompanyDetailPage);
