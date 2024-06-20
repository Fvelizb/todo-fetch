import React, { useState } from 'react';
import TodoList from './TodoList.jsx';
import './index.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const trimmedText = newTask.trim();
      if (trimmedText) {
        setTasks([...tasks, { id: Date.now(), text: trimmedText, isCompleted: false }]);
        setNewTask('');
      }
    }
  };

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="app">
      <h1 className="title">Lista de Tareas</h1>
      <TodoList 
        todos={tasks} 
        deleteTask={handleTaskDelete} 
        noTaskText="¿Seguro que no hay nada por hacer?" 
      />
      <input
        className="new-task-input"
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Agrega aquí tus tareas"
      />
      <p className='pending'>¡Tienes {tasks.length} tareas pendientes!</p>
    </div>
  );
}

export default App;
