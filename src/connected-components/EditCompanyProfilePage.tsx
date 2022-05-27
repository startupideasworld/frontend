import { LocalizationProvider, DatePicker } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React from "react";
import { connect } from "react-redux";
import { Column } from "../layouts/Column";
import { Row } from "../layouts/Row";
import { CreateCompanyUrlType, EditCompanyUrlType } from "../route-config";
import { EditCompanyProfileAppState } from "../states/EditCompanyProfileAppState";
import { RootAppState } from "../states/RootAppState";
import { UrlAppState } from "../states/UrlAppState";
import { StandardActionButton } from "../stateless-components/StandardActionButton";
import { StandardAddressSelector } from "../stateless-components/StandardAddressSelector";

type _Props = {
  urlAppState: UrlAppState<EditCompanyUrlType>;
  editCompanyProfileAppState: EditCompanyProfileAppState;
};
type _State = {
  companyStartDate: Date;
};

class _EditCompanyProfile extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {
      companyStartDate: props.editCompanyProfileAppState.companyStartDate,
    };
  }

  get urlAppState() {
    return this.props.urlAppState.as<EditCompanyUrlType>();
  }

  onSaveClicked = () => {};
  isSaving() {
    return true;
  }

  render(): React.ReactNode {
    return (
      <Paper sx={{ padding: 5 }}>
        <Column width={1 / 1} spacing={2}>
          <TextField required label='Company' fullWidth />

          <FormControlLabel
            control={<Switch defaultChecked />}
            label='The company is conceptual.'
          />
          <Box pb={2}>
            <Alert severity='info'>
              A conceptual startup is one that doesn't exist at the moment. But
              you can still create a profile to share your business concept.
              People will see the startup's profile and they can critic the
              business model. You can make connections and find potential
              business partners.
            </Alert>
          </Box>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label='Company start date'
              value={this.state.companyStartDate}
              onChange={(newValue) => {
                if (newValue) {
                  this.setState({ companyStartDate: newValue });
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField required label='Startup idea in 7 words' fullWidth />

          <TextField
            label='Details'
            multiline
            placeholder='Tell people about your business model'
          />
          <StandardAddressSelector
            required
            label='Location'
            placeholder='City, State, Country'
          />
          <TextField
            label='Website'
            placeholder="Link to your company's website"
          />

          <Column spacing={2} pt={2}>
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
        </Column>
      </Paper>
    );
  }
}

export const EditCompanyProfilePage = connect<_Props, {}, {}, RootAppState>(
  (state) => {
    return {
      urlAppState: state.url.as<EditCompanyUrlType>(),
      editCompanyProfileAppState: state.editCompany.editProfile,
    };
  }
)(_EditCompanyProfile);
