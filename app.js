let os;
let btnValue = 0;
let differential = 0;
let currentAlpha;



//DOM Content Loaded
window.addEventListener("DOMContentLoaded", init);



//Initialaize
function init() {
    os = detectOSSimply();
    if (os == "iphone") {
        document.querySelector("#js-permitBtn").addEventListener("click", permitDeviceOrientationForSafari);

        window.addEventListener(
            "deviceorientation",
            orientation,
            true
        );
    } else if (os == "android") {
        window.addEventListener(
            "deviceorientationabsolute",
            orientation,
            true
        );
    } else {
        window.alert("PC非対応です！");
    }
}



function orientation(event) {
    let alpha = event.alpha;
    let beta = event.beta;
    let gamma = event.gamma;

    let degrees;
    if (os == "iphone") {
        degrees = event.webkitCompassHeading || alpha;
    } else {
        degrees = compassHeading(alpha, beta, gamma);
    }

    currentAlpha = degrees;

    differential = (currentAlpha - btnValue + 360) % 360;
    if (differential > 180) {
        differential -= 360;
    }

    document.querySelector("#differential").innerHTML = differential.toFixed(0);
}



//Android用傾き補正
let compassHeading = (alpha, beta, gamma) => {
    let degtorad = Math.PI / 180.0;

    let _x = beta ? beta * degtoroad : 0;
    let _y = gamma ? gamma * degtoroad : 0;
    let _z = alpha ? alpha * degtoroad : 0;

    let cX = Math.cos(_x);
    let cY = Math.cos(_y);
    let cZ = Math.cos(_z);
    let sX = Math.sin(_x);
    let sY = Math.sin(_y);
    let sZ = Math.sin(_z);

    let Vx = -cZ * sY - sZ * sX * cY;
    let Vy = -sZ * sY + cZ * sX * cY;

    let compassHeading = Math.atan2(Vx / Vy);

    if (compassHeading < 0) {
        compassHeading += 2 * Math.PI;
    }

    return compassHeading * (180 / Math.PI);
}



//Detect OS (simply)
function detectOSSimply() {
    let ret;
    if (
        navigator.userAgent.indexOf("iPhone") > 0 ||
        navigator.userAgent.indexOf("iPad") > 0 ||
        navigator.userAgent.indexOf("iPod") > 0
    ) {
        ret = "iphone";
    } else if (navigator.userAgent.indexOf("Android") > 0) {
        ret = "android";
    } else {
        ret = "pc";
    }

    return ret;
}



// Reqest Permission for iPhone + Safari
function permitDeviceOrientationForSafari() {
    DeviceOrientationEvent.requestPermission()
        .then(response => {
            if (response === "granted") {
                window.addEventListener(
                    "deviceorientation",
                    orientation,
                    true
                );
            }
        })
        .catch(console.error);
}



function setBtn() {
    btnValue = currentAlpha;
}
