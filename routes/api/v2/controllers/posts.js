import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.post('/', async(req, res) => {
    try{
        const newPost = new req.models.Post({
            username: req.body.name,
            url: req.body.url,
            description: req.body.description,
            created_date: new Date()
        })
        
        await newPost.save()
        res.json({"status": "success"})
    }catch(err){
        console.log(err)
        res.status(500).json({"status": "error", "error": err})
    }
    
})

router.get('/', async (req, res) => {
    let allPosts = await req.models.Post.find()
    let postData = await Promise.all(
        allPosts.map(async post => { 
            try{
                let responseHTML = await getURLPreview(post.url)
                //let responseHTML = await response.text()
                return {name:post.username, description: post.description, htmlPreview: responseHTML}
            }catch(err){
                console.log(err)
                res.status(500).json({"status": "error", "error": err})
                return;
            }
        })
    );
    res.json(postData)
    
})

export default router;