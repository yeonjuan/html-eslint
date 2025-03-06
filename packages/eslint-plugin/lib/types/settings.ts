export type MaybeHTMLSettings = {
  templateLiterals?: {
    tags?: string[];
    comments?: string[];
  };
};

export type HTMLSettings = {
  templateLiterals: {
    tags: RegExp[];
    comments: RegExp[];
  };
};
