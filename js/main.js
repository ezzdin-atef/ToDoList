const elements = {
  toDoContainer: document.querySelector('.todo-container'),
  inputText: document.querySelector('.todo-inputs input'),
  todoInputs: document.querySelector('.todo-inputs'),
  todoAdd: document.querySelector('.todo-add'),
  todoDone: document.querySelector('.todo-done'),
  todoList: document.querySelector('.todo-list'),
};

let todo = new Array();
let done = new Array();

const checkNoToDo = () => {
  if (todo.length === 0) { // check if there is To Do
    myMessage = `
    <li class="no-tasks">
      There is no Tasks
    </li>
  `;
  elements.todoList.innerHTML = myMessage;
  } else {
    if (elements.todoList.contains(document.querySelector('.todo-list .no-tasks'))) { // remove the no tasks element if exists
      elements.todoList.innerHTML = '';
    }
  }
};

function upadateToDoLocaleStorage() {
  localStorage.setItem('todo', JSON.stringify(todo));
}
function upadateDoneLocaleStorage() {
  localStorage.setItem('done', JSON.stringify(done));
}

// to make the text field focued when the window load
window.onload = () => {
  // focus on the input text
  elements.inputText.focus();

  // load the data from locale storage
  todo = JSON.parse(localStorage.getItem('todo'));
  done = JSON.parse(localStorage.getItem('done'));
  if (todo == null) todo = new Array();
  if (done == null) done = new Array();

  checkNoToDo();
  console.log(done);
  
  todo.forEach(val => {
    let className = '';
    let tagIcon = 'check';
    if (done.indexOf(val) != -1) {
      className = 'done';
      tagIcon = 'times';
    }
    myElement = `
      <li class="${className}" >
        ${val}
        <div class="icons">
          <span class="todo-remove"><i class="fas fa-trash-alt"></i></span>
          <span class="todo-done"><i class="fas fa-${tagIcon}"></i></span> 
        </div>
      </li>
    `;
    elements.todoList.insertAdjacentHTML('afterbegin', myElement);
  });

};

// add new item functionality
elements.inputText.addEventListener('keydown', (e) => { // for Keyboard Enter
  if (e.keyCode  == 13) {
    addItem();
  }
});
elements.todoAdd.addEventListener('click', () => { // for the button click
  addItem();
});


// add the click event on the check and the delete
document.addEventListener('click', (e) => {
  if (e.target.matches('.todo-remove, .todo-remove i')) { // Delete functionality start
    let rmToDo = e.target.closest('li');
    let id = setInterval(frame, 4);
    let right = 0;
    function frame() {
      if (right == 100) {
        clearInterval(id);
        continueDelete();
      } else {
        right++;
        e.target.closest('li').style.right = right + '%';
      }
    }

    function continueDelete() {
      //Delete the item from todo array
      todo.splice(todo.indexOf(rmToDo.innerText), 1);

      // Delete the item from done array if exists
      if (done) {
        if (done.indexOf(rmToDo.innerText)) {
          done.splice(done.indexOf(rmToDo.innerText), 1);
        }
      }

      elements.todoList.innerHTML = '';
      checkNoToDo(); // check if the todo array is empty to show message
      upadateToDoLocaleStorage();
      upadateDoneLocaleStorage();

      // Update the UI
      todo.forEach(val => {
        let className = '';
        let tagIcon = 'check';
        if (done.indexOf(val) != -1) {
          className = 'done';
          tagIcon = 'times';
        }
        myElement = `
          <li class="${className}" >
            ${val}
            <div class="icons">
              <span class="todo-remove"><i class="fas fa-trash-alt"></i></span>
              <span class="todo-done"><i class="fas fa-${tagIcon}"></i></span> 
            </div>
          </li>
        `;
        elements.todoList.insertAdjacentHTML('afterbegin', myElement);
      });
    }
    

  } else if (e.target.matches('.todo-done, .todo-done i')) { // Done functionality start

    let myLi = e.target.closest('li'); // looking for the li which hold the To Do

    myLi.classList.toggle('done'); // toggle the done class to it

    // change the check icon
    if (myLi.classList.contains('done')) { // if it's already have done class
      if (done == null) done = [];
      done.push(myLi.innerText);
      upadateDoneLocaleStorage();
      e.target.closest('.todo-done').innerHTML = '<i class="fas fa-times"></i>';

    } else { // if it's haven't done class
      done.splice(done.indexOf(myLi.innerText), 1); // remove the element from the done array
      
      upadateDoneLocaleStorage();
      e.target.closest('.todo-done').innerHTML = '<i class="fas fa-check"></i>';
    }
  } // end the done functionality
});



// add Item Function
function addItem() {
  if (elements.inputText.value == '') {
    showMessage("Input Warning", "You shouldn't leave the input field empty");
  } else if (todo.indexOf(elements.inputText.value) != -1){
    showMessage("Input Warning", "This task already exist");
  } else {
    
    todo.push(elements.inputText.value);

    myElement = `
      <li>
        ${elements.inputText.value}
        <div class="icons">
          <span class="todo-remove"><i class="fas fa-trash-alt"></i></span>
          <span class="todo-done"><i class="fas fa-check"></i></span> 
        </div>
      </li>
    `;
    checkNoToDo();
    upadateToDoLocaleStorage();
    elements.todoList.insertAdjacentHTML('afterbegin', myElement);

    elements.inputText.value = '';
    elements.inputText.focus();
  }
}


// Alert Setting
function showMessage(Header, message) {
  let MessageElement = `
    <div class="alert">
      <i class="close fas fa-times"></i>
      <h3><i class="fas fa-exclamation-triangle"></i>  ${Header}</h3>
      <p>${message}</p>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', MessageElement);
  let myDiv = '<div class="overlay"></div>';
  document.body.insertAdjacentHTML('beforeend', myDiv);
  window.scrollTo(500, 0);
  document.body.style.overflowY = 'hidden';
  document.querySelector('.alert .close').addEventListener('click', (e) => {
    e.target.closest('.alert').style.animationName = 'toUp';
    e.target.closest('.alert').style.animationDuration = '1s';
    document.querySelector('.overlay').style.animationName = 'rotationOff';
    document.querySelector('.overlay').style.animationDuration = '1s';
    setTimeout(()=> {
      e.target.closest('.alert').remove();
      document.querySelector('.overlay').remove();
      document.body.style.overflowY = 'auto';
      elements.inputText.focus();
    }, 900);
  });
}