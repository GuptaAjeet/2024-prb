import React, { useEffect, useState } from "react";
import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBold, faHeading, faListUl, faListOl } from '@fortawesome/free-solid-svg-icons';
import draftToHtml from "draftjs-to-html";

const RichTextEditor = ({ onChange, onChangeText, value }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const onBoldClick = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const onHeaderClick = (headerType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, headerType));
  };

  const onListClick = (listType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, listType));
  };

  return (
    <div
      className=""
      style={{
        border: "1px solid #555",
        minHeight: "8em",
        cursor: "text",
        borderRadius: "3px",
      }}
    >
      <div className="btn-group" role="group" aria-label="Formatting">
        <button className="btn btn-light" onClick={() => onBoldClick("BOLD")}>
          <i className="bi bi-type-bold"></i>
        </button>
        <button
          className="btn btn-light"
          onClick={() => onBoldClick("UNDERLINE")}
        >
          <i className="bi bi-type-underline"></i>
        </button>
        <button
          className="btn btn-light"
          onClick={() => onHeaderClick("header-one")}
        >
          <i className="bi bi-type-h1"></i>
        </button>
        <button
          className="btn btn-light"
          onClick={() => onHeaderClick("header-two")}
        >
          <i className="bi bi-type-h2"></i>
        </button>
        <button
          className="btn btn-light"
          onClick={() => onHeaderClick("header-three")}
        >
          <i className="bi bi-type-h3"></i>
        </button>
        <button
          className="btn btn-light"
          onClick={() => onListClick("unordered-list-item")}
        >
          <i className="bi bi-list-ul"></i>
        </button>
        <button
          className="btn btn-light"
          onClick={() => onListClick("ordered-list-item")}
        >
          <i className="bi bi-list-ol"></i>
        </button>
      </div>
      <div
        className="editor"
        style={{
          border: "1px solid #555",
          minHeight: "9em",
          cursor: "text",
          borderRadius: "3px",
        }}
      >
        <Editor
          className="text-editor"
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={(newState) => {
            setEditorState(newState);
            const contentState = newState.getCurrentContent();
            const rawContentState = convertToRaw(contentState);
            onChange(draftToHtml(rawContentState));

            let text = "";
            rawContentState.blocks.forEach((block) => {
              text += `${block.text}\n`;
            });
            text.trim();

            onChangeText(text);
          }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
