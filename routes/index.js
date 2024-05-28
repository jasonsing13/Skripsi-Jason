var express = require('express');
var router = express.Router();
var db = require("../database/db")
var { saveAllVendorInformation } = require("../database/db");
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser'); // Jika Anda menggunakan express versi lama
var bidding_tenderController = require('../src/bidding_tender/controller');
var detail_bidding_tenderController = require('../src/detail_bidding_tender/controller');
//var detail_template_vsController = require('../src/detail_template_vs/controller');
//var detail_vsController = require('../src/detail_vs/controller');
var goods_receivedController = require('../src/goods_received/controller');
//var itemController = require('../src/item/controller');
//var purchase_orderController = require('../src/purchase_order/controller');
//var roleController = require('../src/role/controller');
//var statusController = require('../src/status/controller');
//var template_vsController = require('../src/template_vs/controller');
//var tipe_pemilihanController = require('../src/tipe_pemilihan/controller');
//var userController = require('../src/user/controller');
var pengadaanController = require('../src/pengadaan/controller');
//var vendor_scoreController = require('../src/vendor_score/controller');
var vendorController = require('../src/vendor/controller');
//var jenis_pengadaanController = require('../src/jenis_pengadaan/controller');
//var jenis_vendorController = require('../src/jenis_vendor/controller');
const { option_Tipe_Pemilihan1 } = require('../src/pengadaan/queries');
const { option_Tipe_Pemilihan2 } = require('../src/pengadaan/queries');
const { option_Jenis_Vendor } = require('../src/jenis_vendor/queries');
const { option_Vendor } = require('../src/vendor/queries');
const { option_Jenis_Pengadaan } = require('../src/jenis_pengadaan/queries');

/* GET home page. */
router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Login Page'
  });
});


// // POST login form data
// router.post('/login', function(req, res) {
//   const { email, password } = req.body;
//   console.log(req.body);
//     try{
//       await vendorController.addAccount(req, res);
//   res.redirect(`/registration`);
//     }
//       catch (error)  {    
//          // Log the error and send a 500 response if an error occurs
//       console.error('Error saving vendor information:', error);
//       res.status(500).send('An error occurred during registration: ' + error.message);
//   }
// });



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



router.post('/registration', async function(req, res) {
  const { 
      // nama_vendor,
      // jenis_vendor_id,
      // email_perusahaan,
      // status_kantor,
      // alamat_perusahaan,
      // nama_direktur,
      // no_telp,
      // negara,
      // provinsi_id,
      // kk_id,
      // create_by
  } = req.body;
  console.log(req.body);
  try {
      // Panggil fungsi addVendor dengan parameter yang benar
      const vendor_id = await vendorController.addVendor(req, res);
      // Redirect to the next page if the save is successful
      res.redirect(`/bank-info?id=${vendor_id}`);
  } catch (error) {
      // Log the error and send a 500 response if an error occurs
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
router.post('/bank-info', async function(req, res) {
  const { no_rekening, nama_pemilik_rekening, bank_id, vendor_id} = req.body;
  console.log(req.body);
  try {
    await vendorController.addRekening_Vendor(req, res);
    // Redirect to the next page if the save is successful
    res.redirect(`/tax-info?id=${vendor_id}`);
  } catch (error) {
    // Log the error and send a 500 response if an error occurs
    console.error('Error saving vendor information:', error);
    res.status(500).send('An error occurred during registration: ' + error.message);
  }
});

/* GET tax-info page. */
router.get('/tax-info',  function(req, res) {
  res.render('tax-info');
});


/* POST tax-info page. */
router.post('/tax-info', idMiddleware, async function(req, res) {
  const { no_npwp, status_pkp, vendor_id } = req.body;
  console.log(req.body);
  try {
    // Await the Promise returned by saveVendorInformation
    await vendorController.updateTax_Vendor(req, res);
    // Redirect to the next page if the save is successful
    res.redirect(`/legal-info?id=${vendor_id}`);
  } catch (error) {
    // Log the error and send a 500 response if an error occurs
    console.error('Error saving vendor information:', error);
    res.status(500).send('An error occurred during registration: ' + error.message);
  }
});

/* GET legal-info page. */
router.get('/legal-info', idMiddleware, function(req, res) {
  res.render('legal-info');
});

/* POST legal-info page. */
router.post('/legal-info', idMiddleware, async function(req, res) {  
  const { no_nibrba, no_ktp_direktur, vendor_id } = req.body;
  console.log(req.body);
  try {
    // Await the Promise returned by saveVendorInformation
    await vendorController.updateLegal_Vendor(req, res);
    // Redirect to the next page if the save is successful
       // Store ID in session
       req.session = req.session || {};
       req.session.id = vendor_id;
    res.redirect(`/profil-informasi?id=${vendor_id}`);
  } catch(error) {
      console.error('Error saving final vendor information:', error);
      res.status(500).send('An error occurred during registration.' + error.message);
  }
});


router.get('/profil-informasi', async (req, res) => {
  try {
    const vendor_id = req.query.id; // Ambil vendor_id dari query parameter
    const result = await vendorController.getProfilInformasi(vendor_id);
    res.render('profil-informasi', { vendor: result, vendor_id });
  } catch (error) {
    console.error('Error fetching vendor data:', error);
    res.status(500).send('Error fetching vendor data');
  }
});

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
    console.error('Error fetching vendor data', error.stack); // Tampilkan stack error
    res.status(500).send('Error fetching vendor data');
  }
});


