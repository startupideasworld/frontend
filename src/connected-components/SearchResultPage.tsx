import React from "react";
import Box from "@mui/material/Box";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Center } from "../layouts/Center";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { SiteAppBar } from "./SiteAppBar";
import { connect } from "react-redux";
import { RootAppState } from "../states/RootAppState";
import {
  SearchResultIdeaItemAppState,
  SearchResultAppState,
  SearchResultLoadingStatus,
} from "../states/SearchResultAppState";
import { SearchResultCompanyItemAppState } from "../states/SearchResultAppState";
import InfiniteScroll from "react-infinite-scroll-component";
import { appStore } from "../store-config";
import { SearchResultAppEvent } from "../events/SearchResultAppEvent";
import { PushRouteAppEvent } from "../events/PushRouteAppEvent";
import {
  buildRoutePath,
  CreateCompanyUrlType,
  RoutePath,
  SearchResultUrlType,
  TimelineListUrlType,
  TimelineUrlType,
} from "../route-config";
import { UrlAppState } from "../states/UrlAppState";
import { StandardLikeButton } from "../stateless-components/StandardLikeButton";
import { Column } from "../layouts/Column";
import {
  KeyboardArrowDownIcon,
  QuestionAnswerOutlinedIcon,
  TipsAndUpdatesOutlinedIcon,
} from "../stateless-components/icons-collection";
import { StandardPostCard } from "../stateless-components/StandardPostCard";
import { FloatingWriteButton } from "../stateless-components/FloatingWriteButton";
import { FindCollaboratorDialog } from "../stateless-components/FindCollaboratorDialog";
import { TagAppState } from "../states/TagAppState";
import SitePostEditor from "./SitePostEditor";
import { Row } from "../layouts/Row";
import { CreateCompanyPageTabIndex } from "./CreateCompanyPage";
import { TagType } from "../types/min-combinators";
import { SiteSearchField } from "./SiteSearchField";

function renderCompanyItem(item: SearchResultCompanyItemAppState) {
  return (
    <ListItem key={item.companyId} disablePadding>
      <Card
        sx={{ minWidth: 275, display: "flex", width: 1 / 1, marginBottom: 1 }}
        variant='outlined'>
        {item.isSkeleton ? (
          <CardMedia>
            <Skeleton variant='rectangular' width={155} height={155} />
          </CardMedia>
        ) : (
          <CardMedia
            component={"img"}
            sx={{ width: 155, height: 155 }}
            image={item.image}
          />
        )}
        <Box>
          <CardContent>
            <Typography variant='caption' color='text.secondary' gutterBottom>
              {item.isSkeleton ? <Skeleton width={100} /> : item.homepageUrl}
            </Typography>

            <Typography variant='h6' sx={{ textTransform: "capitalize" }}>
              {item.isSkeleton ? <Skeleton width={200} /> : item.companyName}
            </Typography>
            <Typography variant='body2'>
              {item.isSkeleton ? (
                <Skeleton variant='rectangular' width={300} height={60} />
              ) : (
                item.description
              )}
            </Typography>
          </CardContent>
          {!item.isSkeleton && (
            <CardActions>
              <Button size='small' href={item.learnMoreLink}>
                Learn More
              </Button>
            </CardActions>
          )}
        </Box>
      </Card>
    </ListItem>
  );
}

type _Props = {
  searchResultAppState: SearchResultAppState;
  urlAppState: UrlAppState<SearchResultUrlType>;
};

type _State = {
  showFindCollaboratorDialog: boolean;
};

