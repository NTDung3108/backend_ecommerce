const { response } = require('express');
const pool = require('../Database/database');
var moment = require('moment-timezone');

const addFavoriteProduct = async (req, res = response) => {

    const { idProduct, idUser } = req.body;

    const rows = await pool.query('SELECT product_id, user_id FROM favorite WHERE product_id = ? AND user_id = ?', [idProduct, idUser]);

    console.log(rows);
    console.log(idProduct + idUser + "");

    if (rows.length == 0) {
        await pool.query(`CALL SP_ADD_PRODUCT_FAVORITE(?,?);`, [idProduct, idUser]);

        res.json({
            resp: true,
            msj: 'Product add to Favorite'
        })
    } else {
        await pool.query(`CALL SP_DELETE_PRODUCT_FAVORITE(?,?);`, [idProduct, idUser]);

        res.json({
            resp: true,
            msj: 'Delete product to Favorite'
        });
    }
};

const productFavoriteForUser = async (req, res = response) => {

    const uidUser = req.uid;

    const rows = await pool.query(`CALL SP_LIST_FAVORITE_PRODUCTS(?);`, [uidUser]);

    const listProducts = rows[0];

    console.log(listProducts[0]);

    for (i = 0; i < listProducts.length; i++) {

        const color = JSON.parse(listProducts[i].colors);

        const picture = JSON.parse(listProducts[i].picture);

        listProducts[i].colors = color;

        listProducts[i].picture = picture;
    }

    res.json({
        resp: true,
        msj: 'List to products favorites',
        favorites: listProducts
    });
}

// const saveOrderProducts = async (req, res = response) => {
//     try {
//         const { status, date, amount, address, note, payment, products } = req.body;
//         const uid = req.uid;

//         if (status == undefined || date == undefined || amount == undefined
//             || address == undefined || payment == undefined || products == undefined) {
//             return res.status(400).json({
//                 resp: false,
//                 msj: 'Somthing Wrong'
//             });
//         } else {

//             const db = await pool.query('INSERT INTO orderBuy (user_id, status, datee, amount, address, note, payment) VALUES (?,?,?,?,?,?,?)', [uid, status, date, amount, address, note, payment]);

//             console.log(db);

//             console.log(products[0]);

//             products.forEach(e => {
//                 pool.query('INSERT INTO orderDetails (orderBuy_id, product_id, quantity, price) VALUES(?,?,?,?)', [db.insertId, e.uidProduct, e.amount, e.price]);
//             });

//             return res.status(200).json({
//                 resp: true,
//                 msj: 'Products save'
//             });
//         }
//     } catch (error) {
//         return res.json({
//             resp: true,
//             msj: error
//         });
//     }
// }

const checkQuantityProduct = async (req, res = response) => {
    var idProduct = req.query.idProduct;
    var quantity = req.query.quantity;
    if (idProduct == undefined || quantity == undefined) {
        return res.json({
            resp: false,
            msj: 'Somthing Wrong'
        });
    }
    try {
        const row = await pool.query('SELECT nameProduct, quantily, sold FROM products WHERE idProduct = ?', [idProduct]);
        if(row[0].quantily > parseInt(quantity)){
            return res.json({
                resp: true,
                msj: 'update number successfully'
            });
        }else{
            return res.json({
                resp: false,
                msj: 'Quantity '+ row[0].nameProduct + ' is not enough'
            });
        }
    } catch (error) {
        return res.json({
            resp: false,
            msj: error
        });
    }
}

const updateQuantityProduct = async (req, res = response) => {
    var {idProduct, quantity} = req.body;
    if (idProduct == undefined || quantity == undefined) {
        return res.json({
            resp: false,
            msj: 'Somthing Wrong'
        });
    }
    try {
        const row = await pool.query('SELECT nameProduct, quantily, sold FROM products WHERE idProduct = ?', [idProduct]);
            var nQuantity = row[0].quantily - quantity;
            var nSold = row[0].sold + quantity;
            pool.query('UPDATE products SET quantily = ?, sold =? WHERE idProduct = ?',[nQuantity, nSold, idProduct]);
            return res.json({
                resp: true,
                msj: 'update number successfully'
            });
    } catch (error) {
        return res.json({
            resp: false,
            msj: error
        });
    }
}

// const getPurchasedProduct = async (req, res = response) => {

//     const uid = req.uid;

//     const orderbuy = await pool.query('SELECT * FROM orderBuy WHERE user_id = ?', [uid]);

//     console.log(orderbuy);

//     if (orderbuy.length < 0) {
//         return res.status(400).json({
//             resp: false,
//             msj: 'Orders is emty',
//             orderBuy: [],
//         });
//     }

