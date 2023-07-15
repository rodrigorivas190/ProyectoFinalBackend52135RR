import fs from 'fs';

class CartManager {
  constructor(path) {
    this.path = path;
    this.format = 'utf-8';
  }

  read = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const fileContent = await fs.promises.readFile(this.path, this.format);
        if (fileContent) {
          return JSON.parse(fileContent);
        } else {
          return [];
        }
      }
      return [];
    } catch (error) {
      throw new Error('Error reading file');
    }
  };

  write = async (carts) => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
    } catch (error) {
      throw new Error('Error writing file ');
    }
  };

  getNewID = (carts) => {
    const count = carts.length;
    return count > 0 ? carts[count - 1].id + 1 : 1;
  };



  get = async () => {
    try {
      const carts = await this.read();
      return carts;
    } catch (error) {
      throw new Error('Error getting carts');
    }
   
  };

  getById = async (id) => {
    try {
      const carts = await this.get();
      const cart = carts.find((cart) => cart.id == id);
      
      if (!cart) {
        throw new Error('No se encuentra ');
      }
      return cart;
    } catch (error) {
      throw new Error('Error getting cart by ID');
    }
  };

  create = async () => {
    try {
      const carts = await this.get();
      const newID = this.getNewID(carts);
      const newcart = {
        id: newID,
        products: [],
      };
      carts.push(newcart);

      await this.write(carts);

      return newcart;
    } catch (error) {
      throw new Error('Error creating cart');
    }
  };

  updateCart = async (id, pid) => {
    try {
      const cart = await this.getById(id);
      let found = false;
  
      for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].id === pid) {
          cart.products[i].quantity++;
          found = true;
          break;
        }
      }
  
      if (!found) {
        cart.products.push({
          id: pid,
          quantity: 1,
        });
      }
  
      await this.update(id, pid, 1);
      return cart;
  
    } catch (error) {
      throw new Error(`Error adding product to cart, ${error}`);
    }
  }
  

  update = async (id, pid, quantity) => {
    try {
      const carts = await this.read();
      const indexCart = carts.findIndex((cart) => cart.id === id);

      if (indexCart === -1) {
        throw new Error('No existe carrito');
      }
      const indexProduct = carts[indexCart].products.findIndex((product) => product.id === pid);
      if (indexProduct !== -1) {
        carts[indexCart].products[indexProduct].quantity += quantity;
      } else {
        carts[indexCart].products.push({ id: pid, quantity });
      }
      try {
        await this.write(carts);
        return 'ok'; 
      } catch (writeError) {
        throw writeError; 
      }
    } catch (error) {
      throw new Error(`Error adding product to cart, ${error}`);
    }
  };

  delete = async (id) => {
    try {
      const carts = await this.get();
      const index = carts.findIndex((cart) => cart.id === id);
      if (index === -1) {
        throw new Error('no se encuentra carrito');
      }
      carts.splice(index, 1);
      await this.write(carts);
      return carts;
    } catch (error) {
      throw new Error(`Error deleting cart,, ${error}`);
    }
  };

}

export default CartManager;