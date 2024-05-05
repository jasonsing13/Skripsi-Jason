var express = require('express');
var router = express.Router();
var db = require("../database/db")
var { saveAllVendorInformation } = require("../database/db");
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'MPM - Smart Mobility'
    });  
});

/* GET registration page. */
router.get('/register', function(req, res) {
  res.render('registration', {
    title: 'Registrasi Vendor'
  });
});

/* POST registration page. */
router.post('/register', async function(req, res) {
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
  res.render('bank-info', {
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

router.get('/profil-informasi', function(req, res) {
  // Fetch vendor information from the database or session
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
  res.render('profil-informasi', { vendor: vendorInfo });
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
  res.render('approved-vendor-profile', { /* pass necessary data */ });
});

router.get('/approved-akun-bank', function(req, res) {
  res.render('approved-akun-bank', { /* pass necessary data */ });
});

router.get('/approved-perpajakan', function(req, res) {
  res.render('approved-perpajakan', { /* pass necessary data */ });
});

router.get('/approved-legalitas', function(req, res) {
  res.render('approved-legalitas', { /* pass necessary data */ });
});

module.exports = router;
