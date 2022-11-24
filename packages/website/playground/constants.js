export const SCOPE = "@html-eslint";

export const DEFAULT_CODE = `<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
          <div>
        <li> foo </li>
        </div>
    </body>
</html>
`;

export const DEFAULT_RULES = {
  [`${SCOPE}/indent`]: "error",
  [`${SCOPE}/require-li-container`]: "error",
};