class _SearchResult extends React.PureComponent<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {
      showFindCollaboratorDialog: false,
    };
  }

  onFetchMore = () => {
    appStore.dispatch(new SearchResultAppEvent.LoadMoreCompanies());
  };

  override componentDidUpdate() {
    this.updateSearchResult();
  }

  override componentDidMount() {
    this.updateSearchResult();
  }

  updateSearchResult() {
    if (
      this.props.searchResultAppState.currentSearchText !==
        (this.props.urlAppState.search.q ?? "") ||
      this.props.searchResultAppState.loadingStatus ===
        SearchResultLoadingStatus.initial
    ) {
      appStore.dispatch(
        new SearchResultAppEvent.InitialLoad({
          isInitialLoad: true,
          searchText: this.props.urlAppState.search.q ?? "",
        })
      );
    }
  }

  get urlState() {
    return this.props.urlAppState.as<SearchResultUrlType>();
  }

  get currentSearchText() {
    return this.props.searchResultAppState.currentSearchText;
  }

  render() {
    return (
      <React.Fragment>
        <SiteAppBar />
        <Container maxWidth='lg'>
          <Box my={10}>
            <Center>
              <SiteSearchField
                initialSearchText={
                  this.props.urlAppState.as<SearchResultUrlType>().search.q
                }
              />
            </Center>
          </Box>
          <Column spacing={10}>
            {this.renderExactMatchedIdea()}
            {this.renderIdeas()}
            {this.renderStartups()}
            {this.renderCollaborators()}
            {this.renderDiscussions()}
          </Column>
          <Box sx={{ height: 100 }}></Box>
        </Container>
        {this.renderWriteButton()}
        {this.renderFindCollaboratorDialog()}
        <SitePostEditor />
      </React.Fragment>
    );
  }

  renderWriteButton() {
    return (
      <FloatingWriteButton>
        <ListItemButton component={Link}>
          <ListItemIcon>
            <TipsAndUpdatesOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary='Create an idea' />
        </ListItemButton>
        <ListItem>
          <ListItemText disableTypography>
            <Divider textAlign='left'>
              <Typography variant='subtitle2'>For this Idea</Typography>
            </Divider>
          </ListItemText>
        </ListItem>
        <ListItemButton component={Link}>
          <ListItemIcon>
            <QuestionAnswerOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary='Add a discussion' />
        </ListItemButton>
        <ListItemButton component={Link}>
          {/* <ListItemIcon>
      <SmsOutlinedIcon />
    </ListItemIcon> */}
          <ListItemText inset primary='Find collaborators' />
        </ListItemButton>
        <ListItemButton component={Link}>
          {/* <ListItemIcon>
      <DomainAddRoundedIcon />
    </ListItemIcon> */}
          <ListItemText inset primary='Create a startup' />
        </ListItemButton>
        <ListItemButton component={Link}>
          {/* <ListItemIcon>
      <DomainAddRoundedIcon />
    </ListItemIcon> */}
          <ListItemText inset primary='Create a project' />
        </ListItemButton>
      </FloatingWriteButton>
    );
  }

  renderStartups() {
    const state = this.props.searchResultAppState;
    const itemList = state.companiesList.toArray();
    return (
      <Column spacing={3}>
        <Box>
          <Typography variant='h2'>
            {this.currentSearchText
              ? "Startups based on this idea"
              : "Popular startups"}
          </Typography>
          {this.currentSearchText && (
            <Typography variant='subtitle1'>
              Displaying startups and projects that focus on "
              <i>{this.currentSearchText}</i>":
            </Typography>
          )}
        </Box>
        <Box mb={2}>
          <Chip
            component={Link}
            label='Create a Startup'
            clickable
            color='primary'
            href={buildRoutePath<CreateCompanyUrlType>(
              RoutePath.createCompany,
              {},
              {
                idea: this.currentSearchText,
                create: CreateCompanyPageTabIndex.createStartup,
              }
            )}
          />
        </Box>
        <List>
          {itemList.map(renderCompanyItem)}
          <ListItem>
            <Button
              startIcon={<KeyboardArrowDownIcon />}
              onClick={() => {
                appStore.dispatch(new SearchResultAppEvent.LoadMoreCompanies());
              }}>
              View More
            </Button>
          </ListItem>
        </List>
      </Column>
    );
  }

  renderExactMatchedIdea() {
    let exactMatch = this.props.searchResultAppState.exactMatchIdea;
    return (
      exactMatch && (
        <Column spacing={5}>
          <Box>
            <Typography variant='h2'>Exact Match</Typography>
            <Typography variant='subtitle1'>
              Displaying idea matching "<i>{this.currentSearchText}</i>":
            </Typography>
          </Box>
        </Column>
      )
    );
  }

  renderDiscussions() {
    return (
      <Column spacing={5}>
        <Box>
          <Typography variant='h2'>Community discussion</Typography>
          {this.currentSearchText && (
            <Typography variant='subtitle1'>
              Displaying community posts mentioning "
              <i>{this.currentSearchText}</i>":
            </Typography>
          )}
        </Box>
        <Box>
          <Chip
            component={Link}
            label='Add Discussion'
            clickable
            color='primary'
            href={buildRoutePath<TimelineUrlType>(
              RoutePath.timelinePublic,
              {},
              {}
            )}
          />
        </Box>
        <InfiniteScroll
          style={{ overflowY: "hidden" }}
          dataLength={this.props.searchResultAppState.communityPosts.length}
          next={() => {
            appStore.dispatch(
              new SearchResultAppEvent.LoadMoreCommunityPosts()
            );
          }}
          loader={false}
          hasMore={true}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }>
          <Grid container columns={{ xs: 1 }} spacing={{ xs: 1, md: 3 }}>
            {this.props.searchResultAppState.communityPosts
              .toArray()
              .map((x) => (
                <Grid item xs={1} key={x.key}>
                  <StandardPostCard smallLayout postData={x} />
                </Grid>
              ))}
          </Grid>
        </InfiniteScroll>
      </Column>
    );
  }

  renderCollaborators() {
    return (
      <Column spacing={5}>
        <Box>
          <Typography variant='h2'>People looking for collaborators</Typography>
          {this.currentSearchText && (
            <Typography variant='subtitle1'>
              Displaying people who are looking for partners to work together on
              "<i>{this.currentSearchText}</i>":
            </Typography>
          )}
        </Box>
        <Box>
          <Chip
            component={Link}
            label='Find Collaborators'
            clickable
            color='primary'
            onClick={() => {
              this.setState({
                showFindCollaboratorDialog: true,
              });
            }}
          />
        </Box>
        <Grid container columns={{ xs: 1, md: 3 }} spacing={{ xs: 1, md: 1 }}>
          {this.props.searchResultAppState.collaboratorPosts
            .toArray()
            .map((x) => (
              <Grid item xs={1} key={x.key}>
                <StandardPostCard smallLayout postData={x} />
              </Grid>
            ))}
        </Grid>
        <List>
          <ListItem>
            <Button
              startIcon={<KeyboardArrowDownIcon />}
              onClick={() => {
                appStore.dispatch(
                  new SearchResultAppEvent.LoadMoreCollaboratorPosts()
                );
              }}>
              View More
            </Button>
          </ListItem>
        </List>
      </Column>
    );
  }

  renderFindCollaboratorDialog() {
    return (
      <FindCollaboratorDialog
        open={this.state.showFindCollaboratorDialog}
        onClose={() => {
          this.setState({
            showFindCollaboratorDialog: false,
          });
        }}
        submitButtonText='Search'
        onSubmit={(attrs) => {
          let tags = [TagAppState.mega.findCollaborator.getTag()];
          if (attrs.idea) {
            tags.push(
              new TagAppState({
                type: TagType.idea,
                originalText: attrs.idea,
              }).getTag()
            );
          }
          if (attrs.city) {
            for (let term of attrs.city.terms) {
              tags.push(
                new TagAppState({
                  type: TagType.location,
                  originalText: term.value,
                }).getTag()
              );
            }
          }
          appStore.dispatch(
            new PushRouteAppEvent<TimelineUrlType>(
              RoutePath.timelinePublic,
              {},
              {
                filters: {
                  tags: tags,
                },
                findCollaborator: {
                  idea: attrs.idea,
                  city: attrs.city ?? undefined,
                },
              }
            )
          );
        }}
      />
    );
  }

  renderIdeas() {
    let ideas = this.props.searchResultAppState.relatedIdeasList.toArray();
    return (
      <Column spacing={5}>
        <Box>
          <Typography variant='h2'>
            {this.currentSearchText ? "Related ideas" : "Popular ideas"}
          </Typography>
          {this.currentSearchText && (
            <Typography variant='subtitle1'>
              Displaying ideas similar to "<i>{this.currentSearchText}</i>":
            </Typography>
          )}
        </Box>
        <Box>
          <Chip
            component={Link}
            label='Create an Idea'
            clickable
            color='primary'
            href={buildRoutePath<CreateCompanyUrlType>(
              RoutePath.createCompany,
              {},
              {
                idea: this.currentSearchText,
                create: CreateCompanyPageTabIndex.onlyIdea,
              }
            )}
          />
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell align='left'>
                  {this.currentSearchText ? "Related ideas" : "Ideas"}
                </TableCell>
                <TableCell align='right'>
                  Do you think it's a good idea?
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ideas.map((row, index) => (
                <TableRow
                  key={row.key}
                  id={row.key}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component='th' scope='row' width={50}>
                    {row.isSkeleton ? (
                      <Skeleton
                        variant='circular'
                        sx={{ height: 12, width: 12 }}
                      />
                    ) : (
                      index + 1
                    )}
                  </TableCell>
                  <TableCell align='left'>
                    {row.isSkeleton ? (
                      <Skeleton variant='text' />
                    ) : (
                      <Link
                        color={
                          this.currentSearchText === row.text
                            ? "secondary"
                            : "primary"
                        }
                        href={buildRoutePath<SearchResultUrlType>(
                          RoutePath.searchResult,
                          {},
                          { q: row.text }
                        )}>
                        {row.text}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell align='right'>
                    <Row alignRight>
                      {row.isSkeleton ? (
                        <Skeleton variant='text' sx={{ width: 100 }} />
                      ) : (
                        <StandardLikeButton
                          likeCount={row.likes}
                          dislikeCount={row.dislikes}
                          liked={row.userLiked}
                          disliked={row.userDisliked}
                          onLike={() => {
                            console.log("liked");
                          }}
                          onDislike={() => {
                            console.log("disliked");
                          }}
                          onUnLike={() => {
                            console.log("unliked");
                          }}
                          onUnDislike={() => {
                            console.log("undisliked");
                          }}
                        />
                      )}
                    </Row>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Column>
    );
  }
}

export const SearchResult = connect<_Props, {}, {}, RootAppState>((state) => ({
  searchResultAppState: state.searchResult,
  urlAppState: state.url.as<SearchResultUrlType>(),
}))(_SearchResult);
