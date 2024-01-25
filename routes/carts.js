const express = require('express');
const router = express.Router();
const fs = require('fs');

let carts = [];

const cartsDataFile = './data/carts.json';
const productsDataFile = './data/products.json';
try {
  carts = JSON.parse(fs.readFileSync(cartsDataFile, 'utf8'));
} catch (error) {
  console.error('Error al cargar los carritos:', error);
  carts = [];
}

let products = [];

try {
  products = JSON.parse(fs.readFileSync(productsDataFile, 'utf8'));
} catch(error) {
  console.error('Error al cargar los productos:', error);
  productos = [];
}

router.post('/', (req, res) => {
    const newCart = {
        id: carts.length + 1,
        products: []
    }
    carts.push(newCart);

    fs.writeFileSync(cartsDataFile, JSON.stringify(carts), 'utf8');
    res.status(201).json({ status: 'success', message: 'Carrito creado con éxito.', cart: newCart })
})

router.get('/:cid', (req, res) => {
    const { cid } = req.params;

    if(cid < 1 || cid > (carts.length)) {
        res
        .status(404).json({ status: 'error', message: 'Producto no encontrado.' });
    return;
    }
    res.json(carts[cid - 1].products);
})

router.post('/:cid/products/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity <= 0) {
        return res
            .status(400)
            .json({ status: 'error', message: 'La propiedad "quantity" es requerida y debe ser un número positivo.' });
    }

    if(cid < 1 || cid > (carts.length)) {
        res
        .status(404)
        .json({ status: 'error', message: 'Producto no encontrado.' });
    return;
    }
    if(pid < 1 || pid > (products.length)) {
        res
        .status(404)
        .json({ status: 'error', message: 'Producto no encontrado.' });
    return;
    }
    const cart = carts[cid - 1];
    const product = products[pid - 1];
    const findProduct = cart.products.find(item => item.id === pid);

    if(findProduct) {
        findProduct.quantity += quantity;
    } else {
        cart.products.push({
            id: pid,
            quantity: quantity
        })
    }

    fs.writeFileSync(cartsDataFile, JSON.stringify(carts), 'utf8');
    res.status(201).json({ status: 'success', message: 'Producto agregado al carrito con éxito.', product: pid });
})

module.exports = router;