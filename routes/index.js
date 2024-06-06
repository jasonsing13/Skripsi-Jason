var express = require('express');
const session = require('express-session');
var router = express.Router();
router.use(express.static('public'));
router.use(session({ secret: process.env.TOKEN_SECRET, rolling: true,
  cookie: { maxAge: 60 * 1000 * 60 }, resave: false, saveUninitialized: false}));

var db = require("../database/db");
var { saveAllVendorInformation } = require("../database/db");
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser'); // Jika Anda menggunakan express versi lama
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/authenticate'); // Impor middleware otentikasi
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config(); // Load konfigurasi dari file .env

// CONTROLLER
var bidding_tenderController = require('../src/bidding_tender/controller');
var detail_bidding_tenderController = require('../src/detail_bidding_tender/controller');
//var detail_template_vsController = require('../src/detail_template_vs/controller');
//var detail_vsController = require('../src/detail_vs/controller');
var goods_receivedController = require('../src/goods_received/controller');
var itemController = require('../src/item/controller');
//var purchase_orderController = require('../src/purchase_order/controller');
//var roleController = require('../src/role/controller');
//var statusController = require('../src/status/controller');
//var template_vsController = require('../src/template_vs/controller');
//var tipe_pemilihanController = require('../src/tipe_pemilihan/controller');
var userController = require('../src/user/controller');
var pengadaanController = require('../src/pengadaan/controller');
//var vendor_scoreController = require('../src/vendor_score/controller');
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
const noSessionCheckRoutes = ['/', '/login'];

function checkSession(req, res, next) {
  // Jika rute saat ini ada di daftar noSessionCheckRoutes, lanjutkan ke rute berikutnya
  if (noSessionCheckRoutes.includes(req.path)) {
    return next();
  }

  // Cek sesi seperti biasa
  if (req.session && req.session.data) {
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
        req.session.data = {parent: result[0]};
        
        res.redirect('/dashboard-vendor');
        // Send data to route 2 via POST request
      } else {
        return res.status(401).json({ error: 'Autentikasi gagal. Email atau kata sandi tidak valid.' });
      }
    } else if(resultAdm.length > 0) {
      const passwordDb = resultAdm[0].password;
      if (passwordDb.trim() === password.trim()) { //Besok cari cara nge akses token di sidebar dna di file" lainnya
        const token = generateAccessToken({ email: resultAdm[0].email });
        resultAdm[0]['isAdmin'] = true;
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
      const vendor_id = await vendorController.addVendor(req, res);
      res.redirect(`/bank-info?id=${vendor_id}`);
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
    res.render('dashboard-vendor', { parent: data.parent, page: 'dashboard' });
  } catch (error) {
    console.error('Error fetching vendor data', error); // Tampilkan stack error
    res.status(500).send('Error fetching vendor data');
  }
});

