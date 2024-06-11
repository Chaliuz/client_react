import React, { useState, useEffect } from 'react'

import useWebSocket, { ReadyState } from "react-use-websocket"
import Checkbox from 'react-simple-checkbox';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  // -----------------------------------------------------------------------------------------------------
  // websocket stuff
  // -----------------------------------------------------------------------------------------------------
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
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: "subscribe",
      })
    }
  }, [readyState])

  // Run when a new WebSocket message is received (lastJsonMessage)
  useEffect(() => {
    console.log("there is a new message")
    if (lastJsonMessage !== null) {
      console.log(lastJsonMessage)
      setTodos(lastJsonMessage)
      setInput("")
    }

  }, [lastJsonMessage])

  // -----------------------------------------------------------------------------------------------------


  const onChangeInput = e => {
    setInput(e.target.value);
  }

  const deleteTodo = (productId) => {
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
        status: "not_completed",
        operation: "create",
      },
    })
  }

  const updateMessageTodo = ({ id, message, status }) => {
    sendJsonMessage({
      event: "message",
      data: {
        id: id,
        message: message,
        operation: "update_message",
      },
    })
  }

  const updateStatusTodo = ({ id, status }) => {
    sendJsonMessage({
      event: "message",
      data: {
        id: id,
        status: status ? "completed" : "not_completed",
        operation: "update_status",
      },
    })
  }

  const convertDate = (date) => {
    const converted_date = new Date(parseInt(date)); // convert timestamp to milliseconds and construct Date object
    return (converted_date.toLocaleString())
  }



  return (
    <div className="flex flex-col w-screen h-min-[80dvi]">
      <div className="flex flex-col flex-1 justify-center items-center self-center w-[80dvi] m-[3rem]">
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
            {/* <span className="text-md m-[15px] flex-1">{product.id}</span> */}
            <span className="text-md m-[15px] flex-1">{(convertDate(product.id))}</span>
            <p className="flex-5 text-xl">{product.content}</p>

            <button className="text-xl mx-[15px] flex-2" onClick={() => deleteTodo(product.id)}>
              Delete
            </button>
            <button
              className="text-xl mx-[5px] flex-2"
              onClick={() => updateMessageTodo({ id: product.id, message: input })}>
              Update
            </button>
            <Checkbox
              checked={product.status == "completed"}
              onChange={(isChecked) => {
                updateStatusTodo({ id: product.id, status: isChecked })
              }}
              size={5}
              className="m-3"
            />
          </div>
        ))
        }
        < br />
        {/* <br /> */}

        {/* <pre> */}
        {/*   {JSON.stringify(todos, null, 2)} */}
        {/* </pre> */}
      </div>
    </div>
  )
}

export default App
