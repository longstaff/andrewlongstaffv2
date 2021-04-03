import React, {
  useContext,
  useState,
  createContext,
  useEffect,
  useCallback,
} from "react";
import { v4 } from "uuid";
import { Message, MessageJSON } from "../types";
import { ResponseColour } from "../const";
import { getStoredMessages, setStoredMessages } from "../util/localstorage";
import messageFactory, { MessageFactory } from "../util/messages";
import { useSetFlicker } from "./flicker";
import { useSetFocus } from "./focus";

interface Props {
  messages: MessageJSON[];
}

type FactoryWrapper = { factory?: MessageFactory };
type MessageList = {
  history: Message[];
  loading: boolean;
  setHistory: (message: Message[]) => void;
  setLoading: (load: boolean) => void;
  factory: FactoryWrapper;
};

const MessageContext = createContext<MessageList>({
  history: [],
  loading: false,
  setHistory: () => {},
  setLoading: () => {},
  factory: {},
});

const padTime = (num: number): string => {
  if (num < 10) return `0${num}`;
  return num.toString(10);
};
const getDateString = (date: Date) => {
  return `${padTime(date.getDate())}/${padTime(
    date.getMonth() + 1
  )}/${date.getFullYear()}, ${padTime(date.getHours())}:${padTime(
    date.getMinutes()
  )}:${padTime(date.getSeconds())}`;
};

const INTRO_KEY = "intro_line";
const getIntro = () => ({
  call: "",
  id: INTRO_KEY,
  response: [
    {
      value: "Welcome to Andrew Longstaff Terminal! (v 2.0.0)",
      colour: ResponseColour.PURPLE,
    },
    { value: getDateString(new Date()), colour: ResponseColour.PURPLE },
    {
      value: "Documentation: type 'help' for command list",
      colour: ResponseColour.PURPLE,
    },
  ],
});
const getSessionEnd = () => ({
  call: "",
  id: v4(),
  response: [
    { value: "Session ended", colour: ResponseColour.GREY },
    { value: "=============", colour: ResponseColour.GREY },
  ],
});
const getWelcome = () => ({
  call: "",
  id: v4(),
  response: [
    {
      value: "Welcome back to Andrew Longstaff Terminal! (v 2.0.0)!",
      colour: ResponseColour.PURPLE,
    },
    { value: getDateString(new Date()), colour: ResponseColour.PURPLE },
    {
      value: "Documentation: type 'help' for command list",
      colour: ResponseColour.PURPLE,
    },
  ],
});

export const MessageProvider: React.FC<Props> = ({ children, messages }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<Message[]>([]);
  const [factory, setFactory] = useState<FactoryWrapper>({});
  const setFlicker = useSetFlicker();

  //Get history from storage, or play a welcome message
  useEffect(() => {
    const stored = getStoredMessages();
    if (stored.length) {
      setHistory(stored.concat([getSessionEnd(), getWelcome()]));
    } else {
      setHistory([getIntro()]);
    }
  }, []);

  // Record history into local storage
  useEffect(() => {
    setStoredMessages(history);
  }, [history]);

  useEffect(() => {
    const factory = messageFactory({
      clearHistory: () => setHistory([]),
      setFlicker: (flicker) => setFlicker(flicker),
      openLink: (link) => setTimeout(() => window.open(link, "_blank"), 200),
      messages,
    });

    setFactory({ factory });
  }, [setHistory, setFlicker, setFactory, messages]);

  return (
    <MessageContext.Provider
      value={{ history, loading, setLoading, setHistory, factory }}
    >
      {children}
    </MessageContext.Provider>
  );
};

const addMessage = async (
  context: MessageList,
  message: Message,
  setFocus: () => void
) => {
  context.setLoading(true);
  context.setHistory(
    context.history.concat({
      id: message.id,
      call: message.call,
      response: [],
    })
  );

  for (let i = 0; i < message.response.length; i++) {
    await new Promise((pass) => {
      setTimeout(pass, Math.round(Math.random() * (i === 0 ? 1000 : 100)));
    });

    context.setHistory(
      context.history.concat({
        id: message.id,
        call: message.call,
        response: message.response.slice(0, i + 1),
      })
    );
    setFocus();
  }
  context.setLoading(false);
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  const setFocus = useSetFocus();
  const addCall = useCallback(
    (call: string) => {
      if (context.factory.factory) {
        const message = context.factory.factory(call);
        if (message) {
          addMessage(context, message, setFocus);
        }
      }
    },
    [setFocus, context]
  );

  return {
    history: context.history,
    addCall,
  };
};
export const useLoadingContext = () => {
  const cont = useContext(MessageContext);
  return cont.loading;
};
