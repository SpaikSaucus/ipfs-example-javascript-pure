async function getCID() {
    let contentType;
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'text/plain;');

    waitWindows(true);
    fetch(getIpfsPath(), myHeaders).then(function (response) {
        waitWindows(false);
        if (response.status >= 400 && response.status < 600) {
            throw new Error("Bad response from server");
        }

        contentType = response.headers.get("content-type");

        return response.arrayBuffer();
    }).then(function (buffer) {
        if (contentType.substring(0, 10) == "text/plain") {
            const decoder = new TextDecoder('utf-8');
            const text = decoder.decode(buffer);

            document.getElementById("responseCID").innerHTML = text;
            hideIFrame();
            hideImg();
        } else if (contentType.substring(0, 5) == "image") {
            document.getElementById("responseCID").innerHTML = "";
            hideIFrame();
            showImg();
            document.getElementById("imageCID").setAttribute("src", dataUriBase64(contentType, buffer));
        } else if (contentType.substring(0, 15) == "application/pdf") {
            document.getElementById("responseCID").innerHTML = "";
            hideImg();
            showIFrame();
            document.getElementById("pdfCID").setAttribute("src", dataUriBase64(contentType, buffer));
        } else {
            document.getElementById("responseCID").innerHTML = "";
            hideIFrame();
            hideImg();
            alert("format not support for view, try DOWNLOAD");
        }
    }).catch((error) => {
        console.log(error);
    });
}

async function downloadCID() {
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'text/plain;');

    waitWindows(true);
    fetch(getIpfsPath(), myHeaders).then(function (response) {
        waitWindows(false);
        if (response.status >= 400 && response.status < 600) {
            throw new Error("Bad response from server");
        }

        contentType = response.headers.get("content-type");

        return response.arrayBuffer();
    }).then(function (buffer) {
        download("ipfsFile", contentType, buffer);
    }).catch((error) => {
        console.log(error);
    });
}

async function uploadText() {
    let myText = document.getElementById("myText").value;
    if (myText.trim() == "") {
        let msj = "Text invalid, not empty";
        alert(msj);
        throw (msj);
    }

    let formData = new FormData();
    formData.append('file', myText);

    uploadContent(formData);
}

async function uploadFile() {
    let myFile = document.getElementById("myFile");
    if (myFile.files.length == 0) {
        let msj = "Select one file.";
        alert(msj);
        throw (msj);
    }
    let file = myFile.files[0];
    if (file.size >= 6000000) { // 6mb
        let msj = "file size up limit 6mb.";
        alert(msj);
        throw (msj);
    }

    let formData = new FormData();
    formData.append('file', file);

    uploadContent(formData);
}

async function uploadContent(content) {
    document.getElementById("hashCID").innerHTML = "";
    const ipfsPathAdd = "https://ipfs.infura.io:5001/api/v0/add";
    let myHeaders = new Headers();

    /* In case required config Authorization */
    // const projectId = '23jSp...XXX';
    // const projectSecret = '23...XXX';
    // const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
    // myHeaders.append('Authorization', auth);

    waitWindows(true);
    fetch(ipfsPathAdd, {
        method: "POST",
        headers: myHeaders,
        body: content
    }).then((response) => {
        waitWindows(false);
        if (response.status >= 400 && response.status < 600) {
            throw new Error("Bad response from server");
        }
        return response.json();
    }).then((json) => {
        hash = json['Hash'];
        document.getElementById("hashCID").innerHTML = "Hash: " + hash;
    }).catch((error) => {
        console.log(error);
        document.getElementById("hashCID").innerHTML = "Error: " + error;
    });
}

function download(filename, contentType, buffer) {
    let element = document.createElement('a');
    element.setAttribute('href', dataUriBase64(contentType, buffer));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
}

function getIpfsPath() {
    let ipfsCID = document.getElementById("cid").value;
    if (ipfsCID.trim() == "" || ipfsCID.trim().length != 46) {
        let msj = "CID invalid, not empty and not large 46 character";
        alert(msj);
        throw (msj);
    }

    return "https://ipfs.io/ipfs/" + ipfsCID;
}

function dataUriBase64(contentType, buffer) {
    var prefix = "data:" + contentType + ";base64,";
    var file = arrayBufferToBase64(buffer);
    return prefix + file;
}

function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function hideImg() {
    document.getElementById("imageCID").style.visibility = "hidden";
    document.getElementById("imageCID").style.height = "0px";
    document.getElementById("imageCID").style.width = "0px";
}

function hideIFrame() {
    document.getElementById("pdfCID").style.visibility = "hidden";
    document.getElementById("pdfCID").style.height = "0px";
    document.getElementById("pdfCID").style.width = "0px";
}

function showImg() {
    document.getElementById("imageCID").style.visibility = "visible";
    document.getElementById("imageCID").style.height = "200px";
    document.getElementById("imageCID").style.width = "200px";
}

function showIFrame() {
    document.getElementById("pdfCID").style.visibility = "visible";
    document.getElementById("pdfCID").style.height = "100%";
    document.getElementById("pdfCID").style.width = "100%";
}

function waitWindows(active) {
    if(active){
        document.getElementById("waitWindows").style.visibility = "visible";
    } else {
        document.getElementById("waitWindows").style.visibility = "hidden";
    }
}