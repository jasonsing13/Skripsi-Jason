var express = require('express');
var router = express.Router();
var db = require("../database/db")
var { saveAllVendorInformation } = require("../database/db");
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var bidding_tenderController = require('../src/bidding_tender/controller');
var detail_bidding_tenderController = require('../src/detail_bidding_tender/controller');
var detail_template_vsController = require('../src/detail_template_vs/controller');
var detail_vsController = require('../src/detail_vs/controller');
var goods_receivedController = require('../src/goods_received/controller');
var itemController = require('../src/item/controller');
var purchase_orderController = require('../src/purchase_order/controller');
var roleController = require('../src/role/controller');
var statusController = require('../src/status/controller');
var template_vsController = require('../src/template_vs/controller');
var tipe_pemilihanController = require('../src/tipe_pemilihan/controller');
var userController = require('../src/user/controller');
var pengadaanController = require('../src/pengadaan/controller');
var vendor_scoreController = require('../src/vendor_score/controller');
var vendorController = require('../src/vendor/controller');
const { option_Tipe_Pemilihan } = require('../src/pengadaan/queries');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'MPM - Smart Mobility'
    });  
});

/* GET registration page. */
router.get('/registration', function(req, res) {
  res.render('registration', { // Remove the leading slash before "registration"
    title: 'Registrasi Vendor'
  });
});


/* POST registration page. */
router.post('/registration', async function(req, res) {
  const { companyName, companyEmail, companyStatus, companyAddress, directorName, companyPhone } = req.body;
  try {
    // Await the Promise returned by saveVendorInformation
    await db.saveVendorInformation({
      companyName,
      companyEmail,
      companyStatus,
      companyAddress,
      directorName,
      companyPhone
    });
    // Redirect to the next page if the save is successful
    res.redirect('/bank-info');
  } catch (error) {
    // Log the error and send a 500 response if an error occurs
    console.error('Error saving vendor information:', error);
    res.status(500).send('An error occurred during registration: ' + error.message);
  }
});


/* GET bank-info page. */
router.get('/bank-info', function(req, res) {
  res.render('/bank-info', {
    title: 'Bank Information'
  });
});

/* POST bank-info page. */
router.post('/bank-info', async function(req, res) {
  const { accountNumber, accountName, bankName } = req.body;

  try {
    // Await the Promise returned by saveVendorInformation
    await db.saveVendorInformation({
      accountNumber,
      accountName,
      bankName
    });

    // Redirect to the next page if the save is successful
    res.redirect('/tax-info');
  } catch (error) {
    // Log the error and send a 500 response if an error occurs
    console.error('Error saving vendor information:', error);
    res.status(500).send('An error occurred during registration: ' + error.message);
  }
});

/* GET tax-info page. */
router.get('/tax-info', function(req, res) {
  res.render('tax-info');
});

/* POST tax-info page. */
router.post('/tax-info', async function(req, res) {
  const { npwpNumber, pkpStatus } = req.body;

  try {
    // Await the Promise returned by saveVendorInformation
    await db.saveVendorInformation({
      npwpNumber,
      pkpStatus
    });

    // Redirect to the next page if the save is successful
    res.redirect('/legal-info');
  } catch (error) {
    // Log the error and send a 500 response if an error occurs
    console.error('Error saving vendor information:', error);
    res.status(500).send('An error occurred during registration: ' + error.message);
  }
});

/* GET legal-info page. */
router.get('/legal-info', function(req, res) {
  res.render('legal-info');
});

/* POST legal-info page. */
router.post('/legal-info', function(req, res) {
  const { nibNumber, ktpNumber } = req.body;
  const allData = {
      ...req.session.vendorData, // Ensure session data is correctly managed
      nibNumber,
      ktpNumber
  };
  saveAllVendorInformation(allData).then(() => {
      res.redirect('/profil-informasi'); // Redirect to a profil-informasi page
  }).catch(error => {
      console.error('Error saving final vendor information:', error);
      res.status(500).send('An error occurred during registration.');
  });
});

