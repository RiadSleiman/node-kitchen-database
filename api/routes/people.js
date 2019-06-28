const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './peopleUploads/');
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

const People = require('../models/people');

router.get('/', (req, res, next) =>{
    People.find()
    .select('_id image name')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            people: docs.map(doc => {
                return{
                name: doc.name,
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

router.get('/:peopleId', (req, res, next) =>{
    const id = req.params.peopleId;
    People.findById(id)
    .select('_id image name')
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
    const people = new People({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        image: req.file.path
    });
    people
        .save()
        .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created people successfully',
            createdPeople:{
                name: result.name,
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

router.patch('/:peopleId', checkAuth, (req, res, next) =>{
    const id = req.params.peopleId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    People.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message:'People updated',
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:peopleId', checkAuth, (req, res, next) =>{
    const id = req.params.peopleId;
    People.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message:'People deleted'
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