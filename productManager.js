import { promises as fs } from 'fs';

class ProductManager {
  constructor(products = []) {
    this.products = products;
    this.nextId = 1;
  }

  async addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.error('Todos los campos del producto son obligatorios.');
      return;
    }

    if (this.products.some(p => p.code === product.code)) {
      console.error('Ya existe un producto con el mismo código.');
      return;
    }

    product.id = this.nextId++;
    this.products.push(product);
    console.log('Producto agregado correctamente:', product);
    await this.saveProductsToFile();
  }

  getProducts() {
    return this.products;
  }

  async getProductById(id) {
    const products = JSON.parse(await fs.readFile('./productos.txt', 'utf-8'));
    const product = products.find(producto => producto.id === id);
    if (product) {
      console.log(product);
    } else {
      console.log("Producto no encontrado");
    }
  }

  async updateProduct(id, updatedProduct) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updatedProduct };
      await this.saveProductsToFile();
      console.log('Producto actualizado correctamente:', this.products[productIndex]);
    } else {
      console.error('Producto no encontrado.');
    }
  }

  async deleteProduct(id) {
    const initialProductCount = this.products.length;
    this.products = this.products.filter(p => p.id !== id);

    if (this.products.length === initialProductCount) {
      console.error('Producto no encontrado.');
    } else {
      await this.saveProductsToFile();
      console.log('Producto eliminado correctamente.');
    }
  }

  async saveProductsToFile() {
    await fs.writeFile('./productos.txt', JSON.stringify(this.products));
  }
}

// Carga productos desde el archivo tx al crear una instancia de ProductManager
const loadProductsFromFile = async () => {
  try {
    const productsData = await fs.readFile('./productos.txt', 'utf-8');
    const products = JSON.parse(productsData);
    return new ProductManager(products);
  } catch (error) {
    return new ProductManager();
  }
};

// Crea una instancia de ProductManager y cargar los productos desde el txt
loadProductsFromFile().then(async (manager) => {


  // agregando productos
  await manager.addProduct({
    title: 'Producto 3',
    description: 'Descripción del Producto 3',
    price: 25.99,
    thumbnail: 'ruta/imagen3.jpg',
    code: 'P3',
    stock: 30
  });

  await manager.addProduct({
    title: 'Producto 2',
    description: 'Descripción del Producto 6',
    price: 256.99,
    thumbnail: 'ruta/imagen3.jpg',
    code: 'P5',
    stock: 30
  });

  await manager.addProduct({   // Prueba de campos obligatorios.
    title: 'Producto 1',
    description: '',
    price: 25.99,
    thumbnail: 'ruta/imagen3.jpg',
    code: 'P3',
    stock: 30
  });

  await manager.getProductById(1); // Busca producto con ID 1

  await manager.updateProduct(1, { title: 'Producto 1', price:'20000' }); // Actualiza producto con ID 1

  //await manager.deleteProduct(1); // Eliminar producto con ID 1

  const updatedProducts = manager.getProducts(); // Obtener todos los productos actualizados

  console.log('Productos actualizados:', updatedProducts);
});