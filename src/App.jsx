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
  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } = useWebSocket(
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

  useEffect(() => {
    return () => {
      /*
       * Close socket connection when the component is dismounted
      */
      const socket = getWebSocket();
      if (socket) {
        socket.close();
      }
    }

  }, [])

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
    <div className="flex flex-col w-screen md:h-min-[80dvi] h-screen">
      <div className="flex flex-col justify-center items-center self-center ">
        <input
          type='text'
          placeholder='Escribe una Tarea'
          name='texto'
          value={input}
          onChange={onChangeInput}
          className="p-2 rounded-md md:text-xl text-md my-3"
        />

        <button
          onClick={() => addNote()}>
          Añadir nueva tarea
        </button>

        {todos?.map(product => (
          <div key={product.id} className="flex flex-row justify-between items-center md:w-[90%] w-[95%] my-5 max-w-[95%] ">
            <span className="flex-[0.1] text-md mx-[2px] p-3">{(convertDate(product.id))}</span>
            <p className="flex-[0.6] md:text-xl text-md text-center md:min-w-[300px] md:max-w-[600px]">{product.content}</p>

            <div className="flex flex-[0.3] flex-col justify-between items-center max-w-[150px] ">
              <button className="md:text-xl text-md my-1 w-[90px] md:w-[150px]" onClick={() => deleteTodo(product.id)}>
                Borrar
              </button>
              <button
                className="md:text-xl text-md my-1 w-[90px] md:w-[150px] text-center px-0"
                onClick={() => updateMessageTodo({ id: product.id, message: input })}>
                Actualizar
              </button>
            </div>
            <Checkbox
              checked={product.status == "completed"}
              onChange={(isChecked) => {
                updateStatusTodo({ id: product.id, status: isChecked })
              }}
              size={5}
              className="m-2 flex-[0.05] "
            />
          </div>
        ))
        }
        < br />
      </div>
    </div>
  )
}

export default App
