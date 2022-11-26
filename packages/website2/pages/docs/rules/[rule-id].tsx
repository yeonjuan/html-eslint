import {GetStaticPaths} from 'next';

export default function Home() {
  return <div>All Rules</div>;
}

export const getStaticProps:GetStaticPaths = () => {
 return {
  paths:['ruleID'],
  fallback: false
 }
}