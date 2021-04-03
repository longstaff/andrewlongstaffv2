import ReactGA from "react-ga";
import { v4 } from "uuid";
import { Message, MessageJSON } from "../types";
import { ResponseColour } from "../const";

type Commands = {
  clearHistory: () => void;
  setFlicker: (flicker: boolean) => void;
  openLink: (link: string) => void;
  messages: MessageJSON[];
};
type CommandHelp = { command: string; man: string };
type Handler = (call: string, arg: string[], command: string) => Message | null;
export type MessageFactory = (call: string) => Message | null;

const joinParams = (params: string[]): string => params.join("|");

const splitArguments = (input: string = "") => {
  const split = input.split(/\s/).map((val) => val.toLowerCase());
  return {
    command: split[0],
    arguments: split.slice(1),
  };
};

const simpleMessage = (call: string, response: string[]): Message => ({
  call,
  response: response.map((value) => ({ value })),
  id: v4(),
});

const sendNotFound: Handler = (call: string) =>
  simpleMessage(call, [
    `${call}: command not found, please type 'help' for command list`,
  ]);
const getArgumentInvalid = (
  call: string,
  number: number,
  command: string
): Message =>
  simpleMessage(call, [
    `${command} only supports ${number} argument${
      number !== 1 ? "s" : ""
    }. please check your input and try again`,
  ]);
const getArgumentNotFound = (
  call: string,
  arg: string,
  command: string
): Message =>
  simpleMessage(call, [
    `${command} does not support '${arg}' please check your input and try again`,
  ]);

const getArgResponse = (
  defaultResponse: Handler,
  linkMap: { [key: string]: Handler },
  maxArgs: number = 1
): Handler => (call, args, command) => {
  if (args.length > maxArgs) {
    return getArgumentInvalid(call, maxArgs, command);
  } else if (args.length > 0) {
    if (linkMap[joinParams(args)])
      return linkMap[joinParams(args)](call, args, command);
    return getArgumentNotFound(call, args.join(" "), command);
  } else {
    return defaultResponse(call, args, command);
  }
};

