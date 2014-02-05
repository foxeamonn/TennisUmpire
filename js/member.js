function checkUser()
	{
		if(!navigator.onLine) return;

		var target="php/getData.php";  
 		var user=sessionStorage.uid;
		if(!user&&localStorage.tennisApp) user=localStorage.tennisApp.ID;
		if(!user) user="0";
		//alert(user);
		$.ajax({
   				url: target,
   				data: {
     				user: user
   				},
   				success: function( result ) {
   					if(result)
					{
						if(result.indexOf("membership")>-1){
							localStorage.tennisApp=result;
						}
						else{
							$('#playMatch').html('Could not connect to server. Please try later.');
						}
					}
   				},
   				error: function(err){
   					var msg=err+'. Please try later';
 					$('#playMatch').html(msg);
   				}
			});
			
	}		

	function activateDevice()
	{
		checkUser();
		if(localStorage.tennisApp&&localStorage.tennisApp.membership!='NONE'){
			$('#activateButton').html('<b>This device has been activated. Please use the back button.</b>');
		}
	}
	
	function upgradeMe(type)
		{
			var upgrade='STANDARD';
			if(type===2) upgrade='GOLD';
			var html='';
			var target="php/upgrade.php";  
 			var user=sessionStorage.uid;
        	$.ajax({
   				url: target,
   				data: {
     				user: user,
					upgrade: upgrade,
						liked: 'Y'
   				},
   				success: function( result ) {
   				if(result!='Upgrade failed. Please try later')
				{
					localStorage.tennisApp=result;
					var html="Thank you - you now have "+upgrade+" membership, and this device is active.";
					alert(html);
				}
				else
				{
					alert("Upgrade failed. Please try again");
				}
   				},
   				error: function(err){
   						alert(err);
   				}
   
			});
		}

