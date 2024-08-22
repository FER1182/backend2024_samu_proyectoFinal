import express from "express";
import { engine as exphbs } from "express-handlebars";
import Handlebars from "handlebars";
import {allowInsecurePrototypeAccess} from "@handlebars/allow-prototype-access"
const insecureHandlebars = allowInsecurePrototypeAccess(Handlebars)
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import methodOverride from 'method-override';
import initializePassport from "./config/passport.config.js";
import logger,{addLogger} from "./utils/logger.js";
import cookie from 'cookie';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
//Rutas 
import viewsRouter from "./routes/views.router.js"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import MessageModel from "./models/message.model.js";
import usersRouter from "./routes/user.router.js";
import sessionsRouter from "./routes/sessions.router.js"
import "./database.js"



const app = express();
const PUERTO = 8080;

app.use(addLogger); 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(passport.initialize());
initializePassport();   


 app.use(session({
     secret : "secretCoder",
     resave : true ,
     saveUninitialized : true,
     store : MongoStore.create({
         mongoUrl : "mongodb+srv://fernandorudnevichinedita:231182@cluster0.xe7glky.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0" , ttl :100
     })
 }))

//configuracion handlebars
app.engine("handlebars",exphbs({
    handlebars:insecureHandlebars,
    defaultLayout : "main",
}));
app.set("view engine","handlebars");
app.set("views", "./src/views");

app.use("/api/products",productsRouter);
app.use("/api/carts",cartsRouter)
app.use("/api/users",usersRouter)
app.use("/api/sessions",sessionsRouter)

app.use("/",viewsRouter);

const httpServer = app.listen(PUERTO,()=>{
    logger.info(`escuchando en el puerto ${PUERTO}`);
})


const io = new Server(httpServer);

io.on("connection", (socket)=>{
    logger.info("nuevo usuario conectado")
    
    socket.on("message",async data=>{
        await MessageModel.create(data)
    
     //obtengo los mensajes de mongo y los paso
     const messages = await MessageModel.find();
      
     io.sockets.emit("messagesLogs",messages)

    })

    
})
import ProductModel from "./models/product.model.js";
import ProductRepository from "./repositories/product.repository.js";

io.on("connection", async(socket)=>{
    
 
    const productos = await ProductModel.find();
    logger.info("estoy en productos");
    
   io.emit("productos",productos);
   
    socket.on("eliminarProducto",async(id)=>{
        await ProductModel.findByIdAndDelete(id);
        const productosNuevos = await ProductModel.find();
        socket.emit("productos",productosNuevos);
    })

    socket.on("agregarProductos", async(data)=>{
        
        await ProductModel.create(data);
        const productosNuevos = await ProductModel.find();
        socket.emit("productos",productosNuevos);
    })   
})

//configuracion de swagger
const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title:'Supermercado API',
            version:'1.0.0',
            description:'Documentacion de la API para la app Supermercado',
        }
    },
    apis:["./src/docs/**/*.yaml"]
    }
    
//4-conectar swager a express
const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs',swaggerUiExpress.serve,swaggerUiExpress.setup(specs))