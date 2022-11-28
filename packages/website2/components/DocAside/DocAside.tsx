import { FC } from "react";
import { DocTree } from "../../data/docs";
import DocList from "./DocList";

type Props = {
  trees: DocTree[];
};

const DocAside: FC<Props> = ({ trees }) => {
  return (
    <aside
      className="sticky overflow-y-auto top-[60px] py-4 flex-[0_0_240px] border-r-slate-300 border-r-[1px]"
      style={{ height: "calc(100vh - 60px)" }}
    >
      <DocList trees={trees} level={1} />
      {/* <ul>
        <li className="py-2">
          <h2 className="font-medium text-slate-900 text-lg">
            Getting Started
          </h2>
        </li>
        <li className="py-2">
          <h2 className="font-medium text-slate-900 text-lg">Rules</h2>
        </li>
        <li className="py-1">
          <h3 className="pl-2 font-normal text-slate-800 text-base">
            Best Practice
          </h3>
        </li>
        <li className="py-1">
          <h3 className="pl-2 font-normal text-slate-800 text-base">SEO</h3>
        </li>
        <li className="py-1">
          <h3 className="pl-2 font-normal text-slate-800 text-base">
            Accessibility
          </h3>
        </li>
        <li className="py-1">
          <h3 className="pl-2 font-normal text-slate-800 text-base">Style</h3>
        </li>
        <li className="py-2">
          <h2 className="font-medium text-slate-900 text-lg">Others</h2>
        </li>
      </ul> */}
    </aside>
  );
};

export default DocAside;
