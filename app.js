const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// Imported Routes
const userRoutes =          require('./api/routes/user');
const carouselRoutes =      require('./api/routes/carousel');
const servicesRoutes =      require('./api/routes/services');
const placesRoutes =        require('./api/routes/places');
const cateringRoutes =      require('./api/routes/catering');
const eventRoutes =         require('./api/routes/events');
const peopleRoutes =        require('./api/routes/people');
const contactRoutes =       require('./api/routes/contact');
const cvTitlesRoutes =      require('./api/routes/cvTitles');
const cvDescriptionRoutes = require('./api/routes/cvDescription');

mongoose.connect('mongodb+srv://RiadSleiman:'
                  + process.env.MONGO_ATLAS_PW +
                      '@node-rest-shop-yyuno.mongodb.net/test?retryWrites=true&w=majority')
                      {
                        useMongoClient: true
                      }
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

// Add routes to handle
app.use('/user',            userRoutes);
app.use('/carousel',        carouselRoutes);
app.use('/services',        servicesRoutes);
app.use('/places',          placesRoutes);
app.use('/catering',        cateringRoutes);
app.use('/events',          eventRoutes);
app.use('/consultedPeople', peopleRoutes);
app.use('/contact',         contactRoutes);
app.use('/cvTitle',         cvTitlesRoutes);
app.use('/cvDescription',    cvDescriptionRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
      error:{
        message: error.message
      }
    })
});

module.exports = app;