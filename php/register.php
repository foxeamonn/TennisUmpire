<?php
	require_once("passcon.php");
	$version="BASIC";
	$user=$_GET['user'];
	$query="select * from customers where ID='$user'";
	$result=mysql_query($query,$conn);
	$count=mysql_num_rows($result);
	$expires=time()+(366*60*60*24);
	if($count===0)
	{
		$query="INSERT INTO customers VALUES ('$user','BASIC','$expires','N')";
		$result=mysql_query($query,$conn);
		$data=array('id'=>$user,'membership'=>'BASIC','expires'=>$expires,'liked'=>'N');
	}
	else  //user may have previously registered, but deleted local storage
	{
		$n=mysql_fetch_array($result);
		$data=array('id'=>$n['ID'],'membership'=>$n['membership'],'expires'=>$n['expires'],'liked'=>$n['liked']);
		$result=1;
	}
	echo json_encode($data);
	
?>