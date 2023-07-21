const express = require('express')
const{ServerConfig, Logger} = require('./config');
const apiRoutes = require('./routes')
const rateLimit = require('express-rate-limit');
const {createProxyMiddleware} = require('http-proxy-middleware');
const { FLIGHT_SERVICE_URL, BOOKING_SERVICE_URL } = require('./config/server-config');

const app = express();

const limiter = rateLimit({
    windowMs: 2*60*1000,
    max: 10, //Limit each IP to 10 requests per window
})


app.use(limiter);

app.get('/', (req, res)=>{
    return res.json({msg: "server is live"});
})


app.use('/api', apiRoutes);
app.use('/flightsService', createProxyMiddleware({
    target: FLIGHT_SERVICE_URL, 
    changeOrigin: true, 
    pathRewrite: {'^/flightsService' : '/'} }))
app.use('/bookingService', createProxyMiddleware({
    target: BOOKING_SERVICE_URL, 
    changeOrigin: true,
    pathRewrite: {'^/bookingService' : '/'} }))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(ServerConfig.PORT, ()=>{
    console.log(`Successfully started the port at ${ServerConfig.PORT}`);
    Logger.info('Successfully started server', {})
})