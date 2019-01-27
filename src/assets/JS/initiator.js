export const initiator = (socket) => {
    let localConn = {};
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');

    function gotRemoteStream(e) {
        if (remoteVideo.srcObject !== e.streams[0]) {
            remoteVideo.srcObject = e.streams[0];
            console.log('initiator got remote stream');
        }
    };

    window.navigator.getUserMedia({
        audio: true,
        video: true
    }, function (localStream) {
        localConn = new RTCPeerConnection ();
        localConn.addStream(localStream);
    
        localVideo.srcObject = localStream;
        // display remote's screensharing
        localConn.addEventListener('track', gotRemoteStream );
        
        localConn.onicecandidate = function (evt) {
            if (evt.candidate) {
    
                var lightCandidate = {
                    sdpMid: evt.candidate.sdpMid,
                    sdpMLineIndex: evt.candidate.sdpMLineIndex,
                    candidate: evt.candidate.candidate
                }
    
                // send ice local's iceCandidate to remote
                console.log('sent ice candidate')
                socket.emit('CANDIDATE_WEB_RTC_INIT', {
                    "candidate": lightCandidate
                });
            }
        };
    
        localConn.createOffer(function (desc) {
            // desc is typeof RTCSessionDescription wich contains local's session
            localConn.setLocalDescription(desc);
    
            // send desc to remote
            console.log('send desc');
            socket.emit('ASK_WEB_RTC', JSON.stringify(desc));
    
        }, function (err) {
            console.error(err);
        }, {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        });
    
    }, function (e) {
        console.error("You are not allow navigator use device", e);
    });




    socket.on('CANDIDATE_WEB_RTC_REC', function (candidate) {
        // var candidate = JSON.parse(candidate);

        console.log('got candidate');
        localConn.addIceCandidate(new RTCIceCandidate(candidate.candidate),
            function () {
                console.log('AddIceCandidate success!');
            },
            function (err) {
                console.error('Error AddIceCandidate');
                console.error(err);
            }
        );
    });

    socket.on('RESPONSE_WEB_RTC', function (remoteDesc) {
        console.log('got response');
        localConn.setRemoteDescription(new RTCSessionDescription(remoteDesc));
        
    });

    document.getElementById('visioBtn').addEventListener('click', () => {
        if (localConn) {
            localConn.close();
        }
        localConn = {};
    });

};


    











