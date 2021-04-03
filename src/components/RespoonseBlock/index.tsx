import React from "react";
import styled from "styled-components";
import { ColourMap } from "./colours";
import { parseResponse } from "./util";
import { Response } from "../../types";
import { ResponseColour } from "../../const";

interface Props {
  value: Response[];
}

const StyledLine = styled.p`
  margin: 5px 0;
  padding: 0;
`;

const RespoonseBlock: React.FC<Props> = ({ value }) => {
  const drawLine = (line: Response, ind: number) => {
    let value;
    let Component = ColourMap[ResponseColour.WHITE];

    value = parseResponse(line.value, ind);
    if (line.colour) {
      Component = ColourMap[line.colour];
    }

    return (
      <StyledLine key={ind}>
        <Component>{value}</Component>
      </StyledLine>
    );
  };

  return <div>{value.map(drawLine)}</div>;
};

export default RespoonseBlock;
