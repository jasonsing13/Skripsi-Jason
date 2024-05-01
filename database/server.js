const express = require("express");
const userroutes = require(`../src/user/routes`);
const vendorroutes = require(`../src/vendor/routes`);
const roleroutes = require(`../src/role/routes`);
const pengadaanroutes = require(`../src/pengadaan/routes`);
const statusroutes = require(`../src/status/routes`);
const tipe_pemilihanroutes = require(`../src/status/tipe_pemilihan/routes`);
const vendor_scoreroutes = require(`../src/status/vendor_score/routes`);
const template_vsroutes = require(`../src/status/template_vs/routes`);
const purchase_orderroutes = require(`../src/status/purchase_order/routes`);
const list_itemroutes = require(`../src/status/list_item/routes`);
const kriteriaroutes = require(`../src/kriteria/routes`);
const item_grroutes = require(`../src/item_gr/routes`);
const itemroutes = require(`../src/item/routes`);
const goods_receivedroutes = require(`../src/goods_received/routes`);
const detail_vsroutes = require(`../src/detail_vs/routes`);
const detail_template_vsroutes = require(`../src/detail_template_vs/routes`);
const detail_bidding_tenderroutes = require(`../src/detail_bidding_tender/routes`);
const bidding_tenderroutes = require(`../src/bidding_tender/routes`);



const app = express();
const port = 3000;

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("hello world");
});

// set routes
app.use('/user', userroutes);
app.use('/vendor', vendorroutes);
app.use('/role', roleroutes);
app.use('/pengadaan', pengadaanroutes);
app.use('/status', statusroutes);
app.use('/status', tipe_pemilihanroutes);
app.use('/vendor_score', vendor_scoreroutes);
app.use('/status', template_vsroutes);
app.use('/purchase_order', purchase_orderroutes);
app.use('/list_item', list_itemroutes);
app.use('/kriteria', kriteriaroutes);
app.use('/item_gr', item_grroutes);
app.use('/item', itemroutes);
app.use('/goods_received', goods_receivedroutes);
app.use('/item', detail_vsroutes);
app.use('/item', detail_template_vsroutes);
app.use('/item', detail_bidding_tenderroutes);
app.use('/item', bidding_tenderroutes);



app.listen(port, () => console.log(`app listen on ${port}`))