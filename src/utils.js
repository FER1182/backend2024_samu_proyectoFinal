import multer from "multer"


const storage=multer.diskStorage({   
    destination:(req,file,cb)=>{
        cb(null,"./public/img");
        //carpeta donde guarda las imagenes
    },
    filename: (req,file,cb)=>{
        cb(null,file.originalname);
        //mantengo el nombre original
    }
})

export const uploader = multer({storage})