import classNames from "classnames";
import Link from "next/link";
import { FC, HTMLProps } from "react";
import { DocTree } from "../../data/docs";
import Heading from "./Heading";

type Props = {
  level: number;
  trees: DocTree[];
};

const levelHeadingClassMap: Record<number, string> = {
  1: "text-lg text-slate-900",
  2: "text-base text-slate-800",
  3: "text-sm text-slate-600",
  4: "text-sm text-slate-500",
  5: "text-sm text-slate-500",
};

const DocList: FC<Props> = ({ trees, level }) => {
  if (trees.length <= 0) {
    return null;
  }
  return (
    <ul className={`pl-${level} pb-1`}>
      {trees.map((tree, index) => {
        const HeadingWrap: FC = ({ children }) => {
          if (tree.doc?.path) {
            return <Link href={tree.doc?.path || ""}>{children}</Link>;
          }
          return <>{children}</>;
        };

        return (
          <li key={tree.doc?.path || index}>
            <HeadingWrap>
              <Heading
                level={level}
                className={classNames("my-1", levelHeadingClassMap[level])}
              >
                {tree.title ? tree.title : tree.doc?.title}
              </Heading>
            </HeadingWrap>

            <DocList trees={tree.children || []} level={level + 1} />
          </li>
        );
      })}
    </ul>
  );
};

export default DocList;
