

const fileShare = (socket) => {
    const BYTES_PER_CHUNK = 1200;
    let file;
    let currentChunk;
    const fileInput = document.getElementById('fileInput');
    const fileReader = new FileReader();

    function readNextChunk() {
        const start = BYTES_PER_CHUNK * currentChunk;
        const end = Math.min(file.size, start + BYTES_PER_CHUNK);
        fileReader.readAsArrayBuffer(file.slice(start, end));
    }
    fileReader.onload = function () {
        socket.emit('file-send-room-result', fileReader.result);
        currentChunk++;
        if (BYTES_PER_CHUNK * currentChunk < file.size) {
            readNextChunk();
        }
    };
    fileInput.addEventListener('change', function () {
        console.log(fileInput.files);
        file = fileInput.files[0];
        currentChunk = 0;
        // send some metadata about our file
        // to the receiver
        socket.emit('file-send-room', JSON.stringify({
            fileName: file.name,
            fileSize: file.size
        }));
        readNextChunk();
    });
    let incomingFileInfo;
    let incomingFileData;
    let bytesReceived;
    let downloadInProgress = false;
    socket.on('file-out-room', function (data) {
        startDownload(data);
        console.log(data);
    });
    socket.on('file-out-room-result', function (data) {
        progressDownload(data);
        console.log(data);
    });

    function startDownload(data) {
        incomingFileInfo = JSON.parse(data.toString());
        incomingFileData = [];
        bytesReceived = 0;
        downloadInProgress = true;
        console.log('incoming file <b>' + incomingFileInfo.fileName + '</b> of ' + incomingFileInfo.fileSize + ' bytes');
    }

    function progressDownload(data) {
        bytesReceived += data.byteLength;
        incomingFileData.push(data);
        console.log('progress: ' + ((bytesReceived / incomingFileInfo.fileSize) * 100).toFixed(2) + '%');
        if (bytesReceived === incomingFileInfo.fileSize) {
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
        a.download = incomingFileInfo.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

export default fileShare;