import { useState, useEffect } from 'react'
import './App.css'

function loadTasks() {
  try {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

let nextId = Math.max(0, ...loadTasks().map(t => t.id)) + 1

export default function App() {
  const [tasks, setTasks] = useState(loadTasks)

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])
  const [inputValue, setInputValue] = useState('')

  function addTask() {
    const text = inputValue.trim()
    if (!text) return
    setTasks(prev => [...prev, { id: nextId++, text, completed: false }])
    setInputValue('')
  }

  function toggleTask(id) {
    setTasks(prev =>
      prev.map(task => task.id === id ? { ...task, completed: !task.completed } : task)
    )
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') addTask()
  }

  return (
    <div className="container">
      <h1 className="title">タスクボード</h1>

      <div className="input-area">
        <input
          type="text"
          className="task-input"
          placeholder="タスクを入力..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="add-button" onClick={addTask}>追加</button>
      </div>

      <div className="stats">
        <span>{tasks.filter(t => !t.completed).length} 件残り</span>
        <span>{tasks.filter(t => t.completed).length} 件完了</span>
      </div>

      {tasks.length === 0 ? (
        <p className="empty-message">タスクがありません。上から追加してください。</p>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                className="task-checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span className="task-text">{task.text}</span>
              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
                aria-label="タスクを削除"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
