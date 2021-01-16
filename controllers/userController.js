import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => 
    res.render("join", { pageTitle: "Join"});


export const postJoin = async (req, res, next) => {
    const {
        body: {name, email, password, password2}
    } = req;
    console.log(`console logging req.body from postJoin: ${name}`);
    if(password !== password2){
        res.status(400);
        res.render("join", { pageTitle: "Join"});
    } else {
        try{
            const user = await User({
                name,
                email
            });
            await User.register(user, password);
            next();
        } catch(error){
            console.log(error);
            res.redirect(routes.join);
        }
    }
};

export const getLogin = (req, res) => 
    res.render("login", { pageTitle: "Log In" });

export const postLogin = passport.authenticate("local", {
    failureRedirect: routes.login,
    successRedirect: routes.home
});

export const githubLogin = passport.authenticate("github");

export const githubLoginCallback = async (_, __, profile, cb) => {
    const {
        _json: { id, avatar_url: avatarUrl, name, email }
    } = profile;
    try {
        const user = await User.findOne({email});
        if(user){
            user.githubId = id;
            user.avatarUrl = avatarUrl;
            user.name = name;
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl
        });
        return cb(null, newUser);
        
    } catch(error) {
        return cb(error);
    }
};

export const postGithubLogIn = (req, res) => {
    res.redirect(routes.home);
};

export const logout = (req, res) => {
    req.logout();
    res.redirect(routes.home);
};

export const getMe = (req, res) => {
    res.render("userDetail", { pageTitle: "User Detail", user: res.locals.loggedUser});
};

export const userDetail = (req, res) => {
    console.log(req.body);
    res.render("userDetail", { pageTitle: "User Detail" });
    // const user = req.user;
    // console.log(user.avatarUrl);
};


// export const userDetail = async (req, res) => {
//     const {
//         params: { id },
//     } = req;
//     try {
//         const user = await User.findById(id).populate("videos");
//         res.render("userDetail", { pageTitle: "User Detail", user });
//         console.log(`userDetail Console Logging: ${user.name}`);
//     } catch (error) {
//         res.redirect(routes.home);
//     }
// };


export const editProfile = (req, res) => 
    res.render("editProfile", { pageTitle: "Edit Profile"});
export const changePassword = (req, res) => 
    res.render("changePassword", { pageTitle: "Change Password"});