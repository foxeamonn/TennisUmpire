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
		$query="INSERT INTO customers VALUES ('$user','BASIC','$expires')";
		$result=mysql_query($query,$conn);
	}
	else
	{
		$n=mysql_fetch_array($result);
		$version=$n[1];
		$expires=$n[2];
		if($expires<time()){
			$version="BASIC";
			$query="UPDATE customers set membership='BASIC' where ID='$user'";
			$r=mysql_query($query,$conn);
		}
	}
	echo $version;
	
?>