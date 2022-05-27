import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Switch,
  Button,
  Box,
  TextField,
  ListItem,
  List,
  IconButton,
  Chip,
  Paper,
} from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import { EditCompanyUrlType } from "../route-config";
import { RootAppState } from "../states/RootAppState";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Row } from "../layouts/Row";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Editor from "rich-markdown-editor";
import { Column } from "../layouts/Column";
import { UrlAppState } from "../states/UrlAppState";
import { StandardActionButton } from "../stateless-components/StandardActionButton";
import {
  CompanyContentSectionAppState,
  CompanyContentSectionType,
  EditCompanyContentAppState,
  SpecialCompanyContentSectionTag,
} from "../states/EditCompanyContentAppState";
import { ImmuList, mapState, to, uuid4 } from "../simple-redux";
import { TimelineDataPointAppState } from "../states/CompanyDetailAppState";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
enum SectionType {
  article,
  timeline,
}

type SectionData = {
  sectionType: SectionType;
  enabled: boolean;
  articleProps?: {
    title: string;
    content: string;
  };
  timelineData?: {};
};

type _Props = {
  urlAppState: UrlAppState<EditCompanyUrlType>;
  editCompanyContentAppState: EditCompanyContentAppState;
};

type _State = {};

class _EditCompanyContent extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }

  onSaveClicked = () => {};
  isSaving() {
    return true;
  }

  /**
   * Retrieves the backend's state data for the special sections, or create an
   * empty section.
   * @param tag The special tag of the special section.
   * @returns The state object if found in this.editCompanyContentAppState else
   * create an empty state
   */
  getSpecialContent(
    tag: SpecialCompanyContentSectionTag
  ): CompanyContentSectionAppState {
    let found = this.editCompanyContentAppState.pageContent.find(
      (x) => x.specialTag == tag
    );
    if (found) {
      return found;
    }
    let title: string | undefined;
    let enabled: boolean | undefined;
    switch (tag) {
      case SpecialCompanyContentSectionTag.businessModel:
        title ??= "Business Model Explained";
        enabled ??= true;
      // fallthrough
      case SpecialCompanyContentSectionTag.risks:
        title ??= "Risk & Challenges";
        enabled ??= true;
      // fallthrough
      case SpecialCompanyContentSectionTag.currentState:
        title ??= "Current State";
        enabled ??= true;
      // fallthrough
      case SpecialCompanyContentSectionTag.whyFail:
        title ??= "Why the Company Failed";
        enabled ??= false;
      // fallthrough
      case SpecialCompanyContentSectionTag.whySuccees:
        title ??= "How the Company Became a Success";
        enabled ??= false;
        // fallthrough
        return (
          this.editCompanyContentAppState.pageContent.find(
            (x) => x.specialTag == tag
          ) ??
          new CompanyContentSectionAppState({
            id: uuid4(),
            isNew: true,
            specialTag: tag,
            enabled: enabled,
            type: CompanyContentSectionType.article,
            articleData: {
              title: title,
              content: "",
            },
          })
        );
      case SpecialCompanyContentSectionTag.timeline:
      default:
        return (
          this.editCompanyContentAppState.pageContent.find(
            (x) => x.specialTag == tag
          ) ??
          new CompanyContentSectionAppState({
            id: uuid4(),
            isNew: true,
            specialTag: tag,
            enabled: true,
            type: CompanyContentSectionType.timeline,
            timelineData: {
              title: "Timeline",
              timeline: [
                new TimelineDataPointAppState({
                  label: "Conceptual",
                }),
                new TimelineDataPointAppState({
                  label: "Founded",
                }),
              ],
            },
          })
        );
    }
  }

  render(): React.ReactNode {
    return (
      <Column width={1 / 1}>
        {renderPageSection(
          this.getSpecialContent(SpecialCompanyContentSectionTag.businessModel)
        )}
        {renderPageSection(
          this.getSpecialContent(SpecialCompanyContentSectionTag.risks)
        )}
        {renderPageSection(
          this.getSpecialContent(SpecialCompanyContentSectionTag.timeline)
        )}
        {renderPageSection(
          this.getSpecialContent(SpecialCompanyContentSectionTag.currentState)
        )}
        {renderPageSection(
          this.getSpecialContent(SpecialCompanyContentSectionTag.whySuccees)
        )}
        {renderPageSection(
          this.getSpecialContent(SpecialCompanyContentSectionTag.whyFail)
        )}
        {this.props.editCompanyContentAppState.pageContent
          .filter((x) => x.specialTag === SpecialCompanyContentSectionTag.none)
          .toArray()
          .map(renderPageSection)}

        <Paper sx={{ my: 5, padding: 5 }}>
          <Column spacing={2}>
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
        </Paper>
      </Column>
    );
  }

  get urlAppState() {
    return this.props.urlAppState.as<EditCompanyUrlType>();
  }

  get editCompanyContentAppState() {
    return this.props.editCompanyContentAppState;
  }
}

