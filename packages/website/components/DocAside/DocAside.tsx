import { FC } from "react";
import { DocTree } from "../../data/docs";
import DocList from "./DocList";

type Props = {
  trees: DocTree[];
};

const DocAside: FC<Props> = ({ trees }) => {
  return (
    <aside
      className="hidden sticky overflow-y-auto top-[60px] py-4 flex-[0_0_240px] border-r-slate-300 border-r-[1px] md:block"
      style={{ height: "calc(100vh - 60px)" }}
    >
      <DocList trees={trees} level={1} />
    </aside>
  );
};

export default DocAside;
