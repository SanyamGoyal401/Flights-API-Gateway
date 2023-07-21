const express = require('express')
const{ServerConfig, Logger} = require('./config');
const apiRoutes = require('./routes')
const rateLimit = require('express-rate-limit');
const app = express();

const limiter = rateLimit({
    windowMs: 2*60*1000,
    max: 3, //Limit each IP to 2 requests per window
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(limiter);


app.get('/', (req, res)=>{
    return res.json({msg: "server is live"});
})


app.use('/api', apiRoutes);


app.listen(ServerConfig.PORT, ()=>{
    console.log(`Successfully started the port at ${ServerConfig.PORT}`);
    Logger.info('Successfully started server', {})
})