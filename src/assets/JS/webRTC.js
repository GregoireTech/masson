import serversList from '../config/servers';
const servers = serversList;

const webRTC = (socket, initiator) => {

    const localVideo = document.getElementById('localVideo');
    let myStream;
    let videoSetting = true;
    let audioSetting = true;

    if (initiator) {
        console.log('starting initiator');
        let localConn = {};
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
            myStream = localStream;
            localConn = new RTCPeerConnection(servers);
            localConn.addStream(localStream);

            localVideo.srcObject = localStream;
            // display remote's screensharing
            localConn.addEventListener('track', gotRemoteStream);

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



    } else {
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
            }, function (localStream) {
                myStream = localStream;
                localVideo.srcObject = localStream;
                localConn.addStream(localStream);

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

    const camBtn = document.getElementById('camera');
    const micBtn = document.getElementById('microphone');

    camBtn.addEventListener('click', () => {
        if(videoSetting = true){
            videoSetting = false;
            localVideo.pause();
            localVideo.srcObject = null;
            //myStream.active = false;
            console.log(myStream);
        } else {
            console.log(myStream);
            videoSetting = true;
            localVideo.srcObject = myStream;
            localVideo.play();
        }

    });


};

export default webRTC;