import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Popover,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { connect } from "react-redux";
import {
  TimelineListInitialLoadAppEvent,
  TimelineListLoadMoreAppEvent,
  TimelineListRefreshAppEvent,
  TimelineListRefreshSuccessAppEvent,
} from "../events/TimelineListAppEvent";
import {
  TimelineListAppState,
  TimelineListLoadingStatus,
} from "../states/TimelineListAppState";
import { RootAppState } from "../states/RootAppState";
import { UrlAppState } from "../states/UrlAppState";
import { appStore } from "../store-config";
import { StandardPostCard } from "../stateless-components/StandardPostCard";
import { SiteAppBar } from "./SiteAppBar";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";
import { Column } from "../layouts/Column";
import { Overlay } from "../layouts/Overlay";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import { ReturnToTopButton } from "../stateless-components/ReturnToTopButton";
import { Row } from "../layouts/Row";
import { Random } from "../states/random-generation";
import Editor from "rich-markdown-editor";
import {
  TimelinePostAppState,
  PostData,
  CommentData,
} from "../states/TimelinePostAppState";
import { StandardEditor } from "../stateless-components/StandardEditor";
import { appTheme } from "../theme";
import { PersonalTimelinePageLayout } from "../stateless-components/PersonalTimelinePageLayout";
import FriendActivitiesWidget from "./FriendActivitiesWidget";
import TimelinePage from "./TimelinePage";
import { SessionAppState } from "../states/SessionAppState";
import {
  PostEditor,
  PostEditorProps,
} from "../stateless-components/PostEditor";
import { RoutePath, TimelineUrlType } from "../route-config";
import { PushRouteAppEvent } from "../events/PushRouteAppEvent";
import {
  ClearRoundedIcon,
  FilterAltOutlinedIcon,
  SearchIcon,
} from "../stateless-components/icons-collection";
import { Spacer } from "../layouts/Spacer";
import { MentionSelectionField } from "../stateless-components/MentionSelectionField";
import { AutocompleteDropdown } from "./AutocompleteDropdown";
import { TagAppState } from "../states/TagAppState";
import { mapState, mapStateOptional, Modifier } from "../simple-redux";
import { NonFunctionKeys } from "../simple-redux/type_helpers";
import { AfterEventOfType } from "../simple-redux/schedule";
import { Search } from "react-router-dom";

type _Props = {
  urlAppState: UrlAppState<TimelineUrlType>;
  timelineListAppState: TimelineListAppState;
  sessionAppState: SessionAppState;
};

type _State = {
  editorText: string;
  openRefineSearchDropdown: boolean;
};

class _TimelineListPage extends React.PureComponent<_Props, _State> {
  scrollButton: HTMLButtonElement | null = null;

  constructor(props: _Props) {
    super(props);
    this.state = {
      editorText: "",
      openRefineSearchDropdown: false,
    };
  }

  refineSearchButtonRef = React.createRef<HTMLButtonElement>();

  lastReadPostY: number | null = null;
  lastReadPostId: string | null = null;

  get urlAppState() {
    return this.props.urlAppState.as<TimelineUrlType>();
  }

  onFetchMore = () => {
    appStore.dispatch(new TimelineListLoadMoreAppEvent());
  };

  onRefresh = () => {
    let posts = this.props.timelineListAppState.posts;
    if (posts) {
      let postId = posts.at(0).key;
      let element = document.getElementById(postId)!;
      this.lastReadPostId = postId;
      this.lastReadPostY = element.getBoundingClientRect().top;
    }
    appStore.dispatch(new TimelineListRefreshAppEvent());
  };

