import { useState } from "react"

// const Counter = () => {
//   const [count, setCount] = useState(0);

//   return (
//     <div>
//       <p>Count: {count}</p>
//       <button onClick={()=> setCount(count + 1)}> Increase </button>
//       <button onClick={()=> setCount(count - 1)}> Decrease </button>
//       <button onClick={()=> setCount(0)}> Reset </button>
//     </div>
//   )
// }

const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  }

  const increment3 = () => {
    // setCount(count + 1); // global value
    // setCount(count + 1);
    // setCount(count + 1);

    setCount(c => c + 1); // c is the current value of count state when the current line is being executed
    setCount(c => c + 1);
    setCount(c => c + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={()=> increment()}> Increase by 1 </button>
      <button onClick={()=> increment3()}> Increase by 3 </button>
    </div>
  )
}

const Todo = () => {
  const [todos, setTodos] = useState([
    {id: 1, text: "Learn React", done: false},
    {id: 2, text: "Build project", done: false}
  ]);

  const [input, setInput] = useState('');

  const addTodo = () => {
    const newTodo = {
      id: Date.now(),
      text: input,
      done: false
    }
    setTodos([...todos, newTodo]);
    setInput('')
  }

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id != id))
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id == id ? {...todo, done: !todo.done} : todo))
  }

  return (
    <>
      <input value={input} placeholder="Enter a task" onChange={(event) => {
        setInput(event.target.value)
      }}/>
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((todo, index) => {
          return <li key={index}> 
            <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
            <span>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        })}
      </ul>
    </>
  )
}

const App = () => {
  const [fruitState, setFruitState]: any = useState(['orange', 'kiwi']);
  const fruits = ["banana", "apple", "mango"]

  const handleClick = () => {
    console.log("fruitState is :", fruitState);
  }

  const handleUpdate = () => {
    setFruitState(fruits);
    console.log("fruitState is updated")
  }
  
  return (
    <>
      {/* <ul>
        {fruitState.map((item, index) => {
          return <li key={index}>{item}</li>
        })}
      </ul>

      <button onClick={handleClick}>Click Me!</button>
      <button onClick={handleUpdate}>Update!</button>

      <br/>
      <Counter/> */}
      {/* <Todo/> */}
      <Counter/>
    </>
  )
}

export default App
