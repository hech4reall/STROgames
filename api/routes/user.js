const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Offer = require('../models/offer')
const bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');
const isAuth = require('../middleware/passport');

router.post('/register', async (req, res) => {
    const {email, password} = req.body;

    try {
        const searchedUser = User.findOne({email: email})
        if(searchedUser){
            return res.send({error: "email exist"})
        }

        const salt = 10;
        const genSalt = await bcrypt.genSalt(salt);
        const hashed_password = await bcrypt.hash(password, genSalt);

        let newUser = new User({
            email: email,
            password: hashed_password
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
        const offer = await Offer.findById(id);
        offer.status = 'accepted';

        await offer.save();
        res.send('mrigl')
    } catch (error) {
        console.log(error)
    }
})


router.post('/reject/:id', async(req, res) => {
    try {
        const offer = await Offer.findById(id);
        offer.status = 'Rejected';

        await offer.save();
        res.send('mrigl')
    } catch (error) {
        
    }
})


module.exports = router;