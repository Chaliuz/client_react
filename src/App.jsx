import React, { useState } from 'react'

const initialTodos = [
  { id: 1, description: 'Desc' },
  { id: 2, description: 'Desc #2' },
];

const App = () => {
  const [todos, setTodos] = useState(initialTodos);
  const [input, setInput] = useState('');

  const onChangeInput = e => {
    setInput(e.target.value);
    console.log(input)
  }

  const deleteProduct = (productId) => {
    const changedTodos = todos.filter(product => product.id !== productId);
    setTodos(changedTodos);
  }

  const addProduct = (newProduct) => {
    newProduct.id = Date.now();
    const changeTodos = [
      newProduct,
      ...todos,
    ];
    setTodos(changeTodos);
    setInput("")
  }

  const updateProduct = (editProduct) => {
    const changeTodos = todos.map(product => (
      product.id === editProduct.id
        ? editProduct
        : product
    ))
    setTodos(changeTodos);
  }

  return (
    <div class="flex flex-col w-screen h-min-[80dvi]">
      <div class="flex flex-col flex-1 justify-center items-center self-center w-[80dvi] m-[3rem]">
        <input
          type='text'
          placeholder='Escribe una Tarea'
          name='texto'
          value={input}
          onChange={onChangeInput}
          class="p-2 rounded-md text-xl m-3"
        />
        <button
          onClick={() => addProduct({ description: input })}>
          Add
        </button>

        {todos.map(product => (
          <div key={product.id} class="flex flex-row justify-between items-center m-[10px] w-[50%]">
            <span class="text-xl m-[15px] flex-1">{product.id}</span>
            <p class="flex-5 bg-[#acaa03]">{product.description}</p>

            <button class="text-xl mx-[15px] flex-2" onClick={() => deleteProduct(product.id)}>
              Delete
            </button>
            <button
              class="text-xl mx-[5px] flex-2"
              onClick={() => updateProduct({ id: product.id, description: input })}>
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
