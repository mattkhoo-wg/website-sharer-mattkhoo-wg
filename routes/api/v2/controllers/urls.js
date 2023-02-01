import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.get('/preview', async(req, res) => {
    let responseHTML = await getURLPreview(req.query.url)

    res.type('html')
    res.send(responseHTML)
})

export default router;