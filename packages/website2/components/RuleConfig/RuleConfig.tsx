import plugin from "@html-eslint/eslint-plugin";
import { Linter } from "eslint";
import { ChangeEvent, FC, useState } from "react";

type RuleNamesMap = Record<string, string[]>;
type Rules = Partial<Linter.RulesRecord>;

const RULE_NAMES: RuleNamesMap = Object.entries(plugin.rules).reduce(
  (acc: any, [name, { meta }]: any) => {
    acc[meta.docs.category] = [...(acc[meta.docs.category] || []), name];
    return acc;
  },
  {} as RuleNamesMap
);

Object.entries(RULE_NAMES).map(([category, ruleNames]) => {
  RULE_NAMES[category] = ruleNames.sort((a, b) => a.localeCompare(b));
});

type Props = {
  rules: Rules;
  onChange: (rules: Rules) => void;
};

const RULE_NAMES_ENTRY = Object.entries(RULE_NAMES);

const RuleConfig: FC<Props> = ({ rules, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...rules,
      [`@html-eslint/${e.target.name}`]: e.target.checked ? "error" : undefined,
    });
  };
  return (
    <div className="flex flex-col justify-around md:flex-row">
      {RULE_NAMES_ENTRY.map(([category, names]) => {
        return (
          <div key={category}>
            <h3 className="text-xl p-2">{category}</h3>
            <ul key={category}>
              {names.map((name) => {
                return (
                  <li key={name} className="my-1 flex items-center">
                    <label className="cursor-pointer" htmlFor={name}>
                      <input
                        type="checkbox"
                        id={name}
                        className="mr-1"
                        checked={rules[`@html-eslint/${name}`] === "error"}
                        name={name}
                        onChange={handleChange}
                      />
                      {name}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default RuleConfig;
