var express = require('express');
var router = express.Router();
var db = require("../database/db")

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'MPM - Smart Mobility',
    backgroundImage: 'login page.jpg',
    body: res.render('index')
  });
});

router.get('/register', function(req, res) {
  res.render('registration');
});

router.post('/register', function(req, res) {
  const { companyName, companyEmail, companyStatus, companyAddress, directorName, companyPhone } = req.body;
  // Process the data, save to database or perform other actions
  saveVendorInformation({
      companyName,
      companyEmail,
      companyStatus,
      companyAddress,
      directorName,
      companyPhone
  }).then(() => {
      res.redirect('/bank-info'); // Redirect to the bank info page
  }).catch(error => {
      console.error('Error saving vendor information:', error);
      res.status(500).send('An error occurred during registration.');
  });
});

router.get('/bank-info', function(req, res) {
  res.render('bank-info');
});

router.post('/bank-info', function(req, res) {
  const { accountNumber, accountName, bankName } = req.body;
  // Process the data, save to database or perform other actions
  // Redirect to the next step or handle errors
  res.redirect('/tax-info'); // Modify this to the correct next step URL
});

router.get('/tax-info', function(req, res) {
  res.render('tax-info');
});

router.post('/tax-info', function(req, res) {
  const { npwpNumber, pkpStatus } = req.body;
  // Process the data, save to database or perform other actions
  // Redirect to the next step or handle errors
  res.redirect('/legal-info'); // Modify with actual URL for the next step
});

router.get('/legal-info', function(req, res) {
  res.render('legal-info');
});


router.post('/legal-info', function(req, res) {
  const { nibNumber, ktpNumber } = req.body;
  const allData = {
      ...req.session.vendorData, // Ensure session data is correctly managed
      nibNumber,
      ktpNumber
  };
  saveAllVendorInformation(allData).then(() => {
      res.redirect('/registration-complete'); // Redirect to a confirmation page
  }).catch(error => {
      console.error('Error saving final vendor information:', error);
      res.status(500).send('An error occurred during registration.');
  });
});
module.exports = router;
