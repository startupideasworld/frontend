import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteRenderInputParams,
  ClickAwayListener,
  ListItem,
  TextField,
  TextFieldProps,
} from "@mui/material";
import React from "react";
import { Row } from "../layouts/Row";
import { Helmet } from "react-helmet-async";
import {
  AddressPrediction,
  defaultAddressPredictions,
  searchPlaces,
} from "./google-map";

type _Props = {
  placeholder?: string;
  required?: boolean;
  label?: string;
  textfieldProps?: TextFieldProps;
  limit?: ("(cities)" | "(regions)" | "country")[];
  autoFocus?: boolean;
  defaultValue?: Prediction;
  autocompleteProps?: AutocompleteProps<
    Prediction,
    boolean,
    boolean,
    undefined // freeSolo
  >;
  onSelectionChange?: (option: null | AddressPrediction) => void;
};

type Prediction = google.maps.places.AutocompletePrediction;

type _State = {
  predictions: Prediction[];
  open: boolean;
  loading: boolean;
};

export function asyncDebonce<PS extends any[], R>(
  fn: (...args: PS) => Promise<R>,
  interval: number
): (...args: PS) => Promise<R> {
  let timer: any = undefined;
  return function (this: any, ...args: PS) {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(fn.apply(this, args)), interval);
    });
  };
}

export class StandardAddressSelector extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {
      predictions: defaultAddressPredictions,
      open: false,
      loading: false,
    };
  }

  openDropdown() {
    this.setState({ open: true });
  }

  closeDropdown() {
    this.setState({ open: false });
  }

  render() {
    return (
      <Autocomplete<Prediction, boolean, boolean, undefined>
        {...this.props.autocompleteProps}
        sx={{ width: 1 / 1 }}
        options={this.state.predictions}
        filterOptions={(options, object) => options}
        loading={this.state.loading}
        renderOption={(props, option) => (
          <ListItem {...props} key={option.place_id}>
            {option.description}
          </ListItem>
        )}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          }
          return option.description;
        }}
        isOptionEqualToValue={(option, value) => {
          return option.description === value.description;
        }}
        onChange={(e, val, reason) => {
          this.props.autocompleteProps?.onChange?.(e, val, reason);
          if (reason === "selectOption") {
            this.props.onSelectionChange?.(val as AddressPrediction);
          }
        }}
        onInputChange={async (event, newValue, reason) => {
          if (newValue) {
            this.openDropdown();
          }
          this.props.autocompleteProps?.onInputChange?.(
            event,
            newValue,
            reason
          );
          this.setState({ loading: true });
          let result = await searchPlaces(newValue, this.props.limit);
          this.setState({ predictions: result, loading: false });
        }}
        defaultValue={this.props.defaultValue}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <TextField
            required={this.props.required}
            autoFocus={this.props.autoFocus ?? false}
            label={this.props.label}
            placeholder={this.props.placeholder}
            {...this.props.textfieldProps}
            {...params}
            fullWidth
          />
        )}
      />
    );
  }
}
