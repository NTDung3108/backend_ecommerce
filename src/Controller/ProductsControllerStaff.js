const{ response } = require('express');
const pool = require('../Database/database');

const addNewProduct = async (req, res = response) => {
    const {in_nameProduct, in_description, in_price, in_discount, in_quantily, 
        in_brands_id, in_colors ,in_subcategory_id} = req.body;

    var pictures = [];

    try {
        
        console.log(req.files);
        if(req.files == undefined || req.files.length <= 0){
            return res.json({
                resp : false,
                msj : 'You must select at least 1 file or more.'
            });
        }

        for(i = 0 ; i<req.files.length; i++){
            pictures.push(req.files[0].filename);
        }

        var json1 = JSON.stringify(pictures);

        console.log(json1+' - '+typeof(json1));

        if(in_nameProduct == ''||in_description == ''||in_price == ''||in_discount == ''||in_quantily == ''
        ||in_brands_id == ''||in_subcategory_id== ''){
            return res.status(400).json({
                resp : false,
                msj : 'Missing product information'
            });
        }
    
        var date = new Date().getTime()/1000;
        var time = Math.round(date);

        
        console.log(time);

        var json = JSON.stringify(in_colors);

        console.log(json+' - '+typeof(json));
        

        await pool.query(`CALL SP_ADD_PRODUCT(?,?,?,?,?,?,?,?,?,?);`,[in_nameProduct, in_description, in_price, in_discount, in_quantily,
            in_brands_id, json, in_subcategory_id, time, time]);
        
        return res.status(200).json({
            resp : true,
            msj : 'Success'
        });
        
    } catch (error) {
        return res.status(400).json({
            resp : false,
            msj : error
        });
    }
};

// const updateProduct = async (req, res = response) => {
//     const {in_nameProduct, in_description, in_price, in_discount, in_quantily, 
//         in_brands_id, in_colors ,in_subcategory_id} = req.body;

//     try {
        
//         console.log(req.files);
//         if(req.files == undefined || req.files.length <= 0){
//             return res.json({
//                 resp : false,
//                 msj : 'You must select at least 1 file or more.'
//             });
//         }

//         for(i = 0 ; i<req.files.length; i++){
//             pictures.push(req.files[0].filename);
//         }

//         var json1 = JSON.stringify(pictures);

//         console.log(json1+' - '+typeof(json1));

//         if(in_nameProduct == ''||in_description == ''||in_price == ''||in_discount == ''||in_quantily == ''
//         ||in_brands_id == ''||in_subcategory_id== ''){
//             return res.status(400).json({
//                 resp : false,
//                 msj : 'Missing product information'
//             });
//         }
    
//         var date = new Date().getTime()/1000;
//         var time = Math.round(date);

        
//         console.log(time);

//         var json = JSON.stringify(in_colors);

//         console.log(json+' - '+typeof(json));
        

//         await pool.query(`CALL SP_ADD_PRODUCT(?,?,?,?,?,?,?,?,?,?);`,[in_nameProduct, in_description, in_price, in_discount, in_quantily,
//             in_brands_id, json, in_subcategory_id, time, time]);
        
//         return res.status(200).json({
//             resp : true,
//             msj : 'Success'
//         });
        
//     } catch (error) {
//         return res.status(400).json({
//             resp : false,
//             msj : error
//         });
//     }
// };


const deleteProduct = async (req, res = response) =>{
    
    try {
        if(req.params.idProduct == undefined || req.params.idProduct == null || req.params.idProduct == ''){
            return res.status(400).json({
                resp : false,
                msj : 'Product deletion failed due to missing idproduct'
            });
        }
    
        await pool.query(`CALL SP_DELETE_PRODUCT(?);`,[req.params.idProduct]);
    
        return res.status(200).json({
            resp : true,
            msj : 'Success'
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error
        });
    }
}

const getProductById = async (req, res = response) => {
    try {
        console.log(req.params.id);
        if(req.params.id == undefined || req.params.id == ''){
            return res.status(400).json({
                resp : false,
                msj : 'Missing idProduct',
                product: {}
            });
        }

        const row = await pool.query("SELECT*FROM products WHERE idProduct = ? AND status = 1;",[req.params.id]);
        
        const product = row[0];

        const colors = JSON.parse(product.colors);
    
        const picture = JSON.parse(product.picture);
    
        product.colors = colors;
    
        product.picture = picture;
    
        return res.status(200).json({
            resp : true,
            msj : 'Product by id = ' +req.params.id,
            product: product
        });

    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            product: {}
        });
    }
}

const getAllProductStaff = async(req, res = response) => {
    try {
    
        const row = await pool.query(`CALL SP_GET_PRODUCT_STAFF();`);
        
        const product = row[0];

        console.log(product);

        if(product == null){
            return res.json({
                resp : false,
                msj : 'All Product Fail',
                products: []
            });
        }

        return res.status(200).json({
            resp : true,
            msj : 'All Product',
            products: product
        });

    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            products: []
        });
    }
}

module.exports = {
    addNewProduct,
    deleteProduct,
    getProductById,
    getAllProductStaff
}