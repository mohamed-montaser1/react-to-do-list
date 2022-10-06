import React, { useState, useEffect } from "react";
import "./App.css";
import Message from "./Components/Message";
import Preview from "./Components/Preview";
import NotesContainer from "./Components/Notes/NotesContainer";
import NotesList from "./Components/Notes/NotesList";
import NoteItem from "./Components/Notes/NoteItem";
import Alert from "./Components/Alert";
function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [validationError, setValidationError] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("notes")) {
      setNotes(JSON.parse(localStorage.getItem("notes")));
    } else {
      localStorage.setItem("notes", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    if (validationError !== 0) {
      setTimeout(() => {
        setValidationError([]);
      }, 5000);
    }
  }, [validationError]);

  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const validate = () => {
    const validationError = [];
    let passed = true;

    if (!title) {
      validationError.push("write task's title");
      passed = false;
    }

    if (!content) {
      validationError.push("write task's content");
      passed = false;
    }

    setValidationError(validationError);

    return passed;
  };

  // change title
  const changeTitleHandler = (event) => {
    setTitle(event.target.value);
  };

  // change content
  const changeContentHandler = (event) => {
    setContent(event.target.value);
  };

  // save note

  const saveNoteHandler = () => {
    if (!validate()) return;

    let note = {
      id: new Date(),
      title: title,
      content: content,
    };

    const updatedNotes = [...notes, note];
    saveToLocalStorage("notes", updatedNotes);
    setNotes(updatedNotes);
    setCreating(false);
    setSelectedNote(note.id);
    setTitle("");
    setContent("");
  };

  const selectedNoteHandler = (noteId) => {
    setSelectedNote(noteId);
    setEditing(false);
    setCreating(false);
  };

  const editNoteHandler = () => {
    const note = notes.find((note) => note.id === selectedNote);
    setEditing(true);
    setTitle(note.title);
    setContent(note.content);
  };

  // update note handler
  const updateNoteHandler = () => {
    if (!validate()) return;

    const updatedNotes = [...notes];
    const noteIndex = updatedNotes.findIndex(
      (note) => note.id === selectedNote
    );
    updatedNotes[noteIndex] = {
      id: selectedNote,
      title: title,
      content: content,
    };
    saveToLocalStorage("notes", updatedNotes);
    setNotes(updatedNotes);
    setEditing(false);
    setTitle("");
    setContent("");
  };

  // delete note handler
  const deleteNoteHandler = () => {
    const updatedNotes = [...notes];
    const noteIndex = updatedNotes.findIndex(
      (note) => note.id === selectedNote
    );
    updatedNotes.splice(noteIndex, 1);
    saveToLocalStorage("notes", updatedNotes);
    setNotes(updatedNotes);
    setSelectedNote(null);
  };

  const getAddNote = () => {
    return (
      <div>
        <h2>Add New Note</h2>
        <div>
          <input
            type="text"
            name="title"
            className="form-input mb-30"
            placeholder="Title"
            value={title}
            onChange={changeTitleHandler}
          />

          <textarea
            rows="10"
            name="content"
            className="form-input"
            placeholder="Content"
            value={content}
            onChange={changeContentHandler}
          />

          <a href="#" className="button green" onClick={saveNoteHandler}>
            Save
          </a>
        </div>
      </div>
    );
  };

  const getPreview = () => {
    if (notes.length === 0) {
      return <Message title="No Notes Yet" />;
    }

    if (!selectedNote) {
      return <Message title="Please Select Note" />;
    }

    const note = notes.find((note) => {
      return note.id === selectedNote;
    });

    let noteDisplay = (
      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    );

    if (editing) {
      noteDisplay = (
        <div>
          <h2>Editing Note</h2>
          <form>
            <input
              type="text"
              name="title"
              className="form-input mb-30"
              placeholder="Title"
              value={title}
              onChange={changeTitleHandler}
            />
            <textarea
              rows="10"
              name="content"
              className="form-input"
              placeholder="Content"
              value={content}
              onChange={changeContentHandler}
            />
            <a href="#" className="button green" onClick={updateNoteHandler}>
              Save
            </a>
          </form>
        </div>
      );
    }

    return (
      <div>
        {!editing && (
          <div className="note-operations">
            <a href="#" onClick={editNoteHandler}>
              <i className="fa fa-pencil-alt" />
            </a>
            <a href="#" onClick={deleteNoteHandler}>
              <i className="fa fa-trash" />
            </a>
          </div>
        )}
        {noteDisplay}
      </div>
    );
  };

  const AddNoteHandler = () => {
    setCreating(true);
    setEditing(false);
    setTitle("");
    setContent("");
  };

  return (
    <div className="App">
      <NotesContainer>
        <NotesList>
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              title={note.title}
              noteClicked={() => selectedNoteHandler(note.id)}
              active={selectedNote === note.id}
            />
          ))}
        </NotesList>
        <button className="add-btn" onClick={AddNoteHandler}>
          +
        </button>
      </NotesContainer>
      <Preview>{creating ? getAddNote() : getPreview()}</Preview>
      {validationError.length !== 0 && (
        <Alert validationMessages={validationError} />
      )}
    </div>
  );
}

export default App;
