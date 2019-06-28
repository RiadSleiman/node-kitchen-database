const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const CvTitle = require('../models/cvTitle');

router.get('/', (req, res, next) =>{
    CvTitle.find()
    .select('_id image')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            cvTitle: docs.map(doc => {
                return{
                title: doc.title,
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

router.get('/:cvTitleId', (req, res, next) =>{
    const id = req.params.cvTitleId;
    CvTitle.findById(id)
    .select('_id title')
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

router.post('/',checkAuth ,(req, res, next) =>{
    console.log(req.file);
    const cvTitle = new CvTitle({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
    });
    cvTitle
        .save()
        .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created cvTitle successfully',
            createdCvTitle:{
                title: result.title,
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

router.patch('/:cvTitleId', checkAuth, (req, res, next) =>{
    const id = req.params.cvTitleId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    CvTitle.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message:'CvTitle updated',
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:cvTitleId', checkAuth, (req, res, next) =>{
    const id = req.params.cvTitleId;
    CvTitle.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message:'CvTitle deleted'
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