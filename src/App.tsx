import React, { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios'

// Axios Config and URL
const getUrl = 'http://localhost:5000/'
const postUrl = 'http://localhost:5000/post'
const editUrl = 'http://localhost:5000/update'
const deleteUrl = 'http://localhost:5000/delete'
const config = {
  headers: {
      'content-type': 'multipart/form-data'
  }
}

function App() {
  const [productData, setProductData] = useState<IProductData[]>([])
  const [productName, setProductName] = useState<string>('')
  const [selectedProduct, setSelectedProduct] = useState<IProductData>({name: '', createdAt: '', id: 0})
  const [mode, setMode] = useState<IMode>('create')
  type IMode = 'edit' | 'create'
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = () => {
    axios({
      method: 'GET',
      url: getUrl,
    }).then(res => setProductData(res.data.data))
  }
  const postData = () => {
    const form = new FormData()
    form.append('name', productName)
    
    axios.post(postUrl, form, config)
      .then(() => {
        alert('OK')
        fetchData()
      })
      .catch(err => alert(err))
  }

  const updateData = () => {
    const form = new FormData()
    form.append("name", productName)
    form.append("id", String(selectedProduct.id))
    axios.put(editUrl, form, config)
      .then(() => {
        alert("SUCCESS UPDATE DATA")
        fetchData()
        setMode('create')
      })
      .catch(err => alert(err))
  }

  const deleteData = (id: number) => {
    const param = `${deleteUrl}?id=${id}`
    axios.delete(param, config)
      .then(() => {
        alert("SUCCESS DELETE DATA")
        fetchData()
      })
      .catch(err => alert(err))
  }
  type IProductData = {
    createdAt: string
    name: string
    id: number
  }

  const onClickEdit = (product: IProductData) => {
    setSelectedProduct(product)
    setMode('edit')
  }

  
  const onClickSubmit = () => {
    switch (mode) {
      case 'create':
        postData()
        break
      case 'edit':
        updateData()
        break
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1, height: '100%' }}>
      <div style={{ flex: 1, flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
        <text>
          {mode === 'create' ? 'Input New Product' : `Update value of ${selectedProduct.name}` }
        </text>
        <input onChange={e => setProductName(e.target.value)} placeholder={'Input Product Name'} defaultValue={selectedProduct.name} className={'textInput'}/>
        <button className={'button'} onClick={() => onClickSubmit()}>
          Submit
        </button>
      </div>
      <div style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {productData.map((e: IProductData) => {
          return (
            <div key={e.id} style={{ display: 'flex', flexDirection: 'row', padding: 10, border: 'solid 1px black', alignItems: 'center', justifyContent: 'space-between' }}>
              <text>
                {e.name}
              </text>
              <div>
                <button className={'button'} onClick={() => onClickEdit(e)}>Edit</button>
                <button className={'button'} onClick={() => deleteData(e.id)} style={{ marginLeft: 12 }}>
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
