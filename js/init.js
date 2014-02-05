
	// initialisation
		setButtons();
		checkStatus();
	
	
	/////////////////////////// functions ///////////////////////
	function checkStatus()
	{
			
		if(sessionStorage.uid&&navigator.onLine){	//online and logged into Facebook, get details from database
			var target="php/getData.php";  
 			var user=sessionStorage.uid;
			$.ajax({
   					url: target,
   					data: {
     					user: user
   						},
   					success: function( result ) {
   						if(result)
						{
							localStorage.tennisApp=result;
						}
						
   					},
   						error: function(err){
   							showObject(err);
   					}
				});
			}
			
		var data=JSON.parse(localStorage.tennisApp);
		if(data.membership!="GOLD")
		{
			$('#editTitle').addClass('ui-disabled');
			$('#editPlayers').addClass('ui-disabled');
			$('#editScore').addClass('ui-disabled');
		}
					
		if(data.membership=="NONE") $('#start').addClass('ui-disabled');
	}		

	function setButtons()
	{
		$('#mainHdr').text(match.title);
		$('#buttonOne').text(match.playerOneName);
		$('#buttonTwo').text(match.playerTwoName);
		$('#serverOne').hide();
		$('#serverTwo').hide();
	}
	