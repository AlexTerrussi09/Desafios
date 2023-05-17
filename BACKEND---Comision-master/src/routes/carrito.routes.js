import { Router } from "express";
import { CartManager } from "../CartManager.js";

const carritoRouter = Router()
const cartManager = new CartManager('./carrito.txt')

carritoRouter.get("/:cid", async (req, res)=>{
    try{
       const getCarrito = await cartManager.getCartByID(req.params.cid)
       res.send(JSON.stringify(getCarrito))
    }catch(error){
        res.send(error)
    }
})

carritoRouter.post("/:cid/product/:pid", async (req, res)=>{

    try {
    const{ cid, pid } = req.params;
    const { quantity } = req.body

        let productAdd = await cartManager.addProductCart(cid, quantity, pid)
        if (productAdd) {
            res.send("Producto agregado al carrito");
        } else {
            res.send(`El carrito con id ${cid} no existe!`);
            
        }
    } catch (error) {
      res.send(error);
    }
})
carritoRouter.post("/carts", async (req, res)=>{
    try {

        await cartManager.createCarrito() //Llama a la funcion createCarrito ejecutada en CartManager.js
         res.send('carrito creado')
        
    } catch (error) {
        res.send(error);
    }
})

export default carritoRouter