router.get('/upload-dokumen-vendor', function(req, res) {
  res.render('upload-dokumen-vendor');
});


// router.post('/upload-dokumen-vendor', upload.fields([
//   { name: 'url_buku_akun_bank', maxCount: 1 },
//   { name: 'url_npwp', maxCount: 1 },
//   { name: 'url_pkp', maxCount: 1 },
//   { name: 'url_ktp_direktur', maxCount: 1 },
//   { name: 'url_akta_perubahan', maxCount: 1 },
//   { name: 'url_akta_pendirian', maxCount: 1 },
//   { name: 'url_nibrba', maxCount: 1 },
//   { name: 'url_dokumen_ijin_lain', maxCount: 1 },
//   { name: 'url_profile_perusahaan', maxCount: 1 }
// ]), function(req, res) {
//   // Process the uploaded files here
//   // Assuming db.saveFileInformation expects an array of file data
//   let fileData = [];
//   for (let key in req.files) {
//     fileData.push(...req.files[key].map(file => ({
//       url_buku_akun_bank: file.filename,
//       url_npwp: file.filename,
//       url_pkp: file.filename,
//       url_ktp_direktur: file.filename,
//       url_akta_perubahan: file.filename,
//       url_akta_pendirian: file.filename,
//       url_nibrba: file.filename,
//       url_dokumen_ijin_lain: file.filename,
//       url_profile_perusahaan: file.filename,
//       path: file.path,
//       size: file.size,
//       mimetype: file.mimetype
//     })));
//   }

//   db.saveFileInformation(fileData)
//     .then(() => {
//       res.redirect('/dashboard-vendor'); 
//       console.log('File information saved successfully');
//       res.send('Files uploaded and saved successfully!');
//     })
//     .catch(error => {
//       console.error('Error saving file information:', error);
//       res.status(500).send('Failed to save file information');
//     });
// });

router.post('/upload-dokumen-vendor', async function(req, res) {
  const { url_buku_akun_bank, url_dokumen_npwp, url_dokumen_ppkp, url_ktp_direktur, url_akta_perubahan, url_akta_pendirian, url_nibrba, url_dokumen_ijin_lain, url_profile_perusahaan, vendor_id } = req.body;
  console.log(req.body);
  try {
    // Await the Promise returned by saveVendorInformation
    await vendorController.updateVendorURL(req, res);
    // Redirect to the next page if the save is successful
    res.redirect(`/approved-vendor-profile?id=${vendor_id}`);
  } catch (error) {
    // Log the error and send a 500 response if an error occurs
    console.error('Error saving vendor information:', error);
    res.status(500).send('An error occurred during registration: ' + error.message);
  }
});

router.get('/dashboard-vendor', function(req, res) {
  res.render('dashboard-vendor');
});

