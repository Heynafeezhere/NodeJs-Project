require('dotenv').config();
require('express-async-errors');

//Express
const express = require('express');
const app = express();

//rest of packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

//database 
const connectDB = require('./db/connect');

//Router
const authRouter = require('./Routes/authRoute'); 
const userRouter = require('./Routes/userRoute'); 
const productRouter = require('./Routes/productRoute'); 
const reviewRouter = require('./Routes/reviewRoutes'); 
const orderRouter = require('./Routes/orderRoute'); 

//Error Middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload());



app.get('/',(req,res)=>{
    res.send('HEllo')
})

app.get('/api/v1',(req,res)=>{
    console.log(req.signedCookies);
    res.send('TESTING')
})


app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/products',productRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/orders',orderRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//Port
const port = process.env.PORT || 5000

const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port,console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
}



start()
