# Example Web Application for Image and Video Recognition

This repository contains a [Web App][webpage]. 


[webpage]:			https://manuelwe.github.io/

### Two things can be done on the Website:

1. Analyze faces via webcam snapshot
	- Uses your webcam
	- Sends the pictures to the Microsoft Face API
	- Shows the result in a nice format
	- makes use of the face landmark functionality of the api
	
2. Analyze the webcam life feed
	- Uses your webcam
	- Sends every 2 seconds an image to the api
	- Adds a description to the life stream
	- Recognizes celebrities
	- Adds Tags to the stream


## Getting Started
You can take a first look at the Webpage [here][webpage]. 


[webpage]:			https://manuelwe.github.io/

1. Get API keys for the Vision APIs from [microsoft.com/cognitive][Sign-Up]. For video frame analysis, the applicable APIs are:
    - [Computer Vision API][]
    - [Face API][]
2. Download the code from this repository
3. Insert your own api keys at the top of the javascript file

[Sign-Up]:             https://www.microsoft.com/cognitive-services/en-us/sign-up
[Computer Vision API]: https://www.microsoft.com/cognitive-services/en-us/computer-vision-api
[Face API]:            https://www.microsoft.com/cognitive-services/en-us/face-api
