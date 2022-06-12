const { response } = require('express');
const pool = require('../Database/database');
var moment = require('moment-timezone');

const saveOrderProducts = async (req, res = response) => {
    try {
        const { status, date, amount, address, note, payment, tax, totalOriginal, datee2, products } = req.body;
        const uid = req.uid;

        if (status == undefined || date == undefined || amount == undefined
            || address == undefined || payment == undefined || products == undefined) {
            return res.json({
                resp: false,
                msj: 'Somthing Wrong'
            });
        } else {
            console.log(req.body);
            console.log(products[0]);

            const db = await pool.query('INSERT INTO orderBuy (user_id, status, datee, amount, address, note, payment, tax, total_original, datee2) VALUES (?,?,?,?,?,?,?,?,?,?)', [uid, status, date, amount, address, note, payment, tax, totalOriginal, datee2]);

            console.log(products[0]);

            products.forEach(e => {
                pool.query('INSERT INTO orderDetails (orderBuy_id, product_id, quantity, price) VALUES(?,?,?,?)', [db.insertId, e.uidProduct, e.quantity, e.price]);
            });

            return res.status(200).json({
                resp: true,
                msj: 'Products save'
            });
        }
    } catch (error) {
        return res.status(400).json({
            resp: false,
            msj: error
        });
    }
}

const getPurchasedProduct = async (req, res = response) => {

    const uid = req.uid;

    const orderbuy = await pool.query('SELECT * FROM orderBuy WHERE user_id = ?', [uid]);

    console.log(orderbuy);

    if (orderbuy.length < 0) {
        return res.status(400).json({
            resp: false,
            msj: 'Orders is emty',
            orderBuy: [],
        });
    }

    for (i = 0; i < orderbuy.length; i++) {
        var a = moment.tz(orderbuy[i].datee, "Asia/Ho_Chi_Minh");
        console.log(a.format('DD/MM/yyyy HH:mm:ss'));

        orderbuy[i].datee = a.format('DD/MM/yyyy HH:mm:ss');
    }


    res.json({
        resp: true,
        msj: 'Get Puchased Products',
        orderBuy: orderbuy,
    });
}

const getDetailOders = async (req, res = response) => {

    const orderDetail = await pool.query('CALL SP_DETAIL_ORDERS(?);', [req.params.orderId]);

    console.log(orderDetail);

    if (orderDetail[0].length < 1) {
        return res.status(400).json({
            resp: false,
            msj: 'Order Detail Is Emty',
            orderDetails: []
        });
    }

    for (i = 0; i < orderDetail[0].length; i++) {
        var picture = JSON.parse(orderDetail[0][i].picture);

        orderDetail[0][i].picture = picture;
    }

    res.json({
        resp: true,
        msj: 'Get Order Detail',
        orderDetails: orderDetail[0]
    });
}

const updateOrderStatus = async (req, res = response) => {

    const { status, reason, orderId } = req.body;

    console.log(status + '+' + orderId);

    if (status == undefined || orderId == undefined || status == '' || orderId == '') {
        return res.json({
            resp: false,
            msj: 'status, reason or orderid is undefined',
        });
    }
    try {
        await pool.query('UPDATE orderbuy SET status = ?, reason = ? WHERE uidOrderBuy = ?', [status, reason, orderId]);

        if (status == -1) {
            const orderBuy = await pool.query('SELECT product_id, quantity FROM orderdetails WHERE orderBuy_id = ?', [orderId]);
            console.log(orderBuy);
            for (i = 0; i < orderBuy.length; i++) {
                var product = await pool.query('SELECT quantily, sold FROM products WHERE idProduct = ?', [orderBuy[i].product_id]);
                console.log(product);
                if (product != null || product[0].sold > -1) {
                    var sold = product[0].sold - orderBuy[i].quantity;
                    var quantily = product[0].quantily + orderBuy[i].quantity;
    
                    pool.query('UPDATE products SET quantily = ?, sold = ? WHERE idProduct = ?', [quantily, sold, orderBuy[i].product_id]);
                }
    
            }
        }
    
        res.status(200).json({
            resp: true,
            msj: 'Complete',
        });
    } catch (error) {
        return res.status(400).json({
            resp: false,
            msj: error,
        });
    }
}

module.exports = {
    saveOrderProducts,
    getPurchasedProduct,
    getDetailOders,
    updateOrderStatus,
}