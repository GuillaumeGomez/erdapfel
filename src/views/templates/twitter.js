export default (location) => {
  return `https://twitter.com/home?status=${ encodeURIComponent(location) }`;
};