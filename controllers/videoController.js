import routes from "../routes"
import Video from "../models/Video"

export const home = async (req, res) => {
    try{
        const videos = await Video.find({}).sort({_id: -1});
        res.render("home", { pageTitle: "Home", videos});
    } catch(error){
        console.log(error);
        res.render("home", { pageTitle: "Home", videos: [] });
    }
}
    
export const search = async (req, res) => {
    const {
        query: {term: searchingBy}
    } = req; 
    // this line equals const searchingBy = request.query.term;

    let videos = [];

    try{
        videos = await Video.find({
            title: { $regex: searchingBy, $options: "i" }
        });
    }catch(error){
        console.log(error);
    }
    res.render("search", { pageTitle: "Search", searchingBy: searchingBy, videos });
}
export const getUpload = (req,res) => 
    res.render("upload", { pageTitle: "Upload"});

export const postUpload = async(req, res) => {
    const { 
        body: { title, description },
        file: { path }
    }= req;
    const newVideo = await Video.create({
        fileUrl: path,
        title,
        description,
        creator: req.user
    });
    res.locals.loggedUser.videos.push(newVideo.id);
    res.locals.loggedUser.save();
    res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req,res) => {
    const {
        params: { id }
    } = req;
    try{
        const video = await Video.findById(id).populate("creator");
        res.render("videoDetail", {pageTitle: video.title, video /* same as doing "video: video" */ }); 
    } catch(error){
        res.redirect(routes.home);
    }
};

export const getEditVideo = async (req,res) => {
    const {
        params: { id }
    }=req;
    try{
        const video = await Video.findById(id);
        if(video.creator != req.user){
            throw Error();
        } else {
            res.render("editVideo", { pageTitle: `Edit ${video.title}`, video});
        }
    } catch(error) {
        res.redirect(routes.home);
    }
};

export const postEditVideo = async (req, res) => {
    const {
        params: { id },
        body: { title, description }
    }=req;
    try{
        await Video.findOneAndUpdate({ _id: id }, { title, description});
        res.redirect(routes.videoDetail(id));
    }catch(error){
        res.redirect(routes.home);
    }
};

export const deleteVideo = async (req,res) => {
    const {
        params: { id }
    }=req;
    try{
        const video = await Video.findById(id);
        if(video.creator != req.user){
            throw Error();
        } else {
            await Video.findOneAndRemove({_id: id});
        }
    } catch(error) { 
        console.log(error);
    }
    res.redirect(routes.home);
};
