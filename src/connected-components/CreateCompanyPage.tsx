import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  FormControlLabel,
  Link,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Switch,
  SxProps,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Column } from "../layouts/Column";
import { SiteAppBar } from "./SiteAppBar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StandardAddressSelector } from "../stateless-components/StandardAddressSelector";
import { appStore } from "../store-config";
import { UrlAppState } from "../states/UrlAppState";
import {
  buildRoutePath,
  CreateCompanyUrlType,
  RoutePath,
  SearchResultUrlType,
} from "../route-config";
import { connect } from "react-redux";
import { RootAppState } from "../states/RootAppState";
import {
  CreateCompanyAppState,
  CreateCompanyLoadingStatus,
} from "../states/CreateCompanyAppState";
import { CreateCompanySaveAppEvent } from "../events/CreateCompanySaveAppEvent";
import { Overlay } from "../layouts/Overlay";
import { StandardActionButton } from "../stateless-components/StandardActionButton";
import { Row } from "../layouts/Row";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  ArchitectureIcon,
  HelpOutlineOutlinedIcon,
  MapsHomeWorkRoundedIcon,
  TipsAndUpdatesOutlinedIcon,
} from "../stateless-components/icons-collection";
import { Center } from "../layouts/Center";
import TabUnstyled from "@mui/base/TabUnstyled";
import TabsListUnstyled from "@mui/base/TabUnstyled";
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import { appTheme } from "../theme";
import { PushRouteAppEvent } from "../events/PushRouteAppEvent";

type _Props = {
  createCompanyAppState: CreateCompanyAppState;
  urlAppState: UrlAppState<CreateCompanyUrlType>;
};
type _State = {
  foundingDate: Date | null;
  idea?: string;
  alsoCreateCompany: boolean;
  projectOrCompany: CreateCompanyPageTabIndex;
  activeStep: number;
};

export enum CreateCompanyPageTabIndex {
  createStartup = "1",
  createProject = "2",
  onlyIdea = "3",
}

