require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { 
    GOOGLE_CLIENT_ID, 
    GOOGLE_CLIENT_SECRET, 
    GOOGLE_CALLBACK_URL,
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    FACEBOOK_CALLBACK_URL,
} = require('./');
const { User, Profile } = require('../models/');
const sendMail = require('../utils/sendMail');

const googleConfig = {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'email', 'photos'],
};

const facebookConfig = {
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'photos', 'email'],
};

passport.use(
    new GoogleStrategy(
        googleConfig,
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { id, displayName, emails, photos } = profile,
                    nameToArray = displayName.split(" "),
                    lastName = nameToArray[0],
                    firstName = nameToArray[1],
                    email = emails[0].value,
                    image = photos[0].value,
                    isVerified = emails[0].verified;

                const currentUser = await User.findOne({
                    $or: [
                        { googleId: id },
                        { email },
                    ],
                });
                if (currentUser) {
                    if (currentUser.googleId == undefined) {
                        currentUser.googleId = id;
                        await currentUser.save();
                    }
                    return done(null, currentUser);
                } else {
                    const newUser = await new User({ 
                        email, googleId: id, firstName, lastName,  role: 'USER', userType: 'entrepreneur', isVerified,  
                    }).save();
                    if (process.env.NODE_ENV !== 'test') {
                        sendMail(
                            'no-reply@product-investo.com',
                            email, 
                            'Product-Investo Registration',
                            `
                                <h2 style="display: flex; align-items: center;">Welcome to Product-Investo</h2>
                                <p>Hello ${lastName} ${firstName}, </p>
                                <p>Thank you for using this platform. <br> With Product-Investo, you can connect and relate with multiple investors.</p>
                                <br>
                                <br>
                                <p>Best Regards, <b><span style="color: red;">Product-Investo</span></b>Team</p>
                            `
                        );
                    }
                    await new Profile({ userId: newUser._id, image, lastName, firstName }).save();
                    return done(null, newUser);
                }
            } catch (error) {
                console.log(error);
                done(error, false, error.message);
            }
        }
    )
);

passport.use(
    new FacebookStrategy(
        facebookConfig,
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { id, displayName, emails, photos } = profile,
                    nameToArray = displayName.split(" "),
                    lastName = nameToArray[0],
                    firstName = nameToArray[1],
                    email = emails[0].value,
                    image = photos[0].value;

                const currentUser = await User.findOne({
                    $or: [
                        { facebookId: id },
                        { email },
                    ],
                });
                if (currentUser) {
                    if (currentUser.facebookId == undefined) {
                        currentUser.facebookId = id;
                        await currentUser.save();
                    }
                    return done(null, currentUser);
                } else {
                    const newUser = await new User({ 
                        email, facebookId: id, firstName, lastName,  role: 'USER', userType: 'entrepreneur', isVerified: true,  
                    }).save();
                    if (process.env.NODE_ENV !== 'test') {
                        sendMail(
                            'no-reply@product-investo.com',
                            email, 
                            'Product-Investo Registration',
                            `
                                <h2 style="display: flex; align-items: center;">Welcome to Product-Investo</h2>
                                <p>Hello ${lastName} ${firstName}, </p>
                                <p>Thank you for using this platform. <br> With Product-Investo, you can connect and relate with multiple investors.</p>
                                <br>
                                <br>
                                <p>Best Regards, <b><span style="color: red;">Product-Investo</span></b>Team</p>
                            `
                        );
                    }
                    await new Profile({ userId: newUser._id, image, lastName, firstName }).save();
                    return done(null, newUser);
                }
            } catch (error) {
                console.log(error);
                done(error, false, error.message);
            }
        }
    )
);
