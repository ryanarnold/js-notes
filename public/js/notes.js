
/********************* Classes *********************/

class Note {
  constructor(text) {
    this.id = Math.floor(Math.random() * 99999) + 10000;
    this.text = text;
    this.dateTimeCreated = new Date();
  }
}

/********************* Elements *********************/

const elemNoteAdd = document.getElementById('noteAdd');
const buttonAdd = document.getElementById('btnAdd');

/********************* Functions *********************/

function createNote() {
  let text = elemNoteAdd.value.trimRight();

  // Exit if note is empty
  if (!text) {
    alert('Empty note!');
    return;
  }

  let note = new Note(text);

  // Try to load 'notes' list in local storage
  let notes = JSON.parse(localStorage.getItem('notes'));
  
  // If 'notes' list already exists in local storage append to it, else create new
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


function loadSavedNotes() {
  const notes = JSON.parse(localStorage.getItem('notes'));

  if (notes) {
    // Clear notes list display
    document.querySelectorAll('.note').forEach(e => e.remove());

    let elemContainer = document.querySelector('.container');

    for (const note of notes) {
      note.textHTML = note.text.replace(/\r\n|\r|\n/gi, '<br>');

      let elemNote = document.createElement('div');
      elemNote.className = 'col-main note';
      elemNote.innerHTML = `<p>${note.textHTML}</p>`

      elemContainer.append(elemNote);
    }
  }
}

/******************* Event Binding *******************/

// Trigger note saving on CTRL + ENTER shortcut
elemNoteAdd.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.keyCode === 13) {
    createNote();
  }
});

// Trigger note saving on 'Add' button click
buttonAdd.addEventListener('click', (event) => createNote);

// Display notes
document.body.onload = loadSavedNotes;
