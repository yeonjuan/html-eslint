import * as path from 'path';

import {getFilePaths, getMarkdownData} from '../../utils/docs'
import { GetStaticPaths, GetStaticProps } from "next";

const MD_EXT = '.md';
const DOCS_DIR = path.join(process.cwd(), '../../docs');

type Props = {
  html: string;
}

export default function DocId({html}: Props) {
  return <div dangerouslySetInnerHTML={{__html: html}}></div>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getFilePaths(DOCS_DIR);
  const mdPaths = paths.filter(p => p.endsWith(MD_EXT));
  return {
    paths: mdPaths.map(p => ({
      params: {'doc-id': path.basename(p, MD_EXT)}
    })),
    fallback: false
  };
}

export const getStaticProps: GetStaticProps  = async (context) => {
  const mdPath = path.join(DOCS_DIR, context.params?.['doc-id'] + '.md');
  const {html, data} = await getMarkdownData(mdPath);
  return {
    props: {
      html,
      data
    }
  }
}