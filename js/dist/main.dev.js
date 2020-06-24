"use strict";

var elements = {
  toDoContainer: document.querySelector('.todo-container'),
  inputText: document.querySelector('.todo-inputs input'),
  todoInputs: document.querySelector('.todo-inputs'),
  todoAdd: document.querySelector('.todo-add'),
  todoDone: document.querySelector('.todo-done'),
  todoList: document.querySelector('.todo-list')
};
var todo = new Array();
var done = new Array();

var checkNoToDo = function checkNoToDo() {
  if (todo.length === 0) {
    // check if there is To Do
    myMessage = "\n    <li class=\"no-tasks\">\n      There is no Tasks\n    </li>\n  ";
    elements.todoList.innerHTML = myMessage;
  } else {
    if (elements.todoList.contains(document.querySelector('.todo-list .no-tasks'))) {
      // remove the no tasks element if exists
      elements.todoList.innerHTML = '';
    }
  }
};

function upadateToDoLocaleStorage() {
  localStorage.setItem('todo', JSON.stringify(todo));
}

function upadateDoneLocaleStorage() {
  localStorage.setItem('done', JSON.stringify(done));
} // to make the text field focued when the window load


window.onload = function () {
  // focus on the input text
  elements.inputText.focus(); // load the data from locale storage

  todo = JSON.parse(localStorage.getItem('todo'));
  done = JSON.parse(localStorage.getItem('done'));
  if (todo == null) todo = new Array();
  if (done == null) done = new Array();
  checkNoToDo();
  console.log(done);
  todo.forEach(function (val) {
    var className = '';
    var tagIcon = 'check';

    if (done.indexOf(val) != -1) {
      className = 'done';
      tagIcon = 'times';
    }

    myElement = "\n      <li class=\"".concat(className, "\" >\n        ").concat(val, "\n        <div class=\"icons\">\n          <span class=\"todo-remove\"><i class=\"fas fa-trash-alt\"></i></span>\n          <span class=\"todo-done\"><i class=\"fas fa-").concat(tagIcon, "\"></i></span> \n        </div>\n      </li>\n    ");
    elements.todoList.insertAdjacentHTML('afterbegin', myElement);
  });
}; // add new item functionality


elements.inputText.addEventListener('keydown', function (e) {
  // for Keyboard Enter
  if (e.keyCode == 13) {
    addItem();
  }
});
elements.todoAdd.addEventListener('click', function () {
  // for the button click
  addItem();
}); // add the click event on the check and the delete

document.addEventListener('click', function (e) {
  if (e.target.matches('.todo-remove, .todo-remove i')) {
    var frame = function frame() {
      if (right == 100) {
        clearInterval(id);
        continueDelete();
      } else {
        right++;
        e.target.closest('li').style.right = right + '%';
      }
    };

    var continueDelete = function continueDelete() {
      //Delete the item from todo array
      todo.splice(todo.indexOf(rmToDo.innerText), 1); // Delete the item from done array if exists

      if (done) {
        if (done.indexOf(rmToDo.innerText)) {
          done.splice(done.indexOf(rmToDo.innerText), 1);
        }
      }

      elements.todoList.innerHTML = '';
      checkNoToDo(); // check if the todo array is empty to show message

      upadateToDoLocaleStorage();
      upadateDoneLocaleStorage(); // Update the UI

      todo.forEach(function (val) {
        var className = '';
        var tagIcon = 'check';

        if (done.indexOf(val) != -1) {
          className = 'done';
          tagIcon = 'times';
        }

        myElement = "\n          <li class=\"".concat(className, "\" >\n            ").concat(val, "\n            <div class=\"icons\">\n              <span class=\"todo-remove\"><i class=\"fas fa-trash-alt\"></i></span>\n              <span class=\"todo-done\"><i class=\"fas fa-").concat(tagIcon, "\"></i></span> \n            </div>\n          </li>\n        ");
        elements.todoList.insertAdjacentHTML('afterbegin', myElement);
      });
    };

    // Delete functionality start
    var rmToDo = e.target.closest('li');
    var id = setInterval(frame, 4);
    var right = 0;
  } else if (e.target.matches('.todo-done, .todo-done i')) {
    // Done functionality start
    var myLi = e.target.closest('li'); // looking for the li which hold the To Do

    myLi.classList.toggle('done'); // toggle the done class to it
    // change the check icon

    if (myLi.classList.contains('done')) {
      // if it's already have done class
      if (done == null) done = [];
      done.push(myLi.innerText);
      upadateDoneLocaleStorage();
      e.target.closest('.todo-done').innerHTML = '<i class="fas fa-times"></i>';
    } else {
      // if it's haven't done class
      done.splice(done.indexOf(myLi.innerText), 1); // remove the element from the done array

      upadateDoneLocaleStorage();
      e.target.closest('.todo-done').innerHTML = '<i class="fas fa-check"></i>';
    }
  } // end the done functionality

}); // add Item Function

function addItem() {
  if (elements.inputText.value == '') {
    showMessage("Input Warning", "You shouldn't leave the input field empty");
  } else if (todo.indexOf(elements.inputText.value) != -1) {
    showMessage("Input Warning", "This task already exist");
  } else {
    todo.push(elements.inputText.value);
    myElement = "\n      <li>\n        ".concat(elements.inputText.value, "\n        <div class=\"icons\">\n          <span class=\"todo-remove\"><i class=\"fas fa-trash-alt\"></i></span>\n          <span class=\"todo-done\"><i class=\"fas fa-check\"></i></span> \n        </div>\n      </li>\n    ");
    checkNoToDo();
    upadateToDoLocaleStorage();
    elements.todoList.insertAdjacentHTML('afterbegin', myElement);
    elements.inputText.value = '';
    elements.inputText.focus();
  }
} // Alert Setting


function showMessage(Header, message) {
  var MessageElement = "\n    <div class=\"alert\">\n      <i class=\"close fas fa-times\"></i>\n      <h3><i class=\"fas fa-exclamation-triangle\"></i>  ".concat(Header, "</h3>\n      <p>").concat(message, "</p>\n    </div>\n  ");
  document.body.insertAdjacentHTML('beforeend', MessageElement);
  var myDiv = '<div class="overlay"></div>';
  document.body.insertAdjacentHTML('beforeend', myDiv);
  window.scrollTo(500, 0);
  document.body.style.overflowY = 'hidden';
  document.querySelector('.alert .close').addEventListener('click', function (e) {
    e.target.closest('.alert').style.animationName = 'toUp';
    e.target.closest('.alert').style.animationDuration = '1s';
    document.querySelector('.overlay').style.animationName = 'rotationOff';
    document.querySelector('.overlay').style.animationDuration = '1s';
    setTimeout(function () {
      e.target.closest('.alert').remove();
      document.querySelector('.overlay').remove();
      document.body.style.overflowY = 'auto';
      elements.inputText.focus();
    }, 900);
  });
}
//# sourceMappingURL=main.dev.js.map
