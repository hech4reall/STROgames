const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Offer = require('../models/offer')
const bcrypt = require('bcrypt');

const Destination = require('../models/destination')

var jwt = require('jsonwebtoken');
const isAuth = require('../middleware/passport');

router.post('/register', async (req, res) => {
    const {email, password, numero} = req.body;
    console.log("mrigl")
    try {
        const searchedUser = await User.findOne({email: email})
        if(searchedUser){
            return res.send({error: "email exist"})
        }

        const salt = 10;
        const genSalt = await bcrypt.genSalt(salt);
        const hashed_password = await bcrypt.hash(password, genSalt);

        let newUser = new User({
            email: email,
            password: hashed_password,
            numero
        });

        await newUser.save()


        const payload = {
			email: newUser.email
		}
		const token = await jwt.sign(payload, process.env.SCTY_KEY, {
			expiresIn: '7d'
		});
        
        res.send({ user: newUser, token: `bearer ${token}` })
    } catch (error) {
        console.log(error)
    }
});


router.post('/login', async (request, result) => {
    const { email, password } = request.body;
    try {
        const searchedUser = await User.findOne({ email });
        if (!searchedUser) {
            result.status(400).send({error: "User not found"});
            return;
        }

        const match = await bcrypt.compare(password, searchedUser.password);

        if (!match) {
            result.status(400).send({error: "Invalid credentials"});
            return;
        }       

		const payload = {
			email: searchedUser.email
		}
		const token = await jwt.sign(payload, process.env.SCTY_KEY, {
			expiresIn: '7d'
		});        
        result.status(200).send({ user: searchedUser, token: `bearer ${token}` });
    } catch (error) {
        console.error("Error during login:", error);
        result.status(500).send({error: "Login Failed"});
    }
});


router.get('/current', isAuth(), (request, result) => {    
    result.status(200).send({user: request.user});
});

router.get('/offer/:id', async(req, res) => {
    const userId = req.params.id;
    try {
        const offers = await Offer.find({userId: userId});
        res.send({offers})
    } catch (error) {
        console.log(error)
    }
})

router.post('/accept/:id', async(req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        offer.status = 'accepted';

        await offer.save();
        res.send('mrigl')
    } catch (error) {
        console.log(error)
    }
})


router.post('/reject/:id', async(req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        offer.status = 'rejected';

        await offer.save();
        res.send('mrigl')
    } catch (error) {
        console.log(error)
    }
})


router.get('/all', async(req, res) => {
    try {
        const users = await User.find();
        res.send(users)
    } catch (error) {
        console.log(error)
    }
})


router.patch('/:role/:id', async(req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, {role: req.params.role}, {new : true})
        res.send("done")        
    } catch (error) {
        console.log(error)
    }
});


router.delete('/:id', async(req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.send("done");
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;