  render(): React.ReactNode {
    let personalTimelineAppState = this.props.timelineListAppState;
    let userSlug = this.props.urlAppState.params.userSlug;
    let topicSlug = this.props.urlAppState.params.topicSlug;
    return (
      <React.Fragment>
        <TimelinePage>
          <Column spacing={2}>
            {this.renderEditor()}
            {this.renderAppliedFilters()}
            {this.renderRefineSearchMenu()}
          </Column>
          <Box pt={5} pb={2}>
            {topicSlug && (
              <Divider textAlign='left'>
                <Row spacing={0.5} vertiCenter>
                  <Typography variant='subtitle1'>Ideas in</Typography>
                  <Typography variant='h4' sx={{ fontStyle: "italic" }}>
                    #{topicSlug}
                  </Typography>
                </Row>
              </Divider>
            )}
            {userSlug && (
              <Divider textAlign='left'>
                <Row spacing={0.5} vertiCenter>
                  <Typography variant='subtitle1'>Ideas of</Typography>
                  <Typography variant='h4' sx={{ fontStyle: "italic" }}>
                    @{userSlug}
                  </Typography>
                </Row>
              </Divider>
            )}
          </Box>
          {this.props.timelineListAppState.loadingStatus !==
            TimelineListLoadingStatus.loading && (
            <Column pb={2} horizCenter>
              <Fab
                onClick={this.onRefresh}
                variant='extended'
                size='small'
                color='primary'
                aria-label='add'>
                <KeyboardDoubleArrowUpRoundedIcon />
                More Recent Activities
              </Fab>
            </Column>
          )}
          <List>
            <InfiniteScroll
              style={{ overflowY: "hidden" }}
              dataLength={personalTimelineAppState.posts.length}
              next={this.onFetchMore}
              loader={<CircularProgress />}
              hasMore={true}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }>
              {personalTimelineAppState.posts.toArray().map(this.renderPost)}
            </InfiniteScroll>
          </List>
        </TimelinePage>
      </React.Fragment>
    );
  }

  renderEditor(editorProps?: Partial<PostEditorProps>) {
    let _session = this.props.sessionAppState;
    if (_session.user) {
      return (
        <PostEditor
          {...editorProps}
          author={_session.user}
          context={{
            prefilledIdea:
              this.props.urlAppState.search.findCollaborator?.idea || undefined,
            prefilledLocation:
              this.props.urlAppState.search.findCollaborator?.city || undefined,
          }}
          initialText={this.state.editorText}
        />
      );
    }
    return undefined;
  }

  loadPage() {
    let hash = this.props.urlAppState.hash();
    let currentHash = this.props.timelineListAppState.currentUrlHash;
    if (hash != currentHash) {
      appStore.dispatch(
        new TimelineListInitialLoadAppEvent({
          userSlug: this.props.urlAppState.params.userSlug,
          topicSlug: this.props.urlAppState.params.topicSlug,
          currentUrlHash: hash,
        })
      );
      this.setState({
        editorText: this.props.urlAppState.search.findCollaborator?.idea ?? "",
      });
    }
  }

  restorePreviousReadPostScrollY() {
    if (
      this.lastReadPostY &&
      this.lastReadPostId &&
      this.lastReadPostId !== this.props.timelineListAppState.posts.at(0).postId
    ) {
      let element = document.getElementById(this.lastReadPostId)!;
      let y =
        element.getBoundingClientRect().top +
        window.pageYOffset -
        this.lastReadPostY;
      window.scrollTo({ top: y });
      this.lastReadPostY = null;
      this.lastReadPostId = null;
    }
  }

  componentDidUpdate() {
    this.loadPage();
    this.restorePreviousReadPostScrollY();
  }

  renderPost = (post: PostData) => {
    return (
      <Column id={post.postId} key={post.postId} mb={5}>
        <Container
          sx={{
            backgroundColor: "white",
            py: 2,
            boxShadow: 1,
            borderRadius: 0.5,
          }}>
          <StandardPostCard elevation={0} postData={post} />
        </Container>
      </Column>
    );
  };

  get currentFilters(): string[] {
    return this.props.urlAppState.search.filters?.tags ?? [];
  }

  modifyFilterAndRefresh(
    filterModifier: Modifier<NonNullable<TimelineUrlType["search"]["filters"]>>
  ) {
    appStore.dispatch(
      new PushRouteAppEvent<TimelineUrlType>(
        this.props.urlAppState.path as any,
        this.props.urlAppState.params,
        mapState<TimelineUrlType["search"]>({
          filters: mapStateOptional(filterModifier, {}),
        })(this.props.urlAppState.search)
      )
    );
  }

  renderAppliedFilters() {
    return (
      <Box>
        <Row alignTop>
          <Grid container spacing={1} alignItems='center'>
            {this.currentFilters.length > 0 && (
              <React.Fragment>
                <Grid item>
                  <Typography variant='subtitle2'>Applied filters:</Typography>
                </Grid>
                {this.currentFilters.map((x, index) => (
                  <Grid item key={index}>
                    <Chip
                      label={x}
                      onDelete={() => {
                        this.modifyFilterAndRefresh({
                          tags: (tags) => tags?.filter((x, i) => i != index),
                        });
                      }}
                    />
                  </Grid>
                ))}
              </React.Fragment>
            )}
            {this.currentFilters.length > 1 && (
              <Grid item>
                <Chip
                  label='Clear All'
                  color='primary'
                  variant='outlined'
                  onClick={() => {
                    appStore.dispatch(
                      new PushRouteAppEvent<TimelineUrlType>(
                        this.props.urlAppState.path as any,
                        {},
                        {
                          ...this.props.urlAppState.search,
                          filters: {},
                        }
                      )
                    );
                  }}
                />
              </Grid>
            )}
          </Grid>
          <Spacer></Spacer>
          <Button
            sx={{ flexShrink: 0 }}
            ref={this.refineSearchButtonRef}
            onClick={() => {
              this.setState({
                openRefineSearchDropdown: true,
              });
            }}
            startIcon={<FilterAltOutlinedIcon />}>
            Refine Search
          </Button>
        </Row>
      </Box>
    );
  }

  renderRefineSearchMenu() {
    return (
      <AutocompleteDropdown<TagAppState>
        menuProps={{
          open: this.state.openRefineSearchDropdown,
          onClose: () => {
            this.setState({
              openRefineSearchDropdown: false,
            });
          },
          anchorEl: this.refineSearchButtonRef.current,
          anchorOrigin: {
            horizontal: "right",
            vertical: "bottom",
          },
          transformOrigin: {
            horizontal: "right",
            vertical: "top",
          },
        }}
        textfieldProps={{
          placeholder: "Search #topic or @someone",
          autoFocus: true,
          sx: { width: 240 },
          InputProps: {
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
        onInputChange={function (text: string): void {
          // throw new Error("Function not implemented.");
        }}
        options={[
          TagAppState.random(),
          TagAppState.random(),
          TagAppState.random(),
        ]}
        renderOption={(option, index) => {
          // throw new Error("Function not implemented.");
          return (
            <ListItem key={option.key}>
              <ListItemButton
                onClick={() => {
                  this.modifyFilterAndRefresh({
                    tags: (tags) => (tags ?? []).concat(option.originalText),
                  });
                  this.setState({
                    openRefineSearchDropdown: false,
                  });
                }}>
                <ListItemText secondary={option.getTag()}></ListItemText>
              </ListItemButton>
            </ListItem>
          );
        }}
      />
    );
  }
}

export const TimelineListPage = connect<_Props, {}, {}, RootAppState>(
  (state) => {
    return {
      urlAppState: state.url.as<TimelineUrlType>(),
      timelineListAppState: state.timelineList,
      sessionAppState: state.session,
    };
  }
)(_TimelineListPage);
