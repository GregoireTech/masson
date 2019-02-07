//import React from 'react';
//import FileBox from '../../components/fileBox/fileBox';

const fileShare = (socket, onDownloadComplete) => {
    const BYTES_PER_CHUNK = 1200;
    let file;
    let currentChunk;
    const fileInput = document.getElementById('fileInput');
    const fileReader = new FileReader();


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
    // On file input, we send info to the peer and await confirmation
    fileInput.addEventListener('change', function () {
        console.log(fileInput.files);
        file = fileInput.files[0];
        currentChunk = 0;
        // send some metadata about our file
        // to the receiver
        socket.emit('fileTransferRequest', JSON.stringify({
            name: file.name,
            size: file.size
        }));
        
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
    let downloadInProgress = false;

    function startDownload(data) {
        incomingFileInfo = JSON.parse(data.toString());
        console.log(incomingFileInfo);
        incomingFileData = [];
        bytesReceived = 0;
        downloadInProgress = true;
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
        downloadInProgress = false;
        //const blob = new Blob(incomingFileData);

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


  /*  const createFileElem = (data) => {
        const filesContainer = document.getElementById('container');
        const fileElem = (
            <FileBox 
                name={data.name} 
                size={data.size} 
                onAccept={onFileDownload}
                downloading={downloadInProgress}
                progress = {downloadProgress}
            />
        );
        filesContainer.appendChild(fileElem);
    }

    // 
    const createFilesContainer = data => {
        const filesContainer = document.createElement('div');
        filesContainer.id = 'filesContainer';
        document.getElementById('boardContainer').appendChild(filesContainer);
        createFileElem(data);
    }

    // Once the user clicks on accept
    const onFileDownload = (data) => {
        socket.emit('fileTranferAccepted');
        startDownload(data);
        console.log(data);
    } */
