<?php
	require_once("passcon.php");
	$user=$_GET['user'];
	$query="select * from customers where ID='$user'";
	$result=mysql_query($query,$conn) or die('an error has occurred');
	$count=mysql_num_rows($result);
	if($count===0)
	{
		$data = array('ID'=>"00000000",'membership'=>'NONE','expires'=>'000000','liked'=>'N');
	}
	else
	{
		$n=mysql_fetch_array($result);
		$expires=$n['expires'];
		// code for if expires is greater than today
		$expires=substr(date(r,$expires),0,16);
		$data=array('ID'=>$n['ID'],'membership'=>$n['membership'],'expires'=>$expires,'liked'=>$n['liked']);
	}
	echo json_encode($data);
	
?>