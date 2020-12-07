import React from "react";
import ReactDom from "react-dom";
import Playground from "./playground";
import "core-js/stable";
import "regenerator-runtime/runtime";

ReactDom.render(<Playground />, document.getElementById("playground"));
