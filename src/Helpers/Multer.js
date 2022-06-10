const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: ( req, res, cb ) => {
        cb(null, 'src/Uploads/Profile')
    },
    filename: ( req, file, cb ) => {
        cb( null, file.fieldname + '-' + Date.now() + path.extname(file.originalname) )
    }
});


const uploadsProfile = multer({ storage: storage });

// Khởi tạo biến cấu hình cho việc lưu trữ file upload
var product_storage = multer.diskStorage({
    // Định nghĩa nơi file upload sẽ được lưu lại
    destination: (req, file, callback) => {
      callback(null, 'src/Uploads/Products');
    },
    filename: (req, file, callback) => {
      // Tên của file thì mình nối thêm một cái nhãn thời gian để tránh bị trùng tên file.
      let filename = `${Date.now()}-product-${file.originalname}`;
      callback(null, filename);
    }
  });
  // Khởi tạo middleware uploadManyFiles với cấu hình như ở trên,
  // Bên trong hàm .array() truyền vào name của thẻ input, ở đây mình đặt là "many-files", và tham số thứ hai là giới hạn số file được phép upload mỗi lần, mình sẽ để là 17 (con số mà mình yêu thích). Các bạn thích để bao nhiêu cũng được.
  const uploadManyFiles = multer({storage: product_storage});

  var brands_storage = multer.diskStorage({
    destination: ( req, res, cb ) => {
        cb(null, 'src/Uploads/Brands')
    },
    filename: ( req, file, cb ) => {
        cb( null, file.fieldname + '-brands-' + Date.now() + path.extname(file.originalname) )
    }
  });

  const uploadsBrands = multer({ storage: brands_storage });

  // Khởi tạo biến cấu hình cho việc lưu trữ file upload
var categories_storage = multer.diskStorage({
  // Định nghĩa nơi file upload sẽ được lưu lại
  destination: (req, file, callback) => {
    callback(null, 'src/Uploads/Categories');
  },
  filename: (req, file, callback) => {
    // Tên của file thì mình nối thêm một cái nhãn thời gian để tránh bị trùng tên file.
    let filename = `${Date.now()}-categories-${file.originalname}`;
    callback(null, filename);
  }
});
// Khởi tạo middleware uploadManyFiles với cấu hình như ở trên,
// Bên trong hàm .array() truyền vào name của thẻ input, ở đây mình đặt là "many-files", và tham số thứ hai là giới hạn số file được phép upload mỗi lần, mình sẽ để là 17 (con số mà mình yêu thích). Các bạn thích để bao nhiêu cũng được.
const uploadPictures = multer({storage: categories_storage});

const uploadsDiscount = multer({ storage: discount_storage });

// Khởi tạo biến cấu hình cho việc lưu trữ file upload
var discount_storage = multer.diskStorage({
    // Định nghĩa nơi file upload sẽ được lưu lại
    destination: (req, file, callback) => {
      callback(null, 'src/Uploads/Discount');
    },
    filename: (req, file, callback) => {
      // Tên của file thì mình nối thêm một cái nhãn thời gian để tránh bị trùng tên file.
      let filename = `${Date.now()}-product-${file.originalname}`;
      callback(null, filename);
    }
  });

module.exports = {
    uploadsProfile,
    uploadManyFiles,
    uploadsBrands,
    uploadPictures
}