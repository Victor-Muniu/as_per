const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');

const StaffRouter = require('./routes/general/staffRoute')
const staffOffRouter = require('./routes/general/staffOffRoute')
const leaveApplicationRouter = require('./routes/general/leaveApplicationRoute')
const inventoryRouter = require('./routes/procurement/inventoryRoute')
const assetsRouter = require('./routes/procurement/assetsRouter')
const daily_collectionsRouter = require('./routes/accounts/daily_collectionsRoute')
const loginRouter = require('./routes/general/login')
const roomRouter = require('./routes/reservations/roomRouter')
const supplierRouter = require('./routes/accounts/supplierRoute')
const lpoRouter = require('./routes/procurement/lpoRouter')
const invoiceRouter = require('./routes/procurement/invoiceRouter')
const creditorsRouter = require('./routes/accounts/creditorsRouter')
const purchaseRouter = require('./routes/accounts/purchasesRouter')
const tableRouter = require('./routes/service/tableRoute')
const menuRouter = require('./routes/service/menuRouter')
const bar_menuRouter = require('./routes/service/bar_menuRouter')
const assign_tableRouter = require('./routes/service/assign_table')
const kotRouter = require('./routes/service/kotRouter')
const app = express();
app.use(express.json());
app.use(cors({
    origin: true,  
    credentials: true,                
}));
app.use(cookieParser()); 

mongoose.connect("mongodb+srv://Vic4971:pnlvmn4971@cluster2.jl5mf.mongodb.net/Epashikino")
    .then(() => console.log("Connected to MongoDB successfully."))
    .catch(error => console.error("Error connecting to MongoDB:", error));



app.use('', StaffRouter);
app.use('', staffOffRouter)
app.use('', leaveApplicationRouter)
app.use('', inventoryRouter)
app.use('', assetsRouter)
app.use('', daily_collectionsRouter)
app.use('', loginRouter)
app.use('', roomRouter)
app.use('', supplierRouter)
app.use('', lpoRouter)
app.use('', invoiceRouter)
app.use('', creditorsRouter)
app.use('', purchaseRouter)
app.use('', tableRouter)
app.use('', menuRouter)
app.use('', bar_menuRouter)
app.use('', assign_tableRouter)
app.use('', kotRouter)

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