router.get('/approved-vendor-profile', function(req, res) {
  const vendorInfo = {
    code: 'V1234',
    category: 'Electronics',
    name: 'PT. Setia Berkah Abadi',
    officeStatus: 'Active',
    ownerName: 'John Doe',
    phone: '08123456789',
    email: 'contact@setiaberkahabadi.com',
    address: 'Jl. Merdeka No. 123, Jakarta',
    country: 'Indonesia',
    province: 'DKI Jakarta',
    city: 'Jakarta',
    postalCode: '10110'
};
  res.render('approved-vendor-profile', { vendor: vendorInfo });
});

router.get('/approved-akun-bank', function(req, res) {
  const bankInfo = {
    accountNumber: '88362773868',
    accountName: 'PT Setia Berkah Abadi',
    bankName: 'Bank BCA'
};
  res.render('approved-akun-bank', { bank: bankInfo });
});

router.get('/approved-perpajakan', function(req, res) {
  const taxInfo = {
    npwpNumber: '09.254.8274-8-23.000',
    pkpStatus: 'Sudah PKP',
    pkpNumber: 'PEM-02339/ERI.09/KP.0904/2012'
};

  res.render('approved-perpajakan', {tax: taxInfo});
});

router.get('/approved-legalitas', function(req, res) {
  const legalInfo = {
    nibNumber: '2208220056059',
    ownerIdNumber: '187700093874002',
    authorizedIdNumber: '33099270002938'
};
  res.render('approved-legalitas', { legal: legalInfo});
});

router.get('/daftar-pengadaan', async function(req, res) {
  try {
    const result = await pengadaanController.getPengadaan(); // Fetch pengadaan data
    res.render('daftar-pengadaan', { pengadaan: result });
  } catch (error) {
    console.error('Error fetching pengadaan data:', error);
    res.status(500).send('Error fetching pengadaan data: ' + error.message);
  }
});

router.get('/informasi-pengadaan', function(req, res) {
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
  res.render('informasi-pengadaan', { procurement: procurementInfo });
});

router.get('/item-pengadaan', function(req, res) {
  const itemsData = [
      { no: 'IG000001', name: 'MEJA', quantity: 20, price: 'Rp. 200.000', discount: '-', netAmount: 'Rp. 4.000.000' },
      { no: 'IG000002', name: 'KURSI', quantity: 100, price: 'Rp. 100.000', discount: '-', netAmount: 'Rp. 10.000.000' }
  ];
  res.render('item-pengadaan', { items: itemsData });
});

router.get('/informasi-purchase-order', function(req, res) {
  const itemsData = [
      { no: 'IG000001', name: 'MEJA', quantity: 20, price: 'Rp. 200.000', discount: '-', netAmount: 'Rp. 4.000.000' },
      { no: 'IG000002', name: 'KURSI', quantity: 100, price: 'Rp. 100.000', discount: '-', netAmount: 'Rp. 10.000.000' }
  ];
  res.render('informasi-purchase-order', { items: itemsData });
});

router.get('/dokumen-purchase-order', function(req, res) {
  const itemsData = [
      { no: 'IG000001', name: 'MEJA', quantity: 20, price: 'Rp. 200.000', deliveryDate: '14-04-2024', status: 'TUTUP' },
      { no: 'IG000002', name: 'KURSI', quantity: 100, price: 'Rp. 100.000', deliveryDate: '12-04-2024', status: 'TUTUP' }
  ];
  res.render('dokumen-purchase-order', { items: itemsData });
});

router.get('/list-bidding-vendor', async (req, res) => {
  try {
      let result = await bidding_tenderController.getBidding(); // Fetch bids data
      console.log('Bidding data:', result); // Log data yang diterima
      if (!result || result.length === 0) {
          throw new Error('No bidding data found');
      }
      // res.send(result);
      res.render('list-bidding-vendor', { bidding_tender: result });
  } catch (error) {
      console.error('Error fetching bidding data:', error.message); // Log error yang lebih detail
      res.status(500).send('Error fetching bidding data');
  }
});




