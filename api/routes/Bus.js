const express = require('express')
const router = express.Router();

const BusBooking = require('../models/bus');
const User = require('../models/user');
const Offer = require('../models/offer');

router.post('/', async(req, res) => {
    try {
    const {
        userId,
        nomComplet,
        email,
        telephone,
        destination,
        typeDuBus,
        dateDepart,
        dateRetour,
        nbPlaces
    } = req.body;

    const newBooking = new BusBooking({
        userId,
        nomComplet,
        email,
        telephone,
        destination,
        typeDuBus,
        dateDepart,
        dateRetour,
        nbPlaces
    });

    await newBooking.save();
    res.send("c bon");
    } catch (error) {
        console.log(error);
    }
});


router.get('/', async(req, res) => {
    try {
        const booking = await BusBooking.find();
        res.send({booking})
    } catch (error) {
        console.log(error)
    }
})
router.patch('/approve/:prix/:id', async(req, res) => {
    const id = req.params.id;
    const prix = req.params.prix;
    try {
        const booked = await BusBooking.findById(id);
        const bookedUser = await User.findById(booked.userId);
    
        const newOffer = new Offer({
            userId: bookedUser._id,
            prix: prix,
            bookingId: id
        });
        await newOffer.save();
    
        await BusBooking.findByIdAndDelete(id);
        
        res.send("Approved and converted to offer");
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  });

router.patch('/reject/:id', async(req, res) => {
    const id = req.params.id;
    try {
        const booked = await BusBooking.findByIdAndUpdate(id, {status: 'rejected'}, {new: true});
        const bookedUser = await User.findById(booked.userId);

        booked.status = "rejected";
        await booked.save();
        const newOffer = new Offer({
            userId: bookedUser._id,
            status: 'Rejected'
        })

        newOffer.save();
        res.send("mrigl")
    } catch (error) {
        console.log(error)
    }
});

router.get('/offers', async(req, res) => {
    try {
      const offers = await Offer.find()
        .populate('userId', 'email')
        .exec();
        
      res.send(offers);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  });

router.delete('/offer/:id', async(req, res) => {
    try {
        const offers = await Offer.findOneAndDelete(req.params.id);
        res.send(offers);
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:id', async(req, res) => {
    const id = req.params.id;
    try {
        await BusBooking.findByIdAndDelete(id);
        res.send("mrigl")
    } catch (error) {
        console.log(error)
    }
});


module.exports = router; 