router.get('/dashboard-admin', async(req, res) => {
  try {
    const data = req.session.data; // Access data from session
    
    res.render('dashboard-admin', { parent: data.parent, page: 'dashboard' });
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

// router.get('/daftar-pengadaan', async function(req, res) {
//   try {
//       const result = await pengadaanController.getDaftarPengadaan();
//       const vendor_id = req.query.id; // Sesuaikan ini
//       // const pengadaan_id = req.query.pengadaan_id; // Sesuaikan ini
//       res.render('daftar-pengadaan', {
//           pengadaan: result,
//           vendor_id: vendor_id,
//           pengadaan_id: result.pengadaan_id
//       });
//   } catch (error) {
//       console.error('Error fetching pengadaan data:', error);
//       res.status(500).send('Error fetching pengadaan data: ' + error.message);
//   }
// });

router.get('/daftar-pengadaan', async function(req, res) {
  const data = req.session.data;
  try {
      const statusOptions = await pengadaanController.option_Select_Status();
      const result = await pengadaanController.getDaftarPengadaan(data.parent.id);
      const vendor = await vendorController.getProfilInformasi(req.query.id);
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
      page: 'bidding'
    });
} catch (error) {
    console.error('Failed to add new detail bidding tender:', error);
    res.status(500).send('Error adding new detail bidding tender');
  }
});

router.post('/add-bidding-tender', async (req, res) => {
  const { bt_id, vendor_id, pengadaan_id } = req.body;
  try {
      // Assuming you have a function to insert data into the database
      await detail_bidding_tenderController.addDetail_Bidding_Tender(bt_id, vendor_id);
      res.redirect('back')
  } catch (error) {
      console.error('Failed to add new detail bidding tender:', error);
      res.status(500).send('Error adding new detail bidding tender');
  }
});

router.post('/form-bidding', async (req, res) => {
  console.log(req.body);
  const { durasi_pekerjaan, pengajuan_harga, bt_id, vendor_id } = req.body;
  try {
      // Assuming you have a function to insert data into the database
      await detail_bidding_tenderController.updateDetail_Bidding_Tender(durasi_pekerjaan, pengajuan_harga, bt_id, vendor_id);
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

  res.render('form-tender', {
    title: "Form Tender",
    currdate: formattedDate,
    page: 'tender',
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

router.get('/form-vendor-scoring', function(req,res) {
  res.render('form-vendor-scoring', {
    title: "Form Vendor Scoring"
  })
})

//ADMIN

router.get('/list-vendor-admin', async (req, res) => {
  try {
    const data = req.session.data;
    const result = await vendorController.getVendor(); // Fetch vendors data using a function from db.js
    res.render('list-vendor-admin', { vendor: result, parent: data.parent });
  } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).send('Error fetching vendor data');
  }
});


router.get('/approval-vendor-admin', function(req, res) {
  const data = req.session.data;
  res.render('approval-vendor-admin', { parent: data.parent });
});

router.post('/approval-vendor-admin', async (req, res) => {
  const { vendor_id, status_id } = req.body;
  const data = req.session.data;
  try {
      await vendorController.updateVendor_Status(vendor_id, status_id); // Assuming db.updateVendorStatus updates the status
      res.redirect('/list-vendor-admin', { parent: data.parent });
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

// router.post('/buat-pengadaan', async function(req, res) {
//   const { 
//           // nama_pengadaan, 
//           // tipe_pemilihan_id, 
//           // jenis_pengadaan_id, 
//           // jenis_vendor_id, 
//           // termin_pembayaran, 
//           // tanggal_pemilihan, 
//           // create_date, 
//           // create_by, 
//           // modif_date, 
//           // modif_by 
//         } = req.body;
//         console.log(req.body);
//   try {
//       // Assuming you have a function to insert data into the database
//       const pengadaan_id = await pengadaanController.addPengadaan(req, res);
//       res.redirect('/daftar-pengadaan-admin'); // Redirect to the list page after successful insertion
//   } catch (error) {
//       console.error('Failed to add new pengadaan:', error);
//       res.status(500).send('Error adding new pengadaan');
//   }
// });

// router.post('/buat-pengadaan', async (req, res) => {
//   const {
//       nama_pengadaan,
//       tipe_pemilihan_id,
//       jenis_pengadaan_id,
//       jenis_vendor_id,
//       termin_pembayaran,
//       nama_barang,
//       harga_barang,
//       jumlah_barang,
//       url_foto_item,
//       create_by
//   } = req.body;

//   try {
//       const client = await pool.connect();
//       try {
//           await client.query('BEGIN');
//           const result = await client.query(addPengadaan, [
//               nama_pengadaan,
//               tipe_pemilihan_id,
//               jenis_pengadaan_id,
//               jenis_vendor_id,
//               termin_pembayaran,
//               create_by
//           ]);

//           const pengadaan_id = result.rows[0].pengadaan_id;

//           await client.query(addItem, [
//               pengadaan_id,
//               nama_barang,
//               harga_barang,
//               jumlah_barang,
//               url_foto_item
//           ]);

//           await client.query('COMMIT');
//           res.redirect('/daftar-pengadaan-admin');
//       } catch (error) {
//           await client.query('ROLLBACK');
//           console.error('Error during transaction', error);
//           res.status(500).send('Something went wrong');
//       } finally {
//           client.release();
//       }
//   } catch (error) {
//       console.error('Database connection error', error);
//       res.status(500).send('Something went wrong');
//   }
// });

// index.js
// router.post('/buat-pengadaan', async (req, res) => {
//   const {
//       nama_pengadaan,
//       tipe_pemilihan_id,
//       jenis_pengadaan_id,
//       jenis_vendor_id,
//       termin_pembayaran,
//       tanggal_pemilihan,
//       create_date,
//       create_by
//   } = req.body;

//   try {
//       // Buat pengadaan baru dan dapatkan pengadaan_id
//       const pengadaan_id = await pengadaanController.addPengadaan(req, res);

//       // Tambahkan item ke pengadaan yang baru dibuat
//       const items = JSON.parse(req.body.items);
//       for (const item of items) {
//           await pengadaanController.addItem(pengadaan_id, item);
//       }

//       // Redirect ke halaman daftar-pengadaan-admin dengan pengadaan_id sebagai query parameter
//       res.redirect(`/daftar-pengadaan-admin?pengadaan_id=${pengadaan_id}`);
//   } catch (error) {
//       console.error('Database connection error', error);
//       res.status(500).send('Something went wrong');
//   }
// });

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
      const statusOptions = await pengadaanController.option_Select_Status();
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
    const statusOptions = await pengadaanController.option_Select_Status();
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
    const result = await detail_bidding_tenderController.getDetail_Bidding_TenderById(pengadaan.bt_id);
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
  try {
      // Asumsi Anda memiliki fungsi untuk menyetujui pengadaan
      await pengadaanController.validasiPengadaan(req.body, vendor_id);
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
  const {pengadaan_id, vendor_id, dbt_id, bt_id} = req.body;
  try {
      // Asumsi Anda memiliki fungsi untuk menyetujui pengadaan
      await pengadaanController.setPemenang(pengadaan_id, vendor_id, dbt_id, bt_id);
      // const data = req.session.data;
      // const statusOptions = await pengadaanController.option_Select_Status();
      // const result = await pengadaanController.getDaftarPengadaan();
      res.redirect(`/vendor-pengadaan-previous/`+pengadaan_id);
    } catch (error) {
      console.error('Gagal menyetujui pengadaan:', error);
      res.status(500).send('Error menyetujui pengadaan');
  }
});

router.get('/informasi-pengadaan-approved', function(req, res) {
  const data = req.session.data;
  const pengadaan_id = req.query.id;
  const procurementInfo = {
      procurementName: 'Portal Vendor',
      procurementType: 'Jasa',
      vendorType: 'Software House',
      itemName: 'Website',
      itemPrice: 'Rp. 150.000.000,00',
      itemQuantity: 1,
      startDate: '01-01-2024',
      endDate: '30-04-2024',
      actualEndDate: '-'
  };
  res.render('informasi-pengadaan-approved', { procurement: procurementInfo, pengadaan_id, parent: data.parent, page: 'pengadaan' });
});

router.get('/item-pengadaan-approved', function(req, res) {
  const data = req.session.data;
  const pengadaan_id = req.query.id;
  const itemsData = [
      { no: 'IG000001', name: 'MEJA', quantity: 20, price: 'Rp. 200.000', discount: '-', netAmount: 'Rp. 4.000.000' },
      { no: 'IG000002', name: 'KURSI', quantity: 100, price: 'Rp. 100.000', discount: '-', netAmount: 'Rp. 10.000.000' }
  ];
  res.render('item-pengadaan-approved', { items: itemsData, pengadaan_id, parent: data.parent, page: 'pengadaan' });
});

router.get('/informasi-purchase-order-approved', function(req, res) {
  const data = req.session.data;
  const pengadaan_id = req.query.id;
  const itemsData = [
      { no: 'IG000001', name: 'MEJA', quantity: 20, price: 'Rp. 200.000', discount: '-', netAmount: 'Rp. 4.000.000' },
      { no: 'IG000002', name: 'KURSI', quantity: 100, price: 'Rp. 100.000', discount: '-', netAmount: 'Rp. 10.000.000' }
  ];
  res.render('informasi-purchase-order-approved', { items: itemsData, pengadaan_id, parent: data.parent, page: 'pengadaan' });
});

router.get('/dokumen-purchase-order-approved', function(req, res) {
  const data = req.session.data;
  const pengadaan_id = req.query.id;
  const itemsData = [
      { no: 'IG000001', name: 'MEJA', quantity: 20, price: 'Rp. 200.000', deliveryDate: '14-04-2024', status: 'TUTUP' },
      { no: 'IG000002', name: 'KURSI', quantity: 100, price: 'Rp. 100.000', deliveryDate: '12-04-2024', status: 'TUTUP' }
  ];
  res.render('dokumen-purchase-order-approved', { items: itemsData, pengadaan_id, parent: data.parent, page: 'pengadaan' });
});

// GET route for the goods received page
router.get('/goods-received-vendor', (req, res) => {
  res.render('goods-received-vendor');
});

router.post('/goods-received-vendor', 
upload.fields([{ name: 'invoice' }, { name: 'surat_jalan' }]), async (req, res) => {
  try {
    // Extract file paths from the uploaded files
    const url_invoice = req.files['invoice'][0].path;
    const url_surat_jalan = req.files['surat_jalan'][0].path;

    // Assuming you have a function to insert data into the database
    await goods_receivedController.addGoods_Received(url_invoice, url_surat_jalan);
    res.redirect('/daftar-pengadaan'); // Redirect to the list page after successful insertion
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

// GET route for the goods received page
router.get('/goods-received-admin', (req, res) => {
  res.render('goods-received-admin');
});

router.post('/goods-received-admin', 
upload.fields([{ name: 'invoice' }, { name: 'surat_jalan' }]), async (req, res) => {
  try {
    // Extract file paths from the uploaded files
    const url_invoice = req.files['invoice'][0].path;
    const url_surat_jalan = req.files['surat_jalan'][0].path;

    // Assuming you have a function to insert data into the database
    await goods_receivedController.addGoods_Received(url_invoice, url_surat_jalan);
    res.redirect('/daftar-pengadaan-vendor'); // Redirect to the list page after successful insertion
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
      nama_vendor 
    } = req.body;
    // Assuming you have a function to insert data into the database
    const item = await vendorController.getVendor(nama_vendor)
    res.send(item); // Redirect to the list page after successful insertion
  } catch (error) {
    console.error('Failed to add goods received:', error);
    res.status(500).send('Error adding goods received');
  }
});

module.exports = router;