router.get('/profil-informasi', async (req, res) => {
  try {
    const result = await vendorController.getVendor();
    res.render('profil-informasi', { vendor: result });
  } catch (error) {
    console.error('Error fetching vendor data:', error);
    res.status(500).send('Error fetching vendor data');
  }
});


router.get('/profil-akun-bank', function(req, res) {
  // Fetch bank information from the database or session
  const bankInfo = {
      accountNumber: '88362773868',
      accountName: 'PT Setia Berkah Abadi',
      bankName: 'Bank BCA'
  };
  res.render('profil-akun-bank.ejs', { bank: bankInfo });
});

router.get('/profil-perpajakan', function(req, res) {
  // Fetch taxation information from the database or session
  const taxInfo = {
      npwpNumber: '09.254.8274-8-23.000',
      pkpStatus: 'Sudah PKP',
      pkpNumber: 'PEM-02339/ERI.09/KP.0904/2012'
  };
  res.render('profil-perpajakan', { tax: taxInfo });
});

router.get('/profil-legalitas', function(req, res) {
  // Fetch legal information from the database or session
  const legalInfo = {
      nibNumber: '2208220056059',
      ownerIdNumber: '187700093874002',
      authorizedIdNumber: '33099270002938'
  };
  res.render('profil-legalitas', { legal: legalInfo });
});

router.get('/upload-dokumen-vendor', function(req, res) {
  res.render('upload-dokumen-vendor');
});


router.post('/upload-dokumen-vendor', upload.fields([
  { name: 'url_buku_akun_bank', maxCount: 1 },
  { name: 'url_npwp', maxCount: 1 },
  { name: 'url_pkp', maxCount: 1 },
  { name: 'url_ktp_direktur', maxCount: 1 },
  { name: 'url_akta_perubahan', maxCount: 1 },
  { name: 'url_akta_pendirian', maxCount: 1 },
  { name: 'url_nibrba', maxCount: 1 },
  { name: 'url_dokumen_ijin_lain', maxCount: 1 },
  { name: 'url_profile_perusahaan', maxCount: 1 }
]), function(req, res) {
  // Process the uploaded files here
  // Assuming db.saveFileInformation expects an array of file data
  let fileData = [];
  for (let key in req.files) {
    fileData.push(...req.files[key].map(file => ({
      url_buku_akun_bank: file.filename,
      url_npwp: file.filename,
      url_pkp: file.filename,
      url_ktp_direktur: file.filename,
      url_akta_perubahan: file.filename,
      url_akta_pendirian: file.filename,
      url_nibrba: file.filename,
      url_dokumen_ijin_lain: file.filename,
      url_profile_perusahaan: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    })));
  }

  db.saveFileInformation(fileData)
    .then(() => {
      res.redirect('/dashboard-vendor'); 
      console.log('File information saved successfully');
      res.send('Files uploaded and saved successfully!');
    })
    .catch(error => {
      console.error('Error saving file information:', error);
      res.status(500).send('Failed to save file information');
    });
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
      const bids = await getBids(); // Fetch bids data
      res.render('list-bidding-vendor', { bids: bids });
    } catch (error) {
      res.status(500).send('Error fetching bids data');
    }
});


router.get('/form-bidding-vendor', function(req, res) {
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('id-ID', options);

  res.render('form-bidding-vendor', {
    title: "Form Bidding Vendor",
    currdate: formattedDate
  });
});

router.post('/form-bidding-vendor', async function(req, res) {
  const { duration, bidAmount, vendor_id, bt_id } = req.body;  // Ensure vendor_id and bt_id are provided in the form or derived from session/context

  try {
      await db.addDetail_Bidding_Tender({
          pengajuan_harga: bidAmount,
          durasi_pekerjaan: duration,
          vendor_id: vendor_id,  // Assuming vendor_id is obtained correctly
          bt_id: bt_id           // Assuming bt_id is obtained correctly
      });

      res.redirect('/list-bidding-vendor'); // Redirect or send a success response
  } catch (error) {
      console.error('Error submitting bid:', error);
      res.status(500).send('An error occurred during the bidding process: ' + error.message);
  }
});

