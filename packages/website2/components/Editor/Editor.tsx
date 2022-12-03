import { FC, useEffect, useRef, useState } from "react";
import type { Linter } from "eslint";
import "codemirror/lib/codemirror.css";
import type { Editor as CodeMirrorEditor } from "codemirror";
import toMarker from "./toMarker";

type Props = {
  onChange: (value: string) => void;
  messages: Linter.LintMessage[];
};

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
          <div>
        <li> foo </li>
        </div>
    </body>
</html>
`;

const Editor: FC<Props> = ({ messages, onChange }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<CodeMirrorEditor>();

  useEffect(() => {
    (async () => {
      if (ref.current) {
        const [CodeMirror] = await Promise.all([
          import("codemirror"),
          // @ts-ignore
          import("codemirror/mode/htmlmixed/htmlmixed.js"),
        ]);
        const instance = CodeMirror.default.fromTextArea(ref.current, {
          mode: "text/html",
          lineNumbers: true,
          showCursorWhenSelecting: true,
        });
        instance.setValue(DEFAULT_HTML);
        onChange(instance.getValue());
        instance.on("change", (editor) => {
          onChange(editor.getValue());
        });
        editorRef.current = instance;
      }
    })();
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      messages.map(toMarker).map(([start, end]) =>
        editorRef.current?.markText(start, end, {
          startStyle: "editor_error",
        })
      );
    }
  }, [messages]);

  return (
    <div className="border-[1px] border-slate rounded">
      <textarea autoComplete="off" ref={ref} />
    </div>
  );
};

export default Editor;
