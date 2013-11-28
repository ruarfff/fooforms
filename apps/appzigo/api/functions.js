<? 
function dadd(&$var,$msg){
$var.="<br>".$msg;
}

function stripslashesFull($input)
{
    if (is_array($input)) {
        $input = array_map('stripslashesFull', $input);
    } elseif (is_object($input)) {
        $vars = get_object_vars($input);
        foreach ($vars as $k=>$v) {
            $input->{$k} = stripslashesFull($v);
        }
    } else {
        $input = stripslashes($input);
    }
    return $input;
}

// cloud Related functions

function getCloudID($cloud){
global $database;
$result= $database->query("select id from clouds where menuLabel='".$cloud."'")->fetchAll();
return $result;
}

function getUsercloudsJSON(){
global $database;
$result= $database->query("select clouds.* from clouds inner join user_clouds on clouds.id = user_clouds.cloudid and user_clouds.userid=".$_SESSION['ctID']."")->fetchAll();
return $result;
}

function getUserhubsJSON(){
global $database;
$result= $database->query("select hubs.* from hubs inner join user_hubs on hubs.id = user_hubs.hubid and user_hubs.userid=".$_SESSION['ctID']."")->fetchAll();
return $result;
}

function getUserappsJSON(){
global $database;
$result= $database->query("select apps.* from apps inner join user_apps on apps.id = user_apps.appid and user_apps.userid=".$_SESSION['ctID']."")->fetchAll();
return $result;
}

function getcloudJSON($id){
global $database;
$result['cloud']= $database->query("select clouds.* from clouds where clouds.id=$id")->fetchAll();
$result['apps']= $database->query("select apps.* from apps inner join cloud_apps on apps.id = cloud_apps.appid and cloud_apps.cloudid=".$id."")->fetchAll();
$result['posts']= null;

return $result;

}

function getappJSON($app){
global $database;
$tmpResult= $database->query("select apps.* from apps where apps.id=$app")->fetchAll();
$result['app'] = $tmpResult[0];
$result['fields']=$result['app']['fields'];
$result['posts']= $database->query("select posts.*, users.displayName as postFrom, users.photo as postFromPhoto , apps.icon as appIcon from posts inner join user_apps on user_apps.appid = posts.appid inner join users on users.id= posts.postedBy inner join apps on apps.id= posts.appid where user_apps.userid=".$_SESSION['ctID']." and posts.appId=".$app." order by posted desc")->fetchAll();

return $result;
}

function gethubJSON($hub){
global $database;
$result['app']= $database->query("select hubs.* from hubs where hubs.id=$hub")->fetchAll();
$result['fields']= null;
$result['posts']= null;
return $result;
}

function createCloudJSON($name,$description,$icon,$menuLabel ){
global $database;
$newcloudID= $database->insert("clouds", array(
	"name" => $name,
	"menuLabel" => $menuLabel,
	"description" => $description,
	"icon" => $icon,
));

$newusercloudID= $database->insert("user_clouds", array(
	"userid" => $_SESSION['ctID'],
	"cloudid" => $newcloudID,

));

if($newcloudID!=0){
return $menuLabel;
}else{
return 0;
}

}
 function createComment($app,$comment,$postId){
 global $database;
 $newcomment= $database->insert("app_comments", array(
	"appId" => $app,
	"postId" => $postId,
	"comment" => $comment,
	"userId" => $_SESSION['ctID']
	));
	$comment = "<div class='comments'><h4>".$_SESSION['displayName']."</h4>$comment</div>";
	return $comment;
 }

function createAppJSON($name,$description,$newButtonLabel,$menuLabel,$icon,$feedDisplayStyle,$slug,$fields,$allowComments,$minimumPostLevel,$minimumViewLevel,$clouds){
global $database;
$newAppID= $database->insert("apps", array(
	"name" => $name,
	"description" => $description,
	"icon" => $icon,
	"newButtonLabel" => $newButtonLabel,
	"menuLabel" => $menuLabel,
	"feedDisplayStyle" => $feedDisplayStyle,
	"slug" => $slug,
	"fields" => stripslashes($fields),
	"allowComments" => $allowComments,
	"minimumPostLevel" => $minimumPostLevel,
	"minimumViewLevel" => $minimumViewLevel
));

$newuserAppID= $database->insert("user_apps", array(
	"userid" => $_SESSION['ctID'],
	"appid" => $newAppID,

));
$cloudlist=explode(",",$clouds);
foreach ($cloudlist as $key=>$cloudid)
$newcloudAppID= $database->insert("cloud_apps", array(
	"cloudid" => $cloudid,
	"appid" => $newAppID,

));

return $database->error();

}



function createAppPost($appFields ){
$fieldData=json_encode($appFields);
global $database;
$newAppPostId= $database->insert("posts", array(
	"appId" => $appFields['appId'],
	"posted" => date("Y-m-d H:i:s"),
	"postedBy" => $_SESSION['ctID'],
	"fieldData" => $fieldData,
));

return $newAppPostId;
}

function getSingleAppPost($postId){
global $database;
$tmpResult= $database->query("select apps.* from apps inner join posts on apps.id = posts.appid where posts.id=$postId")->fetchAll();
$result['app'] = $tmpResult[0];
$result['fields']=$result['app']['fields'];
$result['posts']= $database->query("select posts.* from posts where id=$postId")->fetchAll();
$result['comments']= $database->query("select app_comments.*,users.displayName , users.photo as postFromPhoto from app_comments inner join users on users.id= app_comments.userId where app_comments.postId=$postId")->fetchAll();
return $result;
}

function getUsersAppsPosts(){
global $database;
$result['posts']= $database->query("select posts.*, users.displayName as postFrom, users.photo as postFromPhoto , apps.icon as appIcon from posts inner join user_apps on user_apps.appid = posts.appid inner join users on users.id= posts.postedBy inner join apps on apps.id= posts.appid where user_apps.userid=".$_SESSION['ctID']." order by posted desc")->fetchAll();
return $result;
}