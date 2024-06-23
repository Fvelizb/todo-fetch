import React, { useState } from 'react';

function TodoItem({ todo, deleteTask }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="todo-item" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {todo.label}
      {isHovered && (
        <span 
          className="delete-icon"
          onClick={() => deleteTask(todo.id)}
        >
          &#10006;
        </span>
      )}
    </div>
  );
}

export default TodoItem;
