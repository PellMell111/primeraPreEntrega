const express = require('express');

const app = express();
const router = express.Router();
const PORT = 8080;

app.use(express.json());

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Ocurrío algún problema!');
});

app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});