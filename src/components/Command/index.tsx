import React from 'react';
import styled from 'styled-components';

interface Props {
    command?:string
}

const StyledCommand = styled.div`
    white-space: nowrap;
    color: #ffcc00;
    margin-right: 7px;
    user-select: none;
    float: left;
`;

const Command:React.FC<Props> = ({command = '$>'}) => {
    return <StyledCommand>{command}</StyledCommand>
}

export default Command;