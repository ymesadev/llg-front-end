export const limitText = (text, limit = 200) => {
  if (!text) return "";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};
