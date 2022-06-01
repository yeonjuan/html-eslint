/* eslint-disable no-undef */
expect.extend({
  toMatchPos(received, pos) {
    let pass = false;
    let message = "";
    if (received.range[0] !== pos.range[0]) {
      message = `Expect range[0] (${received.range[0]}) to be a ${pos.range[0]}`;
    } else if (received.range[1] !== pos.range[1]) {
      message = `Expect range[1] (${received.range[1]}) to be a ${pos.range[1]}`;
    } else if (received.start !== pos.range[0]) {
      message = `Expect start (${received.start}) to be a ${pos.range[0]}`;
    } else if (received.end !== pos.range[1]) {
      message = `Expect end (${received.end}) to be a ${pos.range[1]}`;
    }else if (received.loc.start.column !== pos.loc[0].column) {
      message = `Expect start column (${received.loc.start.column}) to be a ${pos.loc[0].column}`;
    } else if (received.loc.end.column !== pos.loc[1].column) {
      message = `Expect end column (${received.loc.end.column}) to be a ${pos.loc[1].column}`;
    } else if (received.loc.start.line !== pos.loc[0].line) {
      message = `Expect start line (${received.loc.start.line}) to be a ${pos.loc[0].line}`;
    } else if (received.loc.end.line !== pos.loc[1].line) {
      message = `Expect end line (${received.loc.end.line}) to be a ${pos.loc[1].line}`;
    } else {
      pass = true;
    }
    return {
      pass,
      message: () => message,
    };
  },
});
