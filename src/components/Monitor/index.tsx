import React from "react";
import styled from "styled-components";
import { useLoadingContext } from "../../hooks/messages";
import History from "../History";
import Prompt from "../Prompt";

const StyledWrapper = styled.div`
  padding: 20px;
`;

const Monitor: React.FC<{}> = () => {
  const loading = useLoadingContext();

  return (
    <StyledWrapper>
      <History prompt={!loading} />
      {loading ? null : <Prompt />}
    </StyledWrapper>
  );
};

export default Monitor;
