import {Router}  from 'express'
import { ProductManager } from "../ProductManager.js";

const productManager = new ProductManager("./productos.txt");



const viewsRouter = Router()

viewsRouter.get("/", async (req, res) => {
    try {
      const products = await productManager.getProducts();
      res.render("home", {products});
    } catch (error) {
      res.send(error);
    }
  });
  
  viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {
      const products = await productManager.getProducts();
      res.render("realTimeProducts", {  products })
    } catch (error) {
      res.send(error);
    }
  });


export default viewsRouter