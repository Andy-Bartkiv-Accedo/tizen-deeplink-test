const paramountAppId = "rJyOSqC6Up.PPlusIntl";
const secondAppId = "rJyOSqC6Up.CBSAllAccess";
const testAppId = "RIizRBD0Fg.DeepLinkTest";
const storeAppId = "com.samsung.tv.store";

//Initialize function
var init = function () {
    // TODO:: Do your initialization job
    console.log('init() called');

    let focusBtn = 'center';
    focusBtnStyle(focusBtn);

    const btnLeft = document.querySelector('#btn-left');
    btnLeft.addEventListener('click', () => onClick('left'));
    const btnCenter = document.querySelector('#btn-center');
    btnCenter.addEventListener('click', () => onClick('center'));
    const btnRight = document.querySelector('#btn-right');
    btnRight.addEventListener('click', () => onClick('right'));
    

    const appIdLeft = document.querySelector('#app-id-left');
    const appIdRight = document.querySelector('#app-id-right');

    appIdLeft.textContent = `App ID: ${paramountAppId}`;
    appIdRight.textContent = `App ID: ${secondAppId}`;
    
    document.addEventListener('visibilitychange', function() {
        if(document.hidden){
            // Something you want to do when hide or exit.
        } else {
            // Something you want to do when resume.
        }
    });
 
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	switch(e.keyCode){
    	case 37: //LEFT arrow
            console.log('LEFT arrow');
            focusBtn = changeFocus('left', focusBtn);
            focusBtnStyle(focusBtn);
    		break;
    	case 38: //UP arrow
            console.log('UP arrow');
            // appInfo();
    		break;
    	case 39: //RIGHT arrow
            console.log('RIGHT arrow');
            focusBtn = changeFocus('right', focusBtn);
            focusBtnStyle(focusBtn);
    		break;
    	case 40: //DOWN arrow
            console.log('DOWN arrow');
            // listAllApps()
    		break;
    	case 13: //OK button
            onClick(focusBtn);
    		break;
    	case 10009: //RETURN button
		tizen.application.getCurrentApplication().exit();
    		break;
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    });
};
// window.onload can work without <body onload="">
window.onload = init;

function onClick(btn) {
    console.log(btn);
    let id = '';
    let side = 'center';
    switch(btn) {
        case 'left':
            id = paramountAppId;
            side = 'left';
            break;
        case 'center':
            break;
        case 'right':
            id = secondAppId;
            side = 'right';
            break;
    }
    if (btn !== 'center') {
        const textOutput = document.querySelector(`#app-name-${side}`);
        const appInfo = isAppInstalled(id);
        if (appInfo) {
            textOutput.textContent = `App name: ${appInfo.name}`;
            alert(`Launching ${appInfo.name}`);
            setTimeout(() => launchAppById(id), 1000);
        } else {
            textOutput.textContent = `App is not installed`;
            alert(`App with id=${id} is not installed`);
        }
    } else {
        alert(`Redirecting to Samsung App Store`);
        setTimeout(() => launchTizenStore(), 1000);
    }  
}

function isAppInstalled(appId) {
    try {
        var appInfo = tizen.application.getAppInfo(appId);
        console.log("Application " + appInfo.name);
        return appInfo;
    } catch (exc) {
        console.log("appInfo exc: " + exc.message);
        return false;
    }
}

function launchAppById(appId) {
    try {
        tizen.application.launch(
            appId,         
            function() {console.log("Paramount launched");},
            function(err) {alert("Paramount launch failed: " + " " + err.message);}
        );
    } catch (exc) {
        alert("launchService exc: " + exc.message);
    }
}

function changeFocus(dir, currentFocus = 'center') {
    const focusRange = ['left', 'center', 'right'];
    let res = focusRange.indexOf(currentFocus);
    if (dir === 'left') {
        res = (res > 0) ? res - 1 : 0
    } else if (dir === 'right' ) {
        res = (res < focusRange.length - 1) ? res + 1 : focusRange.length - 1;
    }
    return focusRange[res];
}

function focusBtnStyle(btnId) {
    const focusRange = ['left', 'center', 'right'];
    focusRange.forEach(element => {
        document.querySelector(`#btn-${element}`).classList.remove("focused")
    })
    document.querySelector(`#btn-${btnId}`).classList.add("focused");
}

function appInfo() {
    id = paramountAppId;
    console.log("App Info");
    const textOutput = document.querySelector('#app-name-left');

    try {
        var appInfo = tizen.application.getAppInfo(id);
        textOutput.textContent = `App name: ${appInfo.name}`;
        alert("Application " + appInfo.name);
    } catch (exc) {
        textOutput.textContent = `App is not installed`;
        alert("appInfo exc: " + exc.message);
    }
    // var appInfo = tizen.application.getAppInfo(id);
    // alert("Application " + appInfo.name);
    
    // var app = tizen.application.getCurrentApplication();
    // console.log("Current application's app id is " + app.appInfo.id);

    // function onListInstalledApplications(applications) {
    //     console.log('The number of installed applications is ' + applications.length);
    // }
    // tizen.application.getAppsInfo(onListInstalledApplications);
};

function launchTizenStore() {
    var service = new tizen.ApplicationControl(
        // "http://tizen.org/appcontrol/operation/view",
        // "tizenstore://Main",
        `tizenstore://ProductDetail/${testAppId}`,
        null,
        null,
        null);
    const id = storeAppId;
    try {
        tizen.application.launchAppControl(
        service,
        id,
        () => { console.log("TizenStore launched"); },
        (err) => { alert("TizenStore launch failed: " + " " + err.message); },
        null);
    } catch (exc) {
        alert("launchService exc: " + exc.message);
    }
    }

function listAllApps() {
    function onListInstalledApps(applications) {
        for (var i = 0; i < applications.length; i++) {
            console.log("ID: " + applications[i].id);
        }
    }
    tizen.application.getAppsInfo(onListInstalledApps);
}
