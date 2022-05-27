import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { values } from "lodash";
import React from "react";
import { connect } from "react-redux";
import {
  EditCompanyPeopleInitialLoadAppEvent,
  EditCompanyPeopleRemoveUserAppEvent,
} from "../events/EditCompanyPeopleAppEvent";
import { Column } from "../layouts/Column";
import { Row } from "../layouts/Row";
import {
  AcceptCompanyInvitationUrlType,
  buildRoutePath,
  EditCompanyUrlType,
  RoutePath,
} from "../route-config";
import { uuid4 } from "../simple-redux";
import {
  CompanyPermissionRole,
  EditCompanyPeopleAppState,
  EditCompanyPeopleLoadingStatus,
  EditCompnayPeoplePersonAppState,
} from "../states/EditCompanyPeopleAppState";
import { RootAppState } from "../states/RootAppState";
import { UrlAppState } from "../states/UrlAppState";
import { appStore } from "../store-config";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { StandardActionButton } from "../stateless-components/StandardActionButton";

type _Props = {
  urlAppState: UrlAppState<EditCompanyUrlType>;
  editCompanyPeopleAppState: EditCompanyPeopleAppState;
};
type _State = {
  moreMenuAnchorEl: HTMLElement | null;
  menuTargetPerson: EditCompnayPeoplePersonAppState | null;
};

