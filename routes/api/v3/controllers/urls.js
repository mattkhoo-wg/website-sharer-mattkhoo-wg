import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

const escapeHTML = str => String(str).replace(/[&<>'"]/g, 
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));

router.get('/preview', async(req, res) => {
    let responseHTML = await getURLPreview(escapeHTML(req.query.url))

    res.type('html')
    res.send(responseHTML)
})

export default router;