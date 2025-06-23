const express = require('express')
const router = express.Router();

const Destination = require('../models/destination')

router.get('/', async(req, res) => {
    try {
        const destinations = await Destination.find();
        res.send({destinations})
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:id', async(req,res) => {
    try {
        await Destination.findByIdAndDelete(req.params.id);
        res.send("done")
    } catch (error) {
        console.log(error)
    }
})

router.post('/', async(req, res) => {
    const { city } = req.body;
    try {
        const newCity = new Destination({
            city
        })

        await newCity.save()
        res.send(newCity)
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;