class _EditCompanyPeople extends React.PureComponent<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {
      moreMenuAnchorEl: null,
      menuTargetPerson: null,
    };
  }

  get urlAppState() {
    return this.props.urlAppState.as<EditCompanyUrlType>();
  }

  isSaving() {
    return (
      this.props.editCompanyPeopleAppState.loadingStatus ===
      EditCompanyPeopleLoadingStatus.saving
    );
  }

  onSaveClicked = () => {};

  componentDidMount() {
    appStore.dispatch(new EditCompanyPeopleInitialLoadAppEvent());
  }

  onCloseMenu = () => {
    this.setState({
      moreMenuAnchorEl: null,
      menuTargetPerson: null,
    });
  };

  renderMenu() {
    return (
      this.state.menuTargetPerson &&
      this.state.moreMenuAnchorEl && (
        <Menu
          elevation={1}
          anchorEl={this.state.moreMenuAnchorEl}
          open={this.state.moreMenuAnchorEl !== null}
          onClose={this.onCloseMenu}>
          <MenuItem
            onClick={() => {
              appStore.dispatch(
                new EditCompanyPeopleRemoveUserAppEvent({
                  userId: this.state.menuTargetPerson!.id,
                })
              );
              this.onCloseMenu();
            }}
            dense>
            <ListItemIcon>
              <DeleteRoundedIcon color='error' />
            </ListItemIcon>
            <ListItemText>
              <Typography color='error'>
                Remove "{this.state.menuTargetPerson!.name}" from this company
              </Typography>
            </ListItemText>
          </MenuItem>
        </Menu>
      )
    );
  }

  renderPeopleList() {
    return (
      <Column spacing={1}>
        <Typography variant='h6'>People</Typography>
        <List>
          {this.props.editCompanyPeopleAppState.companyPeople
            .toArray()
            .map((person) => (
              <ListItem key={person.id}>
                <ListItemAvatar>
                  <Avatar component={Link} href='#' src={person.avatar} />
                </ListItemAvatar>
                <ListItemText
                  sx={{ maxWidth: 200 }}
                  primary={person.name}
                  secondary={person.title}
                />
                <Box width={10}></Box>
                <RoleSelector
                  defaultRole={person.permissionRole}
                  onChange={(role: CompanyPermissionRole) => {}}
                />
                <Box width={10}></Box>
                <TextField
                  label='Title'
                  defaultValue={person.title}
                  placeholder='eg. Founder, or Manager'></TextField>

                <Box width={10}></Box>
                <ListItemIcon>
                  <IconButton
                    onClick={(e) => {
                      this.setState({
                        moreMenuAnchorEl: e.target as HTMLElement,
                        menuTargetPerson: person,
                      });
                    }}>
                    <MoreHorizIcon />
                  </IconButton>
                </ListItemIcon>
                <ListItemButton>
                  {person.isSaving && <CircularProgress size={25} />}
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Column>
    );
  }

  render(): React.ReactNode {
    return (
      <Paper sx={{ padding: 5 }}>
        <Column spacing={5}>
          <Column spacing={2}>
            <Typography variant='h6'>Invite People</Typography>
            <_RenderInvitationSection urlAppState={this.props.urlAppState} />
          </Column>
          {this.renderPeopleList()}
          <Column spacing={2}>
            <Typography variant='caption'>
              {"* Changes are automatically saved."}
            </Typography>
            <Row>
              <StandardActionButton
                onClick={this.onSaveClicked}
                isSaving={this.isSaving()}>
                Update
              </StandardActionButton>
            </Row>
          </Column>
          {this.renderMenu()}
        </Column>
      </Paper>
      // <Accordion sx={{ width: 1 / 1 }}>
      //   <AccordionSummary
      //     sx={{
      //       pointerEvents: "none",
      //     }}
      //     aria-controls='panel1a-content'
      //     id='panel1a-header'>
      //     <Row vertiCenter spacing={2}>
      //       Add People
      //     </Row>
      //   </AccordionSummary>
      //   <AccordionDetails>
      //     <Box mx={5} mb={3}></Box>
      //   </AccordionDetails>
      // </Accordion>
    );
  }
}

function RoleSelector(props: {
  defaultRole: CompanyPermissionRole;
  onChange: (role: CompanyPermissionRole) => void;
}) {
  return (
    <FormControl sx={{ width: 150 }}>
      <InputLabel>Role</InputLabel>
      <Select<CompanyPermissionRole>
        defaultValue={props.defaultRole}
        label='Role'
        onChange={(e) =>
          props.onChange(e.target.value as CompanyPermissionRole)
        }>
        <MenuItem value={CompanyPermissionRole.member}>Member</MenuItem>
        <MenuItem value={CompanyPermissionRole.admin}>Admin</MenuItem>
      </Select>
    </FormControl>
  );
}

type _RenderInvitationSectionProps = {
  urlAppState: UrlAppState<EditCompanyUrlType>;
};
type _RenderInvitationSectionState = {
  invitationLink: string;
  role: CompanyPermissionRole;
  showCopiedText: boolean;
};
class _RenderInvitationSection extends React.Component<
  _RenderInvitationSectionProps,
  _RenderInvitationSectionState
> {
  constructor(props: _RenderInvitationSectionProps) {
    super(props);
    this.state = {
      invitationLink: this.generateLink(CompanyPermissionRole.member),
      role: CompanyPermissionRole.member,
      showCopiedText: false,
    };
  }

  generateLink(role: CompanyPermissionRole): string {
    return buildRoutePath<AcceptCompanyInvitationUrlType>(
      RoutePath.acceptCompanyInvitation,
      {
        slug: this.props.urlAppState.params.slug,
        token: uuid4(),
      },
      {}
    );
  }

  render(): React.ReactNode {
    return (
      <Row spacing={1}>
        <RoleSelector
          defaultRole={CompanyPermissionRole.member}
          onChange={(role) => {
            this.setState({
              role: role,
            });
          }}
        />
        <ClickAwayListener
          onClickAway={() => {
            this.setState({
              showCopiedText: false,
            });
          }}>
          <Tooltip
            PopperProps={{
              disablePortal: true,
            }}
            placement='top-end'
            open={this.state.showCopiedText}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={`Copied! (${this.state.role})`}>
            <OutlinedInput
              value={this.state.invitationLink}
              disabled
              endAdornment={
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(this.state.invitationLink);
                    this.setState({
                      showCopiedText: true,
                    });
                  }}>
                  Copy
                </Button>
              }
            />
          </Tooltip>
        </ClickAwayListener>
      </Row>
    );
  }
}

export const EditCompanyPeoplePage = connect<_Props, {}, {}, RootAppState>(
  (state) => {
    return {
      urlAppState: state.url.as<EditCompanyUrlType>(),
      editCompanyPeopleAppState: state.editCompany.editPeople,
    };
  }
)(_EditCompanyPeople);
