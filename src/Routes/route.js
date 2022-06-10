const cors = require('cors');
const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, createStaff} = require('../Controller/Register');
const { LoginUser, RenewToken, RefreshToken, LoginStaff} = require('../Controller/LoginController');
const { ValidatedAuth} = require('../Middlewares/ValidateAuth');
const { validateToken } = require('../Middlewares/ValidateToken');
const { changePhotoProfile, userPersonalRegister, getPersonalInformation, 
    updateFirstName, updateLastName, updatePhone, updateAddress, checkPhone, forgotPassword} = require('../Controller/UserController');
const { uploadsProfile, uploadManyFiles, uploadsBrands} = require('../Helpers/Multer');
const { ListProductsHome, ListCategoriesAll, ListCategoriesHome, ListSubCategoriesAll,
     ListDiscaountBannerHome, ListSubcategoriesHome, getAllSubCategories} = require('../Controller/HomeController');
const { addFavoriteProduct, productFavoriteForUser, saveOrderProducts, getPurchasedProduct, 
    getProductsForCategories, getBrandList, getAllProducts, checkQuantityProduct, getDetailOders,
    updateOrderStatus, getProductDetail} = require('../Controller/ProductsController');
const { addNewProduct, deleteProduct, getProductById, getAllProductStaff} = require('../Controller/ProductsControllerStaff');
const { addNewBrands, getAllBrands, deleteBrands } = require('../Controller/BrandsControllerStaff');
const { getAllOrders, revenueStatistics, exportInvoice, getOrderDetail} = require('../Controller/OrdersControllerStaff');
const { getAllUsers, getAllStaff, verifyStaff, registerInfoStaff} = require('../Controller/UserControllerSaff');
const { topBuyers, revenue, sumProduct, sumOrder, topProduct} = require('../Controller/AdminHomeContronller');
const { getAllDiscount } = require('../Controller/DiscountControllerStaff');
const { getRating, getAVGRating, addNewRating } = require('../Controller/RatingController');
const {  } = require('../Controller/CategoryControllerStaff');



const router = Router();


router.post( '/api/register', [
    check('phone', 'PhoneNumber is required').isMobilePhone(),
    check('password', 'Password is required').not().isEmpty(),
    check('idUser', 'idUser is required').not().isEmpty(),
    ValidatedAuth
], createUser);

router.post('/api/login',[
    check('phone', 'PhoneNumber is required').isMobilePhone(),
    check('password', 'Password is required').not().isEmpty(),
    ValidatedAuth
], LoginUser );

router.put('/api/personal/register', userPersonalRegister);

router.put('/api/personal/updateFirstName', validateToken, updateFirstName);
router.put('/api/personal/updateLastName', validateToken, updateLastName);
router.put('/api/personal/updatePhone', validateToken, updatePhone);
router.put('/api/personal/updateAddress', validateToken, updateAddress);

router.get('/api/get-personal-information', validateToken, getPersonalInformation);

router.get('/api/login/renew', validateToken, RenewToken);

router.post('/api/login/refresh-token', RefreshToken)

router.put('/api/update-image-profile', [validateToken, uploadsProfile.single('image')], changePhotoProfile);

router.get('/api/check-phone/:phone', checkPhone);

router.put('/api/forgot-password', forgotPassword);



//router home
router.get('/api/list-products-home', ListProductsHome);
router.get('/api/list-categories-home', ListCategoriesHome);
router.get('/api/discount-banners-home', ListDiscaountBannerHome);
router.get('/api/list-subcategory-home', ListSubcategoriesHome);


//router categoris
router.get('/api/list-categories-all', ListCategoriesAll);

//router subcategoris
router.get('/api/list-subcategories-all/:idCategory', ListSubCategoriesAll);
router.get('/api/get-all-subcategories', getAllSubCategories);


//Products
router.post('/api/add-Favorite-Product', validateToken, addFavoriteProduct);
router.get('/api/product-favorite-for-user', validateToken, productFavoriteForUser);
router.post('/api/save-order-products', validateToken, saveOrderProducts);
router.get('/api/get-purchased-products', validateToken, getPurchasedProduct);
router.get('/api/get-products-for-subcategories/:id', getProductsForCategories);
router.get('/api/get-brands-list/:subCategoryId', getBrandList);
router.get('/api/get-all-product', getAllProducts);
router.put('/api/update-quantity-product', validateToken, checkQuantityProduct);
router.get('/api/get-detail-by-id/:orderId', validateToken, getDetailOders);
router.put('/api/update-order-status', validateToken, updateOrderStatus);
router.get('/api/get-detail-product/:productId', getProductDetail);

router.get('/api/get-avg-rating/:productId', getAVGRating);
router.post('/api/new-rating', addNewRating);

////////////////////////////////////////////////////////////////////////////////////////

//Staff api//

//api auth staff

router.post( '/api/register-staff', [
    check('phone', 'PhoneNumber is required').isMobilePhone(),
    check('password', 'Password is required').not().isEmpty(),
    check('idUser', 'idUser is required').not().isEmpty(),
    ValidatedAuth,
], createStaff);

router.post('/api/login-staff',[
    check('phone', 'PhoneNumber is required').isMobilePhone(),
    check('password', 'Password is required').not().isEmpty(),
    ValidatedAuth,
], LoginStaff );

router.put('/api/staff/register', registerInfoStaff);

router.post('/api/staff/add-new-product', uploadManyFiles.array('multi-files',5), addNewProduct);
router.delete('/api/staff/delete-product/:idProduct', deleteProduct);
router.get('/api/staff/get-product-by-id/:id', getProductById)
router.get('/api/staff/get-all-product', getAllProductStaff)

router.post('/api/staff/add-new-brands', uploadsBrands.single('brands'), addNewBrands);
router.get('/api/staff/get-all-brands', getAllBrands);
router.delete('/api/staff/delete-brands', deleteBrands);

router.get('/api/staff/get-all-orders', getAllOrders);

router.get('/api/staff/top-buyer', cors(), topBuyers);

router.get('/api/staff/get-all-user', getAllUsers);
router.get('/api/staff/get-all-staff', validateToken, getAllStaff);
router.put('/api/staff/verify-staff', validateToken, verifyStaff);

router.get('/api/get-all-discount', getAllDiscount);

router.get('/api/get-rating/:productId', validateToken, getRating);

router.get('/api/get-all-order', [validateToken, cors()], getAllOrders);
router.get('/api/revenue-statistics', [validateToken, cors()], revenueStatistics);
router.get('/api/export_invoice/:orderId',cors(), exportInvoice);
router.get('/api/order_details/:orderId', [validateToken, cors()], getOrderDetail);

router.get('/api/revenue-month', [validateToken, cors()], revenue);
router.get('/api/sum-product', [validateToken, cors()], sumProduct);
router.get('/api/sum-order', [validateToken, cors()], sumOrder);
router.get('/api/top-Products', [validateToken, cors()], topProduct);

module.exports = router;