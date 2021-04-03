import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useFocusContext } from "../../hooks/focus";
import { useMessageContext } from "../../hooks/messages";
import Command from "../Command";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledInput = styled.input`
  outline: none;
  background-color: transparent;
  margin: 0;
  font: inherit;
  border: none;
  color: inherit;
  text-shadow: inherit;
  width: 100%;
  padding-bottom: 20px;
`;

const Prompt: React.FC<{}> = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("");
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const { history, addCall } = useMessageContext();
  const focus = useFocusContext();

  useEffect(() => {
    inputRef.current?.focus();
  }, [focus]);

  const historyScrollUp = () => {
    var nextIndex = Math.min(historyIndex + 1, history.length);
    setHistoryIndex(nextIndex);
    setValue(valFromHistory(nextIndex));
  };
  const historyScrollDown = () => {
    var nextIndex = Math.max(historyIndex - 1, 0);
    setHistoryIndex(nextIndex);
    setValue(valFromHistory(nextIndex));
  };
  const valFromHistory = (index: number) => {
    return index === 0 ? "" : history[index - 1].call;
  };

  const testKey = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      addCall(value);
      setValue("");
      setHistoryIndex(0);
      ev.preventDefault();
    } else if (ev.key === "ArrowUp") {
      historyScrollUp();
      ev.preventDefault();
    } else if (ev.key === "ArrowDown") {
      historyScrollDown();
      ev.preventDefault();
    }
  };
  const updateMessage = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setValue(ev.target.value);
  };

  return (
    <StyledWrapper>
      <Command />
      <StyledInput
        ref={inputRef}
        type="text"
        onKeyDown={testKey}
        onChange={updateMessage}
        value={value}
      />
    </StyledWrapper>
  );
};

export default Prompt;
