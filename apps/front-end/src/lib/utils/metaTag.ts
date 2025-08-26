import { Metadata } from "next";
import { DEFAULT_META_TAG } from "../constants/metaTag";

export const generatePostMetadata = (
  title: string,
  description: string
): Metadata => {
  return {
    ...DEFAULT_META_TAG,
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
};
