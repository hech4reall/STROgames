const User = require("../models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SCTY_KEY,
};
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ email: jwt_payload.email }).select("-password");
      
      user ? done(null, user) : done(null, false);
    } catch (error) {
      console.log(error);
    }
  })
);


module.exports = isAuth = () =>
  passport.authenticate("jwt", { session: false });