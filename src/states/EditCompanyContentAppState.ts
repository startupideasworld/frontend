import { AppState, ImmuList, uuid4 } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";
import { TimelineDataPointAppState } from "./CompanyDetailAppState";

export enum CompanyContentSectionType {
  article,
  timeline,
}

export enum SpecialCompanyContentSectionTag {
  businessModel,
  risks,
  timeline,
  currentState,
  whySuccees,
  whyFail,
  none,
}

export class CompanyContentSectionAppState extends AppState {
  id = "";
  enabled = false;
  isNew = false;
  type = CompanyContentSectionType.article;
  specialTag = SpecialCompanyContentSectionTag.none;
  articleData: null | {
    title: string;
    content: string;
  } = null;
  timelineData: null | {
    title: string;
    timeline: TimelineDataPointAppState[];
  } = null;

  constructor(props: PartialProps<CompanyContentSectionAppState>) {
    super();
    this.assignProps(props);
  }

  get key() {
    return this.id;
  }

  static random(
    type: CompanyContentSectionType,
    specialTag: SpecialCompanyContentSectionTag
  ): CompanyContentSectionAppState {
    switch (type) {
      case CompanyContentSectionType.article:
        return new CompanyContentSectionAppState({
          id: uuid4(),
          type: CompanyContentSectionType.article,
          specialTag: specialTag,
          articleData: {
            title: "title",
            content: "",
          },
        });
      case CompanyContentSectionType.timeline:
        return new CompanyContentSectionAppState({
          id: uuid4(),
          specialTag: specialTag,
          timelineData: {
            title: "title",
            timeline: [
              new TimelineDataPointAppState({
                time: new Date(),
                label: "label",
              }),
            ],
          },
        });
    }
  }
}

export class EditCompanyContentAppState extends AppState {
  pageContent = new ImmuList<CompanyContentSectionAppState>([]);
  constructor(props: PartialProps<EditCompanyContentAppState>) {
    super();
    this.assignProps(props);
  }

  static random() {
    return new EditCompanyContentAppState({
      pageContent: new ImmuList([
        CompanyContentSectionAppState.random(
          CompanyContentSectionType.article,
          SpecialCompanyContentSectionTag.businessModel
        ),
        CompanyContentSectionAppState.random(
          CompanyContentSectionType.article,
          SpecialCompanyContentSectionTag.risks
        ),
        CompanyContentSectionAppState.random(
          CompanyContentSectionType.timeline,
          SpecialCompanyContentSectionTag.timeline
        ),
        CompanyContentSectionAppState.random(
          CompanyContentSectionType.article,
          SpecialCompanyContentSectionTag.currentState
        ),
        CompanyContentSectionAppState.random(
          CompanyContentSectionType.article,
          SpecialCompanyContentSectionTag.whySuccees
        ),
        CompanyContentSectionAppState.random(
          CompanyContentSectionType.article,
          SpecialCompanyContentSectionTag.whyFail
        ),
      ]),
    });
  }
}
