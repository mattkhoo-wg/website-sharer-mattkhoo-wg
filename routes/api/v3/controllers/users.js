import express from 'express';

var router = express.Router();

router.get('/myIdentity', (req, res) => {
    if(req.session.isAuthenticated){
        res.json({
            status: "loggedin",
            userInfo: {
                name: req.session.account.name,
                username: req.session.account.username
            }
        })
    } else {
        res.json({
            status: "loggedout"
        })
    }
})

router.post('/', async (req, res) => {
    if(req.session.isAuthenticated){
        try{
            let userInfo = await req.models.User.find({username: req.query.username})
            if(userInfo.length == 0){
                let newUser = new req.models.User({
                    username: req.session.account.username,
                    favColor: req.body.userInfo,
                })
                await newUser.save()
                res.json({"status": "success"})
            } else {
                let user = userInfo[0]
                user.favColor = req.body.userInfo
                await user.save()
                res.json({"status": "success"})
            }
        } catch(err) {
            console.log(err)
            res.status(500).json({"status": "error", "error": err})
        }
    } else {
        res.status(401).json({"status": "error", "error": "You must be logged in to save information"})
    }
});

router.get('/', async (req, res) => {
    if(req.session.isAuthenticated){
        try{
            let userInfo = await req.models.User.find({username: req.query.username})
            res.json(userInfo[0])
        } catch(err) {
            console.log(err)
            res.status(500).json({"status": "error", "error": err})
        }
    } else {
        res.status(401).json({"status": "error", "error": "You must be logged in to view saved information"})
    }
});

export default router;