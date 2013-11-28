<?

require_once '/home/bcloud/priv/medoo.min.php';
require_once '/home/bcloud/priv/functions.php';

$input_arr = array();
//grabs the $_POST variables and adds slashes
foreach ($_POST as $key => $input_arr) {
    $_POST[$key] = addslashes($input_arr);
}

$debug = "";
$msg="Starting Debug";
dadd($debug,$msg);

$userid=$_SESSION['identifier'];
$displayName=$_SESSION['displayName'];
$photo=$_SESSION['photo'];
$firstName=$_SESSION['firstName'];

 
// Initialize
$database = new medoo('bcloud_bigdata');

 
$datas = $database->select("users",array("id","userid"),array("userid"=>$userid));
// first time we've seen this user so set them up.
if (empty($datas) && $userid!=''){
$newUserID= $database->insert("users", array(
	"userid" => $_SESSION['user']['id'],
	"email" => $_SESSION['user']['email'],
	"displayname" => $_SESSION['user']['name'],
	"firstname" => $_SESSION['user']['given_name'],
	"lastname" => $_SESSION['user']['family_name'],
	"photo" => $_SESSION['photo'],
));

$newUserCloud= $database->insert("user_clouds", array(
	"userid" => $newUserID,
	"cloudid" => 1,
	"level" => "admin"
));
$_SESSION['ctID']=$newUserID;
}else{
foreach($datas as $data)
{
	$_SESSION['ctID']= $data["id"] ;
}
}



$username = "user1bghmghykjgyk";
$password = "highedwebtech1";
dadd($debug,"<br>userid=$userid<br><br>");
dadd($debug,"<br>displayName=$displayName<br><br>");
dadd($debug,print_r($_SESSION['user'],true));
dadd($debug,"datas");
dadd($debug,print_r($datas,true));
$msg=sha1($username.$password);
dadd($debug,$msg);
dadd($debug,"userinsert=".$newUserID);