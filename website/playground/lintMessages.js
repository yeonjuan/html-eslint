import React from "react";
import { SCOPE } from "./constants";

const LintMessages = (props) => {
  return (
    <>
      {props.messages.map(({ line, column, message, ruleId, fatal }, index) => {
        return (
          <div className="lint-message" key={`lint-msg-${index}`}>
            {`${line}:${column} - `}
            {`${message} `}(
            <a
              href={`/html-eslint/docs/rules/${ruleId.replace(
                `${SCOPE}/`,
                ""
              )}`}
            >
              {ruleId}
            </a>
            )
          </div>
        );
      })}
    </>
  );
};

export default LintMessages;
