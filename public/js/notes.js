
/********************* Elements *********************/

const elemNoteAdd = document.getElementById('noteAdd');
const buttonAdd = document.getElementById('btnAdd');

/********************* Functions *********************/

function createNote() {
  let text = elemNoteAdd.value.trimRight();

  // Exit if note is empty
  if (text === '') {
    alert('Empty note!');
    return;
  }

  let note = {
    id: Math.floor(Math.random() * 99999) + 10000, // Use random number for Id (ewan ko na lang pag nagduplicate pa to)
    text
  };

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
