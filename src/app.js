import express from "express";
import prodRouter from './router/productRouter.js';
import cartRouter from './router/cartRouter.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));


app.use('/api/products', prodRouter);
app.use('/api/carts', cartRouter);

const server = app.listen(8080);
server.on('error', ()=>console.log('ERROR'));