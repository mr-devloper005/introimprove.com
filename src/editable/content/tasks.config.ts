import type { TaskKey } from "@/lib/site-config";

export const slot4TaskSupport = {
  article: true,
  classified: false,
  sbm: false,
  profile: true,
  pdf: false,
  listing: false,
  image: false,
} satisfies Record<TaskKey, boolean>;

export const slot4TaskNotes = {
  article: "Article pages and article detail views",
  classified: "Classified pages and detail views",
  sbm: "Social bookmarking pages and detail views",
  profile: "Profile/user pages",
  pdf: "PDF/document pages and detail views",
  listing: "Business listing pages and detail views",
  image: "Image/gallery pages and detail views",
} satisfies Record<TaskKey, string>;
