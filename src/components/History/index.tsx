import React from 'react';
import styled from 'styled-components';
import { Response } from '../../types';
import { useMessageContext } from '../../hooks/messages';
import CallBlock from '../CallBlock';
import RespoonseBlock from '../RespoonseBlock';

interface Props {
  prompt: boolean
}

const StyledWrapper = styled.ol<{pad:boolean}>`
  padding: 0;
  margin: 0;
  ${({pad}) => pad ? `padding-bottom: 20px;` : ''}
`
const StyledItem = styled.li`
  list-style: none;
  padding: 2px 0;
  margin: 0;
`

const loadingResponse: Response[] = [{
  value: "..."
}];

const History:React.FC<Props> = ({prompt}) => {
    const { history } = useMessageContext();

    return (
      <StyledWrapper pad={prompt}>
        {
          history.map(val => {
            return <StyledItem key={val.id}>
              {val.call ? <CallBlock value = {val.call}/> : null}
              <RespoonseBlock value={val.response ? val.response : loadingResponse } />
            </StyledItem>
          })
        }
      </StyledWrapper>
    );
}

export default History;
