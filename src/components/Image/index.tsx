import React from "react";
import styled from "styled-components";
import { useSetFocus } from "../../hooks/focus";

interface Props {
  src: string;
}

const StyledImage = styled.img`
  width: 100%;
`;

const Image: React.FC<Props> = ({ src, ...props }) => {
  const focus = useSetFocus();

  return (
    <StyledImage
      src={`${process.env.PUBLIC_URL}${src}`}
      alt=""
      onLoad={() => focus()}
      {...props}
    />
  );
};

export default Image;
