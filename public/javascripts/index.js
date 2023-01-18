
async function previewUrl(){
    let url = document.getElementById("urlInput").value;
    
    await fetch("api/v1/urls/preview?url=" + url)
        .then(res => res.text())
        .then(preview => displayPreviews(preview))
        .catch(err => displayPreviews(err))
    
    
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
