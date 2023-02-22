import express from 'express';

var router = express.Router();

//Find all comments that have the Post with the id referenced in the query parameter "postID"
//Return as json an array of all the comments with their fields
router.get('/', async (req, res) => {
    try{
        let comments = await req.models.Comment.find({post: req.query.postID})
        res.json(comments)
    }catch(err){
        console.log(err)
        res.status(500).json({"status": "error", "error": err})
    }
})

router.post('/', async (req, res) => {
    if(req.session.isAuthenticated){
        try{
            let comment = new req.models.Comment({
                username: req.session.account.username,
                comment: req.body.newComment,
                post: req.body.postID,
                created_date: new Date()
            })
            await comment.save()
            res.json({"status": "success"})
        }catch(err){
            console.log(err)
            res.status(500).json({"status": "error", "error": err})
        }
    } else {
        res.status(401).json({"status": "error", "error": "You must be logged in to comment on a post"})
    }
})
export default router;