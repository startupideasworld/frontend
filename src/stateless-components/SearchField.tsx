import {
  Autocomplete,
  createFilterOptions,
  IconButton,
  InputAdornment,
  ListItem,
  TextField,
  TextFieldProps,
} from "@mui/material";
import React from "react";
import { SearchIcon } from "./icons-collection";

type PeopleSearchFieldProps = {
  placeholder?: string;
};
type _State = {
  searchText: string;
};

type OptionType = {
  text: string;
};

export class SearchField extends React.Component<
  PeopleSearchFieldProps,
  _State
> {
  constructor(public props: PeopleSearchFieldProps) {
    super(props);
    this.state = { searchText: "" };
  }

  render() {
    let filter = createFilterOptions<OptionType>();
    return (
      <Autocomplete
        options={[{ text: "1" }]}
        renderOption={(props, option) => {
          return (
            <ListItem {...props} key={option.text}>
              {option.text}
            </ListItem>
          );
        }}
        filterOptions={(options, params) => {
          let filtered = filter(options, params);
          filtered = filtered.concat({ text: "" });
          return filtered;
        }}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          }
          return option.text;
        }}
        value={{ text: this.state.searchText }}
        renderInput={(renderInputParams) => (
          <TextField
            placeholder={this.props.placeholder ?? "Search"}
            InputProps={{
              ...renderInputParams.InputProps,
              startAdornment: (
                <InputAdornment position='end'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            inputProps={renderInputParams.inputProps}
            sx={{ width: 300 }}
          />
        )}
      />
    );
  }
}
