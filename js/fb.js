

	window.fbAsyncInit = function() {
  		FB.init({
    	appId      : 759195620761144, // App ID  - change for each app
    	channelUrl : 'channel.html', // Channel File
   		status     : false, // check login status
    	cookie     : true, // enable cookies to allow the server to access the session
    	xfbml      : true  // parse XFBML
  	});
	
	
		// version 
		FB.getLoginStatus(function(response) {
				faceBookStatus(response);
		 });
		
		
		FB.Event.subscribe('auth.authResponseChange', function(response) {
  				faceBookStatus(response);
		});
		
		FB.Event.subscribe('edge.create', page_like_callback);
		
  };// end of load function //////////////////////////////////////////////////

  // Load the FBSDK asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/all.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

	function login()
	{
		FB.login(function(response) {
   				faceBookStatus(response);
 			}
		);
	}

	function logout()
	{
		 FB.logout(function(response) {
        	// Person is now logged out
				
			$('#fbLogin').removeClass('ui-disabled');
			$('#fbLogout').addClass('ui-disabled');
			$('#fbLike').addClass('ui-disabled');
			alert('You have logged out of Facebook');
			$('#membership').addClass('ui-disabled');
    	});
	}
		
	// end of Facebook calls  ////////////////////////////////////////
	
	function faceBookStatus(response)
	{
		
		if(response.status==='connected')
		{
			sessionStorage["uid"]  = response.authResponse.userID;
		 	sessionStorage["token"]= response.authResponse.accessToken;
			$('#fbLogin').addClass('ui-disabled');
			$('#fbLike').removeClass('ui-disabled');
			$('#fbLogout').removeClass('ui-disabled');
			$('#regButton').removeClass('ui-disabled');
			$('#membership').removeClass('ui-disabled');
			getName();
			checkUser();
			$('#notLoggedIn').hide();
			$('#activateButton').show();
		}
		else
		{
			sessionStorage.removeItem('uid');
			var mess="Welcome, guest.";
			$('#customer').text(mess);
			$('#notLoggedIn').show();
			$('#activateButton').hide();
			
		}
	}
	
	function getName(){
		FB.api('/me', function(response) {
			var mess="Welcome, "+response.first_name;
			sessionStorage['firstname']=response.first_name;
			$('#customer').text(mess);
    	});

	
	}
	
	
	// callback that logs arguments
	var page_like_callback = function(url, html_element) {
  		upgradeMe(1);
	}

	
	function postLike() {
		var objectToLike='https://foxenet.com/TennisUmpire/';
    	FB.api(
    	   'https://graph.facebook.com/me/og.likes',
       		'post',
       		{ object: objectToLike,
      	  	 privacy: {'value': 'SELF'} },  // take this out
      	 	function(response) {
        		 if (!response) {
           		alert('Error occurred.');
         	} else if (response.error) {
           		      alert('Error: ' + response.error.message);
         	} else {	// set to standard membership
				var target="php/upgrade.php";  
 				var user=sessionStorage.uid;
				var upgrade="STANDARD";
           		$.ajax({
   					url: target,
   					data: {
     					user: user,
						upgrade: upgrade
   						},
   					success: function( result ) {
   						if(result!='Upgrade failed. Please try later')
						{
							var html="Thank you. You now have standard membership. <br>Don't forget to activate your device(s) to use the app.";
							document.getElementById('result').innerHTML =html;
						}
						else
						{
							showError("Upgrade failed. Please try again");
						}
   					},
   						error: function(err){
   							showObject(err);
   					}
   
				});

				sessionStorage.likeID=response.id;
         	}
       	}
    	);
  	}
			
	
	function postScore()
	{	
		var data=JSON.parse(localStorage.tennisApp);
		if(data.membership!="GOLD"){
			alert('Only available to GOLD members.');
			return;
		}
		
		var playerOneFb=$('#S3P1').text()+'|';
		playerOneFb+=$('#S2P1').text()+'|';
		playerOneFb+=$('#GAMESP1').text()+'|';
		playerOneFb+=$('#PP1').text()+'|...';
		playerOneFb+=match.playerOneName;
		
		
		var playerTwoFb=$('#S3P2').text()+'|';
		playerTwoFb+=$('#S2P2').text()+'|';
		playerTwoFb+=$('#GAMESP2').text()+'|';
		playerTwoFb+=$('#PP2').text()+'|...';
		playerTwoFb+=match.playerTwoName

		
		FB.ui(
  		{
			method: 'feed',
    		name: match.title,
    		caption: playerOneFb,
    		description: playerTwoFb, 
    		picture: 'http://www.foxenet.com/TennisUmpire/img/tennisIcon.png',
    		
     	},
  		function(response) {
    		if (response && response.post_id) {
      			showError('Score posted to Facebook');
    		}
			 else {
      				showError('Score not updated.');	
    			}
  			}
		);
	}
	
	function buyTokens()
	{
	
		
	}
