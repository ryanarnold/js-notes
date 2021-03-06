
/** Classes *******************************************************************/

/**
 * Represents Note object
 */
class Note {
  /**
   * Constructor
   * @param {string} text Note's text
   */
  constructor(text) {
    this.id = Math.floor(Math.random() * 99999) + 10000;
    this.text = text;
    this.dateTimeCreated = new Date();

    // Randomly pick color
    const colorDeterminer = Math.floor(Math.random() * 4) + 1;
    if (colorDeterminer === 1) {
      this.color = 'green';
    } else if (colorDeterminer === 2) {
      this.color = 'blue';
    } else if (colorDeterminer === 3) {
      this.color = 'yellow';
    } else if (colorDeterminer === 4) {
      this.color = 'red';
    }
  }
}

/** Elements ******************************************************************/

const elemNoteAdd = document.getElementById('noteAdd');
const buttonAdd = document.getElementById('btnAdd');
const buttonClear = document.getElementById('btnClear');
let elemNotes = document.querySelectorAll('.note');
const elemEmptyNotes = document.getElementById('emptyNotes');

/** Functions *****************************************************************/

/**
 * Deletes a note from the local storate
 * @param {int} noteIdToDelete Note to delete
 */
function deleteNote(noteIdToDelete) {
  let notes = JSON.parse(localStorage.getItem('notes'));
  notes = notes.filter((note) => note.id != noteIdToDelete);
  localStorage.setItem('notes', JSON.stringify(notes));
}

/**
 * Update an existing note from the local storage
 * @param {int} noteId Note to update
 * @param {string} noteText New text of note
 */
function saveNote(noteId, noteText) {
  let notes = JSON.parse(localStorage.getItem('notes'));
  notes = notes.map((note) => {
    if (note.id === noteId) {
      note.text = noteText;
      return note;
    }
    return note;
  });
  localStorage.setItem('notes', JSON.stringify(notes));
}

/**
 * Event handler for editing a note
 * @param {Element} elem Element
 */
function editNote(elem) {
  const noteP = elem.querySelector('p');

  const elemEditTextArea = document.createElement('textarea');
  elemEditTextArea.className = 'text-edit';
  elemEditTextArea.innerHTML = noteP.innerHTML.replace(/<br>/gi, '\n');
  elemEditTextArea.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.keyCode === 13) {
      const parent = event.target.closest('.col-main');
      const noteText = parent.querySelector('textarea').value;
      const noteId = parent.noteId;
      saveNote(noteId, noteText);
      loadSavedNotes();
    } else if (event.keyCode === 27) {
      loadSavedNotes();
    }
  });
  elem.append(elemEditTextArea);

  const btnDiscard = document.createElement('button');
  btnDiscard.className = 'btn btn-edit btn-discard';
  btnDiscard.innerHTML = 'Discard';
  btnDiscard.addEventListener('click', loadSavedNotes);
  elem.append(btnDiscard);

  const btnSave = document.createElement('button');
  btnSave.className = 'btn btn-edit btn-save';
  btnSave.innerHTML = 'Save';
  btnSave.addEventListener('click', () => {
    const parent = event.target.closest('.col-main');
    const noteText = parent.querySelector('textarea').value;
    const noteId = parent.noteId;
    saveNote(noteId, noteText);
    loadSavedNotes();
  });

  elem.append(btnSave);

  elem.editing = 'true';

  noteP.remove();
  textAreaInit();
}

/**
 * Bind note events
 */
function bindNoteEvents() {
  elemNotes.forEach((elem) => {
    elem.addEventListener('mouseover', (event) => {
      if (elem.editing === 'false') {
        elem.querySelector('.btn-delete').hidden = false;
      }
    });

    elem.addEventListener('mouseout', (event) => {
      elem.querySelector('.btn-delete').hidden = true;
    });

    elem.addEventListener('click', () => {
      editNote(elem);
    }, {once: true});

    const buttonDelete = elem.querySelector('.btn-delete');

    buttonDelete.addEventListener('click', (event) => {
      event.preventDefault();
      deleteNote(elem.noteId);
      loadSavedNotes();
    });
  });
}

/**
 * Event handler for creating a note
 */
function createNote() {
  const text = elemNoteAdd.value.trimRight();

  // Exit if note is empty
  if (!text) {
    alert('Empty note!');
    return;
  }

  const note = new Note(text);

  // Try to load 'notes' list in local storage
  let notes = JSON.parse(localStorage.getItem('notes'));

  // If 'notes' list already exists in local storage append , else create new
  if (notes) {
    notes.push(note);
  } else {
    notes = [note];
  }
  localStorage.setItem('notes', JSON.stringify(notes));

  // Clear textarea
  elemNoteAdd.value = '';

  // Load notes again
  loadSavedNotes();
}

/**
 * Refresh notes feed
 */
function loadSavedNotes() {
  const notes = JSON.parse(localStorage.getItem('notes'));

  const elemTop = document.querySelector('.subheading');

  // Clear notes list display
  document.querySelectorAll('.note').forEach((e) => e.remove());

  if (notes && notes.length != 0) {
    elemEmptyNotes.hidden = true;
    for (const note of notes) {
      note.textHTML = note.text.replace(/\r\n|\r|\n/gi, '<br>');

      const elemNote = document.createElement('div');
      elemNote.className = 'col-main note ' + note.color;
      elemNote.noteId = note.id;
      elemNote.editing = 'false';
      elemNote.innerHTML = `
        <a href="" class="btn-delete" hidden>
          <i class="gg-close"></i>
        </a>
        <p>${note.textHTML}</p>`;

      elemTop.after(elemNote);
    }
  } else {
    elemEmptyNotes.hidden = false;
  }

  elemNotes = document.querySelectorAll('.note');
  bindNoteEvents();
}

/** Event Binding *************************************************************/

// Trigger note saving on CTRL + ENTER shortcut
elemNoteAdd.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.keyCode === 13) {
    createNote();
  }
});

// Trigger note saving on 'Add' button click
buttonAdd.addEventListener('click', (event) => {
  createNote();
  buttonAdd.blur();
});

// Display notes
document.body.onload = loadSavedNotes;

// Clear text area
buttonClear.addEventListener('click', (event) => {
  elemNoteAdd.value = '';
  buttonClear.blur();
});
