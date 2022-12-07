import { FC } from "react";

type Props = {
  code: string;
};

const FixerResult: FC<Props> = ({ code }) => {
  return <pre className="text-[12px]">{code}</pre>;
};

export default FixerResult;
