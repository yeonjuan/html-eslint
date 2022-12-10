import React, { FC, HTMLProps } from "react";

type Props = {
  level: number;
} & HTMLProps<HTMLHeadingElement>;

const Heading: FC<Props> = ({ level, ...rest }) => {
  if (level === 1) {
    return <h1 {...rest} />;
  }
  if (level === 2) {
    return <h2 {...rest} />;
  }
  if (level === 3) {
    return <h3 {...rest} />;
  }
  if (level === 4) {
    return <h4 {...rest} />;
  }
  return <h5 {...rest} />;
};

export default Heading;
