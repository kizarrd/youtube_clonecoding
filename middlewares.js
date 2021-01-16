import multer from "multer";
import routes from "./routes";
import User from "./models/User";

export const multerVideo = multer({ dest: "uploads/videos/" });

// export const localsMiddleware = async (req, res, next) => {
//     res.locals.siteName = "KiTube";
//     res.locals.routes = routes;
//     // res.locals.loggedUser = req.user || null;
//     res.locals.loggedUser = await User.findById(req.user) || null;
//     console.log(`console logging req.body from localsMiddleware: ${req.body}`);
//     console.log(`localsMiddleware console logging: ${res.locals.loggedUser}`);
//     next();
// };

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "KiTube";
    res.locals.routes = routes;
    res.locals.loggedUser = req.user || null;
    // res.locals.loggedUser = await User.findById(req.user) || null;
    // console.log(`console logging req.body from localsMiddleware: ${req.body}`);
    // console.log(`localsMiddleware console logging: ${res.locals.loggedUser}`);
    next();
};

export const onlyPublic = (req, res, next) => {
    if(req.user){
        res.redirect(routes.home);
    } else {
        next();
    }
};

export const onlyPrivate = (req, res, next) => {
    if(req.user){
        next();
    } else {
        res.redirect(routes.home);
    }
};

export const uploadVideo = multerVideo.single("videoFile");