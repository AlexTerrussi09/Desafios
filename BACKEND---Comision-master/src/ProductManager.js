import {promises as fs} from 'fs'

export class ProductManager {
    constructor(path){
        this.path = path
    }

    async addProducts(title, description, price, thumbnail, code, stock, status) {

        const adding = await fs.readFile(this.path, 'utf-8')
        const addingConst = JSON.parse(adding)   
        //creo esta instancia para hacer uso de la clase Product y que el producto se cree con un id
        const prod = new Product(title, description, price, thumbnail, code, stock, status)   
        
        addingConst.push(prod)

        await fs.writeFile(this.path, JSON.stringify(addingConst))

        //return "Producto Creado"
        //Para probar websocket, comentar linea 19 
    }

    async getProducts(){
        const products = await fs.readFile(this.path, 'utf-8')
        const prods = JSON.parse(products)
        return prods
        //cambio clg por return 
    }

    
    async getProductsById(id){
        const product = await fs.readFile(this.path, 'utf-8')
        const prod = JSON.parse(product).find(producto => producto.id === parseInt(id))
        console.log(prod)
        
        if(prod){
            return prod
        }else{
            //cambio clg por return 
            return `El producto con el id ${id} no existe!`
        }

    }

    async updateProduct(id, {title, description, price, thumbnail, code, stock, status}){
        const adding = await fs.readFile(this.path, 'utf-8')
        const addingConst = JSON.parse(adding)
        if(addingConst.some(prod => prod.id === parseInt(id))){
            let index = addingConst.findIndex(prod => prod.id === parseInt(id))
            addingConst[index].title = title,
            addingConst[index].description = description,
            addingConst[index].price = price,
            addingConst[index].thumbnail = thumbnail,
            addingConst[index].code = code,
            addingConst[index].stock = stock,
            addingConst[index]. status = status,
            await fs.writeFile(this.path, JSON.stringify(addingConst))
            return "Product Uptaded"
        }else{
            return "Not Found"
        }

    }

    async deleteProduct(id){
        const adding = await fs.readFile(this.path, 'utf-8')
        const addingConst = JSON.parse(adding)
        if(addingConst.some(prod => prod.id === parseInt(id))){
            const prodFiltered = addingConst.filter(prod => prod.id !== parseInt(id))
            await fs.writeFile(this.path, JSON.stringify(prodFiltered))
            //return "Product Deleted"
            //Para probar websocket, comentar linea 72
        }else{
            return "Not Found"
        }

    }

}

class Product{
    constructor(title = "", description = "", price= "", thumbnail= "", code= "", stock= "", status= ""){
        this.title = title,
        this.description = description,
        this.price = price,
        this.thumbnail = thumbnail,
        this.code = code,
        this.stock = stock,
        this.status = status,
        this.id = Product.incrementarID()
    }

    static incrementarID(){
        if (this.idIncrement){
            this.idIncrement++
        }else{
            this.idIncrement = 1
        }
        return this.idIncrement
    }
}


