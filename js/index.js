var input = document.getElementById("upload");
var infoArea = document.getElementById("upload-label");

input.addEventListener("change", showFileName);

function showFileName(event) {
    var input = event.srcElement;
    var fileName = input.files[0].name;
    var limit = 20; 

    if (fileName.length > limit) {
        var truncatedFileName = fileName.substring(0, limit) + "...";
        infoArea.textContent = "File name: " + truncatedFileName;
    } else {
        infoArea.textContent = "File name: " + fileName;
    }
}


function upload() {
    var input = document.getElementById("upload");
    var selectedFile = input.files[0];
    var reader = new FileReader();

    // Disable the upload button and show "Processing" text
    var uploadButton = document.querySelector(".btn-primary");
    uploadButton.disabled = true;
    uploadButton.classList.add("processing");
    uploadButton.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i> Processing';

    reader.onload = function (event) {
        var base64EncodedData = event.target.result;
        recognizeImage(base64EncodedData);
    };

    reader.readAsDataURL(selectedFile);
}

function recognizeImage(base64EncodedData) {
    Tesseract.recognize(base64EncodedData, 'eng', {
        logger: m => console.log(m)
    }).then(({ data: { text } }) => {
        // Display the OCR result (text) in an element with the ID "ocrResult" in your HTML
        document.getElementById("ocrResult").innerText = text;

        // Create a new FormData object
        var form = new FormData();

        // Append the OCR result as a form field
        form.append("ocrResult", text);

        // Append the file data to the FormData object
        var input = document.getElementById("upload");
        form.append("file", input.files[0]);

        // Create a new XMLHttpRequest object
        var req = new XMLHttpRequest();
        req.open("POST", "upload.php", true);

        // Set up a callback function for when the request completes
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                // Handle the response from the server, if necessary
                console.log(req.responseText);

                // Enable the upload button and restore its original text
                var uploadButton = document.querySelector(".btn-primary");
                uploadButton.disabled = false;
                uploadButton.classList.remove("processing");
                uploadButton.innerHTML = '<i class="fa fa-upload me-2"></i> Upload';
            }
        };

        // Send the FormData object as the request body
        req.send(form);
    });
}

