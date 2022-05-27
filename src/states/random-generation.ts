import { LoremIpsum } from "lorem-ipsum";
import { uuid4 } from "../simple-redux";
import { PersonData } from "../types/min-combinators";

export const sentenceLorem = new LoremIpsum({
  wordsPerSentence: { min: 4, max: 7 },
  sentencesPerParagraph: { min: 5, max: 10 },
});

export const paragraphLorem = new LoremIpsum({
  wordsPerSentence: { min: 5, max: 10 },
  sentencesPerParagraph: { min: 5, max: 10 },
});

export const articleLorem = new LoremIpsum({
  wordsPerSentence: { min: 5, max: 10 },
  sentencesPerParagraph: { min: 10, max: 20 },
});

export const nameLorem = new LoremIpsum({
  wordsPerSentence: { min: 1, max: 3 },
});

export class Random {
  static choice<T>(array: T[]): T {
    return array[
      Math.min(array.length - 1, Math.floor(Math.random() * array.length))
    ];
  }

  static boolean(): boolean {
    return Random.choice([true, false]);
  }

  static subset<T>(
    array: T[],
    size: number = Random.int(0, array.length)
  ): T[] {
    let arr = [...array];
    let selected = [];
    for (let i = 0; i < Math.min(size, array.length - 1); i++) {
      let item = Random.choice(arr);
      selected.push(item);
      arr = arr.filter((x) => x != item);
    }
    return selected;
  }

  static avatar(width: number = 100, height: number = 100): string {
    return `https://picsum.photos/${width}/${height}`;
  }

  static image(width: number = 100, height: number = 100): string {
    return `https://picsum.photos/${width}/${height}`;
  }

  static personName(): string {
    return nameLorem.generateWords();
  }

  static personData(): PersonData {
    return {
      name: Random.personName(),
      avatar: Random.avatar(),
      userSlug: Random.slug(),
      profession: Random.profession(),
    };
  }

  static companyName(): string {
    return nameLorem.generateWords();
  }

  static article(): string {
    return articleLorem.generateParagraphs(10);
  }

  static comment(): string {
    return articleLorem.generateSentences(3);
  }

  static profession(): string {
    return (
      Random.choice(["Founder", "CEO", "Manager"]) +
      " of " +
      Random.companyName()
    );
  }

  static idea(): string {
    return sentenceLorem.generateWords();
  }

  static hashTag(): string {
    return Random.companyName()
      .split(" ")
      .map((x) => x[0].toUpperCase() + x.substring(1))
      .join("");
  }

  static slug(): string {
    return Random.personName().replaceAll(" ", "-");
  }

  static hash(): string {
    return uuid4().toString().substring(0, 8);
  }

  static id(): string {
    return uuid4();
  }

  static int(from: number, to: number): number {
    return Math.floor(Math.random() * (to - from)) + from;
  }

  static time(startOffset: number, endOffset: number): Date {
    let current = new Date();
    return new Date(current.getTime() + Random.int(startOffset, endOffset));
  }
}
