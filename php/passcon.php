<?php
	
	if(strpos(gethostname(),'local')>0)
	{
		$conn = mysql_connect('localhost', 'root', 'root') or die("could not connect");
		mysql_select_db('tennisUmpire',$conn) or die("could not select database");
	}
	else
	{
	
		$conn = mysql_connect('localhost', 'foxenet_eamonn', 'myp@$$w*rd$') or die("could not connect");
		mysql_select_db('foxenet_MyPasswords',$conn) or die("could not select database");
	}
 	return $conn;
?>