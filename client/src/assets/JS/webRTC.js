const webRTC = (socket) => {
    let videoSetting = true;
    let audioSetting = true;

    const init = () => {

        const displayError = (error) => console.log(error);


        const getBrowserId = () => {
            var aKeys = ["MSIE", "Firefox", "Safari", "Chrome", "Opera"],
                sUsrAg = window.navigator.userAgent,
                nIdx = aKeys.length - 1;

            for (nIdx; nIdx > -1 && sUsrAg.indexOf(aKeys[nIdx]) === -1; nIdx--);

            return aKeys[nIdx];
        }

        const getLocalVideo = (navigator, settings, success, fail) => {
            switch (navigator) {
                case "Chrome":
                    return window.navigator.getUserMedia(settings, success, fail);
                case "Firefox":
                    return window.navigator.mediaDevices.getUserMedia(settings, success, fail);
                case "Safari":
                    return window.navigator.getUserMedia(settings, success, fail);
                case "Opera":
                    return window.navigator.getUserMedia(settings, success, fail);
                case "MSIE":
                    return window.navigator.getUserMedia(settings, success, fail);
                default:
                    return
            }
        }




        // Start the script
        const navigator = getBrowserId();
        getLocalVideo(navigator, {
                video: videoSetting,
                audio: audioSetting

            },
            function onSuccess(myStream) {
                const localVideo = document.getElementById('localVideo');
                localVideo.srcObject = myStream;
            },
            displayError
        );


    }

    const getBrowserRTCConnectionObj = (nav) => {
        var servers = null;
        var pcConstraints = {
            'optional': []
        };
        switch (nav) {
            case "Chrome":
                return new window.RTCPeerConnection(servers, pcConstraints);
            case "Firefox":
                return new window.mozRTCPeerConnection(servers, pcConstraints);
            case "Safari":
                return new window.webkitRTCPeerConnection(servers, pcConstraints);
            case "Opera":
                return new window.RTCPeerConnection(servers, pcConstraints);
            case "MSIE":
                return new window.msRTCPeerConnection(servers, pcConstraints);
            default:

        }
    }







    init();

};

export default webRTC;