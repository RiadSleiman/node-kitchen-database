const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './servicesUploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now()  + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //Accept File
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    //Reject File
    else{
        cb(null, false);
    }
   
};

const upload = multer({
    storage: storage,
     limits: {
        fileSize: 1024 * 1024 * 5 //Max size 5 Mb
    },
    fileFilter: fileFilter
});

const Service = require('../models/service');

router.get('/', (req, res, next) =>{
    Service.find()
    .select('_id image title description')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            services: docs.map(doc => {
                return{
                title: doc.title,
                description:doc.description,
                image: doc.image,
                _id:doc._id,
                }
            })
        }
            res.status(200).json(response);     
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

router.get('/:servicesId', (req, res, next) =>{
    const id = req.params.servicesId;
    Service.findById(id)
    .select('_id image title description')
    .exec()
    .then(doc =>{
        console.log(doc);
        if(doc){
            res.status(200).json(doc);
        } else{
            res.status(404).json({
                message: "No valid entry found for provided ID"
            });
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/',checkAuth, upload.single('image') ,(req, res, next) =>{
    console.log(req.file);
    const service = new Service({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        image: req.file.path
    });
    service
        .save()
        .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created service successfully',
            createdService:{
                title: result.title,
                description:result.description,
                image: result.image,
                _id:result._id,
            }
        });
    })
    .catch(err => err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
   
});

router.patch('/:serviceId', checkAuth, (req, res, next) =>{
    const id = req.params.serviceId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Service.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message:'Service updated',
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:serviceId', checkAuth, (req, res, next) =>{
    const id = req.params.serviceId;
    Service.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message:'Service deleted'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;