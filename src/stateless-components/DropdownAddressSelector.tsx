import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteRenderInputParams,
  ListItem,
  TextField,
  TextFieldProps,
} from "@mui/material";
import React from "react";
import { Row } from "../layouts/Row";
import { Helmet } from "react-helmet-async";
import {
  AutocompleteDropdown,
  AutocompleteDropdownProps,
} from "../connected-components/AutocompleteDropdown";
import { searchPlaces } from "./google-map";

type Prediction = google.maps.places.AutocompletePrediction;
type _Props = Omit<
  AutocompleteDropdownProps<Prediction>,
  "options" | "onInputChange"
> & {
  limit?: ("(cities)" | "(regions)" | "country")[];
  onInputChange?: (text: string) => void;
};
type _State = {
  predictions: Prediction[];
  loading: boolean;
};

export class DropdownAddressSelector extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = { predictions: [], loading: false };
  }

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <AutocompleteDropdown
          {...this.props}
          options={this.state.predictions}
          onInputChange={async (value) => {
            this.props.onInputChange?.(value);
            this.setState({ loading: true });
            let result = await searchPlaces(value, this.props.limit);
            this.setState({ predictions: result, loading: false });
          }}
        />
      </React.Fragment>
    );
  }
}
