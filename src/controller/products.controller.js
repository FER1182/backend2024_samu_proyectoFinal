import ProductRepository from "../repositories/product.repository.js";
const productRepository = new ProductRepository();

export default class ProductController {
  async getProducts(req, res) {
    try {
      let page = req.query.page || 1;
      let limit = req.query.limit || 10;

      const { sort, query } = req.query;
      const productos = await productRepository.getProducts({
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query,
      });
      
      const productoFinal = productos.docs.map((producto) => {
        const { _id, ...rest } = producto.toObject();
        const idCarrito = req.user.idCart;
        const todo = { _id, rest, idCarrito };

        return todo;
      });
      
      res.render("home", {
        productoFinal: productoFinal,
        hasPrevPage: productos.hasPrevPage,
        hasNextPage: productos.hasNextPage,
        prevPage: productos.prevPage,
        nextPage: productos.nextPage,
        currentPage: productos.page,
        totalPages: productos.totalPages,
        limit: limit,
        titulo: "supermecado",
        user: req.user,
      });
    } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }

  async getProductById(req, res) {
    try { 
      
      const idCarrito = req.user.idCart;
      const id = req.params.pid;
      const producto = await productRepository.getProductById(id);

      if (!producto) {
        return res.json({
          error: "Producto no encontrado",  
        });
      } 
      
      res.render("product", {
        productoFinal: producto,
        idCarrito: idCarrito,
        titulo: "supermecado",
        
      });
    } catch (error) {  
      
      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }

  async addProduct(req, res) {
    const product = req.body
    console.log("user p.controller addporduct",req.user)
    try {
      await productRepository.addProduct(product);
      
      res.send({message:"producto creado con exito"})
    } catch (error) {
      res.status(500).json({error: "Error interno del servidor"});
    }      
  } 

  async updateProduct(req, res) {
    const id = req.params.pid;
    const productoActual = req.body;
    try {
      const producto = await productRepository.updateProduct(id,productoActual);
      if (!producto) {
        return res.json({
          error: "Producto no encontrado",
        });
      }
      res.send({message:"producto actualizado con exito"})
    } catch (error) {  
      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }

  async deleteProduct(req, res,next) {
    const id = req.params.pid;
    const {userId, role} = req.user;
    try {
      const product = await productRepository.getProductById(id);
      if (!product) {
        throw CustomError.crearError('Producto no encontrado', 404);
      }
      
      if(role === 'admin') {
       await productRepository.deletProduct(id);
       return res.status(200).json({ message: 'Producto eliminado con éxito' }); 
      } else if(role === 'premium') {
        if (product.owner.toString() !== userId.toString()) {
          throw CustomError.crearError('No tienes permiso para borrar este producto', 403);
        } 
        await productRepository.deletProduct(id);
        return res.status(200).json({ message: 'Producto eliminado con éxito' });
      }else {
        throw CustomError.crearError('No tienes permiso para realizar esta acción', 403);
      }
    
    } catch (error) {
      next(error);
    }
  }
  async renderRealTimeProducts(req, res) {
    try {
      const user = req.user;
      
      res.render("realTimeProducts", { titulo: "supermecado", user: user });
    } catch (error) {
      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }

}