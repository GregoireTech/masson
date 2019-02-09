// This will throw a warning as not called explicitly in the script but is still required
import adapter from 'webrtc-adapter';

let localMediaStream = false;

export const setupWebRTC = (socket, servers, options) => {
    // Setup video containers
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    // Setup local variables
    let started = false
    
    let localConn = {};
    let gotRemoteDesc = false;
    let gotLocalDescription = false;

    const ICE_config2 = {
        "iceServers": [{
            "url": "stun:eu-turn1.xirsys.com"
        }, {
            "username": "b06944e4-27f0-11e9-bd13-fb8129e75af9",
            "url": "turn:eu-turn1.xirsys.com:80?transport=udp",
            "credential": "b069458e-27f0-11e9-957e-c7d84ecc1503"
        }, {
            "username": "b06944e4-27f0-11e9-bd13-fb8129e75af9",
            "url": "turn:eu-turn1.xirsys.com:3478?transport=udp",
            "credential": "b069458e-27f0-11e9-957e-c7d84ecc1503"
        }, {
            "username": "b06944e4-27f0-11e9-bd13-fb8129e75af9",
            "url": "turn:eu-turn1.xirsys.com:80?transport=tcp",
            "credential": "b069458e-27f0-11e9-957e-c7d84ecc1503"
        }, {
            "username": "b06944e4-27f0-11e9-bd13-fb8129e75af9",
            "url": "turn:eu-turn1.xirsys.com:3478?transport=tcp",
            "credential": "b069458e-27f0-11e9-957e-c7d84ecc1503"
        }, {
            "username": "b06944e4-27f0-11e9-bd13-fb8129e75af9",
            "url": "turns:eu-turn1.xirsys.com:443?transport=tcp",
            "credential": "b069458e-27f0-11e9-957e-c7d84ecc1503"
        }, {
            "username": "b06944e4-27f0-11e9-bd13-fb8129e75af9",
            "url": "turns:eu-turn1.xirsys.com:5349?transport=tcp",
            "credential": "b069458e-27f0-11e9-957e-c7d84ecc1503"
        }]
    }

    // Try to get local stream 
    const tryVideoChat = () => {
        //console.log('trying video');
        window.navigator.getUserMedia({
            audio: options.audio,
            video: options.video
        }, function (localStream) {
            localMediaStream = localStream;
            localVideo.srcObject = localStream;
            initVideoChat();
        }, function (err) {
            console.error("Votre navigateur n'autorise pas la connection vidéo.", err);
        });
    }

    const initVideoChat = () => {
        //Setup RTC connnection, add local stream and listen for remote stream
        const setupConnection = () => {
            if (!started){
                started = true;
                //console.log('setting up connection');
                localConn = new RTCPeerConnection(ICE_config2);
                localConn.addStream(localMediaStream);
                localConn.addEventListener('track', gotRemoteStream);
                localConn.onicecandidate = handleLocalIceCandidate;
            }
        };

        // Starts connection, create & send offer
        const handleVideoInit = () => {
            if (localConn !== {}){
                localConn.createOffer(function (desc) {
                    // desc is typeof RTCSessionDescription wich contains local's session
                    if (!gotLocalDescription) {
                        localConn.setLocalDescription(desc);
                        gotLocalDescription = true;
                        //console.log('send desc');
                        socket.emit('OFFER_WEB_RTC', JSON.stringify(desc));
                    }
                    // send desc to remote
                }, function (err) {
                    console.error(err);
                });
            }
        }
        // Add offer to local connection, create & send answer
        const handleOffer = (remoteDesc) => {
            if (!gotRemoteDesc && localConn !== {}) {
                //console.log('handling offer');
                let remoteTempDesc = JSON.parse(remoteDesc);
                // add remote's description
                localConn.setRemoteDescription(
                        new RTCSessionDescription(remoteTempDesc)
                    )
                    .then(() => {
                        gotRemoteDesc = true;
                        // registerIceCandidates();
                        localConn.createAnswer(function (localDesc) {
                            //if (!gotLocalDescription) {
                            localConn.setLocalDescription(localDesc);
                            gotLocalDescription = true;
                            //}
                            //registerRemoteIceCandidates();
                            socket.emit('RESPONSE_WEB_RTC', localDesc);

                        }, function (err) {
                            console.log(err);
                        });
                    })
                    .catch(err => console.log(err));
            }
        }

        // When we receive remote stream, display it in remote video
        const gotRemoteStream = evt => {
            //console.log('got remote stream');
            if (remoteVideo.srcObject !== evt.streams[0]) {
                remoteVideo.srcObject = evt.streams[0];
            }
        };

        // Sort ice candidate & send them to remote peer
        const handleLocalIceCandidate = evt => {
            //console.log('handling local candidate');
            if (evt.candidate) {

                // send ice local's iceCandidate to remote
                //console.log('send ice candidate')
                socket.emit('CANDIDATE_WEB_RTC', {
                    candidate: evt.candidate
                });
            }
        }

        // Receives remote ICE candidate to remote candidates array
        const handleRemoteIceCandidate = data => {
            //console.log('handling remote candidate');
            if (data.candidate && localConn !== {}) {
                //if (gotRemoteDesc) {
                localConn.addIceCandidate(
                        new RTCIceCandidate(data.candidate)
                    )
                    .then(() => {
                        //console.log('AddIceCandidate success!');
                    })
                    .catch(err => {
                        console.error('Error AddIceCandidate');
                        console.error(err);
                    })
            }
        }
        
        const initSetup = () => {
            if (localConn !== {}){
                localConn.close();
                localConn = {};
            }
            started = false
            gotRemoteDesc = false;
            gotLocalDescription = false;
        }

        const handlePing = () => {
            if (started){
                initSetup();
            }
            setupConnection();
            socket.emit('RTC_MESSAGE', {msg: 'pong'});
        }

        // Dispatches actions depending on message type
        const rtcMessageHandler = data => {
            //console.log(data);
            switch(data.msg){
                case 'ping':
                    handlePing();
                    break;
                case 'pong':
                    setupConnection()
                    handleVideoInit();
                    break;
                case 'iceCandidate':
                    handleRemoteIceCandidate(data);
                    break;
                case 'rtcOffer':
                    handleOffer(data);
                    break;
                case 'rtcResponse':
                if (!gotRemoteDesc && localConn !== {}) {
                    localConn.setRemoteDescription(new RTCSessionDescription(data.response));
                    gotRemoteDesc = true;
                }
                    break;
                default:
                    return;
            }
        }

        // Setup the list of events we expect to receive
        socket.on('RTC_MESSAGE', (data) =>{
            rtcMessageHandler(data);
        });

        socket.on('CANDIDATE_WEB_RTC', handleRemoteIceCandidate);
        socket.on('OFFER_WEB_RTC', handleOffer);
        socket.on('RESPONSE_WEB_RTC', remoteDesc => {
            //console.log('got response');
            if (!gotRemoteDesc && localConn !== {}) {
                localConn.setRemoteDescription(new RTCSessionDescription(remoteDesc));
                gotRemoteDesc = true;
            }
        });
        
        // First tell the peer that we are ready
        socket.emit('RTC_MESSAGE', {msg: 'ping'});
    }

    tryVideoChat();

};

export const changeWebRTC = (type, value) => {
    if (localMediaStream !== false){
        if (type === 'video'){
            localMediaStream.getVideoTracks()[0].enabled = value;
        } else if (type === 'audio'){
            localMediaStream.getAudioTracks()[0].enabled = value;
        }
    }
}

// Config with Google servers

    /*const ICE_config1 = {
        'iceServers': [{
                'url': 'stun:stun.l.google.com:19302'
            },
            {
                'url': 'turn:192.158.29.39:3478?transport=udp',
                'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                'username': '28224511:1379330808'
            },
            {
                'url': 'turn:192.158.29.39:3478?transport=tcp',
                'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                'username': '28224511:1379330808'
            }
        ]
    }*/