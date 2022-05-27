import {
  Autocomplete,
  AutocompleteProps,
  Popper,
  TextField,
  TextFieldProps,
} from "@mui/material";
import React from "react";
import { simulateDelay } from "../events/helpers";

type _Props = {
  defaultMentions: MentionAutocompleteOption[];
  textfieldProps?: TextFieldProps;
  autoCompleteProps?: Partial<
    AutocompleteProps<MentionAutocompleteOption, true, undefined, true>
  >;
};

type MentionAutocompleteOption = {
  text: string;
  symbol: string;
};

type _State = {
  options: MentionAutocompleteOption[];
};

export class MentionSelectionField extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {
      options: [],
    };
  }

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <Autocomplete
          {...this.props.autoCompleteProps}
          options={this.state.options}
          getOptionLabel={(option) => {
            if (typeof option === "string") {
              return option;
            }
            return option.symbol + option.text;
          }}
          open={true}
          disablePortal
          defaultValue={this.props.defaultMentions}
          renderOption={(props, option, state) => <li>{option.text}</li>}
          renderInput={(params) => (
            <TextField {...this.props.textfieldProps} {...params} />
          )}
          onInputChange={async (e, val, reason) => {
            await simulateDelay(500);
            this.setState({
              options: [
                {
                  text: "string",
                  symbol: "string",
                },
                {
                  text: "string2",
                  symbol: "string2",
                },
              ],
            });
          }}
        />
      </React.Fragment>
    );
  }
}
