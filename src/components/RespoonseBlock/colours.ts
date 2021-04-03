import styled, { css, StyledComponent } from "styled-components";
import { ResponseColour } from "../../const";

const StyledResponse = css`
  padding: 0;
  margin: 0;
  white-space: pre-wrap;
`;

const StyledRedResponse = styled.span`
  ${StyledResponse}
  color: #f92672;
  text-shadow: 0 0 5px #f92672;
`;
const StyledYellowResponse = styled.span`
  ${StyledResponse}
  color: #e6db74;
  text-shadow: 0 0 5px #e6db74;
`;
const StyledBlueResponse = styled.span`
  ${StyledResponse}
  color: #66d9ef;
  text-shadow: 0 0 5px #66d9ef;
`;
const StyledWhiteResponse = styled.span`
  ${StyledResponse}
  color: #fff;
  text-shadow: 0 0 5px #fff;
`;
const StyledGreenResponse = styled.span`
  ${StyledResponse}
  color: #a6e22e;
  text-shadow: 0 0 5px #a6e22e;
`;
const StyledGreyResponse = styled.span`
  ${StyledResponse}
  color: #75715e;
  text-shadow: 0 0 5px #75715e;
`;
const StyledPurpleResponse = styled.span`
  ${StyledResponse}
  color: #ae81ff;
  text-shadow: 0 0 5px #ae81ff;
`;

export const ColourMap: {
  [key in ResponseColour]: StyledComponent<"span", any, {}, never>;
} = {
  [ResponseColour.BLUE]: StyledBlueResponse,
  [ResponseColour.GREEN]: StyledGreenResponse,
  [ResponseColour.GREY]: StyledGreyResponse,
  [ResponseColour.PURPLE]: StyledPurpleResponse,
  [ResponseColour.RED]: StyledRedResponse,
  [ResponseColour.WHITE]: StyledWhiteResponse,
  [ResponseColour.YELLOW]: StyledYellowResponse,
};
