import {promises as fs} from 'fs'

export class CartManager {
    constructor(path){
        this.path = path
    }

    static incrementarID(){
        if(this.idIncrement){
            this.idIncrement ++
        }else{
            this.idIncrement = 1
        }
        return this.idIncrement
    }

    async createCarrito(){
        const carritoJSON = await fs.readFile(this.path, 'utf-8')
        const cart = JSON.parse(carritoJSON)
        const carrito = {
            id: CartManager.incrementarID(),
            // cambio cantidad por products
            products: []
        }

        cart.push(carrito)
        await fs.writeFile(this.path, JSON.stringify(cart))
        return "Carrito Creado"
    }

    async getCartByID(id){
        const carritoJSON = await fs.readFile(this.path, 'utf-8')
        const cart = JSON.parse(carritoJSON)
        if(cart.some(carrito => carrito.id === parseInt(id))){
            return cart.find(carrito => carrito.id === parseInt(id))
        }else{
            return "Carrito no encontrado"
        }
    }

    async addProductCart(idCart, quantity, idProduct){
        //me traigo los carritos del archivo txt y los convierto para poder trabajarlos
        const cartsJSON = await fs.readFile(this.path, 'utf-8')
        const carts = JSON.parse(cartsJSON)
        //busco el carrito especificado
        const carrito = carts.find(cart => cart.id === parseInt(idCart))
       
        if (carrito) {
            //si existe verifico si el producto ya fue previamente agregado al carrito
            if (carrito.products.some(product => product.product === parseInt(idProduct))) {
                //busco el indice del producto para poder modificar su cantidad 
                let index = carrito.products.findIndex(product => product.product === parseInt(idProduct))

                carrito.products[index].product = parseInt(idProduct)
                carrito.products[index].quantity = carrito.products[index].quantity + parseInt(quantity)
                
                //busco el indice del carrito para modificarlo
                let indexCart = carts.findIndex(c => c.id === parseInt(idCart))
                carts[indexCart]= carrito

                //reescribo el archivo txt con los nuevos datos
                await fs.writeFile(this.path, JSON.stringify(carts))
                return true
    
            } else {
                // si el producto no se habia agregado previamente, este se agrega por primera vez
    
                    const newproduct = {"product":parseInt(idProduct),"quantity":parseInt(quantity)}
                    //agrego el producto al carrito
                    carrito.products.push(newproduct)

                    //busco el indice del carrito para modificarlo
                    let indexCart = carts.findIndex(c => c.id === parseInt(idCart))
                    carts[indexCart]= carrito

                    //reescribo el archivo txt con los nuevos datos
                    await fs.writeFile(this.path, JSON.stringify(carts))
                    return true
    
            }

        } else {
            //si no existe el carrito, devuelve false, que es lo que usa la ruta para indicar si el producto fue agregado al carrito o si el carrito no existe
            return false
        }
    }
}

