import React from "react";

const NoteItem = (props) => {
  const { title, noteClicked, active } = props;
  return (
    <li className={`note-item ${active && "active"}`} onClick={noteClicked}>
      {title}
    </li>
  );
};

export default NoteItem;
