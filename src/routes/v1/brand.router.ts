import express from 'express';

const router = express.Router();
// const authenticateJwt = require("../../config/passport_auth");

const brandCtrl = require('../controller/brand.controller')();

// single brand
router.get('/brand/:id' /*authenticateJwt*/, brandCtrl.GetBrand);
// All brands
router.get('/brands', brandCtrl.GetBrands);
// create brand
router.post('/brand' /*authenticateJwt*/, brandCtrl.CreateBrand);
// Update brand
router.patch('/brand/:id' /*authenticateJwt*/, brandCtrl.UpdateBrand);
// Delete brand
router.delete('/brand/:id' /*authenticateJwt*/, brandCtrl.DeleteBrand);

export = router;