const messageFactory = (commands: Commands): MessageFactory => {
  const commandMap: { [key: string]: Handler } = {};
  const linkMap: { [key: string]: Handler } = {};
  const helpList: CommandHelp[] = [];

  commandMap.notFound = sendNotFound;

  /* *********************** Clear ************************** */
  const COMMAND_CLEAR = "clear";

  const clearHistory: Handler = (call) => {
    commands.clearHistory();
    return null;
  };
  helpList.push({ command: COMMAND_CLEAR, man: "Clear the console" });
  commandMap[COMMAND_CLEAR] = clearHistory;

  /* *********************** Flicker ************************** */
  const COMMAND_FLICKER = "flicker";

  const switchFlickerOn: Handler = (call) => {
    commands.setFlicker(true);
    return simpleMessage(call, ["Flicker enabled"]);
  };
  const switchFlickerOff: Handler = (call) => {
    commands.setFlicker(false);
    return simpleMessage(call, ["Flicker disabled"]);
  };

  const flickerMap: { [key: string]: Handler } = {
    on: switchFlickerOn,
    yes: switchFlickerOn,
    y: switchFlickerOn,
    off: switchFlickerOff,
    no: switchFlickerOff,
    n: switchFlickerOff,
  };

  const getFlickerDefault: Handler = (call) =>
    simpleMessage(call, ["Set flicker with argument:", "**on**", "**off**"]);

  const getFlicker: Handler = getArgResponse(getFlickerDefault, flickerMap);
  helpList.push({
    command: COMMAND_FLICKER,
    man: "Adjust animations on website",
  });
  commandMap[COMMAND_FLICKER] = getFlicker;
  commandMap["f"] = getFlicker;

  /* *********************** Colours ************************** */
  const COMMAND_COLOURS = "colours";

  const colourArray = [
    { value: "white", colour: ResponseColour.WHITE },
    { value: "grey", colour: ResponseColour.GREY },
    { value: "red", colour: ResponseColour.RED },
    { value: "purple", colour: ResponseColour.PURPLE },
    { value: "blue", colour: ResponseColour.BLUE },
    { value: "green", colour: ResponseColour.GREEN },
    { value: "yellow", colour: ResponseColour.YELLOW },
  ];

  const getColours: Handler = (call, args) => {
    let useArray = colourArray;
    if (args.length) {
      useArray = colourArray.filter(
        (colour) => args.indexOf(colour.value) > -1
      );
      if (useArray.length === 0) {
        useArray = [
          {
            value: `No matching colours: ${args.join()}`,
            colour: ResponseColour.WHITE,
          },
        ];
      }
    }

    return {
      call,
      response: useArray,
      id: v4(),
    };
  };

  helpList.push({
    command: COMMAND_COLOURS,
    man: "List all the pretty colours of the command output",
  });
  commandMap[COMMAND_COLOURS] = getColours;
  commandMap["colors"] = getColours;
  commandMap["colour"] = getColours;
  commandMap["getColours"] = getColours;

  /* *********************************************************************** */
  /* **************************** Run Mapper ******************************* */
  /* *********************************************************************** */

  const testInMessage = (output: string[], test: RegExp): string[] =>
    output
      .map((line) => line.split(test).filter((_, ind) => ind % 2 === 1))
      .reduce((acc, list) => acc.concat(list), []);

  const decorateMessage = (call: string, command: string, output: string[]) => {
    const out: string[] = output.slice();
    const pages = testInMessage(out, /[^*]\*{2,2}[^*]/);
    const links = testInMessage(out, /[^*]\*{3,3}[^*]/);

    if (links.length || pages.length) out.push(" ");
    if (links.length)
      out.push("To follow a highlighted link type 'open {link}'");
    if (pages.length)
      out.push(
        `For more info on a highlighted topic type '${command} {subject}'`
      );

    return simpleMessage(call, out);
  };

  commands.messages.forEach((message) => {
    let links: string[] = [];
    if (message.output)
      links = links.concat(testInMessage(message.output, /[^*]\*{3,3}[^*]/));
    if (message.params) {
      message.params.forEach(({ output }) => {
        links = links.concat(testInMessage(output, /[^*]\*{3,3}[^*]/));
      });
    }
    if (links.length) {
      links.forEach((link) => {
        const [name, url] = link.split("::");
        linkMap[name] = (call) => triggerLink(call, url);
      });
    }

    if (message.help) {
      helpList.push({ command: message.command[0], man: message.help });
    }
    let response: Handler | null = null;
    let outputResponse: Handler | null = null;

    if (message.output !== undefined) {
      outputResponse = (call, args, command) =>
        decorateMessage(call, command, message.output as string[]);
    }

    if (message.params) {
      const paramMap: { [key: string]: Handler } = {};
      let maxArgs = 0;

      const defaultResponse: Handler = outputResponse
        ? outputResponse
        : (call, args, command) =>
            simpleMessage(call, [`${command} needs to be passed parameters`]);

      message.params.forEach((param) => {
        maxArgs = Math.max(maxArgs, param.command.length);
        paramMap[joinParams(param.command)] = (call, args, command) =>
          decorateMessage(call, command, param.output);
      });

      response = getArgResponse(defaultResponse, paramMap, maxArgs);
    } else {
      if (outputResponse) {
        response = outputResponse;
      } else {
        response = (call, args, command) =>
          simpleMessage(call, [`${command} needs to be passed parameters`]);
      }
    }

    message.command.forEach((command) => {
      commandMap[command] = response as Handler;
    });
  });

  /* *********************** Open ************************** */
  const COMMAND_OPEN = "open";

  const getOpenDefault: Handler = (call) =>
    simpleMessage(call, ["Open has to be passed a link"]);

  const triggerLink = (call: string, link: string): Message => {
    commands.openLink(link);
    return simpleMessage(call, [
      `Opening url: ***${link}***`,
      "If window did not open check popup blockers and try again.",
    ]);
  };

  const openLink: Handler = getArgResponse(getOpenDefault, linkMap);
  helpList.push({ command: COMMAND_OPEN, man: "Open a link" });
  commandMap[COMMAND_OPEN] = openLink;

  /* *********************** Help ************************** */
  const COMMAND_HELP = "help";

  helpList.push({
    command: COMMAND_HELP,
    man: "Warning: Cyclical reference detected",
  });

  function getHelpFromArr(arr: CommandHelp[]) {
    const maxLength = arr.reduce((prev, next) => {
      const nextLength =
        next.command.length > prev ? next.command.length : prev;
      return nextLength;
    }, 0);
    const padding = new Array(maxLength + 1).join(" ");
    const commands = arr
      .sort((a, b) => {
        if (a.command < b.command) return -1;
        if (a.command > b.command) return 1;
        return 0;
      })
      .map((val) => {
        const padCommand = `${val.command}${padding}`.slice(0, maxLength + 1);
        return `${padCommand} - ${val.man}`;
      });
    return commands;
  }

  const getHelp: Handler = (call, args, command) => {
    if (args.length) {
      const filtered = helpList.filter((val) => args.indexOf(val.command) > -1);
      if (filtered.length === 0)
        return getArgumentNotFound(call, args.join(" "), command);
      return simpleMessage(call, getHelpFromArr(filtered));
    } else {
      return simpleMessage(
        call,
        ["Available commands:"].concat(
          getHelpFromArr(helpList.filter((val) => val.command !== COMMAND_HELP))
        )
      );
    }
  };

  commandMap[COMMAND_HELP] = getHelp;
  commandMap["man"] = getHelp;

  /* *********************** Factory ************************** */

  const factory = (call: string) => {
    const input = splitArguments(call);

    ReactGA.event({
      category: input.command,
      action: input.arguments.join(", "),
    });
    return (commandMap[input.command] || commandMap.notFound)(
      call,
      input.arguments,
      input.command
    );
  };

  return factory;
};
export default messageFactory;
