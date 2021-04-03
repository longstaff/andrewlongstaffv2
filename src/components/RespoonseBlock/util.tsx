import React from "react";
import { ColourMap } from "./colours";
import { ResponseColour } from "../../const";
import Image from "../Image";

type Chainable = (nextCall?: Decorator) => Decorator;
type Splitter = (val: string) => string[];
type Decorator = (
  value: string,
  index: number
) => React.ReactChild | React.ReactChild[];

const parseThroughVal: Decorator = (val) => val;
const parseAlternate = (
  base: Decorator = parseThroughVal,
  active: Decorator = parseThroughVal
): Decorator => (val, ind) =>
  ind % 2 === 0 ? base(val, ind) : active(val, ind);
const makeValArr: Chainable = (nextCall = parseThroughVal) => (val, ind) => {
  let ret = nextCall(val, ind);
  if (!Array.isArray(ret)) ret = [ret];
  return ret;
};

const makeChainable = (split: Splitter, decorate: Decorator): Chainable => (
  nextCall = parseThroughVal
) => (value) =>
  Array.prototype.concat.call(
    [],
    split(value).map(makeValArr(parseAlternate(nextCall, decorate)))
  );

const addHighlights: Decorator = (val, key) => {
  const Component = ColourMap[ResponseColour.GREEN];
  return <Component key={key}>{val}</Component>;
};
const addLink: Decorator = (val, key) => {
  const Component = ColourMap[ResponseColour.BLUE];
  return <Component key={key}>{val.split("::")[0]}</Component>;
};
const addImg: Decorator = (val, key) => (
  <Image key={key} src={`${process.env.PUBLIC_URL}/${val}`} />
);

const getHighlights: Splitter = (val) => val.split(/\*{2,2}/);
const getLinks: Splitter = (val) => val.split(/\*{3,3}/);
const getImgs: Splitter = (val) => val.split(/[[\]]/);

const getHighlightsVals: Chainable = makeChainable(
  getHighlights,
  addHighlights
);
const getLinksVals: Chainable = makeChainable(getLinks, addLink);
const getImgsVals: Chainable = makeChainable(getImgs, addImg);

export const parseResponse: Decorator = (value, index) => {
  let highlights = getHighlightsVals(parseThroughVal);
  let links = getLinksVals(highlights);
  let images = getImgsVals(links);

  return images(value, index);
};
