import { useEffect, useRef, useState } from "react";
import Editor from "../components/Editor";
import LintResult from "../components/LintResult";
import RuleConfig from "../components/RuleConfig";
import type { Linter as ESLinter } from "eslint";
import { createLinter } from "../utils/linter";

type Linter = ReturnType<typeof createLinter>;
type LinterResult = ReturnType<Linter["lint"]>;

export default function Playground() {
  const [code, setCode] = useState("");
  const linter = useRef<ReturnType<typeof createLinter>>();
  const [lintResult, setLintResult] = useState<LinterResult>({
    messages: [],
    output: "",
  });
  const [rules, setRules] = useState<Partial<ESLinter.RulesRecord>>({});

  useEffect(() => {
    if (!linter.current) {
      linter.current = createLinter();
    }
  }, []);

  useEffect(() => {
    if (linter.current) {
      const result = linter.current.lint(code, rules);
      setLintResult(result);
    }
  }, [code, linter.current, rules]);

  return (
    <div className="pt-[40px]">
      <h1 className="text-2xl p-2">Playground</h1>
      <div className="flex flex-col gap-2 mt-3 md:flex-row">
        <div className="md:w-1/2 min-h-[300px]">
          <Editor onChange={setCode} messages={lintResult.messages} />
        </div>
        <div className="md:w-1/2 flex min-h-[300px]">
          <LintResult messages={lintResult.messages} code={lintResult.output} />
        </div>
      </div>
      <div>
        <h2 className="text-2xl p-2">Rules</h2>
        <RuleConfig rules={rules} onChange={setRules} />
      </div>
    </div>
  );
}
