import fetch from 'node-fetch';
import parser from 'node-html-parser';
import express from 'express';
var router = express.Router();

router.get('/urls/preview', async (req, res) => {
    let pageText
    let url
    try {
        url = req.query.url
        let response = await fetch(url)
        pageText = await response.text()
    } catch (err) {
        console.log(err)
        res.send(err)
    }
    let htmlPage = parser.parse(pageText)
    
    // get url image, description.
    let ogUrl = htmlPage.querySelector('meta[property="og:url"]')
    let urlContent
    if (ogUrl) {
        urlContent = ogUrl.attributes.content
    } else {
        urlContent = url
    }

    //get title
    let ogTitle = htmlPage.querySelector('meta[property="og:title"]');
    let titleContent
    if (ogTitle) {
        titleContent = ogTitle.attributes.content
    } else {
        let titleTag = htmlPage.querySelector('title')
        if (titleTag) {
            titleContent = titleTag.textContent
        } else {
            titleContent = url
        }
    }

    //get image
    let ogImg = htmlPage.querySelector('meta[property="og:image"]');
    let imgSrc
    if (ogImg) {
        imgSrc = ogImg.attributes.content
    }

    //get description
    let ogDesc = htmlPage.querySelector('meta[property="og:description"]');
    let descContent
    if (ogDesc) {
        descContent = ogDesc.attributes.content
    }

    //get alternate locale
    let ogVideo = htmlPage.querySelector('meta[property="og:video"]');
    let videoContent
    if (ogVideo) {
        videoContent = ogVideo.attributes.content
        // let langs = ""
        // ogAlocale.forEach(lang => {
        //     langs += " " + String(lang)
        // });
        // langsContent= "Webpage is also available in these languages: " + langs
    }

    let responseHTML = `
        <div style='max-width: 300px; border: 1px; padding: 3px; text-align: center;'>
            <a href=${urlContent}>
                <p><strong>
                    ${titleContent}
                </strong></p>`
    if (imgSrc !== undefined) {
        responseHTML += `<img src=${imgSrc} style='max-height: 200px; max-width: 270px;'/>`
    }
    responseHTML += `</a>`
    if (descContent !== undefined) {
        responseHTML += `<p>${descContent}</p>`
    }
    if(videoContent !== undefined) {
        responseHTML += `<p>This is the link to the video: ${videoContent}</p>`
    }
    responseHTML += `</div>`

    res.type("html")
    res.send(responseHTML)
})

export default router;