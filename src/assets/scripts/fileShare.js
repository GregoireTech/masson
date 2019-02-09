//import React from 'react';
//import FileBox from '../../components/fileBox/fileBox';

const fileShare = (socket, onDownloadComplete) => {
    const BYTES_PER_CHUNK = 1200;
    let file;
    let currentChunk;
    const fileInput = document.getElementById('fileInput');
    const fileReader = new FileReader();
    const acceptedTypes = [
        'pdf', 'jpeg', 'jpg', 'svg', 'png', 'txt', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'
    ];
    const maxSize = 4000000; // Max size in bytes => 4 mb


    //////////////////////////////////////////////////////////
    ///////////     SEND                    /////////////////
    /////////////////////////////////////////////////////////
    function readNextChunk() {
        const start = BYTES_PER_CHUNK * currentChunk;
        const end = Math.min(file.size, start + BYTES_PER_CHUNK);
        fileReader.readAsArrayBuffer(file.slice(start, end));
    }

    fileReader.onload = function () {
        socket.emit('fileSendResult', fileReader.result);
        currentChunk++;
        if (BYTES_PER_CHUNK * currentChunk < file.size) {
            readNextChunk();
        }
    };

    //fn to validate file type and size
    const validateFile = (file) => {
        let valid;
        const split = file.name.split('.');
        const extension = split[split.length-1];
        console.log(extension);
        if (acceptedTypes.includes(extension)) {
            if (file.size <= maxSize) {
                valid = true;
            } else {
                valid = `Fichier trop volumineux. Taille maximale acceptée: ${maxSize/1000000}Mb`;
            }
        } else {
            let acceptString = '';
            for (let i = 0; i < acceptedTypes.length; i++) {
                acceptString += ` .${acceptedTypes[i]}`
            }
            valid = `Type de fichier non accepté. Les types acceptés sont :${acceptString}.`
        }
        return valid;
    }

    // On file input, we send info to the peer and await confirmation
    fileInput.addEventListener('change', function () {
        console.log(fileInput.files);
        file = fileInput.files[0];
        const valid = validateFile(file);
        if (valid === true) {
            alert('Fichier envoyé')
            currentChunk = 0;
            // send some metadata about our file
            // to the receiver
            socket.emit('fileTransferRequest', JSON.stringify({
                name: file.name,
                size: file.size
            }));
        } else {
            alert(valid);
        }
    });
    // On confirmation that the peer accepts the file, we start the transfer
    socket.on('fileTransferAccepted', () => {
        socket.emit('fileSendStart', JSON.stringify({
            name: file.name,
            size: file.size
        }));
        readNextChunk();
    });





    //////////////////////////////////////////////////////////
    ///////////     SEND                    /////////////////
    /////////////////////////////////////////////////////////
    let incomingFileInfo;
    let incomingFileData;
    let bytesReceived;

    function startDownload(data) {
        incomingFileInfo = JSON.parse(data.toString());
        console.log(incomingFileInfo);
        incomingFileData = [];
        bytesReceived = 0;
        console.log('incoming file <b>' + incomingFileInfo.name + '</b> of ' + incomingFileInfo.size + ' bytes');
    }

    function progressDownload(data) {
        bytesReceived += data.byteLength;
        incomingFileData.push(data);
        console.log('progress: ' + ((bytesReceived / incomingFileInfo.size) * 100).toFixed(2) + '%');
        if (bytesReceived === incomingFileInfo.size) {
            endDownload();
        }
    }

    function endDownload() {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = new Blob(incomingFileData);
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = incomingFileInfo.name;
        a.click();
        window.URL.revokeObjectURL(url);
        onDownloadComplete();
    }

    socket.on('fileSendStart', function (data) {
        startDownload(data);
        console.log(data);
    });

    socket.on('fileSendResult', function (data) {
        progressDownload(data);
        console.log(data);
    });
}

export default fileShare;

