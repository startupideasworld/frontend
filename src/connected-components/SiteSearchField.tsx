import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Button,
  Chip,
  createFilterOptions,
  Divider,
  Link,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { appStore } from "../store-config";
import { PushRouteAppEvent } from "../events/PushRouteAppEvent";
import {
  buildRoutePath,
  CreateCompanyUrlType,
  RoutePath,
  SearchResultUrlType,
} from "../route-config";
import { Row } from "../layouts/Row";
import { StandardSearchField } from "../stateless-components/StandardSearchField";
import { Column } from "../layouts/Column";
import { StandardLikeButton } from "../stateless-components/StandardLikeButton";
import { SearchIcon } from "../stateless-components/icons-collection";
import { CreateCompanyPageTabIndex } from "./CreateCompanyPage";
import { IdeaCard } from "../stateless-components/IdeaCard";
import { connect } from "react-redux";
import { RootAppState } from "../states/RootAppState";
import { SiteSearchFieldAppState } from "../states/SiteSearchField";
import { SessionAppState } from "../states/SessionAppState";
import { SiteSearchFieldAppEvent } from "../events/SiteSearchFieldAppEvent";

type _StateProps = {
  siteSearchFieldAppState: SiteSearchFieldAppState;
  sessionAppState: SessionAppState;
};
type _OwnProps = {
  initialSearchText?: string;
};
type _Props = _StateProps & _OwnProps;
type _State = {
  openDropdown: boolean;
};

enum OptionType {
  createButton,
  autoComplete,
  randomRater,
}
type Option = {
  type: OptionType;
  text?: string;
  key: string;
};

class _SiteSearchField extends React.PureComponent<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = { openDropdown: false };
  }

  inputRef = React.createRef<HTMLInputElement>();

  get currentText(): string | undefined {
    console.log(this.inputRef.current);
    return this.inputRef.current?.value;
  }

  componentDidMount() {
    appStore.dispatch(new SiteSearchFieldAppEvent.LoadInitialContent());
  }

  onSearch = () => {};

  render() {
    const filter = createFilterOptions<Option>();
    return (
      <Row spacing={1} vertiCenter sx={{ height: 50 }}>
        <Autocomplete<Option, boolean, boolean, boolean>
          sx={{ width: 1 / 1 }}
          options={[]}
          onOpen={() => {
            this.setState({ openDropdown: true });
          }}
          onClose={() => {
            this.setState({ openDropdown: false });
          }}
          open={this.state.openDropdown}
          renderOption={(props, option) => {
            switch (option.type) {
              case OptionType.createButton:
                return (
                  <Row py={1} px={2} key={option.key}>
                    {/* <Chip
                      component={Link}
                      label='Create an Idea'
                      clickable
                      href={buildRoutePath<CreateCompanyUrlType>(
                        RoutePath.createCompany,
                        {},
                        { idea: this.state.searchText }
                      )}
                    /> */}
                    <Button
                      sx={{ textTransform: "none", bgcolor: "info" }}
                      onClick={() => {
                        appStore.dispatch(
                          new PushRouteAppEvent<CreateCompanyUrlType>(
                            RoutePath.createCompany,
                            {},
                            {
                              idea: this.currentText ?? "",
                              create: CreateCompanyPageTabIndex.onlyIdea,
                            }
                          )
                        );
                      }}>
                      Create an Idea
                    </Button>
                  </Row>
                );
              case OptionType.autoComplete:
                return (
                  <ListItem {...props} key={option.key}>
                    {option.text}
                  </ListItem>
                );
              case OptionType.randomRater:
                return (
                  this.props.siteSearchFieldAppState.randomIdea && (
                    <Row key={option.key}>
                      <IdeaCard
                        ideaData={this.props.siteSearchFieldAppState.randomIdea.asTagData()}
                        elevation={2}
                        sx={{ margin: 2 }}
                        onClick={() => {
                          this.setState({ openDropdown: false });
                          appStore.dispatch(
                            new PushRouteAppEvent<SearchResultUrlType>(
                              RoutePath.searchResult,
                              {},
                              {
                                q: this.props.siteSearchFieldAppState.randomIdea?.getLinkText(),
                              }
                            )
                          );
                        }}
                      />
                    </Row>
                  )
                ); //this.renderRandomIdeaRater(option);
            }
          }}
          filterOptions={(options, params) => {
            let filtered = filter(options, params);
            if (options.length == 0 && !this.currentText) {
              filtered = filtered.concat({
                type: OptionType.randomRater,
                key: "-1",
              });
            }
            filtered = filtered.concat({
              type: OptionType.createButton,
              key: "-2",
            });
            return filtered;
          }}
          getOptionLabel={(option) => {
            if (typeof option === "string") {
              return option;
            }
            return option.text ?? "";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              this.onSearch();
            }
          }}
          freeSolo
          fullWidth
          // value={{ type: OptionType.autoComplete, text: this.currentText }}
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField
              {...params}
              inputRef={this.inputRef}
              placeholder='Describe your startup idea in 7 words.'
              InputProps={{
                ...params.InputProps,
                startAdornment: <SearchIcon color='action' />,
                sx: {
                  borderRadius: 2,
                  boxShadow: 1,
                  bgcolor: "white",
                  "&:hover fieldset.MuiOutlinedInput-notchedOutline": {
                    borderColor: "grey.200",
                  },
                  "& fieldset.MuiOutlinedInput-notchedOutline": {
                    borderColor: "grey.200",
                  },
                  "&.Mui-focused fieldset.MuiOutlinedInput-notchedOutline": {
                    borderColor: "grey.200",
                  },
                },
              }}
            />
          )}
        />
        <Button
          sx={{ height: "100%" }}
          variant='contained'
          onClick={this.onSearch}>
          Search
        </Button>
      </Row>
    );
  }
}

export const SiteSearchField = connect<
  _StateProps,
  {},
  _OwnProps,
  RootAppState
>((state) => {
  return {
    siteSearchFieldAppState: state.siteSearchField,
    sessionAppState: state.session,
  };
})(_SiteSearchField);
