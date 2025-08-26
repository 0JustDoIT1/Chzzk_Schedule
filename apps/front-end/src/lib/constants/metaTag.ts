import { Metadata } from "next";

export const DEFAULT_META_TAG: Metadata = {
  title: {
    template: "%s | 0군의 삶",
    default: "0군의 삶",
  },
  description: "치지직 스케줄을 만들어보세요.",
  authors: {
    name: "0JustDoIT1",
  },
  openGraph: {
    type: "website",
    title: {
      template: "%s | 0군의 삶",
      default: "0군의 삶",
    },
    description: "치지직 스케줄을 만들어보세요.",
  },
  twitter: {
    card: "summary_large_image",
  },
};
