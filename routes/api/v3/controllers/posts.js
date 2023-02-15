import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

const escapeHTML = str => !str ? str : str.replace(/[&<>'"]/g, 
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));

router.post('/', async(req, res) => {
    if(req.session.isAuthenticated){
        try{
            const newPost = new req.models.Post({
                username: req.session.account.username,
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
    } else {
        res.status(401).json({"status": "error", "error": "You must be logged in to create a post"})
    }
    
})

router.get('/', async (req, res) => {
    let allPosts
    if(req.query.username){
        allPosts = await req.models.Post.find({username: req.query.username})
    } else {
        allPosts = await req.models.Post.find()
    }
    let postData = await Promise.all(
        allPosts.map(async post => { 
            try{
                let responseHTML = await getURLPreview(escapeHTML(post.url))
                return {username:post.username, description: post.description, htmlPreview: responseHTML}
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