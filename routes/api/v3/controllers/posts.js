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
                return {id: post._id, username: post.username, description: post.description, likes: post.likes, created_date: post.created_date, htmlPreview: responseHTML}
            }catch(err){
                console.log(err)
                res.status(500).json({"status": "error", "error": err})
                return;
            }
        })
    );
    res.json(postData)
    
})

router.post('/like', async (req, res) => {
    if(req.session.isAuthenticated){
        try{
            let post = await req.models.Post.find({_id: req.body.postID})
            post = post[0]
            console.log(post)
            if(!post.likes.includes(req.session.account.username)){
                post.likes.push(req.session.account.username)
                await post.save()
                res.json({"status": "success"})
            }
        } catch(err) {
            console.log(err)
            res.status(500).json({"status": "error", "error": err})
        }
    } else {
        res.status(401).json({"status": "error", "error": "You must be logged in to like a post"})
    }
})

router.post('/unlike', async (req, res) => {
    if(req.session.isAuthenticated){
        try{
            let post = await req.models.Post.find({_id: req.body.postID})
            post = post[0]
            if(post.likes.includes(req.session.account.username)){
                post.likes = post.likes.filter(username => username !== req.session.account.username)
                await post.save()
                res.json({"status": "success"})
            }
        } catch(err) {
            console.log(err)
            res.status(500).json({"status": "error", "error": err})
        }
    } else {
        res.status(401).json({"status": "error", "error": "You must be logged in to like a post"})
    }
})

router.delete('/', async (req, res) => {
    if(req.session.isAuthenticated){
        try{
            let post = await req.models.Post.find({_id: req.body.postID})
            post = post[0]
            if(post.username != req.session.account.username){
                res.status(401).json({"status": "error", "error": "You can only delete your own posts"})
            } else {
                await req.models.Comment.deleteMany({post: req.body.postID})
                await req.models.Post.deleteOne({_id: req.body.postID})
                res.json({"status": "success"})
            }
        }catch(err){
            console.log(err)
            res.status(500).json({"status": "error", "error": err})
        }
        
    } else {
        res.status(401).json({"status": "error", "error": "You must be logged in to delete a post"})
    }
})

export default router;