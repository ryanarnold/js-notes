
/********************* Classes *********************/

class Note {
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

/********************* Elements *********************/

const elemNoteAdd = document.getElementById('noteAdd');
const buttonAdd = document.getElementById('btnAdd');
const buttonClear = document.getElementById('btnClear');
let elemNotes = document.querySelectorAll('.note');
let elemEmptyNotes = document.getElementById('emptyNotes');

/********************* Functions *********************/


function deleteNote(noteIdToDelete) {
  let notes = JSON.parse(localStorage.getItem('notes'));
  notes = notes.filter(note => note.id != noteIdToDelete);
  localStorage.setItem('notes', JSON.stringify(notes));
  loadSavedNotes();
}

function bindNoteEvents() {
  elemNotes.forEach(elem => {
    elem.addEventListener('mouseover', (event) => {
      elem.querySelector('.btn-delete').hidden = false;
    });

    elem.addEventListener('mouseout', (event) => {
      elem.querySelector('.btn-delete').hidden = true;
    });

    const buttonDelete = elem.querySelector('.btn-delete');
    
    buttonDelete.addEventListener('click', (event) => {
      event.preventDefault();
      deleteNote(elem.noteId);
    });
  });  
}

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

  let elemTop = document.querySelector('.subheading');
  
  // Clear notes list display
  document.querySelectorAll('.note').forEach(e => e.remove());

  if (notes && notes.length != 0) {
    elemEmptyNotes.hidden = true;
    for (const note of notes) {
      note.textHTML = note.text.replace(/\r\n|\r|\n/gi, '<br>');

      let elemNote = document.createElement('div');
      elemNote.className = 'col-main note ' + note.color;
      elemNote.noteId = note.id;
      elemNote.innerHTML = `<a href="" class="btn-delete" hidden><i class="gg-close"></i></a><p>${note.textHTML}</p>`

      elemTop.after(elemNote);
    }
  } else {
    elemEmptyNotes.hidden = false;
  }

  elemNotes = document.querySelectorAll('.note');
  bindNoteEvents();
}

/******************* Event Binding *******************/

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
