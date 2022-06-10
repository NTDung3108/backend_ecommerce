const { response } = require('express');
const pool = require('../Database/database');

const topBuyers = async (req, res = response) => {
    try {
        const buyers = await pool.query(`CALL SP_TOP_BUYERS;`);
        return res.status(200).json({
            resp: true,
            msj: 'Success',
            buyers: buyers[0]
        });
    } catch (error) {
        return res.json({
            resp: false,
            msj: error,
            buyers: []
        });
    }
};

const revenue = async (req, res = response, next) => {
    try {
        const revenue = await pool.query('SELECT amount, tax, total_original FROM orderbuy WHERE datee2 like' + '\'' + req.query.time + '%\'' + 'AND status = 2;');

        console.log(revenue[0]);

        if (revenue == undefined) {
            return res.json({
                resp: false,
                msj: 'Revenue',
                revenue: {}
            });
        }

        return res.json({
            resp: true,
            msj: 'Revenue',
            revenue: revenue[0]
        });

    } catch (error) {
        return res.json({
            resp: false,
            msj: error,
            revenue: {}
        });
    }
}

const sumProduct = async (req, res = response, next) => {
    try {
        const sum = await pool.query('SELECT SUM(quantily) as quantity FROM products WHERE status = 1');

        if (sum == undefined) {
            return res.json({
                resp: false,
                msj: 'Sum Product',
                sumProduct: 0
            });
        }

        return res.json({
            resp: true,
            msj: 'Sum Product',
            sumProduct: sum[0].quantity
        });

    } catch (error) {
        return res.json({
            resp: false,
            msj: error,
            sumProduct: 0
        });
    }
}

const sumOrder = async (req, res = response, next) => {
    try {
        const sum = await pool.query('SELECT COUNT(uidOrderBuy) AS amount FROM orderbuy WHERE status = 2 AND datee2 like ' + '\'' + req.query.time + '%\'');

        if (sum == undefined) {
            return res.json({
                resp: false,
                msj: 'sum order',
                sumProduct: 0
            });
        }

        return res.json({
            resp: true,
            msj: 'sum order',
            sumOrder: sum[0].amount
        });

    } catch (error) {
        return res.json({
            resp: false,
            msj: error,
            sumOrder: 0
        });
    }
}

const topProduct = async (req, res = response, next) => {
    try {
        const products = await pool.query('SELECT nameProduct, picture, sold, price FROM products WHERE status = 1 ORDER BY sold DESC Limit 10');

        if (products == undefined) {
            return res.json({
                resp: false,
                msj: 'no products',
                topProduct: []
            });
        }

        for (i = 0; i < products.length; i++) {
            const picture = JSON.parse(products[i].picture);
            products[i].picture = picture;
        }

        return res.status(200).json({
            resp: true,
            msj: 'Success',
            topProducts: products
        });
    } catch (error) {
        return res.json({
            resp: false,
            msj: error,
            topProducts: []
        });
    }
};

module.exports = {
    topBuyers,
    revenue,
    sumProduct,
    sumOrder,
    topProduct
}