import React, { useState } from "react";
import Plugin from "@html-eslint/plugin";

const SCOPE = "@html-eslint";

const CATEGORY = {
  BEST_PRACTICE: "Best Practice",
  SEO: "SEO",
  ACCESSIBILITY: "Accessibility",
  STYLE: "Style",
};

const RULE_NAMES = {
  [CATEGORY.ACCESSIBILITY]: [],
  [CATEGORY.BEST_PRACTICE]: [],
  [CATEGORY.SEO]: [],
  [CATEGORY.STYLE]: [],
};

Object.entries(Plugin.rules).forEach(([name, { meta }]) =>
  RULE_NAMES[meta.docs.category].push(name)
);

const useRuleOptions = (initial) => {
  const [options, setOptions] = useState(initial || {});

  const RuleOptions = () => {
    const selectRule = (e) => {
      setOptions({
        ...options,
        [`${SCOPE}/${e.target.name}`]: e.target.checked ? "error" : "off",
      });
    };
    return (
      <>
        {Object.entries(RULE_NAMES).map(([category, names]) => {
          return (
            <div key={category}>
              <h3>{category}</h3>
              <ul key={category}>
                {names.map((name) => {
                  return (
                    <li key={name}>
                      <label>
                        <input
                          type="checkbox"
                          onChange={selectRule}
                          name={name}
                          checked={options[`${SCOPE}/${name}`] === "error"}
                        ></input>
                        {name}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </>
    );
  };
  return [options, RuleOptions];
};

export default useRuleOptions;
