const express = require('express');
const router = express.Router();
const fs = require('fs');

let products = [];

const productsDataFile = './data/products.json';
try {
  products = JSON.parse(fs.readFileSync(productsDataFile, 'utf8'));
} catch(error) {
  console.error('Error al cargar los productos:', error);
}

router.get('/', (req, res) => {
    if(products.length === 0) {
      res.status(404).json({ message: 'No hay productos disponibles.' });
    } else {
      res.json(products);
    }
});

router.get('/:pid', (req, res) => {
    const { pid } = req.params;

    if(pid < 1 || pid > (products.length)) {
        res
        .status(404)
        .json({ status: 'error', message: 'Producto no encontrado.' });
    return;
    }
    res.json(products[pid - 1]);
});

router.post('/', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || typeof title !== 'string' || !description || typeof description !== 'string' || !code || !price || typeof price !== 'number' || !stock || typeof stock !== 'number' || !category || typeof category !== 'string') {
        res.status(400).json({ mensaje: 'Todos los campos son requeridos.' });
        return;
    }

    if (!Array.isArray(products)) {
        products = [];
    }

    const newProduct = {
        id: products.length + 1,
        title,
        description,
        code,
        price,
        status: status || true,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    products.push(newProduct);
    fs.writeFileSync(productsDataFile, JSON.stringify(products), 'utf8');
    res.status(201).json({ status: 'success', message: 'Producto añadido con éxito.', product: newProduct });
});

router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const editProduct = products.find((product) => product.id === parseInt(pid));

    if (pid < 1 || pid > products.length) {
        res.status(404).json({ status: 'error', message: 'Producto no encontrado.' });
        return;
    }

    if (title !== undefined && typeof title === 'string') {
        editProduct.title = title;
    }
    if (description !== undefined && typeof description === 'string') {
        editProduct.description = description;
    }
    if (code !== undefined) {
        editProduct.code = code;
    }
    if (price !== undefined && typeof price === 'number') {
        editProduct.price = price;
    }
    if (status !== undefined) {
        editProduct.status = status;
    }
    if (stock !== undefined && typeof stock === 'number') {
        editProduct.stock = stock;
    }
    if (category !== undefined && typeof category === 'string') {
        editProduct.category = category;
    }
    if (thumbnails !== undefined && !Array.isArray(thumbnails)) {
        editProduct.thumbnails = thumbnails;
    }

    fs.writeFileSync(productsDataFile, JSON.stringify(products), 'utf8');
    res.status(201).json({ status: 'success', message: 'Producto editado con éxito.', product: editProduct });
});

router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const indexToDelete = products.findIndex((product) => product.id === parseInt(pid));

    if(indexToDelete === -1) {
        res
            .status(404)
            .json({ status: 'error', message: 'Producto no encontrado.' });
        return;
    }
    products.splice(indexToDelete, 1);

    for(let i = indexToDelete; i < products.length; i++) {
        products[i].id -= 1;
    }

    fs.writeFileSync(productsDataFile, JSON.stringify(products), 'utf8');
    res.status(201).json({ status: 'success', message: 'Producto eliminado con éxito.' });
});

module.exports = router;