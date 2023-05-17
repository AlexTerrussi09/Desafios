import express from 'express'
import { ProductManager } from '../src/ProductManager'

const productManager = new ProductManager('info.txt')

const app = express()
const PORT = 4000
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.get('/', (req, res) =>{
    res.send("Mi primer servidor con express")
})

app.get('/product', async (req, res)=>{
    let {limit} = req.query
    const products = await productManager.getProducts()

    const prodLimit = await products.slice(0, limit)
    res.send(JSON.stringify(prodLimit))
})

app.get('/product/:id', async (req, res)=>{
    const idProduct = await productManager.getProductsById() //Guardo en una constante los valores solicitados por getProductsById

    const getIdProduct = await idProduct.find(prod => prod.id === parseInt(req.params.id))
    if(getIdProduct){
        res.send(`El producto ${idProduct.nombre} con el ID ${req.params.id} pertenece a la categoria ${idProduct.categoria}`)
    }else{
        res.send(`El producto con el ID ${req.params.id} no se encuentra`)
    }
    console.log(getIdProduct)
})

app.listen(PORT, ()=>{
    console.log(`Server on port ${PORT}`)
})