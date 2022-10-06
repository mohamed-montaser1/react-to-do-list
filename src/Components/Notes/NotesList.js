import React from "react";

const NotesList = (props) => (
  <ul className="notes-list">{props.children}</ul>
)

export default NotesList;
