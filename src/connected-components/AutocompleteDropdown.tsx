import {
  List,
  ListItem,
  Menu,
  MenuProps,
  TextField,
  TextFieldProps,
} from "@mui/material";
import React from "react";

type _Props<Option> = {
  onInputChange: (text: string) => void;
  options: Option[];
  renderOption: (option: Option, index: number) => React.ReactNode;
  menuProps: MenuProps;
  textfieldProps?: Omit<TextFieldProps, "onChange">;
  renderTextField?: (props: TextFieldProps) => React.ReactNode;
};
type _State = {};
export type AutocompleteDropdownProps<O> = _Props<O>;
export class AutocompleteDropdown<Option> extends React.Component<
  _Props<Option>,
  _State
> {
  constructor(props: _Props<Option>) {
    super(props);
  }

  textfieldProps(): TextFieldProps {
    return {
      fullWidth: true,
      size: "small",
      ...this.props.textfieldProps,
      onChange: (e) => {
        this.props.onInputChange(e.target.value);
      },
    };
  }

  render(): React.ReactNode {
    return (
      <Menu {...this.props.menuProps}>
        <List dense disablePadding>
          <ListItem dense>
            {this.props.renderTextField ? (
              this.props.renderTextField(this.textfieldProps())
            ) : (
              <TextField {...this.textfieldProps()} />
            )}
          </ListItem>
          {this.props.options.map(this.props.renderOption)}
        </List>
      </Menu>
    );
  }
}
