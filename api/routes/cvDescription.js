const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const CvDescription = require('../models/cvDescription');

router.get('/', (req, res, next) =>{
    CvDescription.find()
    .select('_id description')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            cvDescription: docs.map(doc => {
                return{
                description: doc.description,
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

router.get('/:cvDescriptionId', (req, res, next) =>{
    const id = req.params.cvDescriptionId;
    CvDescription.findById(id)
    .select('_id description')
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
    const cvDescription = new CvDescription({
        _id: new mongoose.Types.ObjectId(),
        description: req.body.description,
    });
    cvDescription
        .save()
        .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created cvDescription successfully',
            createdCvDescription:{
                description: result.description,
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

router.patch('/:cvDescriptionId', checkAuth, (req, res, next) =>{
    const id = req.params.cvDescriptionId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    CvDescription.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message:'CvDescription updated',
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:cvDescriptionId', checkAuth, (req, res, next) =>{
    const id = req.params.cvDescriptionId;
    CvDescription.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message:'CvDescription deleted'
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