import { GetStaticPaths, GetStaticProps } from "next";
import DOCS_DATA, {DocData} from "../../data/docs";
import { getMarkdownHTML } from "../../utils/docs";

type Props = {
  html: string;
  docs: Record<string, Omit<DocData, 'markdown'>>;
};

export default function Docs({ html, docs }: Props) {
  return (
    <div className="relative flex">
      <aside className="sticky overflow-y-auto top-[60px] py-4" style={{height: 'calc(100vh - 60px)'}}>
        <ul>
          <li className="py-2">
            <h2 className="font-medium text-slate-900 text-lg">Getting Started</h2>
          </li>
          <li className="py-2">
            <h2 className="font-medium text-slate-900 text-lg">Rules</h2>
          </li>
          <li className="py-1">
            <h3 className="pl-2 font-normal text-slate-800 text-base">Best Practice</h3>
          </li>
          <li className="py-1">
            <h3 className="pl-2 font-normal text-slate-800 text-base">SEO</h3>
          </li>
          <li className="py-1">
            <h3 className="pl-2 font-normal text-slate-800 text-base">Accessibility</h3>
          </li>
          <li className="py-1">
            <h3 className="pl-2 font-normal text-slate-800 text-base">Style</h3>
          </li>
          <li className="py-2">
            <h2 className="font-medium text-slate-900 text-lg">Others</h2>
          </li>
        </ul>
     
        {/* <ul>
          {
            Object.values(docs).map(data => <li key={data.title}>{data.title}</li>)
          }
        </ul> */}
      </aside>
      <article
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  const keys = Object.keys(DOCS_DATA);
  return {
    paths: keys.map((key) => {
      return {
        params: {
          paths: key.split("/").filter((p) => p && p !== 'docs'),
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const paths = (context.params?.paths || []) as string[];
  const key = `/docs/${paths.join("/")}`;
  const data = DOCS_DATA[key];
  const html = await getMarkdownHTML(data);
  return {
    props: {
      html,
      docs: Object.entries(DOCS_DATA).reduce((docsData, [key, docData]) => {
        docsData = {
          // @ts-ignore
          ...docsData,
          [key]: {
            path: docData.path,
            title: docData.title
          }
        };
        return docsData;
      }, {})
    },
  };
};