router.get('/form-bidding', function(req, res) {
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('id-ID', options);

  res.render('form-bidding', {
    title: "Form Bidding",
    currdate: formattedDate
  });
});


router.post('/form-bidding', async function(req, res) {
  const { durasi_pekerjaan, pengajuan_harga } = req.body;
  try {
      // Assuming you have a function to insert data into the database
      await detail_bidding_tenderController.addDetail_Bidding_Tender(durasi_pekerjaan, pengajuan_harga);
      res.redirect('/list-bidding-vendor'); // Redirect to the list page after successful insertion
  } catch (error) {
      console.error('Failed to add new detail bidding tender:', error);
      res.status(500).send('Error adding new detail bidding tender');
  }
});

router.get('/form-tender', function(req, res) {
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('id-ID', options);

  res.render('form-tender', {
    title: "Form Tender",
    currdate: formattedDate
  });
});

router.post('/form-tender', async function(req, res) {
  const { duration, bidAmount, vendor_id, bt_id } = req.body;  // Ensure vendor_id and bt_id are provided in the form or derived from session/context

  try {
      await db.addDetail_Bidding_Tender({
          pengajuan_harga: bidAmount,
          durasi_pekerjaan: duration,
          vendor_id: vendor_id,  // Assuming vendor_id is obtained correctly
          bt_id: bt_id           // Assuming bt_id is obtained correctly
      });

      res.redirect('/list-tender-vendor'); // Redirect or send a success response
  } catch (error) {
      console.error('Error submitting bid:', error);
      res.status(500).send('An error occurred during the bidding process: ' + error.message);
  }
});

router.get('/list-tender-vendor', async (req, res) => {
  try {
      let result = await bidding_tenderController.getTender(); // Fetch tenders data
      console.log('Tender data:', result); // Log data yang diterima
      if (!result || result.length === 0) {
          throw new Error('No tender data found');
      }
      // res.send(result);
      res.render('list-tender-vendor', { bidding_tender: result });
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
//

router.get('/list-vendor-admin', async (req, res) => {
  try {
      const result = await vendorController.getVendor(); // Fetch vendors data using a function from db.js
      res.render('list-vendor-admin', { vendor: result });
  } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).send('Error fetching vendor data');
  }
});


router.get('/approval-vendor-admin', function(req, res) {
  res.render('approval-vendor-admin');
});

router.post('/approval-vendor-admin', async (req, res) => {
  const { vendor_id, status_id } = req.body;
  try {
      await vendorController.updateVendor_Status(vendor_id, status_id); // Assuming db.updateVendorStatus updates the status
      res.redirect('/list-vendor-admin');
  } catch (error) {
      console.error('Failed to update vendor status:', error);
      res.status(500).send('Error updating vendor status');
  }
});

router.get('/buat-pengadaan', async function(req, res) {
  const option_Tipe_Pemilihan1 = await pengadaanController.option_Tipe_Pemilihan1();
  const option_Jenis_Pengadaan = await pengadaanController.option_Jenis_Pengadaan();
  const option_Jenis_Vendor = await pengadaanController.option_Jenis_Vendor();
  res.render('buat-pengadaan', { option_Tipe_Pemilihan1, option_Jenis_Pengadaan, option_Jenis_Vendor });
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
      nama_pengadaan,
      tipe_pemilihan_id,
      jenis_pengadaan_id,
      jenis_vendor_id,
      termin_pembayaran,
      create_date,
      create_by,
      items // Items as JSON string
  } = req.body;

  try {
      // Buat pengadaan baru dan dapatkan pengadaan_id
      const pengadaan_id = await pengadaanController.addPengadaan(req.body);

      // Parse items JSON string
      const itemsArray = JSON.parse(items);

      // Tambahkan item ke pengadaan yang baru dibuat
      for (const item of itemsArray) {
          await pengadaanController.addItem(pengadaan_id, item);
      }

      // Redirect ke halaman daftar-pengadaan-admin dengan pengadaan_id sebagai query parameter
      res.redirect(`/daftar-pengadaan-admin?pengadaan_id=${pengadaan_id}`);
  } catch (error) {
      console.error('Database connection error', error);
      res.status(500).send('Something went wrong');
  }
});


