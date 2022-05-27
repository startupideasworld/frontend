import { AppState, ImmuList, uuid4 } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";
import { LoremIpsum } from "lorem-ipsum";
import { Props } from "rich-markdown-editor";
import { Random } from "./random-generation";
import { TimelinePostAppState, PostData } from "./TimelinePostAppState";
import { CompanyShortSummaryData } from "../types/min-combinators";

export enum CompanyDetailLoadingStatus {
  initial,
  loading,
  loaded,
}

export type FounderData = {
  key: string;
  id: string;
  name: string;
  role: string;
  summary: string;
  avatar: string;
};

export type AssociateData = {
  key: string;
  id: string;
  name: string;
  avatar: string;
  role: string;
};

type ProductData = {
  id: string;
  name: string;
  image: string;
};

export class TimelineDataPointAppState extends AppState {
  time = new Date();
  label = "";
  constructor(props: PartialProps<TimelineDataPointAppState>) {
    super();
    this.assignProps(props);
  }

  get key() {
    return this.time.getTime() + this.label;
  }
}

export class CompanyDetailAppState extends AppState {
  loadingStatus = CompanyDetailLoadingStatus.initial;
  companyId = "";
  companyTitle = "";
  companyThumbnail = "";
  companyHeadline = "";
  companyDescription = "";
  companyBusinessModel = "";
  companyAnalysis = "";
  companyCurrentState = "";
  companyRisks = "";
  companyTimeline: TimelineDataPointAppState[] = [];
  companyBanner = "";
  companyFoundedDate = new Date();
  companyEmployeesCount = 1;
  companyFounders: FounderData[] = [];
  companyAddress = {
    line: "",
    city: "",
    state: "",
    country: "",
  };
  critics = new ImmuList<PostData>([]);
  mentions = new ImmuList<PostData>([]);
  associates = new ImmuList<AssociateData>([]);
  companySlug = "";
  companyIsConceptual = false;
  companyIsProject = false;

  constructor(props: PartialProps<CompanyDetailAppState>) {
    super();
    this.assignProps(props);
  }

  get key() {
    return this.companySlug;
  }

  asCompanyShortSummaryData(): CompanyShortSummaryData {
    return {
      companyId: this.companyId,
      companySlug: this.companySlug,
      companyName: this.companyTitle,
      isConceptual: this.companyIsConceptual,
      isProject: this.companyIsProject,
      thumbnail: this.companyThumbnail,
      summary: this.companyDescription,
      memberAvatars: this.associates.toArray().map((x) => x.avatar),
      memberNames: this.associates.toArray().map((x) => x.name),
      isSkeleton: false,
      headline: this.companyHeadline,
    };
  }

  static random(): CompanyDetailAppState {
    const nameLorem = new LoremIpsum({
      wordsPerSentence: { min: 1, max: 3 },
    });
    const paragraphLorem = new LoremIpsum({
      wordsPerSentence: { min: 5, max: 10 },
      sentencesPerParagraph: { min: 5, max: 10 },
    });
    const articleLorem = new LoremIpsum({
      wordsPerSentence: { min: 5, max: 10 },
      sentencesPerParagraph: { min: 10, max: 20 },
    });
    return new CompanyDetailAppState({
      companyTitle: nameLorem.generateWords(),
      companyThumbnail: Random.image(400, 400),
      companyBanner: Random.image(1480, 400),
      companyDescription: paragraphLorem.generateParagraphs(1),
      companyBusinessModel: articleLorem.generateParagraphs(3),
      companyRisks: articleLorem.generateParagraphs(3),
      companyAnalysis: articleLorem.generateParagraphs(2),
      companyCurrentState: articleLorem.generateParagraphs(2),
      companySlug: Random.slug(),
      companyTimeline: [
        new TimelineDataPointAppState({
          time: new Date("1995-02"),
          label: "Founded",
        }),
        new TimelineDataPointAppState({
          time: new Date("1995-03"),
          label: "Pre-seed",
        }),
        new TimelineDataPointAppState({
          time: new Date("1996-03"),
          label: "Series A",
        }),
      ],
      companyFounders: [
        {
          key: uuid4(),
          id: uuid4(),
          name: nameLorem.generateWords(),
          role: "Founder",
          summary: paragraphLorem.generateParagraphs(1),
          avatar: "https://picsum.photos/100/100",
        },
        {
          key: uuid4(),
          id: uuid4(),
          name: nameLorem.generateWords(),
          role: "Founder",
          summary: paragraphLorem.generateParagraphs(1),
          avatar: "https://picsum.photos/100/100",
        },
        {
          key: uuid4(),
          id: uuid4(),
          name: nameLorem.generateWords(),
          role: "Founder",
          summary: paragraphLorem.generateParagraphs(1),
          avatar: "https://picsum.photos/100/100",
        },
      ],
      associates: ImmuList.build(5, () => ({
        key: uuid4(),
        id: uuid4(),
        name: nameLorem.generateWords(),
        role: "Manager",
        avatar: "https://picsum.photos/100/100",
      })),
      companyAddress: {
        line: paragraphLorem.generateWords(),
        city: "London",
        state: "Ontario",
        country: "Canada",
      },
      critics: ImmuList.build<PostData>(6, () =>
        TimelinePostAppState.random().asPostData()
      ),
      mentions: ImmuList.build<PostData>(6, () =>
        TimelinePostAppState.random().asPostData()
      ),
    });
  }
}