//     for (i = 0; i < orderbuy.length; i++) {
//         var a = moment.tz(orderbuy[i].datee, "Asia/Ho_Chi_Minh");
//         console.log(a.format('DD/MM/yyyy HH:mm:ss'));

//         orderbuy[i].datee = a.format('DD/MM/yyyy HH:mm:ss');
//     }


//     res.json({
//         resp: true,
//         msj: 'Get Puchased Products',
//         orderBuy: orderbuy,
//     });
// }

const getProductsForCategories = async (req, res = response) => {

    const rows = await pool.query(`CALL SP_LIST_PRODUCTS_FOR_SUBCATEGORY(?);`, [req.params.id]);

    console.log(rows[0]);
    const product = rows[0];

    for (i = 0; i < product.length; i++) {

        const colors = JSON.parse(product[i].colors);

        const picture = JSON.parse(product[i].picture);

        product[i].colors = colors;

        product[i].picture = picture;
    }

    res.json({
        resp: true,
        msj: 'List Products',
        products: product
    });

}

const getBrandList = async (req, res = response) => {

    const rows = await pool.query(`CALL SP_BRAND_LIST(?);`, [req.params.subCategoryId]);

    console.log(rows[0]);

    res.json({
        resp: true,
        msj: 'List brands',
        brands: rows[0]
    });
}

const getAllProducts = async (req, res = response) => {

    const rows = await pool.query('SELECT * FROM Products WHERE status = 1');

    console.log(rows);

    for (i = 0; i < rows.length; i++) {
        const colors = JSON.parse(rows[i].colors);

        const picture = JSON.parse(rows[i].picture);

        rows[i].colors = colors;

        rows[i].picture = picture;
    }

    res.status(200).json({
        resp: true,
        msj: 'List Products',
        products: rows
    });

}

// const getDetailOders = async (req, res = response) => {

//     const orderDetail = await pool.query('CALL SP_DETAIL_ORDERS(?);', [req.params.orderId]);

//     console.log(orderDetail);

//     if (orderDetail[0].length < 1) {
//         return res.status(400).json({
//             resp: false,
//             msj: 'Order Detail Is Emty',
//             orderDetails: []
//         });
//     }

//     for (i = 0; i < orderDetail[0].length; i++) {
//         var picture = JSON.parse(orderDetail[0][i].picture);

//         orderDetail[0][i].picture = picture;
//     }

//     res.json({
//         resp: true,
//         msj: 'Get Order Detail',
//         orderDetails: orderDetail[0]
//     });
// }

// const updateOrderStatus = async (req, res = response) => {

//     const { status, reason, orderId } = req.body;

//     console.log(status + '+' + orderId);

//     if (status == undefined || orderId == undefined || status == '' || orderId == '') {
//         return res.status(400).json({
//             resp: false,
//             msj: 'status, reason or orderid is undefined',
//         });
//     }

//     await pool.query('UPDATE orderbuy SET status = ?, reason = ? WHERE uidOrderBuy = ?', [status, reason, orderId]);

//     if (status == -1) {
//         const orderBuy = await pool.query('SELECT product_id, quantity FROM orderdetails WHERE orderBuy_id = ?', [orderId]);
//         console.log(orderBuy);
//         for (i = 0; i < orderBuy.length; i++) {
//             var product = await pool.query('SELECT quantily, sold FROM products WHERE idProduct = ?', [orderBuy[i].product_id]);
//             console.log(product);
//             if (product != null || product[0].sold > -1) {
//                 var sold = product[0].sold - orderBuy[i].quantity;
//                 var quantily = product[0].quantily + orderBuy[i].quantity;

//                 pool.query('UPDATE products SET quantily = ?, sold = ? WHERE idProduct = ?', [quantily, sold, orderBuy[i].product_id]);
//             }

//         }
//     }

//     res.status(200).json({
//         resp: true,
//         msj: 'Complete',
//     });
// }

const getProductDetail = async (req, res = response) => {

    try {
        const rows = await pool.query('CALL SP_GET_PRODUCT_DETAIL(?);', [req.params.productId]);

        console.log(rows[0][0]);

        var product = rows[0][0];

        if (product == null) {
            return res.json({
                resp: true,
                msj: 'No Product',
                detail: product
            });
        }

        const picture = JSON.parse(product.picture);
        const colors = JSON.parse(product.colors);
        product.picture = picture;
        product.colors = colors;

        return res.json({
            resp: true,
            msj: 'Product Detail',
            detail: product
        });

    } catch (error) {
        return res.json({
            resp: true,
            msj: error,
            detail: null
        });
    }

}

module.exports = {
    updateQuantityProduct,
    addFavoriteProduct,
    productFavoriteForUser,
    getProductsForCategories,
    getBrandList,
    getAllProducts,
    checkQuantityProduct,
    getProductDetail
}