class _CreateCompany extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {
      foundingDate: new Date(),
      idea: this.props.urlAppState.search.idea,
      alsoCreateCompany: true,
      projectOrCompany: CreateCompanyPageTabIndex.createStartup,
      activeStep: 0,
    };
  }

  get urlAppState() {
    return this.props.urlAppState;
  }

  isSaving(): boolean {
    return (
      this.props.createCompanyAppState.loadingStatus ===
      CreateCompanyLoadingStatus.saving
    );
  }

  onCreateOnlyIdea = () => {
    appStore.dispatch(new CreateCompanySaveAppEvent({ idea: this.state.idea }));
  };

  onCreateStartup = (props: { isProject: boolean }) => {
    appStore.dispatch(
      new CreateCompanySaveAppEvent({
        company: {
          isProject: props.isProject,
        },
      })
    );
  };

  ideaWordCount(): number {
    let words = this.state.idea ?? "";
    return words.trim().split(/\s/).length;
  }

  componentDidMount() {
    this.setState({
      projectOrCompany: this.props.urlAppState.search.create,
    });
  }

  renderSuccess() {}

  renderTab(props: {
    name: string;
    renderIcon: (params: { sx: SxProps }) => React.ReactNode;
    value: string;
    color: string;
    textColor?: string;
    backgroundColor?: string;
    borderColor?: string;
    hoverColor: string;
    disabled?: boolean;
  }) {
    return (
      <Tab
        disabled={props?.disabled ?? false}
        sx={{
          padding: 0,
          margin: 2,
          borderRadius: 2,
          "&.Mui-selected": {
            outline: "1px solid",
            outlineColor: props?.borderColor ?? props.color,
          },
        }}
        label={
          <Paper
            sx={{
              bgcolor: "grey.0",
              ".Mui-selected &": {
                bgcolor: props?.backgroundColor ?? "grey.50",
              },
              "&:hover": {
                bgcolor: props?.backgroundColor ?? "grey.50",
              },
            }}>
            <Center sx={{ height: 200, width: 200 }}>
              <Column horizCenter spacing={2}>
                {props.renderIcon({
                  sx: {
                    height: 32,
                    width: 32,
                    color: props?.textColor ?? props.color,
                  },
                })}
                <Typography
                  variant='body2'
                  color={props?.textColor ?? props.color}
                  sx={{ textTransform: "none" }}>
                  {props.name}
                </Typography>
              </Column>
            </Center>
          </Paper>
        }
        value={props.value}
      />
    );
  }

  renderCreateStartupTab(props: { isProject: boolean }) {
    return (
      <Column spacing={3}>
        {!props.isProject && (
          <React.Fragment>
            <FormControlLabel
              sx={{ margin: 0 }}
              control={<Switch defaultChecked />}
              label='Create a conceptual startup'
              disabled={!this.state.alsoCreateCompany}
            />
            <Alert
              severity='info'
              icon={
                <HelpOutlineOutlinedIcon
                  fontSize='inherit'
                  sx={{ color: "info" }}
                />
              }>
              A conceptual startup is a business that's not officially
              registered. Creating a profile would allow the Community to critic
              the business model. You can also make connections and find
              potential business partners.
            </Alert>
          </React.Fragment>
        )}
        <TextField
          required
          variant='filled'
          label={props.isProject ? "Project name" : "Business name"}
          placeholder='Tell people the name of your company'
          fullWidth
          inputProps={{ maxLength: 30 }}
          InputProps={{
            endAdornment: (
              <Typography
                variant='caption'
                color='text.secondary'
                noWrap
                sx={{ width: 125 }}>
                30 characters max
              </Typography>
            ),
          }}
        />
        <TextField
          label='Detail'
          multiline
          placeholder={
            props.isProject
              ? "Tell people what this project is about."
              : "Tell people what this startup does."
          }
          required
          variant='filled'
          inputProps={{ maxLength: 300 }}
          InputProps={{
            endAdornment: (
              <Typography
                variant='caption'
                color='text.secondary'
                noWrap
                sx={{ width: 132 }}>
                300 characters max
              </Typography>
            ),
          }}
        />
        {!props.isProject && (
          <StandardAddressSelector
            required
            label='Location'
            placeholder='City, State, Country'
            textfieldProps={{
              variant: props.isProject ? "outlined" : "filled",
            }}
          />
        )}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label='Start date'
            value={this.state.foundingDate}
            onChange={(newValue) => {
              this.setState({ foundingDate: newValue });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <TextField
          label='Website url'
          placeholder={
            props.isProject
              ? "Link to your project's website"
              : "Link to your company's website"
          }
        />
        <Typography variant='caption'>Required fields*</Typography>
        <Row pt={3}>
          <StandardActionButton
            onClick={() => this.onCreateStartup({ isProject: props.isProject })}
            isSaving={this.isSaving()}>
            Complete
          </StandardActionButton>
        </Row>
      </Column>
    );
  }

  handleNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
    });
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  render(): React.ReactNode {
    let wordCount = this.ideaWordCount();
    return (
      <React.Fragment>
        <SiteAppBar />
        <Container maxWidth='lg'>
          <Paper sx={{ padding: 5, minHeight: "100vh" }}>
            <Column spacing={3} mt={5}>
              <Typography gutterBottom variant='h2'>
                Make your idea known
              </Typography>
              <TextField
                required
                label='7 words idea'
                placeholder='Describe your startup idea in 7 words'
                autoFocus
                variant='filled'
                defaultValue={this.props.urlAppState.search.idea}
                inputProps={{
                  maxLength: 300,
                }}
                InputProps={{
                  endAdornment: (
                    <Typography
                      variant='body2'
                      color={wordCount > 7 ? "error" : "text.secondary"}>
                      {wordCount}/7
                    </Typography>
                  ),
                }}
                fullWidth
                onChange={(e) => {
                  this.setState({
                    idea: e.target.value,
                  });
                }}
              />
              {wordCount > 7 && (
                <Alert severity={wordCount > 7 ? "error" : "info"}>
                  {
                    "We challenge you to summarize the business model in 7 words or less. A good business model should be clear and simple. "
                  }
                  <Link
                    target='_blank'
                    href={buildRoutePath<SearchResultUrlType>(
                      RoutePath.searchResult,
                      {},
                      {}
                    )}>
                    {"Click here to see some idea examples."}
                  </Link>
                </Alert>
              )}
              <Typography variant='body2' pt={2}>
                Optionally, create a startup / project with this idea:
              </Typography>
              {/* <FormControlLabel
                control={<Switch defaultChecked />}
                value={this.state.alsoCreateCompany}
                label='Optionally, create a startup / project for this idea'
                onChange={(e, checked) => {
                  this.setState({ alsoCreateCompany: checked });
                }}
              /> */}

              {this.state.alsoCreateCompany && (
                <TabContext value={this.state.projectOrCompany}>
                  <TabList
                    sx={{ display: "flex", flexWrap: "wrap" }}
                    onChange={(e, val) => {
                      this.setState({
                        projectOrCompany: val,
                      });
                      appStore.dispatch(
                        new PushRouteAppEvent<CreateCompanyUrlType>(
                          RoutePath.createCompany,
                          {},
                          {
                            idea: this.state.idea ?? "",
                            create: val,
                          }
                        )
                      );
                    }}
                    TabIndicatorProps={{
                      sx: {
                        display: "none",
                      },
                    }}
                    aria-label='lab API tabs example'>
                    {/* {this.renderTab({
                      name: "Choose one:",
                      renderIcon: (params) => false,
                      color: "inherit",
                      backgroundColor: "transparent",
                      borderColor: "transparent",
                      hoverColor: "transparent",
                      value: _TabType.initial,
                      disabled: true,
                    })} */}
                    {this.renderTab({
                      name: "Only Idea",
                      renderIcon: (params) => (
                        <TipsAndUpdatesOutlinedIcon {...params} />
                      ),
                      color: appTheme.palette.text.secondary,
                      hoverColor: appTheme.palette.text.secondary,
                      value: CreateCompanyPageTabIndex.onlyIdea,
                    })}
                    {this.renderTab({
                      name: "Create a Startup",
                      renderIcon: (params) => (
                        <MapsHomeWorkRoundedIcon {...params} />
                      ),
                      color: appTheme.palette.primary.light,
                      hoverColor: appTheme.palette.primary.dark,
                      value: CreateCompanyPageTabIndex.createStartup,
                    })}
                    {this.renderTab({
                      name: "Create a Project",
                      renderIcon: (params) => <ArchitectureIcon {...params} />,
                      color: appTheme.palette.secondary.light,
                      hoverColor: appTheme.palette.secondary.dark,
                      value: CreateCompanyPageTabIndex.createProject,
                    })}
                  </TabList>
                  {this.state.projectOrCompany ===
                    CreateCompanyPageTabIndex.onlyIdea && (
                    <Alert
                      icon={
                        <HelpOutlineOutlinedIcon
                          fontSize='inherit'
                          sx={{ color: "text.secondary" }}
                        />
                      }
                      sx={{ bgcolor: "grey.100", color: "text.secondary" }}>
                      Only idea: Create an idea that can be referred by
                      Community posts. Allow others to vote on the idea. Find
                      out if others have the same idea.
                    </Alert>
                  )}
                  {this.state.projectOrCompany ===
                    CreateCompanyPageTabIndex.createStartup && (
                    <Alert
                      icon={<HelpOutlineOutlinedIcon fontSize='inherit' />}
                      color='info'>
                      Create a startup: Debate your business model with the
                      Community, get connected with potential co-founders,
                      collaborators and investors.
                    </Alert>
                  )}

                  {this.state.projectOrCompany ===
                    CreateCompanyPageTabIndex.createProject && (
                    <Alert
                      icon={<HelpOutlineOutlinedIcon fontSize='inherit' />}
                      color={"secondary" as any}>
                      Create a project: Incubate ideas, turn your idea into a
                      product, and find collaborators.
                    </Alert>
                  )}
                  <TabPanel
                    value={CreateCompanyPageTabIndex.createStartup}
                    sx={{ px: 0 }}>
                    {this.renderCreateStartupTab({ isProject: false })}
                  </TabPanel>
                  <TabPanel
                    value={CreateCompanyPageTabIndex.createProject}
                    sx={{ px: 0 }}>
                    {this.renderCreateStartupTab({ isProject: true })}
                  </TabPanel>
                  <TabPanel
                    value={CreateCompanyPageTabIndex.onlyIdea}
                    sx={{ px: 0 }}>
                    <StandardActionButton
                      onClick={this.onCreateOnlyIdea}
                      isSaving={this.isSaving()}>
                      Complete
                    </StandardActionButton>
                  </TabPanel>
                </TabContext>
              )}
            </Column>
          </Paper>
        </Container>
      </React.Fragment>
    );
  }
}

export const CreateCompanyPage = connect<_Props, {}, {}, RootAppState>(
  (state) => ({
    createCompanyAppState: state.createCompany,
    urlAppState: state.url.as<CreateCompanyUrlType>(),
  })
)(_CreateCompany);
