
import ProductModel from "../models/product.model.js";
import mongoosePaginate from "mongoose-paginate-v2";

class ProductRepository {
  async addProduct({ title, description, price, img, code, stock, category, status }) {
    try {


      // Validar que ninguna propiedad esté vacía
      if (
        !title ||
        !description ||
        !price ||
        !status ||
        !code ||
        !stock ||
        !category
      ) {
        console.error("No se pueden agregar productos con propiedades vacías.");
        return;
      }

      // Validar que no exista un producto con el mismo code
      const existeProducto = await ProductModel.findOne({ code: code });
      if (existeProducto) {
        console.log("el codigo ya existe");
        return;
      }

      const nuevoProducto = new ProductModel({
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status,
      });

      await nuevoProducto.save();
    } catch (error) {
      console.log("error al agregar producto", error)
      throw error
    }
  }

  async getProducts({limit, page,sort,query}) {
    try {
      
       const productoFinal = await ProductModel.paginate({},{limit, page,sort,query})
       
      
      //   console.log(productoFinal);
      return productoFinal;
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  async getProductById(id) {
    try {
      const producto = await ProductModel.findById(id).lean();
      if (!producto) {
        console.error(`Error: Producto con id ${id} no encontrado.`);
        return null;
      } else {
        
        return producto;
      }
    } catch (error) {
      console.log("Error al obtener producto por id", error);
    }
  }

  async leerArchivos() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }

  // Actualizamos algun producto:
  async updateProduct(id, productoActualizado) {
    try {
      const updateProduct = await ProductModel.findByIdAndUpdate(
        id,
        productoActualizado
      );
      if (!updateProduct) {
        console.log("no se encontró el producto");
        return null;
      }
      console.log("producto actualizado");
      return updateProduct;
    } catch (error) {
      console.log("Error al actualizar el producto", error);
      throw error;
    }
  }

  // Eliminamos algun producto:

  async deletProduct(id) {
    try {
      const deletProduct = await ProductModel.findByIdAndDelete(id);
      if (!deletProduct) {
        console.error(`Error: Producto con id ${id} no encontrado.`);
        return null;
      } else {
        console.log("producto eliminado");
        return deletProduct;
      }
    } catch (error) {
      console.log("Error al obtener producto por id", error);
    }
  }
}

export default ProductRepository;
