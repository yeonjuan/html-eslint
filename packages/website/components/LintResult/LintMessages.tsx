import { FC } from "react";
import { Linter } from "eslint";
import Link from "next/link";

type Props = {
  messages: Linter.LintMessage[];
};

const LintMessages: FC<Props> = ({ messages }) => {
  return (
    <ul className="text-[13px] text-[#bf111f]">
      {messages.map(({ line, column, message, ruleId }) => {
        return (
          <li
            key={`${ruleId}-${line}-${column}`}
            className="bg-red-100 p-2 mb-1 rounded "
          >
            {`${line}:${column} - ${message}(`}
            <Link
              href={`/docs/rules/${ruleId?.replace("@html-eslint/", "")}`}
              target="_blank"
              rel="noopener"
            >
              {ruleId}
            </Link>
            {")"}
          </li>
        );
      })}
    </ul>
  );
};

export default LintMessages;
