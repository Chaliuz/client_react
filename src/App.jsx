import React, { useState, useEffect } from 'react'

import useWebSocket, { ReadyState } from "react-use-websocket"

const initialTodos = [
  // { id: 1, description: 'Desc' },
  // { id: 2, description: 'Desc #2' },
];

const App = () => {
  const [todos, setTodos] = useState(initialTodos);
  const [input, setInput] = useState('');

  // -----------------------------------------------------------------------------------------------------
  // websocket stuff
  // -----------------------------------------------------------------------------------------------------
  // const WS_URL = "ws://127.0.0.1:8080"
  const WS_URL = "ws://localhost:8080"
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  )
  // Run when the connection state (readyState) changes
  useEffect(() => {
    // console.log("Connection state changed")
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: "subscribe",
        // data: {
        //   channel: "general-chatroom",
        // },
        // event: "message",
        // data: {
        //   channel: "general-chatroom",
        // },
      })
    }
  }, [readyState])

  // Run when a new WebSocket message is received (lastJsonMessage)
  useEffect(() => {
    if (lastJsonMessage !== null) {
      // console.log(`lastJsonMessage: ${JSON.stringify(lastJsonMessage)}`);
      setTodos(lastJsonMessage)
      setInput("")
    }

  }, [lastJsonMessage])


  // -----------------------------------------------------------------------------------------------------

  // console.log(`Got a new message: ${JSON.stringify(lastJsonMessage, null, 2)}`)

  const onChangeInput = e => {
    setInput(e.target.value);
  }

  const deleteTodo = (productId) => {
    // const changedTodos = todos.filter(product => product.id !== productId);
    // setTodos(changedTodos);
    // console.log(productId)
    sendJsonMessage({
      event: "message",
      data: {
        id: productId,
        operation: "delete",
      },
    })
  }

  const addNote = (newProduct) => {
    sendJsonMessage({
      event: "message",
      data: {
        id: Date.now(),
        message: input,
        operation: "create",
      },
    })
  }

  const updateNote = ({ id, message }) => {
    sendJsonMessage({
      event: "message",
      data: {
        id: id,
        message: message,
        operation: "update",
      },
    })
  }

  return (
    <div className="flex flex-col w-screen h-min-[80dvi]">
      <div className="flex flex-col flex-1 justify-center items-center self-center w-[80dvi] m-[3rem]">
        {/* <span>{lastJsonMessage != null ?? lastJsonMessage}</span> */}
        {/* <pre> */}
        {/*   {JSON.stringify(lastJsonMessage, null, 2)} */}
        {/* </pre> */}
        <input
          type='text'
          placeholder='Escribe una Tarea'
          name='texto'
          value={input}
          onChange={onChangeInput}
          className="p-2 rounded-md text-xl m-3"
        />
        <button
          onClick={() => addNote()}>
          Add
        </button>

        {todos?.map(product => (
          <div key={product.id} className="flex flex-row justify-between items-center m-[10px] w-[50%]">
            <span className="text-xl m-[15px] flex-1">{product.id}</span>
            <p className="flex-5 ">{product.message}</p>

            <button className="text-xl mx-[15px] flex-2" onClick={() => deleteTodo(product.id)}>
              Delete
            </button>
            <button
              className="text-xl mx-[5px] flex-2"
              onClick={() => updateNote({ id: product.id, message: input })}>
              Update
            </button>
          </div>
        ))
        }
        < br />
        <br />

        <pre>
          {JSON.stringify(todos, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default App
