import { toArray } from "react-emoji-render";

export const parseEmojis = value => {
  const emojisArray = toArray(value);

  const newValue = emojisArray.reduce((previous, current) => {
    if (typeof current === "string") {
      return previous + current;
    }
    return previous + current.props.children;
  }, "");

  return newValue;
};