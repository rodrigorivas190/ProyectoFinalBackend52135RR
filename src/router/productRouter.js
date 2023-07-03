import { Router } from 'express';
import ProductManager from '../producManager.js';

const router = Router();
const productManager = new ProductManager('products.json');

router.get('/', async (req, res)=>{
    let limit = req.query.limit;
    const products = await productManager.get();
    if(!limit){
        return res.json(products);
    }
    limit = limit < products.length ? limit : products.length;
    const arr = [];
    for(let i=0; i<limit; i++){
        arr.push(products[i]);
    }
    return res.json(arr);
})

router.get('/:pid', async (req, res)=>{
    const pid = parseInt(req.params.pid);
    const prod = await productManager.getbyId(pid);
    if(!prod) return res.status(404).send(`product not found`);
    return res.json(prod);
})

router.post('/', async (req, res)=>{
    const prod = req.body;


    const prodAdd = await productManager.add(prod);
    
    res.send({status: 'successful', prodAdd})
})

router.put('/:pid', async (req, res) =>{
    const pid = parseInt(req.params.pid);
    const update = req.body;

    const prod = await productManager.getbyId(pid);
    
    if(!prod) return res.status(404).send(`product not found`);
    
    for(const prop in update){
        prod[prop] = update[prop];
    }
    
    await productManager.update(pid, prod);

    res.send({status: 'update successful', prod});
})

router.delete('/:pid', async (req, res)=>{
    const pid = parseInt(req.params.pid);
    const nlist = await productManager.delete(pid);
    if(!nlist) return res.status(404).send(`product not found`);
    res.send({status: 'update successful', nlist});
})

export default router;