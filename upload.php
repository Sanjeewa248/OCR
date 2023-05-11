<?php
$uploaded_file = $_FILES['file']['tmp_name'];
$target_dir = "uploaded/";
$target_file = $target_dir . basename($_FILES['file']['name']);
if (move_uploaded_file($uploaded_file, $target_file)) {
  // File successfully copied, redirect back to the UI
  // echo "success";
} else {
  echo "Sorry, there was an error uploading your file.";
}
?>





