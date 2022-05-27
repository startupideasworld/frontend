import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button, { ButtonProps } from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import AdbIcon from "@mui/icons-material/Adb";
import { SignInBox } from "../stateless-components/SignInBox";
import { Row } from "../layouts/Row";
import EditIcon from "@mui/icons-material/Edit";
import {
  Divider,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  buildRoutePath,
  TimelineListUrlType,
  RoutePath,
  SearchResultUrlType,
  TimelineUrlType,
  MyAccountUrlType,
} from "../route-config";
import {
  AttachMoneyIcon,
  HomeIcon,
  TipsAndUpdatesIcon,
} from "../stateless-components/icons-collection";
import { connect } from "react-redux";
import { RootAppState } from "../states/RootAppState";
import { SessionAppState } from "../states/SessionAppState";
import { appStore } from "../store-config";
import {
  SessionLoginAppEvent,
  SessionLogoutAppEvent,
} from "../events/SessionAppEvent";
import { PushRouteAppEvent } from "../events/PushRouteAppEvent";

type _Props = {
  children?: React.ReactNode;
  sessionAppState: SessionAppState;
};
type _State = {
  anchorElNav: null | any;
  anchorElUser: null | any;
};

export function SiteAppBarButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      sx={{
        color: "white",
        display: "flex",
        textTransform: "none",
        flexShrink: 0,
        ":hover": {
          backgroundColor: "primary.light",
        },
      }}>
      <Typography noWrap variant='body1'>
        {props.children}
      </Typography>
    </Button>
  );
}

class _SiteAppBar extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = { anchorElNav: null, anchorElUser: null };
  }

  handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      anchorElNav: event.currentTarget,
    });
  };

  handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      anchorElUser: event.currentTarget,
    });
  };

  handleCloseNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      anchorElNav: null,
    });
  };

  handleCloseUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      anchorElUser: null,
    });
  };

  render() {
    return (
      <AppBar position='static'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant='h6'
              noWrap
              component={Link}
              href='/'
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                flexShrink: 0,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}>
              Startup ideas
            </Typography>
            <Box pl={5}></Box>
            <Row spacing={3}>
              <SiteAppBarButton
                startIcon={<TipsAndUpdatesIcon />}
                href={buildRoutePath<SearchResultUrlType>(
                  RoutePath.searchResult,
                  {},
                  { q: "" }
                )}>
                Ideas
              </SiteAppBarButton>
              <SiteAppBarButton
                startIcon={<HomeIcon />}
                href={buildRoutePath<TimelineUrlType>(
                  RoutePath.timelinePublic,
                  {},
                  {}
                )}>
                Community
              </SiteAppBarButton>
              {/* <SiteAppBarButton
                startIcon={<AttachMoneyIcon />}
                href={buildRoutePath<SearchResultUrlType>(
                  RoutePath.searchResult,
                  {},
                  { q: "" }
                )}>
                Issues
              </SiteAppBarButton> */}
            </Row>

            {/* <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={this.handleOpenNavMenu}
                color='inherit'>
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={this.state.anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(this.state.anchorElNav)}
                onClose={this.handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}>
                {pages.map((page) => (
                  <MenuItem key={page} onClick={this.handleCloseNavMenu}>
                    <Typography textAlign='center'>{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box> */}
            {/* <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} /> */}
            {/* <Typography
              variant='h5'
              noWrap
              component={Link}
              href=''
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}>
              LOGO
            </Typography> */}
            {/* <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={this.handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}>
                  {page}
                </Button>
              ))}
            </Box> */}
            {/* <Typography
              variant='h5'
              noWrap
              component={Link}
              href=''
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}>
              LOGO
            </Typography> */}
            <Box sx={{ flexGrow: 1 }}></Box>
            <Row spacing={1} alignRight mr={3}>
              {this.props.children}
            </Row>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title='Open settings'>
                <IconButton onClick={this.handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={this.props.sessionAppState.user?.name}
                    src={this.props.sessionAppState.user?.avatar}
                  />
                </IconButton>
              </Tooltip>
              {this.props.sessionAppState.user && (
                <Menu
                  sx={{ mt: 5 }}
                  id='menu-appbar'
                  anchorEl={this.state.anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(this.state.anchorElUser)}
                  onClose={this.handleCloseUserMenu}>
                  <List>
                    <ListItemButton
                      component={Link}
                      href={RoutePath.createPost}>
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <ListItemText primary='Share Your Story' />
                    </ListItemButton>
                  </List>
                  <Divider />
                  <List>
                    {/* <ListItemButton onClick={this.handleCloseUserMenu}>
                      <ListItemText primary='Home' />
                    </ListItemButton> */}
                    <ListItemButton
                      onClick={(e) => {
                        appStore.dispatch(
                          new PushRouteAppEvent<MyAccountUrlType>(
                            RoutePath.myAccount,
                            {},
                            {}
                          )
                        );
                        this.handleCloseUserMenu(e);
                      }}>
                      <ListItemText primary='Account' />
                    </ListItemButton>
                    <ListItemButton
                      onClick={(e) => {
                        this.handleCloseUserMenu(e);
                        appStore.dispatch(new SessionLogoutAppEvent());
                      }}>
                      <ListItemText primary='Logout' />
                    </ListItemButton>
                  </List>
                  {/* <SignInBox /> */}
                </Menu>
              )}
              {this.props.sessionAppState.user === null && (
                <Menu
                  open={this.state.anchorElUser !== null}
                  anchorEl={this.state.anchorElUser}
                  onClose={this.handleCloseUserMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}>
                  <SignInBox
                    isProcessing={false}
                    onSignin={(e) => {
                      this.handleCloseUserMenu(e);
                      appStore.dispatch(new SessionLoginAppEvent());
                    }}
                  />
                </Menu>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }
}

export const SiteAppBar = connect((state: RootAppState) => ({
  sessionAppState: state.session,
}))(_SiteAppBar);
