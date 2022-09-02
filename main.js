// Window is a type of EventTarget interface containing a DOM (document
// object model) document, which is an API that interacts with HTML and
// is loaded into the browser. The window makes many functions, objects,
// etc available globally.

// .addEventListener('load', ()...) registers an event handler of type
// load. The second parameter, listener, implementing what happens when
// when the event occurs.
window.addEventListener('load', () => {
    // localStorage is an API providing access to a particular domain's
    // session or local storage. todos is the returned object from parsing
    // what's currently in storage.
	todos = JSON.parse(localStorage.getItem('todos')) || [];
    // .querySelector returns the document element that matches the
    //  selector '#name' or '#new-todo-form'. You can then edit many
    // attirbutes of the element (value, addEventListener, etc.).
	const nameInput = document.querySelector('#name');
	const newTodoForm = document.querySelector('#new-todo-form');

	const username = localStorage.getItem('username') || '';

	nameInput.value = username;

    // This is an addEventListener with type 'change' which will store
    // the username upon change to the nameInput element. 
	nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);
	})

    // Upon submit of the newTodoForm element, the following work will be
    // done.
	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();

        // Create a struct object for a single todo item containing its
        // content, category, done boolean, and date of creation. Note some fields
        // pull from the what prompts the event (e.target.elements).
		const todo = {
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
			done: false,
			createdAt: new Date().getTime()
		}

        // Store the todo item in todos object that is eventually stored in storage.
		todos.push(todo);

        // Modify/update the todos item in storage.
		localStorage.setItem('todos', JSON.stringify(todos));

		// Reset the todo form (e.target).
		e.target.reset();

        // Helper function to now display the todo's given a submit of the newTodoForm.
		DisplayTodos()
	})

	DisplayTodos()
})

function DisplayTodos () {
    // Select document element with class identifier '#todo-list'.
	const todoList = document.querySelector('#todo-list');
    // Set the HTML contained with elemenet todoList to "".
	todoList.innerHTML = "";

    // Given each todo that's been stored in todos, now create document
    // elements, add class identifiers and specifiy the type of element
    // before finaling appending these elements as children to the <div>
    // element 'todo-item'.
	todos.forEach(todo => {
		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

		const label = document.createElement('label');
		const input = document.createElement('input');
		const span = document.createElement('span');
		const content = document.createElement('div');
		const actions = document.createElement('div');
		const edit = document.createElement('button');
		const deleteButton = document.createElement('button');

		input.type = 'checkbox';
		input.checked = todo.done;
		span.classList.add('bubble');
		if (todo.category == 'personal') {
			span.classList.add('personal');
		} else {
			span.classList.add('business');
		}
		content.classList.add('todo-content');
		actions.classList.add('actions');
		edit.classList.add('edit');
		deleteButton.classList.add('delete');

		content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
		edit.innerHTML = 'Edit';
		deleteButton.innerHTML = 'Delete';

		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(actions);

		todoList.appendChild(todoItem);

        // Note the done attribute was set when defining the todo struct.
		if (todo.done) {
			todoItem.classList.add('done');
		}
		
        // Given the input of type checkbox, an addEventListener to update
        // the done attribute when that checkbox is changed.
		input.addEventListener('change', (e) => {
			todo.done = e.target.checked;
            // Modify/update the todos item in storage.
			localStorage.setItem('todos', JSON.stringify(todos));

            // Update the style of the singular todoItem depending on done
            // status.
			if (todo.done) {
				todoItem.classList.add('done');
			} else {
				todoItem.classList.remove('done');
			}

            // Update graphics of all todos.
			DisplayTodos()

		})

        // Upon edit button being clicked, get the document element 'input',
        // set it to be ediable, 
		edit.addEventListener('click', (e) => {
			const input = content.querySelector('input');
			input.removeAttribute('readonly');
            // Set focus on the specific element 'input' so that the keyboard
            // will automatically default there.
			input.focus();
            // Blur is the event type for when an element loses focus.
            // Update content and storage according when field has been edited
            // and thus lost focus.
			input.addEventListener('blur', (e) => {
				input.setAttribute('readonly', true);
				todo.content = e.target.value;
				localStorage.setItem('todos', JSON.stringify(todos));
				DisplayTodos()

			})
		})

        // Upon click event of deleteButton, remove
		deleteButton.addEventListener('click', (e) => {
            // filter creates new array with elements that pass t != todo.
            // Note the todo is the current one in forloop through todos.
			todos = todos.filter(t => t != todo);
			localStorage.setItem('todos', JSON.stringify(todos));
			DisplayTodos()
		})

	})
}