import passport from "passport";
// import pkg from "passport-google-oauth20"; // Import the package
// const { OAuth2Strategy: GoogleStrategy } = pkg; // Extract OAuth2Strategy from the package
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

// Google OAuth strategy configuration
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8010/api/auth/google/callback",
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Check if the user exists based on their Google email
				let user = await UserModel.findOne({ email: profile.emails[0].value });

				// If user does not exist, create a new user
				if (!user) {
					user = new UserModel({
						name: profile.displayName,
						email: profile.emails[0].value,
						password: "", // No password needed for Google login
					});

					await user.save();
				}

				// Proceed to the next step with the user data
				return done(null, user);
			} catch (err) {
				return done(err, null);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	UserModel.findById(id, (err, user) => {
		done(err, user);
	});
});
