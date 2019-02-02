import serversList from '../../config/servers';
const servers = [];

export const receiver = (socket) => {


    const remoteVideo = document.getElementById('remoteVideo');

    let remoteTempDesc = {};
    let remoteTempIceCandidates = [];

    let localConn = {};


    function gotDescription(localDesc) {
        localConn.setLocalDescription(localDesc,
            function () {
                // isAcceptedOffer = true;
                registerIceCandidate();
                // send desc to remote
                socket.emit('RESPONSE_WEB_RTC', localDesc);
            },
            function (err) {
                console.error(err);
            });
    }


    function registerIceCandidate() {
        for (var i = 0; i < remoteTempIceCandidates.length; i++) {
            localConn.addIceCandidate(
                new RTCIceCandidate(remoteTempIceCandidates[i]),
                function () {
                    console.log('AddIceCandidate success!');
                },
                function (err) {
                    console.error('Error AddIceCandidate');
                    console.error(err);
                });
        }
    }


    function sentIceCandidates(evt) {
        if (evt.candidate) {
            var lightCandidate = {
                sdpMid: evt.candidate.sdpMid,
                sdpMLineIndex: evt.candidate.sdpMLineIndex,
                candidate: evt.candidate.candidate
            }
            socket.emit('CANDIDATE_WEB_RTC_REC', {
                "candidate": lightCandidate
            });
        }
    };

    function gotRemoteStream(e) {
        if (remoteVideo.srcObject !== e.streams[0]) {
            remoteVideo.srcObject = e.streams[0];
            console.log('receiver got remote stream');
        }
    };

    function displayError(error) {
        console.error(error);
    }



    function acceptOffer() {
        localConn = new RTCPeerConnection(servers);
        const localVideo = document.getElementById('localVideo');

        window.navigator.getUserMedia({
            audio: true,
            video: true
        }, function (myStream) {

            localVideo.srcObject = myStream;
            localConn.addStream(myStream);

            // video = attachMediaStream(video, myStream);
            // event to send local's iceCandaide to remote
            localConn.onicecandidate = sentIceCandidates;

            // display remote's video stream
            localConn.addEventListener('track', gotRemoteStream);

            // add remote's description
            localConn.setRemoteDescription(
                new RTCSessionDescription(remoteTempDesc),
                function () {
                    localConn.createAnswer(gotDescription, displayError);
                }, displayError);

        }, displayError);
    }

    // document.getElementById('visioBtn').addEventListener('click', () => {
    //     if (localConn) {
    //         localConn.close();
    //     }
    //     localConn = {};
    // });

    ///////////////////////////////////////////////////////////////////////

    socket.on('CANDIDATE_WEB_RTC_REC', function (candidate) {
        console.log('got web candidate');
        remoteTempIceCandidates.push(candidate.candidate);
    });


    socket.on('ASK_WEB_RTC', function (remoteDesc) {
        console.log('ask_web_rtc');
        remoteTempDesc = JSON.parse(remoteDesc);
        acceptOffer();
    });




}