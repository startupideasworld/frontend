import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { CreateCompanyPageTabIndex } from "../connected-components/CreateCompanyPage";
import { PushRouteAppEvent } from "../events/PushRouteAppEvent";
import { Column } from "../layouts/Column";
import { Row } from "../layouts/Row";
import { Spacer } from "../layouts/Spacer";
import {
  buildRoutePath,
  CreateCompanyUrlType,
  RoutePath,
  TimelineListUrlType,
  TimelineUrlType,
} from "../route-config";
import { appStore } from "../store-config";
import { AddressPrediction } from "./google-map";
import { StandardAddressSelector } from "./StandardAddressSelector";
import { TagSearchField } from "./TagSearchField";

export type FindCollaboratorProps = {
  onSubmit: (attrs: { idea: string; city: AddressPrediction | null }) => void;
  onClose?: () => void;
  subtitle?: string;
  submitButtonText?: string;
  secondarySubmitButtonText?: string;
  onSecondarySubmit?: (attrs: {
    idea: string;
    city: AddressPrediction | null;
  }) => void;
  open: boolean;
  prefilledIdea?: string;
  prefilledCity?: AddressPrediction;
};
type _State = {
  idea: string;
  city?: AddressPrediction;
  currentSearchText: string;
};

export class FindCollaboratorDialog extends React.Component<
  FindCollaboratorProps,
  _State
> {
  constructor(props: FindCollaboratorProps) {
    super(props);
    this.state = {
      idea: props.prefilledIdea ?? "",
      city: props.prefilledCity,
      currentSearchText: "",
    };
  }

  render(): React.ReactNode {
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose}>
        <DialogTitle>Find Collaborators</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {this.props.subtitle ??
              "Search for people who are interested in the common idea, or create your own community post to look for collaborations."}
          </DialogContentText>
          <TagSearchField
            textfieldProps={{
              label: "Idea to search",
              // placeholder: "Type something to search...",
              margin: "dense",
              required: true,
            }}
            autocompleteProps={{
              noOptionsText: this.state.currentSearchText
                ? "No options"
                : "Type something to search...",
              onInputChange: (e, val, reason) => {
                this.setState({ currentSearchText: val ?? "" });
              },
            }}
          />
          <DialogContentText>
            Alternatively,
            <Button
              onClick={() => {
                appStore.dispatch(
                  new PushRouteAppEvent<CreateCompanyUrlType>(
                    RoutePath.createCompany,
                    {},
                    { idea: "", create: CreateCompanyPageTabIndex.onlyIdea }
                  )
                );
              }}>
              Create an idea.
            </Button>
          </DialogContentText>
        </DialogContent>
        <DialogContent>
          <DialogContentText>Refine your search (optional)</DialogContentText>
          <StandardAddressSelector
            limit={["(cities)"]}
            placeholder='Only find people in this city / country'
            defaultValue={this.props.prefilledCity}
            textfieldProps={{
              fullWidth: true,
              margin: "dense",
              label: "Filter by City/Country",
            }}
            onSelectionChange={(val) => {
              this.setState({
                city: val ?? undefined,
              });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Row>
            {this.props.secondarySubmitButtonText && (
              <Button
                onClick={() => {
                  this.props.onSecondarySubmit?.({
                    city: this.state.city ?? null,
                    idea: this.state.idea,
                  });
                }}>
                {this.props.secondarySubmitButtonText}
              </Button>
            )}
            <Spacer />
            <Button onClick={this.props.onClose}>Cancel</Button>
            <Button
              onClick={() => {
                this.props.onSubmit({
                  city: this.state.city ?? null,
                  idea: this.state.idea,
                });
              }}>
              {this.props.submitButtonText ?? "Confirm"}
            </Button>
          </Row>
        </DialogActions>
      </Dialog>
    );
  }
}