router.get('/daftar-pengadaan-admin', async (req, res) => {
  try {
    const result = await pengadaanController.getPengadaan();
    res.render('daftar-pengadaan-admin', { pengadaan: result });
  } catch (error) {
      console.error('Error fetching procurement data:', error);
      res.status(500).send('Error fetching procurement data');
  }
});

router.get('/informasi-pengadaan-previous', async (req, res) => {
  try {
    const result = await pengadaanController.getPengadaan();
    const pengadaan_id = req.query.id
    res.render('informasi-pengadaan-previous', { pengadaan: result });
  } catch (error) {
      console.error('Error fetching procurement data:', error);
      res.status(500).send('Error fetching procurement data');
  }
});


router.get('/item-pengadaan-previous', async (req, res) => {
  // Fetch the necessary items data
  try {
    const result = await pengadaanController.getPengadaan();
    const pengadaan_id = req.query.id
    res.render('item-pengadaan-previous', { pengadaan: result });
  } catch (error) {
      console.error('Error fetching procurement data:', error);
      res.status(500).send('Error fetching procurement data');
  }
});

router.get('/validasi-pengadaan-admin', function(req, res) {
  const option_Tipe_Pemilihan2 =  pengadaanController.option_Tipe_Pemilihan2();
  const option_Vendor =  pengadaanController.option_Vendor();
  const option_PIC =  pengadaanController.option_PIC();
  res.render('validasi-pengadaan-admin', {option_Tipe_Pemilihan2, option_Vendor, option_PIC});
});

router.post('/validasi-pengadaan-admin', async function(req, res) {
  const { time_pemilihan_id, tanggal_pemilihan, tanggal_pemilihan_selesai, pic, vendor_id } = req.body;
  console.log(req.body);
  try {
      // Asumsi Anda memiliki fungsi untuk menyetujui pengadaan
      await pengadaanController.validasiPengadaan({ req, res });
      req.session = req.session || {};
      req.session.id = pengadaan_id;
      res.redirect('/informasi-pengadaan-approved'); // Mengarahkan ke halaman sukses atau kembali ke daftar
  } catch (error) {
      console.error('Gagal menyetujui pengadaan:', error);
      res.status(500).send('Error menyetujui pengadaan');
  }
});


router.get('/informasi-pengadaan-approved', function(req, res) {
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
  res.render('informasi-pengadaan-approved', { procurement: procurementInfo });
});

router.get('/item-pengadaan-approved', function(req, res) {
  const itemsData = [
      { no: 'IG000001', name: 'MEJA', quantity: 20, price: 'Rp. 200.000', discount: '-', netAmount: 'Rp. 4.000.000' },
      { no: 'IG000002', name: 'KURSI', quantity: 100, price: 'Rp. 100.000', discount: '-', netAmount: 'Rp. 10.000.000' }
  ];
  res.render('item-pengadaan-approved', { items: itemsData });
});

router.get('/informasi-purchase-order-approved', function(req, res) {
  const itemsData = [
      { no: 'IG000001', name: 'MEJA', quantity: 20, price: 'Rp. 200.000', discount: '-', netAmount: 'Rp. 4.000.000' },
      { no: 'IG000002', name: 'KURSI', quantity: 100, price: 'Rp. 100.000', discount: '-', netAmount: 'Rp. 10.000.000' }
  ];
  res.render('informasi-purchase-order-approved', { items: itemsData });
});

router.get('/dokumen-purchase-order-approved', function(req, res) {
  const itemsData = [
      { no: 'IG000001', name: 'MEJA', quantity: 20, price: 'Rp. 200.000', deliveryDate: '14-04-2024', status: 'TUTUP' },
      { no: 'IG000002', name: 'KURSI', quantity: 100, price: 'Rp. 100.000', deliveryDate: '12-04-2024', status: 'TUTUP' }
  ];
  res.render('dokumen-purchase-order-approved', { items: itemsData });
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
    res.redirect('/daftar-pengadaan-vendor'); // Redirect to the list page after successful insertion
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

module.exports = router;
