
var APIUrl = "https://westcentralus.api.cognitive.microsoft.com";

//Please use your own API keys
var subscriptionKeyFaceAPI = "123620e50edd4e2ab689f9e6ab142acb";
var subscriptionKeyVisionAPI = "32f061f7cad04374b172212560115537";

var firstFace;

window.onload = init;

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
        width: 320,
        height: 240,
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
    var file = document.getElementById("base64image").src.substring(23).replace(' ', '+');
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

    if (face.faceAttributes.emotion.anger > 0.8) output += "You look angry today. ";
    if (face.faceAttributes.emotion.fear > 0.8) output += "You look frightened. What happend? ";
    if (face.faceAttributes.emotion.happiness > 0.8) output += "You look very happy. I am happy too. ";
    if (face.faceAttributes.emotion.sadness > 0.8) output += "You look sad. What is wrong? ";
    if (face.faceAttributes.emotion.surprise > 0.8) output += "You look surprised. Are you impressed by me? ";

    if (face.faceAttributes.facialHair.beard > 0.8) output += "Nice beard. ";
    else if (face.faceAttributes.facialHair.beard > 0.4) output += "Are you growing a beard? ";

    if (face.faceAttributes.glasses === 'NoGlasses') output += "I think glasses would fit you. ";
    else output += "Where did you get your glasses from? ";

    if (face.faceAttributes.hair.invisible === 'false') output += "Unfortunately i can't see your hair. ";
    else {
        if (face.faceAttributes.hair.bald > 0.8) output += "Baldness suits you. ";
        else if (face.faceAttributes.hair.bald > 0.4) output += "Are you bald? ";
        else {
            var colors = face.faceAttributes.hair.hairColor;
            colors.sort(function (a, b) {
                if (b.confidence > a.confidence) return 1;
                if (b.confidence < a.confidence) return -1;
                return 0;
            });
            if (colors[0].color !== 'other') output += "Your " + colors[0].color + " hair looks fantastic! ";
        }
    }

    if (face.faceAttributes.makeup.eyeMakeup === 'true') output += "Great eye makeup. ";
    if (face.faceAttributes.makeup.lipMakeup === 'true') output += "Great lip makeup. ";

    $("#output").html(JSON.stringify(output));
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
    window.refreshIntervalId = setInterval(takePicture, 2000);
}

function stopRecognition() {
    clearInterval(refreshIntervalId);
}

//takes a snapshot
function takePicture() {
    Webcam.snap(function (data_uri) {
        $("#imgField").html('<img id="img" style="display:none" src="' + data_uri + '"/>');
    });
    submitToVisionAPI()
}

//api call
function submitToVisionAPI() {
    var params = {
        "visualFeatures": "Categories,Description,Color",
        "details": "",
        "language": "en",
    };

    var file = document.getElementById("img").src.substring(23).replace(' ', '+');
    var img = Base64Binary.decodeArrayBuffer(file);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", APIUrl + '/vision/v1.0/analyze?' + $.param(params), "image/jpg");
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKeyVisionAPI);
    xhr.onload = uploadVisionAPIComplete;
    xhr.send(img);
}

//receives api response
function uploadVisionAPIComplete(event) {
    var tags = "";
    var description = "";
    var people = false;
    var i = 0;

    if (this.status == 200) {

        var response = event.target.response;

        if (response.description.captions.length > 0) {
            description += capitalizeFirstLetter(response.description.captions[0].text) + ". ";
        }


        while (people === false && i < response.categories.length) {
            try {
                if (response.categories[i].name.match(/people/g).length === 1) {
                    people = true;
                    try {
                        if (response.categories[i].detail.celebrities.length > 0) {
                            description += "I can see following celebrities: ";
                            for (y in response.categories[i].detail.celebrities) {
                                description += response.categories[i].detail.celebrities[y].name + ", ";
                            }
                            description += ".";
                        } else {
                            description += "There are no celebrities.";
                        }
                    } catch (error) {
                        description += "There are no celebrities.";
                    }
                }
            }
            catch (error) {

            }
            i++;
        }


        if (people === false) {
            description += "There are no persons.";
        }

        for (var i = 0; i < 6; i++) {
            tags += "#" + response.description.tags[i] + " ";
        }

        console.log("response", response);
        
        $("#tags").html(tags);
        $("#description").html(description);

    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}




