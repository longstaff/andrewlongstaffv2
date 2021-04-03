import React from 'react';
import styled from 'styled-components';
import Command from '../Command';

interface Props {
    value: string
}

const StyledWrapper = styled.div`
    display: flex;
    flex-direction: row;
`
const StyledText = styled.p`
    margin: 0;
    padding: 0;
`

const Call:React.FC<Props> = ({ value }) => {
    return (
      <StyledWrapper>
        <Command />
        <StyledText>{value}</StyledText>
      </StyledWrapper>
    );
}

export default Call;