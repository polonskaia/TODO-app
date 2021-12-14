(function() {
  function getAllTasks(key) {
    let allTasks = localStorage.getItem(key);
    if (allTasks) {
      return JSON.parse(allTasks);
    }
    return [];
  }

  function getId(key) {
    let tasks = getAllTasks(key);
    if (tasks.length > 0) {
      return tasks[tasks.length - 1].id + 1;
    }
    return 0;
  }

  function putTaskToStorage(key, task) {
    let id = getId(key);
    let tasks = getAllTasks(key);

    if (tasks.length > 0) {
      task.id = id;
      tasks.push(task);
    } else {
      task.id = id;
      tasks = [ task ];
    }

    localStorage.setItem(key, JSON.stringify(tasks));
  }

  function changeTaskStatus(key, id) {
    let tasks = getAllTasks(key);
    for (let task of tasks) {
      if (task.id == id) {
        task.done = !task.done;
        localStorage.setItem(key, JSON.stringify(tasks));
      }
    }
  }

  function deleteTaskFromStorage(key, id) {
    let tasks = getAllTasks(key);
    for (let task of tasks) {
      if (task.id == id) {
        tasks.splice(tasks.indexOf(task), 1);
        localStorage.setItem(key, JSON.stringify(tasks));
      }
    }
  }

  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.setAttribute('disabled', 'disabled');


    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // создаем и возвращаем элемент списка
  function createTodoItem(name, key) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');


    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    //добавляем обработчик на кнопку "Готово"
    doneButton.addEventListener('click', function() {
      item.classList.toggle('list-group-item-success');
      changeTaskStatus(key, item.id);
    });

    // добавляем обработчик на кнопку "Удалить"
    deleteButton.addEventListener('click', function() {
      if (confirm('Вы уверены?')) {
        item.remove();
        deleteTaskFromStorage(key, item.id);
      }
    });

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  // createTodo =====================================================================
  function createTodoApp(container, title = 'Список дел', key, defaultTasks = []) {
    let tasks = getAllTasks(key);

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    if (tasks.length > 0) {
      for (let task of tasks) {
        let item = createTodoItem(task.name, key);

        item.item.id = task.id;

        if (task.done) {
          item.item.classList.toggle('list-group-item-success');
        }

        todoList.append(item.item);
      }
    }

    if (tasks.length === 0 && defaultTasks.length > 0) {
      for (let task of defaultTasks) {
        let item = createTodoItem(task.name, key);

        item.item.id = getId(key);

        putTaskToStorage(key, {name: task.name, done: task.done});

        if (task.done) {
          item.item.classList.toggle('list-group-item-success');
        }

        todoList.append(item.item);
      }
    }

    // делаем кнопку активной, когда поле ввода НЕ пустое
    todoItemForm.input.addEventListener('input', function() {
      if (todoItemForm.input.value.length > 0) {
        todoItemForm.button.removeAttribute('disabled');
      }
    });

    todoItemForm.form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      let todoItem = createTodoItem(todoItemForm.input.value, key);

      todoItem.item.id = getId(key);

      putTaskToStorage(key, {name: todoItemForm.input.value, done: false});

      // создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      // обнуляем значение в поле
      todoItemForm.input.value = '';

      // Снова делаем кнопку неактивной
      todoItemForm.button.setAttribute('disabled', 'disabled');
    });
  }

  window.createTodoApp = createTodoApp;
})();
