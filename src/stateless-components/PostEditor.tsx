import Search from "@mui/icons-material/Search";
import {
  Card,
  Container,
  CardHeader,
  Avatar,
  ListItemText,
  ListItem,
  ListItemAvatar,
  CardContent,
  CardActions,
  Button,
  IconButton,
  DialogContent,
  DialogActions,
  Dialog,
  DialogTitle,
  Tooltip,
  Typography,
  Chip,
  Grid,
  Menu,
  MenuItem,
  InputAdornment,
  ListItemButton,
  ListItemIcon,
  List,
  Zoom,
  CardActionArea,
  Box,
  CardHeaderProps,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { AutocompleteDropdown } from "../connected-components/AutocompleteDropdown";
import { PushRouteAppEvent } from "../events/PushRouteAppEvent";
import { Column } from "../layouts/Column";
import { Row } from "../layouts/Row";
import { TimelinePostUrlType, RoutePath } from "../route-config";
import { Random } from "../states/random-generation";
import { convertStringToHashTag } from "../states/TimelineAppState";
import { TimelinePostAppState } from "../states/TimelinePostAppState";
import { appStore } from "../store-config";
import { PostShortSummaryData } from "../types/min-combinators";
import { DropdownAddressSelector } from "./DropdownAddressSelector";
import {
  FindCollaboratorDialog,
  FindCollaboratorProps,
} from "./FindCollaboratorDialog";
import { AddressPrediction } from "./google-map";
import {
  ClearRoundedIcon,
  EditLocationAltRoundedIcon,
  EditLocationOutlinedIcon,
  FormatQuoteRoundedIcon,
  RepeatOneRoundedIcon,
  SearchIcon,
  SwapCallsRoundedIcon,
  WorkspacesOutlinedIcon,
} from "./icons-collection";
import { SearchField } from "./SearchField";
import { StandardAddressSelector } from "./StandardAddressSelector";
import { StandardEditor } from "./StandardEditor";
export type PostEditorPropsContext = {
  prefilledLocation?: AddressPrediction;
  prefilledIdea?: string;
};
export type PostEditorProps = {
  initialText?: string;
  author: { name: string; avatar: string; profession: string };
  findCollaboratorDialogProps?: FindCollaboratorProps;
  context?: PostEditorPropsContext;
  defaultRepost?: PostShortSummaryData;
  defaultQuote?: PostShortSummaryData;
  cardHeaderProps?: CardHeaderProps;
  autoFocus?: boolean;
};
type _State = {
  // openLocationDialog: boolean;
  openAddLocationDropdown: boolean;
  openCollaboratorDialog: boolean;
  // selectedAddress?: string;
  currentText: string;
  repost: PostShortSummaryData | undefined;
  quote: PostShortSummaryData | undefined;
  showQuote: boolean;
  showRepost: boolean;
};

export class PostEditor extends React.Component<PostEditorProps, _State> {
  constructor(props: PostEditorProps) {
    super(props);
    this.state = {
      // openLocationDialog: false,
      openCollaboratorDialog: false,
      openAddLocationDropdown: false,
      currentText: props.initialText ?? "",
      repost: props.defaultRepost,
      quote: props.defaultQuote,
      showQuote: true,
      showRepost: true,
    };
  }

  editorRef = React.createRef<StandardEditor>();
  addLocationButtonRef = React.createRef<HTMLButtonElement>();

  render(): React.ReactNode {
    return (
      <Card elevation={1}>
        <Container sx={{ backgroundColor: "white", py: 2 }}>
          <CardHeader
            {...this.props.cardHeaderProps}
            avatar={
              <Avatar
                src={this.props.author.avatar}
                sx={{ height: 50, width: 50, mr: 2 }}
              />
            }
            title={
              <ListItemText
                primary={this.props.author.name}
                secondary={this.props.author.profession}
              />
            }>
            <ListItem disablePadding>
              <ListItemAvatar>
                <Avatar
                  src={this.props.author.avatar}
                  sx={{ height: 50, width: 50, mr: 2 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={this.props.author.name}
                secondary={this.props.author.profession}
              />
            </ListItem>
          </CardHeader>
          {this.renderEditor()}
          {this.renderRepostAndQuote()}
          <CardContent>{this.renderParsedTags()}</CardContent>
          <CardActions>{this.renderButtons()}</CardActions>
        </Container>
        {/* {this.renderAddLocationDialog()} */}
        {this.renderFindCollaboratorsDialog()}
        {this.renderAddLocationMenu()}
      </Card>
    );
  }

  renderRepostContent(repost: PostShortSummaryData) {
    return (
      <React.Fragment>
        <CardContent>
          <Container maxWidth='md'>
            <Card sx={{ bgcolor: "grey.200" }}>
              <CardHeader
                avatar={<Avatar src={repost.author.avatar} />}
                title={
                  <Row spacing={1} vertiCenter>
                    <Typography color='secondary' variant='caption'>
                      OP
                    </Typography>
                    <Typography variant='subtitle1'>
                      {repost.author.name}
                    </Typography>
                  </Row>
                }
                subheader={
                  <Column spacing={0}>
                    <Typography variant='caption'>
                      {repost.author.profession}
                    </Typography>
                    <Typography variant='caption'>
                      {formatDistanceToNow(repost.timestamp, {
                        addSuffix: true,
                      })}
                    </Typography>
                  </Column>
                }
              />
              <CardContent>
                <Typography variant='body2'>{repost.summary}</Typography>
              </CardContent>
            </Card>
          </Container>
        </CardContent>
      </React.Fragment>
    );
  }

  renderQuote(quote: PostShortSummaryData) {
    return (
      <Zoom
        in={this.state.showQuote}
        onExited={(el) => {
          this.setState({
            quote: undefined,
          });
        }}
        appear={false}>
        <Box>
          <CardContent>
            <Row vertiCenter spacing={1} mb={2}>
              <RepeatOneRoundedIcon
                fontSize='small'
                sx={{ color: "secondary.light" }}
              />
              <Typography variant='caption' color='secondary.light'>
                Quoting the comment
              </Typography>
            </Row>
            <List disablePadding>
              <ListItem
                secondaryAction={
                  <IconButton
                    onClick={() => {
                      this.setState({
                        showQuote: false,
                      });
                    }}
                    edge='start'>
                    <ClearRoundedIcon />
                  </IconButton>
                }
                sx={{
                  bgcolor: "grey.200",
                  alignItems: "start",
                  borderRadius: 2,
                }}>
                <ListItemIcon>
                  <FormatQuoteRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Row spacing={1} vertiCenter>
                      <Typography variant='body2'>
                        @{quote.author.name}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        &#x2022;{" "}
                        {formatDistanceToNow(quote.timestamp, {
                          addSuffix: true,
                        })}
                      </Typography>
                      {/* <Avatar src={quote.author.avatar} sx={{ width: 24, height: 24 }} /> */}
                    </Row>
                  }
                  secondary={quote.summary}
                />
              </ListItem>
            </List>
          </CardContent>
        </Box>
      </Zoom>
    );
  }

  renderRepostAndQuote() {
    return (
      (this.state.repost || this.state.quote) && (
        <Zoom
          appear={false}
          in={this.state.showRepost}
          onExited={() => {
            this.setState({
              repost: undefined,
              quote: undefined,
            });
          }}>
          <CardContent>
            <Card variant='outlined' sx={{ bgcolor: "white", borderRadius: 2 }}>
              <CardActionArea disableRipple>
                <CardHeader
                  sx={{ pb: 0 }}
                  title={
                    <Row vertiCenter spacing={1}>
                      <SwapCallsRoundedIcon
                        fontSize='small'
                        sx={{ color: "secondary.light" }}
                      />
                      <Typography variant='caption' color='secondary.light'>
                        Spread in the Community
                      </Typography>
                    </Row>
                  }
                  action={
                    <IconButton
                      onClick={() => {
                        this.setState({
                          showRepost: false,
                        });
                      }}
                      edge='start'>
                      <ClearRoundedIcon />
                    </IconButton>
                  }></CardHeader>
                {this.state.repost &&
                  this.renderRepostContent(this.state.repost)}
                {this.state.quote && this.renderQuote(this.state.quote)}
              </CardActionArea>
            </Card>
          </CardContent>
        </Zoom>
      )
    );
  }

  renderEditor() {
    return (
      <CardContent>
        <StandardEditor
          ref={this.editorRef}
          value={this.props.initialText}
          placeholder="What's on your mind?"
          minRows={10}
          sx={{ bgcolor: "grey.100", borderRadius: 2 }}
          onChange={(value) => {
            console.log("value()", value());
            this.setState({ currentText: value() });
          }}
          editorProps={{
            autoFocus: this.props.autoFocus ?? false,
          }}
          mentionsOptions={[
            {
              attrs: {
                text: "@" + Random.hashTag(),
                value: Random.hashTag(),
              },
              display: {
                avatar: Random.avatar(),
                name: "@" + Random.hashTag(),
              },
            },
            {
              attrs: {
                text: "#" + Random.hashTag(),
                value: Random.hashTag(),
              },
              display: {
                avatar: Random.avatar(),
                name: "#" + Random.hashTag(),
              },
            },
            {
              attrs: {
                text: "#" + Random.hashTag(),
                value: Random.hashTag(),
              },
              display: {
                avatar: Random.avatar(),
                name: "#" + Random.hashTag(),
              },
            },
          ]}
        />
      </CardContent>
    );
  }

  renderButtons() {
    return (
      <Row ml={1} spacing={2}>
        <Button variant='contained'>Publish</Button>
        <Tooltip title='Add Location'>
          <IconButton
            ref={this.addLocationButtonRef}
            onClick={() => {
              this.setState({
                openAddLocationDropdown: true,
              });
            }}>
            <EditLocationOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Find Collaborator'>
          <IconButton
            onClick={() => {
              this.setState({
                openCollaboratorDialog: true,
              });
            }}>
            <WorkspacesOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Row>
    );
  }

  renderFindCollaboratorsDialog() {
    return (
      <FindCollaboratorDialog
        {...this.props.findCollaboratorDialogProps}
        open={this.state.openCollaboratorDialog}
        subtitle='Add hashtag to your post to let people know that you are looking for collaborators.'
        submitButtonText='Confirm'
        onSubmit={(attrs) => {
          this.props.findCollaboratorDialogProps?.onSubmit(attrs);
        }}
        onClose={() => {
          this.setState({
            openCollaboratorDialog: false,
          });
          this.props.findCollaboratorDialogProps?.onClose?.();
        }}
        prefilledIdea={this.props.context?.prefilledIdea}
        prefilledCity={this.props.context?.prefilledLocation}
      />
    );
  }

  getParsedTags(text: string): string[] {
    let regex = /\[(#\w+)\]\(mention:\/\/\w+\)/;
    let str: string[] = [];
    for (let phrase of text.split(/\s/)) {
      let m = phrase.match(regex);
      if (m) {
        let [entireMatch, captureGroup1] = m;
        str.push(captureGroup1);
      }
    }
    return str;
  }

  renderParsedTags() {
    return (
      <Grid container spacing={2}>
        {this.getParsedTags(this.state.currentText).map((x, index) => (
          <Grid item key={index}>
            <Chip label={x} />
          </Grid>
        ))}
      </Grid>
    );
  }

  renderAddLocationMenu() {
    return (
      <DropdownAddressSelector
        limit={["(cities)"]}
        menuProps={{
          anchorEl: this.addLocationButtonRef.current,
          open: this.state.openAddLocationDropdown,
          onClose: () => {
            this.setState({
              openAddLocationDropdown: false,
            });
          },
        }}
        textfieldProps={{
          placeholder: "Tag a city / country",
          autoComplete: "off",
          autoFocus: true,
          InputProps: {
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
        renderOption={(option, index: number) => (
          <ListItem key={index}>
            <ListItemButton
              onClick={() => {
                this.setState({
                  openAddLocationDropdown: false,
                });
                let hash = convertStringToHashTag(option.description);
                this.editorRef.current?.insertMention({
                  text: "#" + hash,
                  value: hash,
                });
              }}>
              <ListItemText secondary={option.description}></ListItemText>
            </ListItemButton>
          </ListItem>
        )}
      />
    );
  }

  // renderAddLocationDialog() {
  //   return (
  //     <Dialog
  //       open={this.state.openLocationDialog}
  //       onClose={this.closeLocationDialog}
  //       aria-labelledby='alert-dialog-title'
  //       aria-describedby='alert-dialog-description'>
  //       <DialogContent>
  //         <StandardAddressSelector
  //           limit={["(regions)"]}
  //           autoFocus
  //           placeholder='City, Country'
  //           label='Add a Location'
  //           onChange={(address) => {
  //             console.log(address);
  //             this.setState({
  //               selectedAddress: address,
  //             });
  //           }}
  //           textfieldProps={{ margin: "dense", sx: { width: 300 } }}
  //         />
  //       </DialogContent>
  //       <DialogActions>
  //         <Button
  //           onClick={() => {
  //             this.setState({
  //               selectedAddress: undefined,
  //               openLocationDialog: false,
  //             });
  //           }}>
  //           Cancel
  //         </Button>
  //         <Button
  //           onClick={() => {
  //             if (this.state.selectedAddress) {
  //               this.setState({
  //                 currentText:
  //                   this.state.currentText + this.state.selectedAddress,
  //                 selectedAddress: undefined,
  //                 openLocationDialog: false,
  //               });
  //               let hash = convertStringToHashTag(this.state.selectedAddress);
  //               this.editorRef.current?.insertMention({
  //                 text: "#" + hash,
  //                 value: hash,
  //               });
  //             }
  //           }}>
  //           Confirm
  //         </Button>
  //       </DialogActions>
  //     </Dialog>
  //   );
  // }
}
