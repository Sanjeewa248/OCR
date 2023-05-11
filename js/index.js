/*  ==========================================
    SHOW UPLOADED IMAGE
* ========================================== */
var input = document.getElementById("upload");
var infoArea = document.getElementById("upload-label");

input.addEventListener("change", showFileName);
function showFileName(event) {
    var input = event.srcElement;
    var fileName = input.files[0].name;
    infoArea.textContent = "File name: " + fileName;
}

function upload() {
    var input = document.getElementById("upload");
    var selectedFile = input.files[0];
    var reader = new FileReader();
    var base64EncodedData; 
    reader.onload = function (event) {
        base64EncodedData = event.target.result;
        recognizeImage(base64EncodedData);
    };
    reader.readAsDataURL(selectedFile);
    var form = new FormData();
    form.append("file", selectedFile);
    var req = new XMLHttpRequest();
    req.open("POST", "upload.php", true);
    req.send(form);
    req.onreadystatechange = () => {
        if (req.readyState == 4) {
            // alert(req.responseText);
            recognizeImage(base64EncodedData); 
        }
    };
}
 function recognizeImage(base64EncodedData) {
    Tesseract.recognize(base64EncodedData, 'eng', {
        logger: m => console.log(m)
    }).then(({ data: { text } }) => {
        // Display the OCR result (text) in an element with the ID "ocrResult" in HTML
        document.getElementById("ocrResult").innerText = text;
    });
}