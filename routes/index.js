var express = require('express');
const session = require('express-session');
var router = express.Router();
router.use(express.static('public'));
router.use('/uploads', express.static('uploads'))
router.use(session({ secret: process.env.TOKEN_SECRET, rolling: true,
  cookie: { maxAge: 60 * 1000 * 60 }, resave: false, saveUninitialized: false}));

var db = require("../database/db");
var { saveAllVendorInformation } = require("../database/db");
var multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the directory where uploaded files will be saved
    cb(null, './uploads'); // Replace 'path/to/uploads' with your desired directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for each uploaded file
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  }
});

const fileFilter = (req, file, cb) => {
  // Validate allowed file types
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only .png, .jpg, and .jpeg format allowed!'));
  }
};

const upload = multer({ storage, fileFilter });

const bodyParser = require('body-parser'); // Jika Anda menggunakan express versi lama
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/authenticate'); // Impor middleware otentikasi
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const pdf = require('html-pdf');
const axios = require('axios');


dotenv.config(); // Load konfigurasi dari file .env

// CONTROLLER
var bidding_tenderController = require('../src/bidding_tender/controller');
var detail_bidding_tenderController = require('../src/detail_bidding_tender/controller');
var kriteriaController = require('../src/kriteria/controller');
var detail_vsController = require('../src/detail_vs/controller');
var goods_receivedController = require('../src/goods_received/controller');
var itemController = require('../src/item/controller');
var purchase_orderController = require('../src/purchase_order/controller');
var roleController = require('../src/role/controller');
//var statusController = require('../src/status/controller');
var template_vsController = require('../src/template_vs/controller');
var detail_template_vsController = require('../src/detail_template_vs/controller');
//var tipe_pemilihanController = require('../src/tipe_pemilihan/controller');
var userController = require('../src/user/controller');
var notifController = require('../src/notif/controller');
var pengadaanController = require('../src/pengadaan/controller');
var vendor_scoreController = require('../src/vendor_score/controller');
var vendorController = require('../src/vendor/controller');
//var jenis_pengadaanController = require('../src/jenis_pengadaan/controller');
//var jenis_vendorController = require('../src/jenis_vendor/controller');

// SOME QUERIES
const { option_Tipe_Pemilihan1 } = require('../src/pengadaan/queries');
const { option_Tipe_Pemilihan2 } = require('../src/pengadaan/queries');
const { option_Jenis_Vendor } = require('../src/jenis_vendor/queries');
const { option_Vendor } = require('../src/vendor/queries');
const { option_Jenis_Pengadaan } = require('../src/jenis_pengadaan/queries');
const { option_Select_Status} = require('../src/pengadaan/queries');

/* GET home page. */
// Daftar rute yang tidak perlu dicek sesinya
const noSessionCheckRoutes = ['/', '/login', '/registration', '/kabupaten-kota'];

async function checkSession (req, res, next) {
  // DEV
  if(process.env.ISDEV == "true"){

    // ADMIN
    if(process.env.ISADMIN == "true"){
      var result = await userController.getUserByEmail('admin@example.com');
      result[0]['isAdmin'] = true
      req.session.data = {
        parent : result[0] 
      };
    }else{
      // Vendor
      var result = await vendorController.getEmail('koci@gmail.com');
      result[0]['isAdmin'] = false
      req.session.data = {
        parent : result[0]
      };
    }
    req.session.data.parent.notif = await notifController.getNotif(result[0].id);
  }
  

  // Jika rute saat ini ada di daftar noSessionCheckRoutes, lanjutkan ke rute berikutnya
  if (noSessionCheckRoutes.includes(req.path)) {
    return next();
  }

  // Cek sesi seperti biasa
  if (req.session && req.session.data) {
    var result = [];
    var temp = true;
    if(req.session.data.parent.isAdmin){
      result = await userController.getUserByEmail(req.session.data.parent.email);
      temp = true;
    }else{
      result = await vendorController.getEmail(req.session.data.parent.email_perusahaan);
      temp = false;
    }
    req.session.data.parent = result[0];
    if(temp){
      req.session.data.parent.isAdmin = true;
    }else{
      req.session.data.parent.isAdmin = false;
    }
    req.session.data.parent.notif = await notifController.getNotif(result[0].id);
    next();
  } else {
    res.redirect('/');
  }
}

router.use(checkSession);

router.get('/', function(req, res) {
  res.redirect('login');
});

router.get('/login', function(req, res) {
  // console.log(req.session.data.parent.isAdmin)
  if(req.session.data == null){
    res.render('login', {
      title: 'Login Page'
    });
  }else{
    if(req.session.data.parent.isAdmin){
      res.redirect('/dashboard-admin');
    }else{
      res.redirect('/dashboard-vendor');
    }
  }
});

router.get('/logout', function(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      // Handle error appropriately (e.g., send error response to user)
      return res.status(500).json({ error: 'Failed to logout.' });
    }

    res.clearCookie(); // Optional: Clear session cookie
    res.redirect('/login'); // Redirect to login page after logout
  });
});


