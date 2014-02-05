<?php
	$conn = mysql_connect('localhost', 'foxenet_eamonn', 'myp@$$w*rd$') or die("could not connect");
	$sql="CREATE DATABASE tennisUmpire" or die(mysql_error());
?>