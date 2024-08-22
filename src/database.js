    import mongoose from "mongoose";
    import configObjet from "./config/config.js";
    
    
    // mongoose.connect(configObjet.mongo_url)
    //     .then(()=> console.log("conectados a la base de datos"))
    //     .catch((error)=> console.log("tenemos un error:",error))
    
    
        //patron de dise;o sngelton
    
         class BaseDatos{
             static #instancia; 
             //se declara una variable statica y privada llamada instancia
             constructor(){
                 mongoose.connect(configObjet.mongo_url)
             }
             static getInstancia(){
                 if(this.#instancia){
                     console.log("conexion previa")
                     return this.#instancia
                 }
                 this.#instancia = new BaseDatos()
                 console.log("conexion exitosa")
                 return this.#instancia
             }
    
    
    
         }
    
         export default BaseDatos.getInstancia();