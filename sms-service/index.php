<?php

    class SendSMS {
        public $Url         = null;
        public $Username    = null;
        public $Password    = null;
        public $Message     = null;
        public $Number      = null;
        public $Signature   = null;
        public $TemplateId  = null;
        public $EntityID    = null;

        function __construct() { 
            $jsonData           =   file_get_contents("php://input");
            $object             =   json_decode($jsonData);
            $this->Url          =   $object->url;
            $this->Username     =   $object->username;
            $this->Password     =   $object->password;
            $this->Signature    =   $object->signature;
            $this->EntityID     =   $object->entity_id;
            $this->TemplateId   =   $object->template_id;
            $this->Number       =   $object->mobile;
            $this->Message      =   $object->message;
        }

        function send(){

            $APIUrl = $this->Url.'username='.$this->Username.'&pin='.$this->Password.'&message='.urlencode($this->Message).'&mnumber=91'.$this->Number.'&signature='.$this->Signature.'&dlt_template_id='.$this->TemplateId.'&dlt_entity_id='.$this->EntityID;
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_POST, false);
            curl_setopt($ch, CURLOPT_URL, $APIUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER,false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,2);
            $server_output = curl_exec($ch);
            //curl_setopt($ch, CURLOPT_CAINFO,'/etc/pki/tls/certs/ca-bundle.crt');
            curl_close ($ch);
            print($server_output);
        }
    }

    $object =  new SendSMS(); 
    $object->send();
    
?>

