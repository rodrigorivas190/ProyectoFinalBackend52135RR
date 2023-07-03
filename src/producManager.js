import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.format = "utf-8";
  }

  getNewID = (list) => {
    const count = list.length;
    return count > 0 ? list[count - 1].id + 1 : 1;
  };

  add = async ({
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
  }) => {
    try {
      const list = await this.get();
      const newID = this.getNewID(list);
      const exis = list.some((el) => el.code == code);
      if (!exis) {
        const newProduct = {
          id: newID,
          title: title ?? "",
          description: description ?? "",
          price: price ?? 0.0,
          thumbnail: thumbnail ?? [],
          code: code ?? "",
          stock: stock ?? 0,
          status: true,
          category: category ?? "general",
        };
        list.push(newProduct);
        await this.write(list);
        return newProduct;
      } else {
        throw new Error(`code: ${code} already exists `);
      }
    } catch (error) {
      return { error: error.message };
    }
  };

  read = () => {
    if (fs.existsSync(this.path)) {
      return fs.promises
        .readFile(this.path, this.format)
        .then((r) => JSON.parse(r));
    }
    return [];
  };

  write = async (list) => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(list));
    } catch (error) {
      throw new Error(`Error writing file: ` + error.message);
    }
  };

  get = async () => {
    try {
      const list = await this.read();
      return list;
    } catch (error) {
      return { error: error.message };
    }
  };

  getbyId = async (id) => {
    try {
      const list = await this.get();
      return list.find((prod) => prod.id == id);
    } catch (error) {
      return { error: error.message };
    }
  };

  update = async (id, obj) => {
    try {
      obj.id = id;
      const list = await this.read();

      const idx = list.findIndex((e) => e.id == id);
      if (idx < 0) return;
      list[idx] = obj;
      await this.write(list);
    } catch (error) {
      throw new Error(`Error updating product: ` + error.message);
    }
  };

  delete = async (id) => {
    try {
      const list = await this.get();
      const idx = list.findIndex((e) => e.id == id);
      if (idx < 0) return;
      list.splice(idx, 1);
      await this.write(list);
      return list;
    } catch (error) {
      throw new Error(`Error deleting product: ` + error.message);
    }
  };
}

export default ProductManager;