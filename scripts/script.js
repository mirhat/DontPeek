
var APIUrl = "https://westeurope.api.cognitive.microsoft.com";

//Please use your own API keys
var subscriptionKeyFaceAPI = "ed8d512d5df94c83b206222ff3dacede";
var subscriptionKeyVisionAPI = "ed8d512d5df94c83b206222ff3dacede";

var firstFace;

window.onload = init;

var emotion = {
    anger: false,
    happiness: false,
    fear: false,
    sadness: false,
    surprise: false
}

function init() {
    showCamera();

    $('.nav li').click(function () {
        $('.nav li').removeClass('active');
        $('.nav li').removeClass('focus');
        $(this).addClass('active');
        $(this).addClass('focus');
    });
}

function toggleView(view) {
    $("#home").css("display", "none");
    $("#faceRecognition").css("display", "none");
    $("#itemRecognition").css("display", "none");

    $("#" + view).css("display", "block");
}

//activates the Webcam
function showCamera() {
    Webcam.set({
        width: 520,
        height: 440,
        image_format: 'jpeg',
        jpeg_quality: 100
    });
    Webcam.attach('#my_camera');
    Webcam.attach('#camera');
}

//############################################## Face Recognition ###############################################
//takes a snapshot
function capturePicture() {
    Webcam.snap(function (data_uri) {
        $("#results").html('<img id="base64image" src="' + data_uri + '"/>');
    });
    $("#resultsActions").css("display", "block");
    hideMarkers();
}

//api call
function submitToFaceAPI() {
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "true",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
    };

    hideMarkers();
    $("#status").text("Submitting to cloud...");


    var file = document.getElementById("img").src.substring(23).replace(' ', '+');
    var img = Base64Binary.decodeArrayBuffer(file);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", APIUrl + '/face/v1.0/detect?' + $.param(params), "image/jpg");
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKeyFaceAPI);
    xhr.onload = uploadFaceAPIComplete;
    xhr.send(img);
}

//receives api response
function uploadFaceAPIComplete(event) {
    if (this.status == 200) {
        if (event.target.response.length > 0) {
            if (event.target.response.length === 1) {
                $("#status").text("Found " + event.target.response.length + " Face");
                firstFace = event.target.response[0];
                formatOutput(firstFace);
            } else {
                $("#status").text("Found " + event.target.response.length + " Faces");
                $("#output").html(JSON.stringify("You all look beautiful!"));
            }

            var numberOfFaces = event.target.response.length;
            if (numberOfFaces > 1) {
                $("#StopSign").css("display", "block");
            } else {
                $("#StopSign").css("display", "none");
            }

            console.log("Number of faces " + numberOfFaces);
        }
        else {
            $("#status").text("No face found. Please try again!");
            $("#output").html("");
        }
    }
    else {
        $("#status").text("Error: See the console for details");
        console.log(this.responseText);
    }
}

//formates the api response
function formatOutput(face) {
    if (face.faceAttributes.gender === 'male') output = "Hello Mister! ";
    else output = "Hello Miss! ";

    emotion.anger = face.faceAttributes.emotion.anger > 0.8;
    emotion.fear = face.faceAttributes.emotion.fear > 0.8;
    emotion.happiness = face.faceAttributes.emotion.happiness > 0.8;
    emotion.sadness = face.faceAttributes.emotion.sadness > 0.8;
    emotion.surprise = face.faceAttributes.emotion.surprise > 0.8;

    $("#output").html(JSON.stringify(emotion));
}

//hides icons
function hideMarkers() {
    
    $("#FaceMarker").css("display", "none");
    $("#Hat").css("display", "none");
    $("#Nose").css("display", "none");
    $("#merryChristmas").css("display", "none");
};

//adds christmas icons
function christmas() {
    $("#merryChristmas").css("display", "block");

    // Show face rectangle
    var faceRectange = firstFace.faceRectangle;
    var faceWidth = faceRectange.width;
    var faceHeight = faceRectange.height;
    var faceLeft = faceRectange.left;
    var faceTop = faceRectange.top;



    $("#Hat").css("top", faceTop - faceWidth);
    $("#Hat").css("left", faceLeft);
    $("#Hat").css("height", faceWidth * 1.2);
    $("#Hat").css("width", faceWidth * 1.2);
    $("#Hat").css("display", "block");

    var noseWidth = firstFace.faceLandmarks.noseRightAlarOutTip.x - firstFace.faceLandmarks.noseLeftAlarOutTip.x
    $("#Nose").css("top", firstFace.faceLandmarks.noseLeftAlarOutTip.y - (noseWidth / 2));
    $("#Nose").css("left", firstFace.faceLandmarks.noseLeftAlarOutTip.x);
    $("#Nose").css("height", noseWidth * 1.1);
    $("#Nose").css("width", noseWidth * 1.1);
    $("#Nose").css("display", "block");

}


//######################################## Computer Vision API ##############################################

function startRecognition() {
    takePicture();
    window.refreshIntervalId = setInterval(takePicture, 500);
}

function stopRecognition() {
    clearInterval(refreshIntervalId);
}

//takes a snapshot
function takePicture() {
    Webcam.snap(function (data_uri) {
        $("#imgField").html('<img id="img" style="display:none" src="' + data_uri + '"/>');
    });
    
    //submitToVisionAPI()
    submitToFaceAPI()
}



function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}




