
import express from 'express';
import productRouter from './routes/products.routes.js';
import carritoRouter from './routes/carrito.routes.js';
import multer from 'multer';
import { _dirname } from './path.js';
//Agrego .js a las importaciones
import { engine } from 'express-handlebars'; //Configuracion basica de handlebars
import * as path from 'path'
import {Server} from 'socket.io'
import { ProductManager } from './ProductManager.js';
import viewsRouter from './routes/views.routes.js'

export const managerProd = new ProductManager('./productos.txt')
export const products = await managerProd.getProducts()
const app = express()
const PORT = 4000
const storage = multer.diskStorage({
    destination: (req, file, cb) => { //Destino de mis imagenes cargadas
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
    }
})

const server = app.listen(PORT, ()=>{
    console.log (`Server on Port ${PORT}`)
})

//Configuracion hbs
app.engine('handlebars', engine())
app.set('view engine', 'handlebars') //Asigno valores a la constante - Vistas de hbs
app.set('views', path.resolve(_dirname, './views')) //Concateno con resolve - src/views


//Middlewares 
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
const upload = (multer({ storage: storage})) //Instancio un objeto con la configuracion previa de multer

//Server IO
const io = new Server(server)

io.on('connection', (socket) =>{
    console.log("Cliente Conectado")

    socket.on("prod",async (productosAdd)=>{
        let prodForm = await managerProd.getProducts();
        prodForm.push(productosAdd)
        io.emit('productoFromForm',prodForm)

        
    });

    socket.on("prodDelete",async (prod) =>{
        const {id} = prod;
        await managerProd.deleteProduct(id);
        let prodServer = await managerProd.getProducts();
        io.emit("prodDeletelist", prodServer)
    })

})

//Routes
app.use('/',viewsRouter)
app.use('/product', productRouter)
app.use(express.static(_dirname + '/public'))
app.use('/carrito', carritoRouter)
app.post('/upload', upload.single('product'), (req,res)=>{
    console.log(req.body)
    console.log(req.file)
    res.send("Imagen subida")
})


