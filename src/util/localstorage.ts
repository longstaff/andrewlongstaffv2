import { Message } from "../types";

export const MESSAGE_KEY = "messages.andrewlongstaff.com";

const getMessagesFromStore = (): Message[] => {
  try {
    const encoded = localStorage.getItem(MESSAGE_KEY);
    if (!encoded) return [];
    return JSON.parse(encoded) as Message[];
  } catch {
    return [];
  }
};

const setMessageToStore = (message: Message[]) => {
  try {
    localStorage.setItem(MESSAGE_KEY, JSON.stringify(message));
  } catch {}
};

export const getStoredMessages = (): Message[] => {
  return getMessagesFromStore();
};
export const setStoredMessages = (history: Message[]) => {
  setMessageToStore(history);
};
