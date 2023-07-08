import { Router } from 'express';
import CartManager from '../cartManager.js';

const router = Router();
const cartManager = new CartManager('cart.json');

router.get('/', async (req, res)=>{
    let limit = req.query.limit;
    const carts = await cartManager.get();
    if(!limit){
        return res.json({carts});
    }
    limit = limit < carts.length ? limit : carts.length;
    const arr = [];
    for(let i=0; i<limit; i++){
        arr.push(carts[i]);
    }
    try {
      const carts = await cartManager.get();
      res.status(200).json(carts);
    } catch (err) {
      res.status(400).json({ error400: "Bad Request" });
    }
    return res.json({arr});
    
})

router.get("/:cid", async (req, res) => {
  let { cid } = req.params;

  try {
    const cart = await cartManager.getById(Number(cid));
    res.status(200).json(cart);
  } catch (err) {
    res.status(404).json({ error404: "Not Found" });
  }
})

router.post("/", async (req, res) => {
  try {
    const createCart = await cartManager.create();
    res.status(200).json("A new cart was created");
  } catch (err) {
    res.status(400).json({ error400: "Error creating cart" });
  }
})
router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity || 1;
    try {
      const update = await cartManager.updateCart(
        Number(cid),
        Number(pid),
        quantity
      );
      if (update) {
        res
          .status(200)
          .json(`The product ${pid} in cart ${cid} was successfully updated`);
      } else {
        res.status(404).json({ error404: "Not Found" });
      }
    } catch (err) {
      res.status(400).json({ error400: "Bad Request" });
    }
  });

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    await cartManager.delete(Number(cid));
    res.status(200).json(`Cart with id: ${cid} was removed`);
  } catch (err) {
    res.status(400).json({ error400: "Bad Request" });
  }
});


export default router;