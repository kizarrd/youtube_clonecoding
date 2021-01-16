import passport from "passport";
import GithubStrategy from "passport-github";
import User from "./models/User";
import { githubLoginCallback } from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy());

passport.use(
    new GithubStrategy({
        clientID: process.env.GH_ID,
        clientSecret: process.env.GH_SECRET,
        callbackURL: `http://localhost:4000${routes.githubCallback}`
    },
        githubLoginCallback
        )
);

passport.serializeUser(function (User, done) {
    done(null, User.id);
});
    
passport.deserializeUser(function (User, done) {
    done(null, User);
});