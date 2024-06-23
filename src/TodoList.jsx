import React from 'react';
import TodoItem from './TodoItem.jsx';

const TodoList = ({ todos, deleteTask, noTaskText }) => {
  if (todos.length === 0) {
    return <p>{noTaskText}</p>;
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} deleteTask={deleteTask} />
      ))}
    </div>
  );
};

export default TodoList;