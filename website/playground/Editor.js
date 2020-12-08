import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "codemirror";
import debounce from "./debounce";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/htmlmixed/htmlmixed.js";

function toMarkerPos(pos) {
  return pos - 1;
}

function messageToMarker(message) {
  const from = {
    line: toMarkerPos(message.line),
    ch: toMarkerPos(message.column),
  };
  const to = {
    line: toMarkerPos(message.endLine || message.line),
    ch: toMarkerPos(message.endColumn || message.column),
  };
  return [from, to];
}

const Editor = (props) => {
  const ref = useRef(null);
  const [editor, setEditor] = useState(null);
  const [text, setText] = useState(props.initial || "");
  const [errorMarkers, setErrorMarkers] = useState([]);
  useEffect(() => {
    if (ref.current) {
      const codeMirror = CodeMirror.fromTextArea(ref.current, {
        mode: "text/html",
        lineNumbers: true,
        showCursorWhenSelecting: true,
        matchBrackets: true,
      });
      setEditor(codeMirror);
      codeMirror.on(
        "change",
        debounce(() => {
          const value = codeMirror.getValue();
          setText(value);
          props.onChange(value);
        }, 250)
      );
    }
  }, []);

  useEffect(() => {
    const markers = props.messages.map(messageToMarker);
    errorMarkers.forEach((marker) => marker.clear());
    if (markers && editor) {
      setErrorMarkers(
        markers.map(([start, end]) =>
          editor.markText(start, end, {
            className: "editor_error",
          })
        )
      );
    }
  }, [props.messages, editor]);

  return (
    <textarea
      id="html-editor"
      autoComplete="off"
      ref={ref}
      value={text}
      readOnly
    />
  );
};

export default Editor;
