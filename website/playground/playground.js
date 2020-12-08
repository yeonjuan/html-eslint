import React, { useEffect, useState } from "react";
import Editor from "./Editor";
import useRuleOptions from "./useRuleOptions";
import createLinter from "./createLinter";
import "./playground.css";

const linter = createLinter();
const PlayGround = () => {
  const [messages, setMessages] = useState([]);
  const [ruleOptions, RuleOptions] = useRuleOptions();
  const [output, setOutput] = useState("");
  const [tab, setTab] = useState("fixed");

  const [code, setCode] = useState("");

  useEffect(() => {
    const { messages, output } = linter.lint(code, ruleOptions);
    setMessages(messages);
    setOutput(output);
  }, [ruleOptions, code]);

  return (
    <div className="ply_container">
      <div className="ply_row ply_row--align_end">
        <div className="ply_pane">
          <h2>Editor</h2>
          <div className="code_container">
            <Editor onChange={setCode} messages={messages} />
          </div>
        </div>
        <div className="ply_pane">
          <div>
            <ul className="tabs_titles">
              <li
                className={`tab_title ${
                  tab === "fixed" ? "tab_title--active" : ""
                }`}
                onClick={() => setTab("fixed")}
              >
                Fixed
              </li>
              <li
                className={`tab_title ${
                  tab === "errors" ? "tab_title--active" : ""
                }`}
                onClick={() => setTab("errors")}
              >
                Errors
              </li>
            </ul>
          </div>
          <div className="code_container">
            <pre>{output}</pre>
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
