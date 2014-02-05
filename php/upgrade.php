<?php
	require_once("passcon.php");
	
	$user=$_GET['user'];
	$membership=$_GET['upgrade'];
	$liked=$_GET['liked'];
	if($membership==='') $membership="STANDARD";
	$query="select * from customers where ID='$user'";
	$result=mysql_query($query,$conn);
	$count=mysql_num_rows($result);
	$oneyear=(366*60*60*24);
	if($count===0)
	{
		$expires=time()+$oneyear;
		$sql="INSERT INTO customers VALUES ('$user','$membership','$expires','$liked')";
		$result=mysql_query($sql,$conn) or die('Upgrade failed. Please try later');
		$data=array('id'=>$user,'membership'=>$membership,'expires'=>$expires,'liked'=>$liked);
		
	}
	else
	{
		$n=mysql_fetch_array($result);
		$expires=time()+$oneyear;
		$sql="update customers set membership='$membership',expires='$expires' where ID='$user'";
		$result=mysql_query($sql,$conn) or die('Upgrade failed. Please try later');
		$data=array('id'=>$n['ID'],'membership'=>$n['membership'],'expires'=>$n['expires'],'liked'=>$n['liked']);
	}
	echo json_encode($data);
	
?>