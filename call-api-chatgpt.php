<?php

$theprompt = $_GET['theprompt'];

echo "Recibio: ". $theprompt;
$data = array(
  "prompt" => $theprompt,
  "temperature" => 0.5,
  "max_tokens" => 200, 
  "model" => "ada" 
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.openai.com/v1/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$headers = array();
$headers[] = 'Content-Type: application/json';
$headers[] = 'Authorization: Bearer thekey';
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}
curl_close($ch);
echo $response;
  $url = htmlspecialchars($_SERVER['HTTP_REFERER']);
  echo "<a href='$url'>back</a>"; 

 
