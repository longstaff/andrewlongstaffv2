import { ResponseColour } from "./const";

export type Response = {
  value: string;
  colour?: ResponseColour;
};
export type Message = {
  call: string;
  response: Response[];
  id: string;
};

export type MessageParam = {
  command: string[];
  output: string[];
};
export type MessageJSON = {
  command: string[];
  output?: string[];
  help?: string;
  params?: MessageParam[];
};
