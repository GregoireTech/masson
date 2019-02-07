const checkNavigator = () => {

    let navName;
    if ((window.navigator.userAgent.indexOf("Opera") || window.navigator.userAgent.indexOf('OPR')) != -1) {
        navName = 'Opera';
    } else if (window.navigator.userAgent.indexOf("Chrome") != -1) {
        navName = 'Chrome';
    } else if (window.navigator.userAgent.indexOf("Safari") != -1) {
        navName = 'Safari';
    } else if (window.navigator.userAgent.indexOf("Firefox") != -1) {
        navName = 'Firefox';
    } else if ((window.navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) //IF IE > 10
    {
        navName = 'IE';
    } else {
        navName = 'unknown';
    }
    console.log(navName);
    return (navName === 'Chrome' || navName === 'Safari');
}


export default checkNavigator;