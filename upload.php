<?php
require_once __DIR__ . '/vendor/autoload.php'; // Load Composer autoload

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Retrieve the uploaded file
$uploaded_file = $_FILES['file']['tmp_name'];
$target_dir = "uploaded/";
$timestamp = time();
$new_filename = 'image_' . $timestamp . '.' . pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
$target_file = $target_dir . $new_filename;

if (move_uploaded_file($uploaded_file, $target_file)) {
    // File successfully copied, continue with OCR and database operations

    // Connect to the database
    $servername = $_ENV['DB_HOST'];
    $username = $_ENV['DB_USERNAME'];
    $password = $_ENV['DB_PASSWORD'];
    $dbname = $_ENV['DB_NAME'];
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Retrieve the OCR result from the form field
    $ocr_result = $_POST['ocrResult'];

    // Check if OCR result is not null or empty
    if (!empty($ocr_result)) {
        // Prepare the SQL statement with a placeholder for the OCR result
        $stmt = $conn->prepare("INSERT INTO results (result, path) VALUES (?, ?)");
        $stmt->bind_param("ss", $ocr_result, $target_file);
        $stmt->execute();

        // Check if the statement was successful
        if ($stmt->affected_rows > 0) {
            echo "OCR data saved successfully!";
        } else {
            echo "OCR result is null or empty. Data not saved.";
        }
    
        // Close the database connection
        $conn->close();
    } else {
        echo "Sorry, there was an error uploading your file.";
    }}
   ?> 