// Fungsi untuk menghasilkan token JWT
function generateAccessToken(data) {
  return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

// Rute untuk login
router.post('/login', async (req, res) => {
  const { email_perusahaan, password } = req.body;
  try {
    const result = await vendorController.getEmail(email_perusahaan);
    const resultAdm = await userController.getUserByEmail(email_perusahaan);
    if (result.length > 0) {
      const passwordDb = result[0].password;
      if (passwordDb.trim() === password.trim()) {
        const token = generateAccessToken({ email: result[0].email });
        result[0]['isAdmin'] = false;

        result[0]['notif'] = await notifController.getNotif(result[0].id);

        req.session.data = {parent: result[0]};
        res.redirect(result[0]['status_verifikasi_id'] == "bec6ed04-e967-4ce8-8865-e6285690174e" ? '/dashboard-vendor' : '/approved-vendor-profile');
        // Send data to route 2 via POST request
      } else {
        return res.status(401).json({ error: 'Autentikasi gagal. Email atau kata sandi tidak valid.' });
      }
    } else if(resultAdm.length > 0) {
      const passwordDb = resultAdm[0].password;
      if (passwordDb.trim() === password.trim()) { //Besok cari cara nge akses token di sidebar dna di file" lainnya
        const token = generateAccessToken({ email: resultAdm[0].email });
        resultAdm[0]['isAdmin'] = true;

        resultAdm[0]['notif'] = await notifController.getNotif(resultAdm[0].id);

        req.session.data = {parent: resultAdm[0]};

        res.redirect('/dashboard-admin');
      } else {
        return res.status(401).json({ error: 'Autentikasi gagal. Email atau kata sandi tidak valid.' });
      }
    } else {
        return res.redirect(`/login?status=-1`);
      // return res.status(401).json({ error: 'Autentikasi gagal. Email atau kata sandi tidak valid.' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});


// Rute yang memerlukan autentikasi
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Ini adalah data rahasia', user: req.user });
});

router.get('/kabupaten-kota', async function(req, res) {
  const provinsi_id = req.query.provinsi_id;
  try {
      const option_Kabupaten_Kota = await vendorController.option_Kabupaten_Kota(provinsi_id);
      res.json(option_Kabupaten_Kota);
  } catch (error) {
      console.error('Error fetching kabupaten/kota data:', error);
      res.status(500).send('Error fetching kabupaten/kota data');
  }
});

/* GET registration page. */
router.get('/registration', async function(req, res) {
  const option_Jenis_Vendor = await vendorController.option_Jenis_Vendor();
  const option_Provinsi = await vendorController.option_Provinsi();
  const option_Kabupaten_Kota = await vendorController.option_Kabupaten_Kota();
  const option_kategori_vendor = await vendorController.option_kategori_vendor();
  res.render('registration', { // Remove the leading slash before "registration"
    title: 'Registrasi Vendor',
    option_Jenis_Vendor,
    option_Provinsi,
    option_Kabupaten_Kota,
    option_kategori_vendor
  });
});



const idMiddleware = (req, res, next) => {
  if (req.query.id) {
    req.session = req.session || {};
    req.session.vendor_id = req.query.id;
  } else if (req.body.vendor_id) {
    req.session = req.session || {};
    req.session.vendor_id = req.body.vendor_id;
  }
  next();
};


// router.post('/registration', async function(req, res) {
//   const { 
//       // nama_vendor,
//       // jenis_vendor_id,
//       // email_perusahaan,
//       // status_kantor,
//       // alamat_perusahaan,
//       // nama_direktur,
//       // no_telp,
//       // negara,
//       // provinsi_id,
//       // kk_id,
//       // create_by
//   } = req.body;
//   console.log(req.body);
//   try {
//       // Panggil fungsi addVendor dengan parameter yang benar
//       const vendor_id = await vendorController.addVendor(req, res);
//       // Redirect to the next page if the save is successful
//       res.redirect(`/bank-info?id=${vendor_id}`);
//   } catch (error) {
//       // Log the error and send a 500 response if an error occurs
//       console.error('Error saving vendor information:', error);
//       res.status(500).send('An error occurred during registration: ' + error.message);
//   }
// });

router.post('/registration', async function(req, res) {
  try {
      const res_vendor = await vendorController.addVendor(req, res);
      const vendor_id = res_vendor.rows[0].id;
      
      await notifController.addNotif(vendor_id, `Akun Anda telah dibuat di Portal Vendor. Silahkan mengunggah dokumen yang diperlukan.`);
      res.redirect(`/login`);
  } catch (error) {
      console.error('Error saving vendor information:', error);
      res.status(500).send('An error occurred during registration: ' + error.message);
  }
});


/* GET bank-info page. */
router.get('/bank-info', idMiddleware, async function(req, res) {
  const option_Bank = await vendorController.option_Bank();
  const vendor_id = req.query.id;
  res.render('bank-info', {
    title: 'Bank Information',
    option_Bank,
    vendor_id
  });
});

/* POST bank-info page. */
// router.post('/bank-info', async function(req, res) {
//   const { no_rekening, nama_pemilik_rekening, bank_id, vendor_id} = req.body;
//   console.log(req.body);
//   try {
//     await vendorController.addRekening_Vendor(req, res);
//     // Redirect to the next page if the save is successful
//     res.redirect(`/tax-info?id=${vendor_id}`);
//   } catch (error) {
//     // Log the error and send a 500 response if an error occurs
//     console.error('Error saving vendor information:', error);
//     res.status(500).send('An error occurred during registration: ' + error.message);
//   }
// });

/* POST bank-info page. */
router.post('/bank-info', async function(req, res) {
  try {
      await vendorController.addRekening_Vendor(req, res);
      res.redirect(`/tax-info?id=${req.body.vendor_id}`);
  } catch (error) {
      console.error('Error saving bank information:', error);
      res.status(500).send('An error occurred during registration: ' + error.message);
  }
});

/* GET tax-info page. */
router.get('/tax-info', function(req, res) {
  const vendor_id = req.query.id;
  res.render('tax-info', {
    vendor_id
  });
});

/* POST tax-info page. */
router.post('/tax-info', async function(req, res) {
  const { no_npwp, status_pkp, vendor_id } = req.body;
  try {
    await vendorController.updateTax_Vendor(req, res);
    res.redirect(`/legal-info?id=${vendor_id}`);
  } catch (error) {
    console.error('Error saving vendor information:', error);
    res.status(500).send('An error occurred during registration: ' + error.message);
  }
});

/* GET legal-info page. */
router.get('/legal-info', function(req, res) {
  const vendor_id = req.query.id;
  res.render('legal-info', {
    vendor_id
  });
});

/* POST legal-info page. */
router.post('/legal-info', async function(req, res) {  
  const { no_nibrba, no_ktp_direktur, vendor_id } = req.body;
  try {
    await vendorController.updateLegal_Vendor(req, res);
    res.redirect(`/profil-informasi/${vendor_id}`);
  } catch(error) {
    console.error('Error saving final vendor information:', error);
    res.status(500).send('An error occurred during registration.' + error.message);
  }
});


// `router.get('/profil-informasi/:id', async function(req, res) {
//   const vendor_id = req.params.id;
//   try {
//       const result = await vendorController.getProfilInformasi(vendor_id);
//       console.log('Rendering profile page for vendor:', result); // Tambahkan log ini
//       res.render('profil-informasi', { vendor: result });
//   } catch (error) {
//       console.error('Error fetching vendor data:', error);
//       res.status(500).send('Error fetching vendor data');
//   }
// });`

// router.get('/profil-informasi', async function(req, res) {
//   const vendor_id = req.params.id;
//   try {
//       const result = await vendorController.getProfilInformasi(vendor_id);
//       console.log('Rendering profile page for vendor:', result);
      
//       if (!result) {
//           console.warn(`Vendor with ID ${vendor_id} not found`);
//           return res.render('profil-informasi', { vendor: null }); // Tetap render halaman meskipun data vendor kosong
//       }

//       res.render('profil-informasi', { vendor: result });
//   } catch (error) {
//       console.error('Error fetching vendor data:', error);
//       res.status(500).send('Error fetching vendor data');
//   }
// });


router.get('/profil-informasi', async (req, res) => {
  try{
    const vendor_id = req.query.id; // Ambil vendor_id dari query parameter
    const result = await vendorController.getProfilInformasi(vendor_id);
    res.render('profil-informasi', {vendor: result, vendor_id });
  } catch (error){
    console.error('Error fetching vendor data:', error);
    res.status(500).send('Error fetching vendor data');
  }
})

router.get('/profil-bank', async (req, res) => {
  try{
    const vendor_id = req.query.id; // Ambil vendor_id dari query parameter
    const result = await vendorController.getProfilAkunBank(vendor_id);
    res.render('profil-akun-bank', {vendor: result, vendor_id });
  } catch (error){
    console.error('Error fetching vendor data:', error);
    res.status(500).send('Error fetching vendor data');
  }
})

router.get('/profil-perpajakan', async (req, res) => {
  try{
    const vendor_id = req.query.id; // Ambil vendor_id dari query parameter
    const result = await vendorController.getProfilPerpajakan(vendor_id);
    res.render('profil-perpajakan', {vendor: result, vendor_id });
  } catch (error){
    console.error('Error fetching vendor data:', error);
    res.status(500).send('Error fetching vendor data');
  }
})

router.get('/profil-legalitas', async(req, res) => {
  try {
    const vendor_id = req.query.id; // Ambil vendor_id dari query parameter
    const result = await vendorController.getProfilLegalitas(vendor_id);
    res.render('profil-legalitas', { vendor: result, vendor_id });
  } catch (error) {
    console.error('Error fetching vendor data', error); // Tampilkan stack error
    res.status(500).send('Error fetching vendor data');
  }
});


router.get('/upload-dokumen-vendor', function(req, res) {
  const vendor_id = req.query.id; // Ambil vendor_id dari query parameter
  res.render('upload-dokumen-vendor', { vendor_id });
});

router.post('/upload-ktpDirektur', 
  upload.fields([{ name: 'ktpDirektur' }]), async (req, res) => {
  try {
    // Extract file paths from the uploaded files
    const url_ktp_direktur = req.files['ktpDirektur'][0].path;

    const { id } = req.session.data.parent;

    // Assuming you have a function to insert data into the database
    await vendorController.updateVendorURL(id, 'url_ktp_direktur', url_ktp_direktur);
    res.json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

router.post('/upload-ktpKuasa', 
  upload.fields([{ name: 'ktpKuasa' }]), async (req, res) => {
  try {
    // Extract file paths from the uploaded files
    const url_ktp_penerima_kuasa = req.files['ktpKuasa'][0].path;

    const { id } = req.session.data.parent;

    // Assuming you have a function to insert data into the database
    await vendorController.updateVendorURL(id, 'url_ktp_penerima_kuasa', url_ktp_penerima_kuasa);
    res.json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

router.post('/upload-nirlaba', 
  upload.fields([{ name: 'nirlaba' }]), async (req, res) => {
  try {
    // Extract file paths from the uploaded files
    const url_nirlaba = req.files['nirlaba'][0].path;

    const { id } = req.session.data.parent;

    // Assuming you have a function to insert data into the database
    await vendorController.updateVendorURL(id, 'url_nirlaba', url_nirlaba);
    res.json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

router.post('/upload-akta_pendirian', 
  upload.fields([{ name: 'akta_pendirian' }]), async (req, res) => {
  try {
    // Extract file paths from the uploaded files
    const url_akta_pendirian = req.files['akta_pendirian'][0].path;

    const { id } = req.session.data.parent;

    // Assuming you have a function to insert data into the database
    await vendorController.updateVendorURL(id, 'url_akta_pendirian', url_akta_pendirian);
    res.json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

router.post('/upload-akta_perubahan', 
  upload.fields([{ name: 'akta_perubahan' }]), async (req, res) => {
  try {
    // Extract file paths from the uploaded files
    const url_akta_perubahan = req.files['akta_perubahan'][0].path;

    const { id } = req.session.data.parent;

    // Assuming you have a function to insert data into the database
    await vendorController.updateVendorURL(id, 'url_akta_perubahan', url_akta_perubahan);
    res.json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

router.post('/upload-dokumen_ijin_lain', 
  upload.fields([{ name: 'dokumen_ijin_lain' }]), async (req, res) => {
  try {
    // Extract file paths from the uploaded files
    const url_dokumen_ijin_lain = req.files['dokumen_ijin_lain'][0].path;

    const { id } = req.session.data.parent;

    // Assuming you have a function to insert data into the database
    await vendorController.updateVendorURL(id, 'url_dokumen_ijin_lain', url_dokumen_ijin_lain);
    res.json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

router.post('/upload-dokumen_npwp', 
  upload.fields([{ name: 'dokumen_npwp' }]), async (req, res) => {
  try {
    // Extract file paths from the uploaded files
    const url_dokumen_npwp = req.files['dokumen_npwp'][0].path;

    const { id } = req.session.data.parent;

    // Assuming you have a function to insert data into the database
    await vendorController.updateVendorURL(id, 'url_dokumen_npwp', url_dokumen_npwp);
    res.json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

router.post('/upload-buku_akun_bank', 
  upload.fields([{ name: 'buku_akun_bank' }]), async (req, res) => {
  try {
    // Extract file paths from the uploaded files
    const url_buku_akun_bank = req.files['buku_akun_bank'][0].path;

    const { id } = req.session.data.parent;

    // Assuming you have a function to insert data into the database
    await vendorController.updateVendorURL(id, 'url_buku_akun_bank', url_buku_akun_bank);
    res.json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

router.post('/upload-profil_perusahaan', 
  upload.fields([{ name: 'profil_perusahaan' }]), async (req, res) => {
  try {
    // Extract file paths from the uploaded files
    const url_profil_perusahaan = req.files['profil_perusahaan'][0].path;

    const { id } = req.session.data.parent;

    // Assuming you have a function to insert data into the database
    await vendorController.updateVendorURL(id, 'url_profil_perusahaan', url_profil_perusahaan);
    res.json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

router.post('/upload-dokumen_ppkp', 
  upload.fields([{ name: 'dokumen_ppkp' }]), async (req, res) => {
  try {
    // Extract file paths from the uploaded files
    const url_dokumen_ppkp = req.files['dokumen_ppkp'][0].path;

    const { id } = req.session.data.parent;

    // Assuming you have a function to insert data into the database
    await vendorController.updateVendorURL(id, 'url_dokumen_ppkp', url_dokumen_ppkp);
    res.json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

router.post('/upload-dokumen-vendor', upload.fields([
  { name: 'url_buku_akun_bank', maxCount: 1 },
  { name: 'url_dokumen_npwp', maxCount: 1 },
  { name: 'url_dokumen_ppkp', maxCount: 1 },
  { name: 'url_ktp_direktur', maxCount: 1 },
  { name: 'url_akta_perubahan', maxCount: 1 },
  { name: 'url_akta_pendirian', maxCount: 1 },
  { name: 'url_nibrba', maxCount: 1 },
  { name: 'url_dokumen_ijin_lain', maxCount: 1 },
  { name: 'url_profile_perusahaan', maxCount: 1 },

  // Add other files similarly
]), async function(req, res) {
  const vendor_id = req.body.vendor_id;
  const files = req.files;
  try {
      await vendorController.updateVendorURL({
          vendor_id: vendor_id,
          url_buku_akun_bank: files.url_buku_akun_bank[0].path,
          url_dokumen_npwp: files.url_dokumen_npwp[0].path,
          url_dokumen_ppkp: files.url_dokumen_ppkp[0].path,
          url_ktp_direktur: files.url_ktp_direktur[0].path,
          url_akta_perubahan: files.url_akta_perubahan[0].path,
          url_akta_pendirian: files.url_akta_pendirian[0].path,
          url_nibrba: files.url_nibrba[0].path,
          url_dokumen_ijin_lain: files.url_dokumen_ijin_lain[0].path,
          url_profile_perusahaan: files.url_profile_perusahaan[0].path,
      });
      res.redirect(`/approved-vendor-profile?id=${vendor_id}`);
  } catch (error) {
      console.error('Error updating vendor documents:', error);
      res.status(500).send('Failed to update documents');
  }
});

// router.post('/upload-dokumen-vendor', async function(req, res) {
//   const { url_buku_akun_bank, url_dokumen_npwp, url_dokumen_ppkp, url_ktp_direktur, url_akta_perubahan, url_akta_pendirian, url_nibrba, url_dokumen_ijin_lain, url_profile_perusahaan, vendor_id } = req.body;
//   console.log(req.body);
//   try {
//     // Await the Promise returned by saveVendorInformation
//     await vendorController.updateVendorURL(req, res);
//     // Redirect to the next page if the save is successful
//            // Store ID in session
//            req.session = req.session || {};
//            req.session.id = vendor_id;
//     res.redirect(`/approved-vendor-profile?id=${vendor_id}`);
//   } catch (error) {
//     // Log the error and send a 500 response if an error occurs
//     console.error('Error saving vendor information:', error);
//     res.status(500).send('An error occurred during registration: ' + error.message);
//   }
// });


router.get('/dashboard-vendor', async(req, res) => {
  try {
    const data = req.session.data; // Access data from session
    const pengadaan = await pengadaanController.getDaftarPengadaanByStatus('760ad69f-7739-41e1-baf9-7a68665b21e8', data.parent.id)
    res.render('dashboard-vendor', { parent: data.parent, pengadaan, page: 'dashboard' });
  } catch (error) {
    console.error('Error fetching vendor data', error); // Tampilkan stack error
    res.status(500).send('Error fetching vendor data');
  }
});

router.get('/dashboard-admin', async(req, res) => {
  try {
    const data = req.session.data; // Access data from session
    const terbaik = await pengadaanController.getTerbaik()
    const pengadaan = await pengadaanController.getDaftarPengadaanAdmin()
    res.render('dashboard-admin', { parent: data.parent, terbaik, pengadaan, page: 'dashboard' });
  } catch (error) {
    console.error('Error fetching admin data', error); // Tampilkan stack error
    res.status(500).send('Error fetching admin data');
  }
});

router.get('/approved-vendor-profile', async(req, res) => {
  try {
    const data = req.session.data; // Access data from session
    res.render('approved-vendor-profile', { parent: data.parent, page: 'profile' });
  } catch (error) {
    console.error('Error fetching vendor data', error); // Tampilkan stack error
    res.status(500).send('Error fetching vendor data');
  }
});

router.get('/admin-profile', async(req, res) => {
  try {
    const data = req.session.data; // Access data from session

    res.render('admin-profile', { parent: data.parent, page: 'profile' });
  } catch (error) {
    console.error('Error fetching vendor data', error); // Tampilkan stack error
    res.status(500).send('Error fetching vendor data');
  }
});

router.get('/approved-akun-bank', async function(req, res) {
  try {
    const data = req.session.data;
    const result = await vendorController.getApprovedAkunBank(data.parent.id);
    res.render('approved-akun-bank', { parent: data.parent, result: result, page: 'profile' });
  } catch (error) {
    console.error('Error fetching vendor data', error); // Tampilkan stack error
    res.status(500).send('Error fetching vendor data');
  }
});

router.get('/approved-perpajakan', async function(req, res) {
  try {
    const data = req.session.data;
    const result = await vendorController.getApprovedAkunPerpajakan(data.parent.id);
    res.render('approved-perpajakan', { parent: data.parent, result: result, page: 'profile' });
  } catch (error) {
    console.error('Error fetching vendor data', error); // Tampilkan stack error
    res.status(500).send('Error fetching vendor data');
  }
});

router.get('/approved-legalitas', async function(req, res) {
  try {
    const data = req.session.data;
    const result = await vendorController.getApprovedLegalitas(data.parent.id);
    res.render('approved-legalitas', { parent: data.parent, result: result, page: 'profile' });
  } catch (error) {
    console.error('Error fetching vendor data', error); // Tampilkan stack error
    res.status(500).send('Error fetching vendor data');
  }
});

router.get('/daftar-pengadaan', async function(req, res) {
  const data = req.session.data;
  try {
      const statusOptions = await pengadaanController.option_Select_Status();
      const result = await pengadaanController.getDaftarPengadaan(data.parent.id);
      res.render('daftar-pengadaan', {
          parent: data.parent,
          pengadaan: result,
          status_id: '',
          status: statusOptions, 
          page: 'pengadaan'
      });
  } catch (error) {
      console.error('Error fetching pengadaan data:', error);
      res.status(500).send('Error fetching pengadaan data: ' + error.message);
  }
});

// Tambahkan route untuk filter status pengadaan
router.get('/daftar-pengadaan/status/:status_id', async function(req, res) {
  const status_id = req.params.status_id;
  const data = req.session.data;
  try {
      const statusOptions = await pengadaanController.option_Select_Status();
      const result = await pengadaanController.getDaftarPengadaanByStatus(status_id, data.parent.id);
      res.render('daftar-pengadaan', {
          pengadaan: result,
          status: statusOptions,
          status_id: status_id,
          parent: data.parent,
          page: 'pengadaan'
      });
  } catch (error) {
      console.error('Error fetching pengadaan data:', error);
      res.status(500).send('Error fetching pengadaan data: ' + error.message);
  }
});


router.get('/informasi-pengadaan', async (req, res) => {
  try{
    const pengadaan_id = req.query.id;
    const data = req.session.data;
    // const pengadaan_id = req.params.pengadaan_id;
    const result = await pengadaanController.getInformasiPengadaan(pengadaan_id);
    const pengadaanUser = await bidding_tenderController.getBidding_TenderVendorStatus(pengadaan_id, data.parent.id)
    res.render('informasi-pengadaan', {pengadaanUser: pengadaanUser[0], pengadaan: result[0], pengadaan_id, parent: data.parent, page: 'pengadaan' });
  } catch(error){
    console.error('Error fetching pengadaan data:', error);
    res.status(500).send('Error fetching pengadaan data');
  }
});

router.get('/item-pengadaan', async (req, res) => {
try{
  const pengadaan_id = req.query.id;
  const data = req.session.data;
  const pengadaan = await pengadaanController.getInformasiPengadaan(pengadaan_id);
  const result = await pengadaanController.getItemPengadaan(pengadaan_id);
  const pengadaanUser = await bidding_tenderController.getBidding_TenderVendorStatus(pengadaan_id, data.parent.id)
  res.render('item-pengadaan', { pengadaanUser: pengadaanUser[0], pengadaan: pengadaan[0], item: result, pengadaan_id, parent: data.parent, page: 'pengadaan' });
} catch(error){
  console.error('Error fetching pengadaan data:', error);
  res.status(500).send('Error fetching pengadaan data');
}
});

router.get('/informasi-purchase-order', function(req, res) {
  const pengadaan_id = req.query.id;
  const data = req.session.data;
  const itemsData = [
      { no: 'IG000001', name: 'MEJA', quantity: 20, price: 'Rp. 200.000', discount: '-', netAmount: 'Rp. 4.000.000' },
      { no: 'IG000002', name: 'KURSI', quantity: 100, price: 'Rp. 100.000', discount: '-', netAmount: 'Rp. 10.000.000' }
  ];
  res.render('informasi-purchase-order', { items: itemsData, pengadaan_id: pengadaan_id, parent: data.parent, page: 'pengadaan' });
});

router.get('/dokumen-purchase-order', function(req, res) {
  const pengadaan_id = req.query.id;
  const data = req.session.data;
  const itemsData = [
      { no: 'IG000001', name: 'MEJA', quantity: 20, price: 'Rp. 200.000', deliveryDate: '14-04-2024', status: 'TUTUP' },
      { no: 'IG000002', name: 'KURSI', quantity: 100, price: 'Rp. 100.000', deliveryDate: '12-04-2024', status: 'TUTUP' }
  ];
  res.render('dokumen-purchase-order', { items: itemsData, pengadaan_id: pengadaan_id, parent: data.parent, page: 'pengadaan' });
});


// Assuming you have a route setup for getting a purchase order by ID
// Import the necessary controller
var purchase_orderController = require('../src/purchase_order/controller');

// Add a route for the Purchase Order page
router.get('/purchase-order/:id', async (req, res) => {
    try {
        const po_id = req.params.id;
        const data = req.session.data;
        const purchaseOrderData = await purchase_orderController.getPurchase_OrderById(po_id);
        res.render('template-purchase-order', { 
            po_id: purchaseOrderData.po_id,
            tanggal_po: purchaseOrderData.tanggal_po,
            pengadaan_id: purchaseOrderData.pengadaan_id,
            tanggal_pengiriman: purchaseOrderData.tanggal_pengiriman,
            alamat_pengiriman: purchaseOrderData.alamat_pengiriman,
            nama_vendor: purchaseOrderData.nama_vendor,
            subTotal: purchaseOrderData.subTotal,
            discount: purchaseOrderData.discount,
            ppn: purchaseOrderData.ppn,
            biaya: purchaseOrderData.biaya,
            total: purchaseOrderData.total,
            divHead: purchaseOrderData.divHead,
            vendorApproval: purchaseOrderData.vendorApproval,
            parent: data.parent,
            page: 'pengadaan'
        });
    } catch (error) {
        console.error('Error fetching purchase order:', error);
        res.status(500).send('Error fetching purchase order');
    }
});

router.get('/list-bidding-vendor', async (req, res) => {
  try {
    const data = req.session.data;
    let result = await bidding_tenderController.getBidding(); // Fetch bids data'
    res.render('list-bidding-vendor', { bidding_tender: result, parent: data.parent, page: 'bidding', pagelink: 'undangan' });
  } catch (error) {
      console.error('Error fetching bidding data:', error);
      res.status(500).send('Error fetching bidding data');
  }
});




router.get('/form-bidding/:id', async (req, res) => {
  const data = req.session.data;
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('id-ID', options);
  try {
    const dataBidding = await bidding_tenderController.getBidding_TenderDetailById(req.params.id);
    res.render('form-bidding', {
      title: "Form Bidding",
      currdate: formattedDate,
      dataBidding: dataBidding,
      parent: data.parent,
      page: 'pengadaan'
    });
} catch (error) {
    console.error('Failed to add new detail bidding tender:', error);
    res.status(500).send('Error adding new detail bidding tender');
  }
});

router.post('/add-bidding-tender', async (req, res) => {
  const { bt_id, vendor_id, type, pengadaan_id } = req.body;
  try {
      // Assuming you have a function to insert data into the database
      if(type != '8ef85b64-6d65-4b87-b5ee-5f06016b135c'){
        await detail_bidding_tenderController.addDetail_Bidding_Tender(bt_id, vendor_id);

        const p_res = await pengadaanController.getPengadaanById(pengadaan_id);
        const nama_pengadaan = p_res.nama_pengadaan;

        await notifController.addNotif(vendor_id, `Anda diundang untuk mengikuti ${type == 'b8649cf1-3da3-4258-8e2d-459e10b1b95f' ? 'tender' : 'bidding'} untuk pengadaan ${nama_pengadaan}`);
      }else{
        await vendor_scoreController.addVendor_Score(pengadaan_id, vendor_id);
      }
      res.redirect('back')
  } catch (error) {
      console.error('Failed to add new detail bidding tender:', error);
      res.status(500).send('Error adding new detail bidding tender');
  }
});

router.post('/form-bidding', async (req, res) => {
  const { durasi_pekerjaan, pengajuan_harga, bt_id, vendor_id } = req.body;
  const data = req.session.data;
  try {
      // Assuming you have a function to insert data into the database
      await detail_bidding_tenderController.updateDetail_Bidding_Tender(durasi_pekerjaan, pengajuan_harga, bt_id, vendor_id);

      await notifController.addNotif(true, `Permintaan persetujuan pengadaan baru telah diajukan oleh ${data.parent.nama_vendor}. Silakan masuk ke sistem untuk memberikan persetujuan.`);
      res.redirect('/daftar-pengadaan'); // Redirect to the list page after successful insertion
  } catch (error) {
      console.error('Failed to add new detail bidding tender:', error);
      res.status(500).send('Error adding new detail bidding tender');
  }
});

router.get('/form-tender/:id', async function(req, res) {
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('id-ID', options);
  const data = req.session.data;
  const dataTender = await bidding_tenderController.getBidding_TenderDetailById(req.params.id);

  res.render('form-tender', {
    title: "Form Tender",
    currdate: formattedDate,
    page: 'pengadaan',
    dataTender: dataTender,
    parent: data.parent
  });
});

router.post('/form-tender', async function(req, res) {
  const data = req.session.data;
  const { duration, bidAmount, bt_id } = req.body;  // Ensure vendor_id and bt_id are provided in the form or derived from session/context

  try {
      await db.addDetail_Bidding_Tender({
          pengajuan_harga: bidAmount,
          durasi_pekerjaan: duration,
          parent: data.parent,  // Assuming vendor_id is obtained correctly
          bt_id: bt_id           // Assuming bt_id is obtained correctly
      });

      await notifController.addNotif(true, `Permintaan persetujuan pengadaan baru telah diajukan oleh ${data.parent.nama_vendor}. Silakan masuk ke sistem untuk memberikan persetujuan.`);

      res.redirect('/daftar-pengadaan'); // Redirect or send a success response
  } catch (error) {
      console.error('Error submitting bid:', error);
      res.status(500).send('An error occurred during the bidding process: ' + error.message);
  }
});

router.get('/list-tender-vendor', async (req, res) => {
  try {
    const data = req.session.data;
    let result = await bidding_tenderController.getTender(); // Fetch tenders data
    if (!result || result.length === 0) {
        throw new Error('No tender data found');
    }
    // res.send(result);
    res.render('list-tender-vendor', { bidding_tender: result, parent: data.parent, page: 'tender' });
  } catch (error) {
      console.error('Error fetching tender data:', error.message); // Log error yang lebih detail
      res.status(500).send('Error fetching tender data');
  }
});

router.get('/link-zoom-tender', async (req, res) => {
  try {
      const tenders = await db.getBidding_Tender(); // Fetch tenders data using a function from db.js
      res.render('/link-zoom-tender', { tenders: tenders });
  } catch (error) {
      console.error('Error fetching tenders:', error);
      res.status(500).send('Error fetching tender data');
  }
});

router.get('/form-vendor-scoring/:id/:idv', async function(req,res) {
  const data = req.session.data;
  const pengadaan_id = req.params.id;
  const vendor_id = req.params.idv;
  const vendor = await vendorController.getVendorById(vendor_id);
  const vendorS = await vendor_scoreController.getVendor_ScoreById(pengadaan_id, vendor_id);
  const vendorSD = await detail_vsController.getDetail_Vs(vendorS.vs_id);
  const detailVS = [];
  for (const e of vendorSD){
    detailVS[e.template_vs_id] = await detail_template_vsController.getDetail_Template_Vs(e.template_vs_id)
  };

  const template = await template_vsController.getTemplate_Vs();
  res.render('form-vendor-scoring', {
    title: "Form Vendor Scoring",
    parent: data.parent,
    pengadaan_id,
    vendor,
    vendorS,
    vendorSD,
    detailVS,
    template,
    page: "pengadaan"
  })
})

router.post('/form-vendor-scoring', async (req, res) => {
  const data = req.session.data.parent;
  const {vendor_id, pengadaan_id, final_score} = req.body
  
  
  // const { id } = req.body;
  try {
    // TEKNIKAL
    if(data.role_id == '123e4567-e89b-12d3-a456-426614174001'){
      const {bobot_teknikal, desc_teknikal} = req.body
      var nama_template_val = req.body['nama_template[1][]']; 
      var deskripsi_template_val = req.body['deskripsi_template[1][]']; 
      var kriteria_val = req.body['kriteria[1][]']; 
      var subKriteria_val = req.body['subKriteria[1][]']; 
      var score1_val = req.body['score1[1][]']; 
      var score2_val = req.body['score2[1][]']; 

      const vs = await vendor_scoreController.updateVendor_Score(pengadaan_id, vendor_id, final_score, bobot_teknikal, null, desc_teknikal, null, null, null, null); // Assuming db.updateVendorStatus updates the status
      await detail_vsController.removeDetail_Vs(vs.vs_id, 1);
      if(Array.isArray(nama_template_val)){
        nama_template_val.forEach(async (e, i) => {
          const nama = await template_vsController.getTemplate_VsByName(e)
          var template_id_new = '';
          if(!nama){
            template_id_new = await template_vsController.addTemplate_Vs(e, deskripsi_template_val[i])
            const vs_kriteria_id = await kriteriaController.addKriteria(kriteria_val[i], subKriteria_val[i])
            await detail_template_vsController.addDetail_Template_Vs(template_id_new, vs_kriteria_id)
          }else{
            template_id_new = nama.template_vs_id
          }
  
          await detail_vsController.addDetail_Vs(vs.vs_id, template_id_new, score1_val[i], score2_val[i], 1, data.id)
          
        });
      }else{
        const nama = await template_vsController.getTemplate_VsByName(nama_template_val)
          var template_id_new = '';
          
          if(!nama){
            template_id_new = await template_vsController.addTemplate_Vs(nama_template_val, deskripsi_template_val)
            const vs_kriteria_id = await kriteriaController.addKriteria(kriteria_val, subKriteria_val)
            await detail_template_vsController.addDetail_Template_Vs(template_id_new, vs_kriteria_id)
          }else{
            template_id_new = nama.template_vs_id
          }
  
          await detail_vsController.addDetail_Vs(vs.vs_id, template_id_new, score1_val, score2_val, 1, data.id)
      }
    }
    // KOMERSIL
    else if(data.role_id == '123e4567-e89b-12d3-a456-426614174002'){
      const {bobot_komersial, desc_komersil} = req.body
      var nama_template_val = req.body['nama_template[2][]']; 
      var deskripsi_template_val = req.body['deskripsi_template[2][]']; 
      var kriteria_val = req.body['kriteria[2][]']; 
      var subKriteria_val = req.body['subKriteria[2][]']; 
      var score1_val = req.body['score1[2][]']; 
      var score2_val = req.body['score2[2][]']; 

      const vs = await vendor_scoreController.updateVendor_Score(pengadaan_id, vendor_id, final_score, null, bobot_komersial, null, desc_komersil, null, null, null); // Assuming db.updateVendorStatus updates the status
      await detail_vsController.removeDetail_Vs(vs.vs_id, 2);
      if(Array.isArray(nama_template_val)){
        nama_template_val.forEach(async (e, i) => {
          const nama = await template_vsController.getTemplate_VsByName(e)
          var template_id_new = '';
          if(!nama){
            template_id_new = await template_vsController.addTemplate_Vs(e, deskripsi_template_val[i])
            const vs_kriteria_id = await kriteriaController.addKriteria(kriteria_val[i], subKriteria_val[i])
            await detail_template_vsController.addDetail_Template_Vs(template_id_new, vs_kriteria_id)
          }else{
            template_id_new = nama.template_vs_id
          }
  
          await detail_vsController.addDetail_Vs(vs.vs_id, template_id_new, score1_val[i], score2_val[i], 2, data.id)
          
        });
      }else{
        const nama = await template_vsController.getTemplate_VsByName(nama_template_val)
          var template_id_new = '';
          
          if(!nama){
            template_id_new = await template_vsController.addTemplate_Vs(nama_template_val, deskripsi_template_val)
            const vs_kriteria_id = await kriteriaController.addKriteria(kriteria_val, subKriteria_val)
            await detail_template_vsController.addDetail_Template_Vs(template_id_new, vs_kriteria_id)
          }else{
            template_id_new = nama.template_vs_id
          }
  
          await detail_vsController.addDetail_Vs(vs.vs_id, template_id_new, score1_val, score2_val, 2, data.id)
      }


    }
    // 3 orang penting
    else{
      switch(data.role_id){
        case '123e4567-e89b-12d3-a456-426614174004':
          await vendor_scoreController.updateVendor_Score(pengadaan_id, vendor_id, final_score, null, null, null, null, data.id, null, null);
          break;
        case '123e4567-e89b-12d3-a456-426614174003':
          await vendor_scoreController.updateVendor_Score(pengadaan_id, vendor_id, final_score, null, null, null, null, null, data.id, null);
          break;
        case '123e4567-e89b-12d3-a456-426614174005':
          await vendor_scoreController.updateVendor_Score(pengadaan_id, vendor_id, final_score, null, null, null, null, null, null, data.id);
          break;
      }
    }

    res.redirect('/vendor-pengadaan-previous/'+pengadaan_id);
  } catch (error) {
      console.error('Failed to update vendor status:', error);
      res.status(500).send('Error updating vendor status');
  }
});

//ADMIN

router.get('/list-vendor-admin', async (req, res) => {
  try {
    const data = req.session.data;
    const result = await vendorController.getListVendor(); // Fetch vendors data using a function from db.js
    const pengadaan = await pengadaanController.getDaftarPengadaanAdmin();
    // for (const e of result) {
    //   pengadaan.push({ [e.id]: await pengadaanController.getDaftarPengadaanByVendor(e.id) });
    // }
    res.render('list-vendor-admin', { vendor: result, parent: data.parent, pengadaan, page: 'list-vendor' });
  } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).send('Error fetching vendor data');
  }
});

router.get('/get-eval', async (req, res) => {
  try {
    const {evaluasi_vendor} = req.query;
    res.download(evaluasi_vendor);
  } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).send('Error fetching vendor data');
  }
});

router.post('/approve-vendor', async (req, res) => {
  try {
    const result = await vendorController.getListVendor(); // Fetch vendors data using a function from db.js
  } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).send('Error fetching vendor data');
  }
});

router.get('/list-admin', async (req, res) => {
  try {
    const data = req.session.data;
    const result = await userController.getUser(); // Fetch vendors data using a function from db.js
    const option_role = await roleController.getRole();
    res.render('list-admin', { vendor: result, parent: data.parent, option_role, page: 'list-admin' });
  } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).send('Error fetching vendor data');
  }
});

router.post('/add-admin', async (req, res) => {
  try {
    const id = await userController.addUser(req, res);

    const {first_name, last_name} = req.body;
    await notifController.addNotif(id, `Selamat datang ${first_name} ${last_name}!. Silakan mengakses fitur-fitur yang tersedia di aplikasi Portal Vendor.`);

    res.redirect('/list-admin');
  } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).send('Error fetching vendor data');
  }
});

router.get('/list-barang', async (req, res) => {
  try {
    const data = req.session.data;
    const item = await itemController.getItemAll(); // Fetch vendors data using a function from db.js
    res.render('list-barang', { item, parent: data.parent, page: 'list-barang' });
  } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).send('Error fetching vendor data');
  }
});

router.get('/list-notif', async (req, res) => {
  try {
    const data = req.session.data;
    const item = await notifController.getNotifAll(data.parent.id); // Fetch vendors data using a function from db.js
    res.render('list-notif', { item, parent: data.parent, page: '' });
  } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).send('Error fetching vendor data');
  }
});

router.post('/add-barang', async (req, res) => {
  try {
    await itemController.addItem(req, res);
    res.redirect('/list-barang');
  } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).send('Error fetching vendor data');
  }
});

router.post('/add-po', upload.fields([{ name: 'url_po' }]), async (req, res) => {
  const user_id = req.session.data.parent.id 
  const url_po = req.files['url_po'][0].path;
  const {pengadaan_id, tanggal_pengiriman} = req.body
  try {
    await purchase_orderController.addPurchase_Order(pengadaan_id, tanggal_pengiriman, url_po, user_id);

    const r_id = await pengadaanController.getPengadaanById(pengadaan_id)
    const nama_pengadaan = r_id.nama_pengadaan;
    const vendor_id = r_id.vendor_pemenang;
    await notifController.addNotif(vendor_id, `PO untuk pengadaan ${nama_pengadaan} telah tersedia. Silakan masuk ke Portal Vendor untuk melihat dan mengunduh dokumen PO.`);
    await notifController.addNotif(vendor_id, `Silahkan unggah surat jalan beserta invoice untuk pengadaan ${nama_pengadaan}.`);
    
    res.redirect('/informasi-purchase-order-previous?id='+pengadaan_id);
  } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).send('Error fetching vendor data');
  }
});

router.post('/approval-vendor-admin', async (req, res) => {
  const { id } = req.body;
  try {
      await vendorController.updateStatus_Vendor(id, 'bec6ed04-e967-4ce8-8865-e6285690174e'); // Assuming db.updateVendorStatus updates the status

      await notifController.addNotif(id, `Akun Anda sudah terverifikasi. Silakan mengakses fitur-fitur yang tersedia di aplikasi Portal Vendor.`);

      res.redirect('/list-vendor-admin');
  } catch (error) {
      console.error('Failed to update vendor status:', error);
      res.status(500).send('Error updating vendor status');
  }
});

router.get('/buat-pengadaan', async function(req, res) {
  const data = req.session.data;
  const option_Tipe_Pemilihan1 = await pengadaanController.option_Tipe_Pemilihan2();
  const option_Jenis_Pengadaan = await pengadaanController.option_Jenis_Pengadaan();
  const option_Jenis_Vendor = await pengadaanController.option_Jenis_Vendor();
  res.render('buat-pengadaan', { 
    option_Tipe_Pemilihan1, 
    option_Jenis_Pengadaan, 
    option_Jenis_Vendor, 
    parent: data.parent,
    page: 'pengadaan'
  });
});

router.post('/buat-pengadaan', async (req, res) => {
  const {
      'item_id[]': item_id,
      'jumlah[]': jumlah,
      'harga[]': harga
  } = req.body;
  try {
    // Pastikan bahwa item_id, jumlah, dan harga memiliki panjang yang sama
    if ((item_id.length !== jumlah.length || item_id.length !== harga.length) && item_id.isArray) {
      console.error('Array lengths do not match');
      return res.redirect(`/buat-pengadaan`);
    }

      // Buat pengadaan baru dan dapatkan pengadaan_id
      const pengadaan_id = await pengadaanController.addPengadaan(req.body, req.session.data.parent.id);

      var itemsArray = {};
      // Buat array items
      if(typeof item_id == 'object'){
        itemsArray = item_id.map((id, index) => ({
          id: id,
          jumlah: jumlah[index],
          harga: harga[index]
        }));
      }else{
        itemsArray = [{
          id: item_id,
          jumlah: jumlah,
          harga: harga
        }]
      }
      // Tambahkan item ke pengadaan yang baru dibuat
      for (const item of itemsArray) {
        await pengadaanController.addItem(pengadaan_id, item);
      }

      await bidding_tenderController.addBidding_Tender(pengadaan_id);

      // Redirect ke halaman daftar-pengadaan-admin dengan pengadaan_id sebagai query parameter
      res.redirect(`/daftar-pengadaan-admin`);
  } catch (error) {
      console.error('Database connection error', error);
      res.status(500).send('Something went wrong');
  }
});

router.get('/daftar-pengadaan-admin', async function(req, res) {
  const data = req.session.data;
  try {
      const statusOptions = await pengadaanController.option_Select_Status_Admin();
      const result = await pengadaanController.getDaftarPengadaanAdmin();
      res.render('daftar-pengadaan-admin', {
          parent: data.parent,
          pengadaan: result,
          status_id: '',
          status: statusOptions, 
          page: 'pengadaan'
      });
  } catch (error) {
      console.error('Error fetching pengadaan data:', error);
      res.status(500).send('Error fetching pengadaan data: ' + error.message);
  }
});

router.get('/daftar-pengadaan-admin/status/:status_id', async function(req, res) {
  const data = req.session.data;
  const status_id = req.params.status_id;
  try {
    const statusOptions = await pengadaanController.option_Select_Status_Admin();
    const result = await pengadaanController.getDaftarPengadaanAdminByStatus(status_id);
    res.render('daftar-pengadaan-admin', { 
      parent: data.parent,
      pengadaan: result,
      status_id: status_id,
      status: statusOptions, 
      page: 'pengadaan'
    });
  } catch (error) {
      console.error('Error fetching procurement data:', error);
      res.status(500).send('Error fetching procurement data');
  }
});

router.get('/informasi-pengadaan-previous/:id', async (req, res) => {
  try {
    const data = req.session.data;
    const pengadaan_id = req.params.id
    const result = await pengadaanController.getInformasiPengadaanPrevious(pengadaan_id);
    res.render('informasi-pengadaan-previous', { pengadaan_id, pengadaan: result, parent: data.parent, page: 'pengadaan' });
  } catch (error) {
      console.error('Error fetching procurement data:', error);
      res.status(500).send('Error fetching procurement data');
  }
});


router.get('/item-pengadaan-previous/:id', async (req, res) => {
  // Fetch the necessary items data
  try {
    const pengadaan_id = req.params.id
    const result = await pengadaanController.getInformasiPengadaanPrevious(pengadaan_id);
    const items = await pengadaanController.getItemPengadaan(pengadaan_id);
    const data = req.session.data;
    res.render('item-pengadaan-previous', { pengadaan_id, items, pengadaan: result, parent: data.parent, page: 'pengadaan' });
  } catch (error) {
    console.error('Error fetching procurement data:', error);
    res.status(500).send('Error fetching procurement data');
  }
});

router.get('/vendor-pengadaan-previous/:id', async (req, res) => {
  // Fetch the necessary items data
  try {
    const data = req.session.data;
    const pengadaan_id = req.params.id
    const pengadaan = await pengadaanController.getInformasiPengadaanPrevious(pengadaan_id);
    var result = []
    if(pengadaan.tipe_pemilihan_id == '8ef85b64-6d65-4b87-b5ee-5f06016b135c'){
      result = await vendor_scoreController.getVendor_Score(pengadaan_id);
    }else{
      result = await detail_bidding_tenderController.getDetail_Bidding_TenderById(pengadaan.bt_id);
    }
    res.render('vendor-pengadaan-previous', { pengadaan_id, pengadaan, result, parent: data.parent, page: 'pengadaan' });
  } catch (error) {
      console.error('Error fetching procurement data:', error);
      res.status(500).send('Error fetching procurement data');
  }
});

router.get('/validasi-pengadaan-admin/:id', async function(req, res) {
  const option_Tipe_Pemilihan2 = await pengadaanController.option_Tipe_Pemilihan2();
  const option_Vendor = await pengadaanController.option_Vendor();
  const option_PIC = await pengadaanController.option_PIC();
  const pengadaan_id = req.params.id
  const result = await pengadaanController.getInformasiPengadaanPrevious(pengadaan_id);
  const item = await pengadaanController.getItemPengadaan(pengadaan_id);
  const data = req.session.data;
  res.render('validasi-pengadaan-admin', {pengadaan: result, pengadaanItem: item, option_Tipe_Pemilihan2, option_Vendor, option_PIC, parent: data.parent, page: "pengadaan"});
});

router.post('/validasi-pengadaan-admin', async function(req, res) {
  const vendor_id = req.body.vendor_id || null;
  const link_zoom = req.body.link_zoom || null;
  try {
      // Asumsi Anda memiliki fungsi untuk menyetujui pengadaan
      await pengadaanController.validasiPengadaan(req.body, vendor_id, link_zoom);
      // const data = req.session.data;
      // const statusOptions = await pengadaanController.option_Select_Status();
      // const result = await pengadaanController.getDaftarPengadaan();
      res.redirect(`/daftar-pengadaan-admin`);
    } catch (error) {
      console.error('Gagal menyetujui pengadaan:', error);
      res.status(500).send('Error menyetujui pengadaan');
  }
});

router.post('/set-pemenang', async function(req, res) {
  const {pengadaan_id, vendor_id, dbt_id, bt_id, harga, durasi} = req.body;
  try {
      // Asumsi Anda memiliki fungsi untuk menyetujui pengadaan
      await pengadaanController.setPemenang(pengadaan_id, vendor_id, dbt_id, bt_id, harga, durasi);
      // const data = req.session.data;
      // const statusOptions = await pengadaanController.option_Select_Status();
      // const result = await pengadaanController.getDaftarPengadaan();
      res.redirect(`/vendor-pengadaan-previous/`+pengadaan_id);
    } catch (error) {
      console.error('Gagal menyetujui pengadaan:', error);
      res.status(500).send('Error menyetujui pengadaan');
  }
});

router.get('/informasi-pengadaan-approved', async function(req, res) {
  const data = req.session.data;
  const pengadaan_id = req.query.id;
  const result = await pengadaanController.getInformasiPengadaanPrevious(pengadaan_id);
  const po = await pengadaanController.getInformasiPO(pengadaan_id);
  const pengadaanUser = await bidding_tenderController.getBidding_TenderVendorStatus(pengadaan_id, data.parent.id)
  res.render('informasi-pengadaan-approved', { pengadaanUser: pengadaanUser[0], po, pengadaan_id, pengadaan: result, parent: data.parent, page: 'pengadaan' });
});

router.get('/item-pengadaan-approved', async function(req, res) {
  const data = req.session.data;
  const pengadaan_id = req.query.id;
  const result = await pengadaanController.getInformasiPengadaanPrevious(pengadaan_id);
  const items = await pengadaanController.getItemPengadaan(pengadaan_id);
  const pengadaanUser = await bidding_tenderController.getBidding_TenderVendorStatus(pengadaan_id, data.parent.id)
  res.render('item-pengadaan-approved', { pengadaanUser: pengadaanUser[0], items, pengadaan: result, pengadaan_id, parent: data.parent, page: 'pengadaan' });
});

router.get('/informasi-purchase-order-approved', async function(req, res) {
  const data = req.session.data;
  const pengadaan_id = req.query.id;
  const items = await pengadaanController.getItemPengadaan(pengadaan_id);
  const po = await pengadaanController.getInformasiPO(pengadaan_id);
  const result = await pengadaanController.getInformasiPengadaanPrevious(pengadaan_id);
  const pengadaanUser = await bidding_tenderController.getBidding_TenderVendorStatus(pengadaan_id, data.parent.id)
  
  res.render('informasi-purchase-order-approved', { pengadaanUser: pengadaanUser[0], po, items, pengadaan: result, pengadaan_id, parent: data.parent, page: 'pengadaan' });
});

router.get('/informasi-purchase-order-previous', async function(req, res) {
  const data = req.session.data;
  const pengadaan_id = req.query.id;
  const items = await pengadaanController.getItemPengadaan(pengadaan_id);
  const po = await pengadaanController.getInformasiPO(pengadaan_id);
  const result = await pengadaanController.getInformasiPengadaanPrevious(pengadaan_id);
  const pengadaanUser = await bidding_tenderController.getBidding_TenderVendorStatus(pengadaan_id, data.parent.id)
  
  res.render('informasi-purchase-order-previous', { pengadaanUser: pengadaanUser[0], po, items, pengadaan: result, pengadaan_id, parent: data.parent, page: 'pengadaan' });
});

router.get('/download-po/:pid/:id', async function(req, res){
  const po_id = req.params.id;
  const pid = req.params.pid;
  const po = await purchase_orderController.getPurchase_OrderById(po_id);

  await res.download(po.url_po);
  // await res.download(po.url_po, 'po-'+po_id+'.pdf');
  

})

router.get('/dokumen-purchase-order-approved', async function(req, res) {
  const data = req.session.data;
  const pengadaan_id = req.query.id;
  const items = await pengadaanController.getItemPengadaan(pengadaan_id);
  const result = await pengadaanController.getInformasiPengadaanPrevious(pengadaan_id);
  const pengadaanUser = await bidding_tenderController.getBidding_TenderVendorStatus(pengadaan_id, data.parent.id)
  
  res.render('dokumen-purchase-order-approved', { pengadaanUser: pengadaanUser[0], items, pengadaan: result, pengadaan_id, parent: data.parent, page: 'pengadaan' });
});

router.get('/dokumen-purchase-order-previous', async function(req, res) {
  const data = req.session.data;
  const pengadaan_id = req.query.id;
  const items = await pengadaanController.getItemPengadaan(pengadaan_id);
  const result = await pengadaanController.getInformasiPengadaanPrevious(pengadaan_id);
  const pengadaanUser = await bidding_tenderController.getBidding_TenderVendorStatus(pengadaan_id, data.parent.id)
  
  res.render('dokumen-purchase-order-previous', { pengadaanUser: pengadaanUser[0], items, pengadaan: result, pengadaan_id, parent: data.parent, page: 'pengadaan' });
});

// GET route for the goods received page
router.get('/goods-received-vendor', async (req, res) => {
  const data = req.session.data;
  const pengadaan_id = req.query.id;
  const result = await goods_receivedController.getGoods_ReceivedByPengadaanId(pengadaan_id, data.parent.id);
  res.render('goods-received-vendor', { parent: data.parent, result, page: 'pengadaan', pengadaan_id });
});

router.post('/goods-received-vendor', 
upload.fields([{ name: 'invoice' }, { name: 'surat_jalan' }]), async (req, res) => {
  try {
    // Extract file paths from the uploaded files
    const url_invoice = req.files['invoice'][0].path;
    const url_surat_jalan = req.files['surat_jalan'][0].path;

    const { id } = req.session.data.parent;
    const { pengadaan_id } = req.body

    // Assuming you have a function to insert data into the database
    await goods_receivedController.addGoods_Received(url_invoice, url_surat_jalan, pengadaan_id, id);

    const r_id = await pengadaanController.getPengadaanById(pengadaan_id);
    const nama_pengadaan = r_id.nama_pengadaan;
    await notifController.addNotif(true, `Waktunya untuk melakukan evaluasi vendor untuk pengadaan ${nama_pengadaan}. Silakan masuk ke sistem untuk mengunggah evaluasi.`);
    res.redirect('/daftar-pengadaan'); // Redirect to the list page after successful insertion
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

// GET route for the goods received page
router.get('/goods-received-admin', async (req, res) => {
  const data = req.session.data;
  const pengadaan_id = req.query.id;
  const {vendor_pemenang} = await pengadaanController.getVendorPemenang(pengadaan_id)
  const items = await pengadaanController.getItemPengadaan(pengadaan_id)
  const result = await goods_receivedController.getGoods_ReceivedByPengadaanId(pengadaan_id, vendor_pemenang);
  res.render('goods-received-admin', { parent: data.parent, items, result, page: 'pengadaan', pengadaan_id });
});

router.post('/goods-received-admin', 
upload.fields([{ name: 'bukti_evaluasi' }, { name: 'bukti_foto' }]), async (req, res) => {
  try {
    // Extract file paths from the uploaded files
    const bukti_evaluasi = req.files['bukti_evaluasi'][0].path;
    const bukti_foto = req.files['bukti_foto'][0].path;
    const {pengadaan_id, jumlah_barang, kondisi_barang, tanggal_terima, deskripsi_barang} = req.body;
    const result = await pengadaanController.getVendorPemenang(pengadaan_id)
    const gr = await goods_receivedController.getGoods_ReceivedByPengadaanId(pengadaan_id, result.vendor_pemenang);
    // Assuming you have a function to insert data into the database
    await goods_receivedController.addGoods_ReceivedItem(jumlah_barang, kondisi_barang, bukti_foto, tanggal_terima, deskripsi_barang, gr[0].received_id);

    await pengadaanController.update_evaluasi(pengadaan_id, bukti_evaluasi);

    // TUTUP PENGADAAN
    const r_id = await pengadaanController.getPengadaanById(pengadaan_id)
    const nama_pengadaan = r_id.nama_pengadaan;
    await pengadaanController.tutup(pengadaan_id);
    await notifController.addNotif(vendor_id, `Pengadaan ${nama_pengadaan} telah ditutup.`);
    await notifController.addNotif(true, `Pengadaan ${nama_pengadaan} telah ditutup.`);

    res.redirect('/goods-received-admin?id='+pengadaan_id); // Redirect to the list page after successful insertion
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

// API
router.post('/api/getProduct', async (req, res) => {
  try {
    const {
      prod
    } = req.body;
    // Assuming you have a function to insert data into the database
    const item = await itemController.getItem(prod);
    res.send(item); // Redirect to the list page after successful insertion
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

router.post('/api/getVendor', async (req, res) => {
  try {
    const {
      nama_vendor,
      jenis_vendor_id
    } = req.body;
    // Assuming you have a function to insert data into the database
    const item = await vendorController.getVendor(nama_vendor, jenis_vendor_id)
    res.send(item); // Redirect to the list page after successful insertion
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

router.post('/api/getDetailVsTemplate', async (req, res) => {
  try {
    const {
      nama_template 
    } = req.body;
    // Assuming you have a function to insert data into the database
    const item = await template_vsController.getTemplate_VsByName(nama_template)
    res.send(item); // Redirect to the list page after successful insertion
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

module.exports = router;
