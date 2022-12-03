import { FC, useState } from "react";
import classnames from "classnames";
import { Linter } from "eslint";
import LintMessages from "./LintMessages";
import FixerResult from "./FixerResult";

type Props = {
  messages: Linter.LintMessage[];
  code: string;
};

const TABS = ["Errors", "Fixed"] as const;

const LintResult: FC<Props> = ({ messages, code }) => {
  const [tab, setTab] = useState<typeof TABS[number]>("Errors");

  return (
    <div className="flex flex-col w-full">
      <ul>
        {TABS.map((tabItem) => (
          <li
            className={classnames(
              "inline-block p-2 border-[1px] rounded-t border-b-0",
              tab === tabItem ? "border-gray-200" : "border-transparent"
            )}
            key={tabItem}
            onClick={() => setTab(tabItem)}
          >
            {tabItem}
          </li>
        ))}
      </ul>
      <div className="border-[1px] border-slate rounded flex-grow p-2 bg-gray-100">
        {tab === "Errors" && <LintMessages messages={messages} />}
        {tab === "Fixed" && <FixerResult code={code} />}
      </div>
    </div>
  );
};

export default LintResult;