type RenderTimelineSctionProps = {
  sectionId: string;
  title: string;
  defaultTimeline: TimelineDataPointAppState[];
  defaultEnabled: boolean;
};
type RenderTimelineSctionState = {
  timeline: ImmuList<TimelineDataPointAppState>;
};
class RenderTimelineSction extends React.Component<
  RenderTimelineSctionProps,
  RenderTimelineSctionState
> {
  constructor(props: RenderTimelineSctionProps) {
    super(props);
    this.state = {
      timeline: new ImmuList(props.defaultTimeline),
    };
  }

  render() {
    return (
      <div>
        <AccordionWithSwitch
          defaultEnabled={this.props.defaultEnabled}
          summaryComponent={
            <Typography variant='subtitle1' color='text.secondary'>
              {this.props.title}
            </Typography>
          }>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <List>
              {this.state.timeline.toArray().map((data, index) => (
                <ListItem key={data.key}>
                  <Row spacing={1} vertiCenter>
                    <DatePicker
                      label='Date'
                      onChange={(
                        date: Date | null,
                        keyboardInputValue?: string
                      ) => {
                        if (date) {
                          this.setState({
                            timeline: this.state.timeline.mapItem(data.key, {
                              time: to(date),
                            }),
                          });
                        }
                      }}
                      value={data.time}
                      renderInput={(params) => (
                        <TextField label='Date' {...params} />
                      )}
                    />
                    <TextField label='Progress' defaultValue={data.label} />
                    <IconButton
                      sx={{ width: 50, height: 50 }}
                      color='primary'
                      onClick={() => {
                        this.setState({
                          timeline: this.state.timeline.insertAt(
                            index + 1,
                            new TimelineDataPointAppState({ label: "" })
                          ),
                        });
                      }}>
                      <AddIcon />
                    </IconButton>
                    {index > 0 && (
                      <IconButton
                        sx={{ width: 50, height: 50 }}
                        color='default'
                        onClick={() => {
                          this.setState({
                            timeline: this.state.timeline.remove(data.key),
                          });
                        }}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Row>
                </ListItem>
              ))}
            </List>
          </LocalizationProvider>
        </AccordionWithSwitch>
      </div>
    );
  }
}

function renderPageSection(section: CompanyContentSectionAppState) {
  switch (section.type) {
    case CompanyContentSectionType.article:
      return (
        <RenderArticleSection
          sectionId={section.id}
          title={section.articleData!.title}
          content={section.articleData!.content}
          enabled={section.enabled}
        />
      );
    case CompanyContentSectionType.timeline:
      return (
        <RenderTimelineSction
          sectionId={section.id}
          defaultEnabled={section.enabled}
          title={section.timelineData!.title}
          defaultTimeline={section.timelineData!.timeline}
        />
      );
  }
}

type _AccordionWithSwitchProps = {
  defaultEnabled: boolean;
  summaryComponent: React.ReactNode;
  children: React.ReactNode;
};
type _AccordionWithSwitchState = {
  enabled: boolean;
};
class AccordionWithSwitch extends React.Component<
  _AccordionWithSwitchProps,
  _AccordionWithSwitchState
> {
  constructor(props: _AccordionWithSwitchProps) {
    super(props);
    this.state = {
      enabled: props.defaultEnabled,
    };
  }
  render(): React.ReactNode {
    return (
      <React.Fragment>
        <Accordion expanded={this.state.enabled} sx={{ borderRadius: 2 }}>
          <AccordionSummary
            sx={{
              pointerEvents: "none",
            }}
            aria-controls='panel1a-content'
            id='panel1a-header'>
            <Row vertiCenter spacing={2}>
              <Switch
                defaultChecked={this.props.defaultEnabled}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e, checked) => {
                  this.setState({
                    enabled: checked,
                  });
                }}
                sx={{
                  pointerEvents: "auto",
                }}
              />
              {this.props.summaryComponent}
            </Row>
          </AccordionSummary>
          <AccordionDetails>
            <Box mx={5} mb={3}>
              {this.props.children}
            </Box>
          </AccordionDetails>
        </Accordion>
      </React.Fragment>
    );
  }
}

type _RenderArticleSectionProps = {
  sectionId: string;
  title: string;
  content: string;
  enabled: boolean;
};
type _RenderArticleSectionState = {
  enabled: boolean;
};
class RenderArticleSection extends React.Component<
  _RenderArticleSectionProps,
  _RenderArticleSectionState
> {
  constructor(props: _RenderArticleSectionProps) {
    super(props);
    this.state = {
      enabled: props.enabled,
    };
  }
  render() {
    return (
      <AccordionWithSwitch
        defaultEnabled={this.props.enabled}
        summaryComponent={
          <Typography variant='subtitle1' color='text.secondary'>
            {this.props.title}
          </Typography>
        }>
        <Editor />
      </AccordionWithSwitch>
    );
  }
}

export const EditCompanyContentPage = connect<_Props, {}, {}, RootAppState>(
  (state) => {
    return {
      editCompanyContentAppState: state.editCompany.editContent,
      urlAppState: state.url.as<EditCompanyUrlType>(),
      slug: state.url.as<EditCompanyUrlType>().params.slug,
    };
  }
)(_EditCompanyContent);
