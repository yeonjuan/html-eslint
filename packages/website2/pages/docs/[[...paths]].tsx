import { GetStaticPaths, GetStaticProps } from "next";
import { inspect } from "util";
import DocAside from "../../components/DocAside";
import DOCS_DATA, {DocData, DocTree} from "../../data/docs";
import { getMarkdownHTML } from "../../utils/docs";

type Props = {
  html: string;
  trees: DocTree[];
};

export default function Docs({ html, trees }: Props) {
  return (
    <div className="relative flex">
      <DocAside trees={trees}/>
      {/* <aside className="sticky overflow-y-auto top-[60px] py-4 flex-[0_0_240px] border-r-slate-300 border-r-[1px]" style={{height: 'calc(100vh - 60px)'}}>
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
        </ul> */}
     
        {/* <ul>
          {
            Object.values(docs).map(data => <li key={data.title}>{data.title}</li>)
          }
        </ul> */}
      {/* </aside> */}
      <article
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
    </div>
  );
}


function traverse(docs: DocTree[], callback: (doc: DocTree) => void) {
  docs.forEach(doc => {
    callback(doc);
    traverse(doc.children || [], callback);
  });
}

function findByPath(docs: DocTree[], path: string, callback: (doc: DocTree) => void) {
  docs.some(doc => {
    if (doc.doc?.path === path) {
      callback(doc);
      return true;
    }
    return findByPath(doc.children || [], path, callback);
  });
}

export const getStaticPaths: GetStaticPaths = () => {
  const paths: {
    params: {
       paths: string[];
    };
  }[] = [];

  traverse(DOCS_DATA, (doc: DocTree) => {
    if (doc.doc?.path) {
      paths.push({
        params: {
          paths: doc.doc.path.split("/").filter(p => p && p !== 'docs'),
        }
      })
    }
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const paths = (context.params?.paths || []) as string[];
  const key = `/docs/${paths.join("/")}`;
  let html: Promise<string>; 
  findByPath(DOCS_DATA, key, doc => {
    if (doc.doc) {
      html = getMarkdownHTML(doc.doc);
    }
  });
  
  // @ts-ignore
  if (!await html) {
    throw new Error('');
  }
  return {
    props: {
      html: await html!,
      trees: DOCS_DATA
    },
  };
};
