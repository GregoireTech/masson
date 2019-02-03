import adapter from 'webrtc-adapter';
import serversList from '../../config/servers';
const servers = serversList;


const webRTC = (socket) => {
    // Setup video containers
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    // Setup local variables
    let localMediaStream = null;
    let localConn = {};
    let remoteTempIceCandidates = [];

    // First we setup our own video stream
    tryVideoChat();
    //Signal the other peer that we are ready
    socket.emit('RTC_PEER_READY');

    // Setup the list of events we expect to receive
    socket.on('RTC_PEER_READY', handleVideoInit);

    socket.on('CANDIDATE_WEB_RTC', handleRemoteIceCandidate);

    socket.on('OFFER_WEB_RTC', handleOffer);

    socket.on('RESPONSE_WEB_RTC', remoteDesc => {
        console.log('got response');
        localConn.setRemoteDescription(new RTCSessionDescription(remoteDesc));
    });

    // Try to get local stream 
    const tryVideoChat = () => {
        window.navigator.getUserMedia({
                audio: true,
                video: true
            })
            .then(localStream => {
                localMediaStream = localStream;
                localVideo.srcObject = localStream;
            })
            .catch(err => {
                console.error("You are not allow navigator use device", err);
            });
    }

    //Setup RTC connnection, add local stream and listen for remote stream
    const setupConnection = () => {
        localConn = new RTCPeerConnection(servers);
        localConn.addStream(localMediaStream);
        localConn.addEventListener('track', gotRemoteStream);
        localConn.onicecandidate = handleLocalIceCandidate;
    };

    // Starts connection, create & send offer
    const handleVideoInit = () => {
        setupConnection();
        localConn.createOffer(desc => {
                // desc is typeof RTCSessionDescription wich contains local's session
                localConn.setLocalDescription(desc);
                // send desc to remote
                console.log('send desc');
                socket.emit('OFFER_WEB_RTC', JSON.stringify(desc));
            })
            .catch(err => {
                console.error(err);
            });
    }

    // Add offer to local connection, create & send answer
    const handleOffer = (remoteDesc) => {
        remoteTempDesc = JSON.parse(remoteDesc);
        // Setup local connection
        setupConnection();
        // add remote's description
        localConn.setRemoteDescription(
                new RTCSessionDescription(remoteTempDesc)
            )
            .then(() => {
                localConn.createAnswer();
            })
            .then(localDesc => {
                localConn.setLocalDescription(localDesc);
            })
            .then(localDesc => {
                registerRemoteIceCandidates(); 
                socket.emit('RESPONSE_WEB_RTC', localDesc);
            })
            .catch(err => console.log(err));
    }

    // When we receive remote stream, display it in remote video
    const gotRemoteStream = evt => {
        if (remoteVideo.srcObject !== evt.streams[0]) {
            remoteVideo.srcObject = evt.streams[0];
            console.log('got remote stream');
        }
    };

    // Sort ice candidate & send them to remote peer
    const handleLocalIceCandidate = evt => {
        if (evt.candidate) {
            var lightCandidate = {
                sdpMid: evt.candidate.sdpMid,
                sdpMLineIndex: evt.candidate.sdpMLineIndex,
                candidate: evt.candidate.candidate
            }
            // send ice local's iceCandidate to remote
            console.log('send ice candidate')
            socket.emit('CANDIDATE_WEB_RTC', {
                "candidate": lightCandidate
            });
        }
    }

    // Receives remote ICE candidate & add to local connection
    const handleRemoteIceCandidate = candidate => {
        remoteTempIceCandidates.push(candidate.candidate);
    }

    const registerRemoteIceCandidates = () => {
        for (var i = 0; i < remoteTempIceCandidates.length; i++) {
            localConn.addIceCandidate(
                    new RTCIceCandidate(remoteTempIceCandidates[i])
                )
                .then(() => {
                    console.log('AddIceCandidate success!');
                })
                .catch(err => {
                    console.error('Error AddIceCandidate');
                    console.error(err);
                })
        }
    }


};

export default webRTC;