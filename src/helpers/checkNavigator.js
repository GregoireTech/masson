const checkNavigator = () => {

    let navName;
    if ((window.navigator.userAgent.indexOf("Opera") || window.navigator.userAgent.indexOf('OPR')) !== -1) {
        navName = 'Opera';
    } else if (window.navigator.userAgent.indexOf("Chrome") !== -1) {
        navName = 'Chrome';
    } else if (window.navigator.userAgent.indexOf("Safari") !== -1) {
        navName = 'Safari';
    } else if (window.navigator.userAgent.indexOf("Firefox") !== -1) {
        navName = 'Firefox';
    } else if ((window.navigator.userAgent.indexOf("MSIE") !== -1) || (!!document.documentMode === true)){
        navName = 'IE';
    } else if ((window.navigator.userAgent.indexOf("Edge") !== -1) || (!!document.documentMode === true)){
        navName = 'Edge';
    } else {
        navName = 'unknown';
    }
    console.log(navName)
    return (navName === 'Chrome' || navName === 'Safari');
}


export default checkNavigator;