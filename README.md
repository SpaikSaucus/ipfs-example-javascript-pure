<h3 align="center">Example of IPFS integration in pure JavaScript</h3>

<p align="center">
  <img src="https://img.shields.io/github/stars/SpaikSaucus/ipfs-example-javascript-pure.svg" />
  <img src="https://img.shields.io/github/forks/SpaikSaucus/ipfs-example-javascript-pure.svg" />
  <img src="https://img.shields.io/github/issues/SpaikSaucus/ipfs-example-javascript-pure.svg" />      
</p>

## Table of Contents

- [Getting started](#getting-started)
- [Snippets](#snippets)
  - [Get IPFS](#get-ipfs)
  - [Upload IPFS (infura node)](#upload-ipfs)
- [License](#license)

## Getting Started

* Download
* Open file src/index.html in browser and enjoy!
* Recomendations:
    * Head over to https://proto.school to take the [IPFS course](https://proto.school/course/ipfs) that covers core IPFS concepts.
    * Check out https://docs.ipfs.io for [glossary](https://docs.ipfs.io/concepts/glossary), tips, how-tos and more
    * See https://blog.ipfs.io for news and more

## Snippets
### Get IPFS

```javascript
    let contentType;
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'text/plain;');

    cid = 'Qmc5gCcjYypU7y28oCALwfSvxCBskLuPKWpK4qpterKC7z';

    fetch('https://ipfs.io/ipfs/'+ cid, myHeaders).then(function (response) {
        contentType = response.headers.get("content-type");
        return response.arrayBuffer();
    }).then(function (buffer) {
        if (contentType.substring(0, 10) == "text/plain") {
            //view index.js for more details
            ...
    }).catch((error) => {
        console.log(error);
    });
```

### Upload IPFS

```javascript
    let formData = new FormData();
    formData.append('file', content);

    fetch('https://ipfs.infura.io:5001/api/v0/add', {
        method: "POST",
        body: content
    }).then((response) => {
        return response.json();
    }).then((json) => {
        hash = json['Hash'];
        console.log("Hash: " + hash);
        //Hash: Qmc5gCcjYypU7y28oCALwfSvxCBskLuPKWpK4qpterKC7z
    }).catch((error) => {
        console.log(error);
    });
```

## License

Is licensed under [The MIT License](LICENSE.md).