<?php echo 20;
if($_POST['number'] != ""){
  $message="Dear User,
OTP for login in PMSHRI is 464646.
The OTP is valid for 5 Mins. Please do not share this OTP to anyone.
Regards,
PMSHRI Team -Ministry of Education, Government of India";
  $number=$_POST['number'];
  $result = callAPI($message, $number, '1107165468671287307');
  echo "<pre>";
    print_r($result);
    exit;
  /* if($result != ""){
    echo "<pre>";
    print_r($result);
    exit;
  } else {
    echo "Something wrong with Response"; 
    exit;
  } */
}


function callAPI($message_body, $number, $template_id){
	$ch = curl_init();
	$url = "https://smsgw.sms.gov.in/failsafe/HttpLink?username=shagun.sms&pin=P%26j6@tRb&message=".urlencode($message_body)."&mnumber=91$number&signature=SELMOE&dlt_template_id=".$template_id."&dlt_entity_id=1101607010000029348";

  $ch = curl_init();                       // initialize CURL
        curl_setopt($ch, CURLOPT_POST, false);    // Set CURL Post Data
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER,false);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,2);
		curl_setopt($ch, CURLOPT_CAINFO,'/etc/pki/tls/certs/ca-bundle.crt');
        
	print_r($server_output = curl_exec($ch));

	curl_close ($ch);
	echo $url;
	return $server_output;
}
?>

<html>
<body>
<form name="form1" method="post" action="testsms.php">
  Number 123: <input type="text" name="number"><br>
  <input type="submit">
</form>
</body>

