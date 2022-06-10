const { response } = require('express');
const pool = require('../Database/database');
var moment = require('moment-timezone');
var fs = require("fs");


const getAllOrders = async (req, res = response, next) => {
    try {
        const row = await pool.query(`CALL SP_GET_ALL_ORDERS();`);
        const orders = row[0];

        if (orders.length == 0) {
            return res.status(200).json({
                resp: true,
                msj: 'No order',
                orders: []
            });
        }

        for (i = 0; i < orders.length; i++) {
            var a = moment.tz(orders[i].datee, "Asia/Ho_Chi_Minh");
            console.log(a.format('DD/MM/yyyy HH:mm:ss'));

            orders[i].datee = a.format('DD/MM/yyyy HH:mm:ss');
        }
        return res.status(200).json({
            resp: true,
            msj: 'Success',
            orders: orders
        });
    } catch (error) {
        return res.json({
            resp: false,
            msj: error,
            orders: []
        });
    }
};

const revenueStatistics = async (req, res = response, next) => {
    var starTime = req.query.starTime;
    var endTime = req.query.endTime;
    try {
        const row = await pool.query('CALL  SP_REVENUE_STATIS(?,?);', [starTime, endTime]);
        const statistic = row[0];
        console.log(statistic);
        for (i = 0; i < statistic.length; i++) {
            var a = moment.tz(statistic[i].datee2, "Asia/Ho_Chi_Minh");
            console.log(a.format('DD/MM/yyyy'));

            statistic[i].datee2 = a.format('DD/MM/yyyy');
        }

        if (statistic.length == 0) {
            return res.status(200).json({
                resp: true,
                msj: 'No data',
                revenue: []
            });
        }
        return res.status(200).json({
            resp: true,
            msj: 'Success',
            revenue: statistic
        });
    } catch (error) {
        return res.json({
            resp: false,
            msj: error,
            revenue: []
        });
    }
};

const exportInvoice = async (req, res = response, next) => {
    console.log("Chuan bi ghi du lieu vao file hien tai");

    try {
        const row = await pool.query(`CALL SP_EXPORT_INVOICE(?);`, [req.params.orderId]);
        const invoiceData = row[0];
        console.log(invoiceData);
        //   const productName = invoiceData.nameProduct;
        //   const quantity = invoiceData.quantity;
        //   const price = invoiceData.price;
        //   const amount_1 = quantity*price;
        const date = new Date(Date.now());
        var amount = 0;

        var data = '\t\t\t\tHOA DON BAN HANG\n'
            + '\t\t\t\tMa hoa don: ' + req.params.orderId + '\n'
            + 'Ten cua hang:\n'
            + 'Dia chi: abc-xyz\n\n\n'
            + 'Ten khach hang: ' + invoiceData[0].firstName + ' ' + invoiceData[0].lastName + '\n'
            + 'Dia chi: ' + invoiceData[0].address + '\n'
            + 'So dien thoai: ' + invoiceData[0].phone + '\n'
            + '┍━━┑━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┑━━━┑━━━━━━━━━━━━━━━━━━┑━━━━━━━━━━━━━━━━━━━┑\n'
            + '│st|ten san pham                                        │sl │price             |amount             |\n'


        for (i = 0; i < invoiceData.length; i++) {
            var productName = invoiceData[i].nameProduct;
            var quantity = invoiceData[i].quantity + "";
            var price = invoiceData[i].price + "";
            var amount_1 = (invoiceData[i].quantity * invoiceData[i].price) + "";
            amount = amount + (invoiceData[i].quantity * invoiceData[i].price);
            if (productName.length < 52) {
                const length = 52 - productName.length;
                for (j = 0; j < length; j++) {
                    productName = productName + " ";
                }
            }
            if (quantity.length < 3) {
                const length = 3 - quantity.length;
                for (j = 0; j < length; j++) {
                    quantity = quantity + " ";
                }
            }
            if (price.length < 18) {
                const length = 18 - price.length;
                for (j = 0; j < length; j++) {
                    price = price + " ";
                }
            }
            if (amount_1.length < 19) {
                const length = 19 - amount_1.length;
                for (j = 0; j < length; j++) {
                    amount_1 = amount_1 + " ";
                }
            }

            data = data + '│' + (i + 1) + ' |' + productName + '│' + quantity + '│' + price + '|' + amount_1 + '|\n'
        }

        if (invoiceData[0].payment == 'COD') {
            data = data + '┗━━┙━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┙━━━┙━━━━━━━━━━━━━━━━━━┙━━━━━━━━━━━━━━━━━━━┙\n'
                + '\n Tong gia: ' + amount + ' [ chua thanh toan ]'
                + '\n \t\t\t\t\t     Ngay ' + ("0" + date.getDate()).slice(-2) + ' thang ' + ("0" + (date.getMonth() + 1)).slice(-2) + ' nam ' + date.getFullYear() + ' \n'
                + '\t Khach Hang \t\t\t\tNguoi viet hoa don'
        } else {
            data = data + '┗━━┙━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┙━━━┙━━━━━━━━━━━━━━━━━━┙━━━━━━━━━━━━━━━━━━━┙\n'
                + '\n Tong gia: ' + amount + ' [ da thanh toan ]'
                + '\n \t\t\t\t\t     Ngay ' + ("0" + date.getDate()).slice(-2) + ' thang ' + ("0" + (date.getMonth() + 1)).slice(-2) + ' nam ' + date.getFullYear() + ' \n'
                + '\t Khach Hang \t\t\t\tNguoi viet hoa don'
        }

        const file = 'src/Download/HD' + req.params.orderId + '.txt';

        fs.writeFile(file, data, function (err) {
            if (err) {
                return res.json({
                    resp: false,
                    msj: err,
                });
            }
            console.log("Ghi du lieu vao file thanh cong!");
            console.log("Doc du lieu vua duoc ghi");

            fs.readFile(file, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                console.log("Noi dung file: " + data.toString());
            });
        });
        res.json({
            resp: true,
            msj: 'Export Invoice Success',
        });
    } catch (error) {
        return res.json({
            resp: false,
            msj: error,
        });
    }
}

const getOrderDetail = async (req, res = response, next) => {
    try {
        const row = await pool.query(`CALL SP_INFO_USER_ORDER(?);`, [req.params.orderId]);
        const info = row[0];

        const row2 = await pool.query(`CALL SP_GET_ORDER_DETAIL(?);`, [req.params.orderId]);
        const details = row2[0];

        console.log(info);
        console.log(details);

        if (info.length == 0 || details.length == 0) {
            return res.json({
                resp: true,
                msj: 'No data',
                order_detail: {}
            });
        }
        return res.json({
            resp: true,
            msj: 'Order Detail Data',
            order_detail: {
                order_id: info[0].uidOrderBuy,
                user_name: info[0].firstName + ' ' + info[0].lastName,
                address: info[0].address,
                phone: info[0].phone,
                amount: info[0].amount,
                note: info[0].note ?? '',
                reason: info[0].reason ?? '',
                payment: info[0].payment,
                status: info[0].status,
                details: details
            }
        });
    } catch (error) {
        return res.json({
            resp: false,
            msj: error,
            order_detail: {}
        });
    }
};

module.exports = {
    getAllOrders,
    revenueStatistics,
    exportInvoice,
    getOrderDetail
}