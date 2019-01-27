const webRTC = (socket) => {
    let videoSetting = true;
    let audioSetting = true;



    const localConn = new RTCPeerConnection();
    const remoteConn = new RTCPeerConnection();

    localConn.onicecandidate = e => {
        if (e.candidate) {
            remoteConn.addIceCandidate(e.candidate);
        }
    }

    remoteConn.onicecandidate = e => {
        if (e.candidate) {
            localConn.addIceCandidate(e.candidate);
        }
    }

    window.navigator.mediaDevices.getUserMedia({
            video: true
        })
        .then(stream => {
            document.getElementById('localVideo').srcObject = stream;
            localConn.addStream(stream);
            return localConn.createOffer();
        })
        .then(offer => {
            localConn.setLocalDescription(new RTCSessionDescription(offer))
        })
        .then(() => {
            remoteConn.setRemoteDescription(localConn.localDescription);
        })
        .then(() => remoteConn.createAnswer())
        .then(answer => remoteConn.setLocalDescription(new RTCSessionDescription(answer)))
        .then(() => localConn.setRemoteDescription(remoteConn.localDescription));

    // remoteConn.onaddstream(() => {
    //     console.log('ontrack');
    //     //document.getElementById('remoteVideo').srcObject = e.streams[0];
    // });
    const remoteVideo = document.getElementById('remoteVideo')
    
    remoteConn.addEventListener('track', e => gotRemoteStream(e));
    function gotRemoteStream(e) {
        if (remoteVideo.srcObject !== e.streams[0]) {
        remoteVideo.srcObject = e.streams[0];
        console.log('pc2 received remote stream');
        }
    }






    // Set the video & audio buttons
    const videoBtn = document.getElementById('camera');
    videoBtn.addEventListener('click', () => {
        const previous = videoSetting;
        videoSetting = !previous;
        console.log(videoSetting);
    });
    const audioBtn = document.getElementById('microphone');
    audioBtn.addEventListener('click', () => {
        const previous = audioSetting;
        audioSetting = !previous;
        console.log(audioSetting);
    });



};

export default webRTC;



// const getBrowserId = () => {
//     var aKeys = ["MSIE", "Firefox", "Safari", "Chrome", "Opera"],
//         sUsrAg = window.navigator.userAgent,
//         nIdx = aKeys.length - 1;

//     for (nIdx; nIdx > -1 && sUsrAg.indexOf(aKeys[nIdx]) === -1; nIdx--);

//     return aKeys[nIdx];
// }

// // Start the script
// const navigator = getBrowserId();