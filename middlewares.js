import routes from "./routes";
import multer from "multer";

export const multerVideo = multer({dest: "uploads/videos/" });

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "KiTube";
    res.locals.routes = routes;
    res.locals.user = {
        isAuthenticated: true,
        id: 1
    }
    next();
};

export const uploadVideo = multerVideo.single("videoFile");