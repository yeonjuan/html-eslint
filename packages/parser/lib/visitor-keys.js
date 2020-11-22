const visitorKeys = {
  Program: ["childNodes"],
  "#document": ["childNodes"],
  html: ["childNodes"],
  head: ["childNodes"],
  body: ["childNodes"],
};

module.exports = {
  visitorKeys,
};