router.get('/list-tender-vendor', async (req, res) => {
  try {
    const tenders = await db.getBiddingTender(); // Fetch tenders data using a function from db.js
    res.render('list-tender-vendor', { tenders: tenders }); // Render a view and pass the tenders data
  } catch (error) {
    console.error('Error fetching tenders:', error);
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
      const vendors = await db.getVendors(); // Fetch vendors data using a function from db.js
      res.render('list-vendor-admin', { vendors: vendors });
  } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).send('Error fetching vendor data');
  }
});


router.get('/approval-vendor-admin', function(req, res) {
  res.render('approval-vendor-admin');
});

router.post('/approval-vendor-admin', async (req, res) => {
  const { vendorId, status } = req.body;
  try {
      await db.updateVendorStatus(vendorId, status); // Assuming db.updateVendorStatus updates the status
      res.redirect('/list-vendor-admin');
  } catch (error) {
      console.error('Failed to update vendor status:', error);
      res.status(500).send('Error updating vendor status');
  }
});

router.get('/buat-pengadaan', async function(req, res) {
  const option_Tipe_Pemilihan = await pengadaanController.option_Tipe_Pemilihan();
  const option_Jenis_Pengadaan = await pengadaanController.option_Jenis_Pengadaan();
  const option_Jenis_Vendor = await pengadaanController.option_Jenis_Vendor();
  res.render('buat-pengadaan', { option_Tipe_Pemilihan, option_Jenis_Pengadaan, option_Jenis_Vendor });
});

router.post('/buat-pengadaan', async function(req, res) {
  const { nama_pengadaan, nama_jenis_pengadaan, jenis_vendor, termin_pembayaran, nama_item, harga_item, jumlah_item } = req.body;
  try {
      // Assuming you have a function to insert data into the database
      await pengadaanController.addPengadaan(nama_pengadaan, nama_jenis_pengadaan, jenis_vendor, termin_pembayaran, nama_item, harga_item, jumlah_item);
      res.redirect('/daftar-pengadaan-admin'); // Redirect to the list page after successful insertion
  } catch (error) {
      console.error('Failed to add new pengadaan:', error);
      res.status(500).send('Error adding new pengadaan');
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
    res.render('informasi-pengadaan-previous', { pengadaan: result });
  } catch (error) {
      console.error('Error fetching procurement data:', error);
      res.status(500).send('Error fetching procurement data');
  }
});


router.get('/item-pengadaan-previous', function(req, res) {
  // Fetch the necessary items data
  const itemsData = [
      { itemNumber: '001', itemName: 'Item 1', quantity: 10, price: '100', discount: '5%', netAmount: '95' },
      { itemNumber: '002', itemName: 'Item 2', quantity: 20, price: '200', discount: '10%', netAmount: '180' }
  ];
  res.render('item-pengadaan-previous', { items: itemsData });
});

router.get('/validasi-pengadaan-admin', function(req, res) {
  res.render('validasi-pengadaan-admin');
});

router.post('/validasi-pengadaan-admin', async function(req, res) {
  const { terminPembayaran, alokasiPengadaan, rekomendasiVendor } = req.body;
  try {
      // Assuming you have a function to approve the procurement
      await procurement.approveProcurement({ terminPembayaran, alokasiPengadaan, rekomendasiVendor });
      res.redirect('/informasi-pengadaan-approved'); // Redirect to a success page or back to the list
  } catch (error) {
      console.error('Failed to approve procurement:', error);
      res.status(500).send('Error approving procurement');
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
router.get('/goods-received_vendor', (req, res) => {
  res.render('goods_received_vendor');
});

router.post('/goods-received_vendor', 
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
