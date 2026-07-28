const { computeBranchSegments } = require("../lib/branch-annotation");
const {
  TWIG,
  NUNJUCKS,
  HANDLEBAR_EXTENDED,
} = require("../lib/template-engine-syntax-preset");

// Custom config using STRING patterns instead of RegExp to hit
// the indexOf() fallback path in matches().
const STRING_PATTERN_CONFIG = [
  {
    open: "{%",
    close: "%}",
    branch: {
      start: "if", // string, not RegExp
      continue: "elseif", // string
      end: "endif", // string
    },
  },
];

// ---------------------------------------------------------------------------
// Test helpers — replicate what @html-eslint/template-syntax-parser produces:
// open = [startOfDelim, endOfDelim], close = [startOfCloseDelim, endOfCloseDelim].
// The whitespace-control dash ('-') in '{%-' is CONTENT, not part of the '{%'
// delimiter — so open is always exactly [pos, pos+2] for '{%' tokens.
// ---------------------------------------------------------------------------

/** @param {string} source */
function extractTwigTagInfos(source) {
  const infos = [];
  const re = /\{%([\s\S]*?)%\}/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    infos.push({
      open: [m.index, m.index + 2],
      close: [m.index + 2 + m[1].length, m.index + m[0].length],
    });
  }
  return infos;
}

/** @param {string} source */
function extractHbsTagInfos(source) {
  const infos = [];
  const re = /\{\{([\s\S]*?)\}\}/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    infos.push({
      open: [m.index, m.index + 2],
      close: [m.index + 2 + m[1].length, m.index + m[0].length],
    });
  }
  return infos;
}

// ---------------------------------------------------------------------------

