import React, { useEffect, useState } from "react";
import Editor from "./editor";
import useRuleOptions from "./useRuleOptions";
import createLinter from "./createLinter";
import LintMessages from "./lintMessages";
import { DEFAULT_CODE, DEFAULT_RULES } from "./constants";
import queryParamsState from "./queryParamsState";
import "./playground.css";

const linter = createLinter();

const TabTitles = (props) => {
  const titles = props.titles;
  const selected = props.selected;
  return (
    <ul className="tabs_titles">
      {titles.map((title) => (
        <li
          key={title}
          role="tab"
          className={`tab_title ${
            title === selected ? "tab_title--active" : ""
          }`}
          onClick={() => props.onClick(title)}
        >
          {title}
        </li>
      ))}
    </ul>
  );
};

const PlayGround = () => {
  const [messages, setMessages] = useState([]);
  const [ruleOptions, RuleOptions] = useRuleOptions(
    queryParamsState.get().rules || DEFAULT_RULES
  );
  const [output, setOutput] = useState("");
  const [tab, setTab] = useState("Errors");

  const [code, setCode] = useState(queryParamsState.get().code || DEFAULT_CODE);

  useEffect(() => {
    const { messages, output } = linter.lint(code, ruleOptions);
    setMessages(messages);
    setOutput(output);
    queryParamsState.set({
      code,
      rules: ruleOptions,
    });
  }, [ruleOptions, code]);

  return (
    <div className="ply_container">
      <div className="ply_row ply_row--align_end">
        <div className="ply_pane">
          <h2>Editor</h2>
          <div className="code_container">
            <Editor onChange={setCode} messages={messages} initial={code} />
          </div>
        </div>
        <div className="ply_pane">
          <div>
            <TabTitles
              titles={["Errors", "Fixed"]}
              selected={tab}
              onClick={setTab}
            ></TabTitles>
          </div>
          <div className="code_container" role="tabpanel">
            {tab === "Errors" && <LintMessages messages={messages} />}
            {tab === "Fixed" && <pre>{output}</pre>}
          </div>
        </div>
      </div>
      <h2>All Rules</h2>
      <div className="ply_row ply_row--align_start">
        <RuleOptions />
      </div>
    </div>
  );
};

export default PlayGround;
