import dotenv from "dotenv"
import program from "../utils/commander.js"


const {mode}= program.opts()

dotenv.config({
    path: mode === "produccion" ? "./.env.produccion" : "./.env.desarrollo"
})

const configObjet ={
    node_env : process.env.NODE_ENV,
    mongo_url : process.env.MONGO_URL
}

export default configObjet