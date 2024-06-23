import React, { useState, useEffect } from 'react';
import TodoList from './TodoList.jsx'; 
import './index.css';

function App() {
  const [inputText, setInputText] = useState({ label: "", is_done: false });
  const [tarea, setTarea] = useState([]);
  const [username, setUsername] = useState(null);

  const getUserURL = (user) => `https://playground.4geeks.com/todo/users/${user}`;
  const getTodosURL = (user) => `https://playground.4geeks.com/todo/todos/${user}`;
  const getTodoURL = (todoId) => `https://playground.4geeks.com/todo/todos/${todoId}`;

  useEffect(() => {
    if (username) {
      fetchTareas();
    }
  }, [username]);

  const fetchTareas = () => {
    fetch(getTodosURL(username), {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.detail) });
      }
      return response.json();
    })
    .then((data) => {
      if (Array.isArray(data)) {
        setTarea(data);
      } else {
        console.error('Received data is not an array:', data);
        setTarea([]);
      }
    })
    .catch((error) => console.log("Error fetching tasks:", error));
  };

  const handleChange = (e) => {
    setInputText({
      label: e.target.value,
      is_done: false
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && username) {
      e.preventDefault();

      if (Array.isArray(tarea)) {
        fetch(getTodosURL(username), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label: inputText.label, is_done: false }) 
        })
        .then((response) => {
          if (!response.ok) {
            return response.json().then(err => { throw new Error(err.detail) });
          }
          return response.json();
        })
        .then((newTask) => {
          setTarea([...tarea, newTask]);
          setInputText({ label: "", is_done: false });
        })
        .catch((error) => console.log("Error adding task:", error));
      } else {
        console.error("tarea is not an array:", tarea);
      }
    }
  };

  const handleCreateUser = () => {
    const user = prompt("Por favor, ingrese un nombre de usuario:");
    if (user) {
      fetch(getUserURL(user), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]) 
      })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.detail) });
        }
        return response.json();
      })
      .then(() => {
        setUsername(user);
        setTarea([]);
      })
      .catch((error) => console.log("Error creating user:", error));
    }
  };

  const eliminarTarea = (todoId) => {
    const taskToDelete = tarea.find((task) => task.id === todoId);
    if (!taskToDelete) {
      console.error("Task not found:", todoId);
      return;
    }

    console.log("Deleting task with ID:", taskToDelete.id); 

    fetch(getTodoURL(taskToDelete.id), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.detail) });
      }
      if (response.status === 204) {
        return null; 
      }
      return response.json();
    })
    .then(() => {
      const nuevasTareas = tarea.filter((task) => task.id !== todoId);
      setTarea(nuevasTareas);
    })
    .catch(error => console.error("Error deleting task:", error));
  };

  const eliminarTodas = () => {
    const deletePromises = tarea.map(task => {
      return fetch(getTodoURL(task.id), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.detail) });
        }
        if (response.status === 204) {
          return null; 
        }
        return response.json();
      });
    });

    Promise.all(deletePromises)
    .then(() => {
      setTarea([]);
      setInputText({ label: "", is_done: false });
    })
    .catch(error => console.error("Error deleting all tasks:", error));
  };

  return (
    <div className="app">
      <h1 className="title">Lista de Tareas</h1>
      {!username && <button onClick={handleCreateUser}>Crear Usuario</button>}
      {username && (
        <>
          <TodoList 
            todos={Array.isArray(tarea) ? tarea : []} 
            deleteTask={eliminarTarea} 
            noTaskText="¿Seguro que no hay nada por hacer?" 
          />
          <input
            className="new-task-input"
            type="text"
            value={inputText.label}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={`Hola, ${username} agrega aquí tus tareas`}
          />
          <p className='pending'>¡Tienes {tarea.length} tareas pendientes!</p>
          <button className="clear-all-button" onClick={eliminarTodas}>Limpiar todas las tareas</button>
        </>
      )}
    </div>
  );
}

export default App;