describe("computeBranchSegments", () => {
  // ── degenerate cases ──────────────────────────────────────────────────────

  it("returns empty array when templateInfos is empty", () => {
    expect(computeBranchSegments([], "<p>hi</p>", TWIG)).toEqual([]);
  });

  it("returns empty array when no syntax item has a branch config", () => {
    const source = "{% if x %}A{% endif %}";
    const infos = extractTwigTagInfos(source);
    // Syntax items without .branch property
    const items = [{ open: "{%", close: "%}" }];
    expect(computeBranchSegments(infos, source, items)).toEqual([]);
  });

  it("returns empty array when syntaxItems is empty", () => {
    const source = "{% if x %}A{% endif %}";
    const infos = extractTwigTagInfos(source);
    expect(computeBranchSegments(infos, source, [])).toEqual([]);
  });

  // ── Twig: basic if / else ─────────────────────────────────────────────────

  it("produces two segments for a simple if/else block", () => {
    const source = "{% if cond %}yes{% else %}no{% endif %}";
    const segments = computeBranchSegments(
      extractTwigTagInfos(source),
      source,
      TWIG
    );
    expect(segments).toHaveLength(2);
    expect(new Set(segments.map((s) => s.groupId)).size).toBe(1);
    expect(segments[0].branchIndex).toBe(0);
    expect(segments[1].branchIndex).toBe(1);
    // Branch 0 content is "yes"
    expect(source.slice(segments[0].start, segments[0].end)).toBe("yes");
    // Branch 1 content is "no"
    expect(source.slice(segments[1].start, segments[1].end)).toBe("no");
  });

  // ── Twig: if / elseif / else / endif ─────────────────────────────────────

  it("produces three segments for if/elseif/else/endif", () => {
    const source = [
      "{% if a %}",
      "body_a",
      "{% elseif b %}",
      "body_b",
      "{% else %}",
      "body_c",
      "{% endif %}",
    ].join("\n");
    const segments = computeBranchSegments(
      extractTwigTagInfos(source),
      source,
      TWIG
    );
    expect(segments).toHaveLength(3);
    expect(new Set(segments.map((s) => s.groupId)).size).toBe(1);
    expect(segments.map((s) => s.branchIndex)).toEqual([0, 1, 2]);
  });

  // ── Twig: only-if (no else) ───────────────────────────────────────────────

  it("produces one segment for a plain if block without else", () => {
    const source = "{% if cond %}content{% endif %}";
    const segments = computeBranchSegments(
      extractTwigTagInfos(source),
      source,
      TWIG
    );
    expect(segments).toHaveLength(1);
    expect(segments[0].branchIndex).toBe(0);
  });

  // ── Twig: for/else inside if must not corrupt outer if tracking ───────────

  it("ignores for-else inside an if block (blockOpen/blockClose)", () => {
    const source = [
      "{% if cond %}",
      "  {% for x in xs %}item{% else %}empty{% endfor %}",
      "{% else %}",
      "  B",
      "{% endif %}",
    ].join("\n");
    const segments = computeBranchSegments(
      extractTwigTagInfos(source),
      source,
      TWIG
    );
    // The for-else must NOT be credited to the outer if-block.
    expect(segments).toHaveLength(2);
    expect(new Set(segments.map((s) => s.groupId)).size).toBe(1);
  });

  // ── Twig: whitespace-control dashes ──────────────────────────────────────

  it("handles whitespace-control dashes on if/else/endif tokens", () => {
    const source = "{%- if cond -%}yes{%- else -%}no{%- endif -%}";
    const segments = computeBranchSegments(
      extractTwigTagInfos(source),
      source,
      TWIG
    );
    expect(segments).toHaveLength(2);
  });

  // ── Twig: two separate if-blocks produce two independent groups ───────────

  it("creates separate groups for two independent if blocks", () => {
    const source = "{% if c1 %}A{% endif %}\n{% if c2 %}B{% endif %}";
    const segments = computeBranchSegments(
      extractTwigTagInfos(source),
      source,
      TWIG
    );
    expect(segments).toHaveLength(2);
    expect(new Set(segments.map((s) => s.groupId)).size).toBe(2);
  });

  // ── Twig: nested if blocks ────────────────────────────────────────────────

  it("handles nested if blocks (outer 2 branches + inner 1 branch)", () => {
    const source =
      "{% if outer %}{% if inner %}A{% endif %}{% else %}B{% endif %}";
    const segments = computeBranchSegments(
      extractTwigTagInfos(source),
      source,
      TWIG
    );
    expect(segments).toHaveLength(3);
    expect(new Set(segments.map((s) => s.groupId)).size).toBe(2);
  });

  // ── Nunjucks: elif keyword ────────────────────────────────────────────────

  it("handles Nunjucks elif keyword", () => {
    const source = "{% if a %}\nA\n{% elif b %}\nB\n{% else %}\nC\n{% endif %}";
    const segments = computeBranchSegments(
      extractTwigTagInfos(source),
      source,
      NUNJUCKS
    );
    expect(segments).toHaveLength(3);
    expect(segments.map((s) => s.branchIndex)).toEqual([0, 1, 2]);
  });

  // ── Handlebars EXTENDED: #if / else / /if ─────────────────────────────────

  it("handles Handlebars #if / else / /if", () => {
    const source = "{{#if cond}}yes{{else}}no{{/if}}";
    const segments = computeBranchSegments(
      extractHbsTagInfos(source),
      source,
      HANDLEBAR_EXTENDED
    );
    expect(segments).toHaveLength(2);
  });

  it("ignores Handlebars #each/else inside a #if block", () => {
    const source =
      "{{#if cond}}{{#each items}}item{{else}}empty{{/each}}{{else}}B{{/if}}";
    const segments = computeBranchSegments(
      extractHbsTagInfos(source),
      source,
      HANDLEBAR_EXTENDED
    );
    expect(segments).toHaveLength(2);
    expect(new Set(segments.map((s) => s.groupId)).size).toBe(1);
  });

  // ── String pattern fallback ───────────────────────────────────────────────

  it("uses string patterns (indexOf fallback) instead of RegExp", () => {
    const source = "{% if cond %}A{% elseif x %}B{% endif %}";
    const segments = computeBranchSegments(
      extractTwigTagInfos(source),
      source,
      STRING_PATTERN_CONFIG
    );
    expect(segments).toHaveLength(2);
    expect(new Set(segments.map((s) => s.groupId)).size).toBe(1);
  });
});
