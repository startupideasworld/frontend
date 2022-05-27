import {
  Autocomplete,
  AutocompleteProps,
  Button,
  TextField,
  TextFieldProps,
} from "@mui/material";
import React from "react";
import { TagData, TagType } from "../types/min-combinators";

type _Props = {
  autocompleteProps?: Omit<
    AutocompleteProps<TagData, undefined, undefined, undefined>,
    "renderInput" | "options" | "getOptionLabel"
  >;
  textfieldProps?: TextFieldProps;
};
type _State = {
  options: TagData[];
};

export class TagSearchField extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {
      options: [],
    };
  }

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <Autocomplete<TagData, undefined, undefined, undefined>
          {...this.props.autocompleteProps}
          renderInput={(params) => (
            <TextField {...this.props.textfieldProps} {...params} />
          )}
          filterOptions={(options) => options}
          options={this.state.options}
          getOptionLabel={(option) => {
            switch (option.type) {
              case TagType.idea:
                return option.humanText;
              default:
                return option.tagWithSymbol;
            }
          }}
        />
      </React.Fragment>
    );
  }
}
