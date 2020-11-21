const visitorKeys = {
  Program: ["childNodes"],
  '#document': ["childNodes"],
  html: ["childNodes"],
  head: ["childNodes"],
  body: ["childNodes"],
  documentType: ["childNodes"],
};

module.exports = {
  visitorKeys,
};
