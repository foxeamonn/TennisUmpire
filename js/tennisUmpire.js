	var points=new Array();
	var point=new Object();
	var match=new Object();
	var application=new Object();
	var pointNames=['00','15','30','40','AD',''];
	var current=0;
	var pointsPlayerOne=0;
	var pointsPlayerTwo=0;
	var pointType='Normal';
	var tieBreakPoint=0;
	var deuce=false;
	var wonPoint=0;
	var wonGame=0;
	var setNumber=1;
	var currentServer=1;
	var oldServer=0;
	var setsP1=0;
	var setsP2=0;
	var html='';
	
	// start of jquery load function 
	$(function() {
		checkUser();
		if(match.status!='ON')
		{
			setHeadings();
			reset();
			loadData();
			showScore(point);
			$('#undoPoint').addClass('ui-disabled');
			$('#scoreBoard').addClass('ui-disabled');
			$('#post').addClass('ui-disabled');
		}
		var data=JSON.parse(localStorage.tennisApp);
		if(data.membership=="NONE"||!data.membership){
			$('#editTitle').addClass('ui-disabled');
			$('#editPlayers').addClass('ui-disabled');
			$('#editScore').addClass('ui-disabled');
		}	
		
	});
	//end of jquery load function
	
	function startMatch()	// ********** start match **************
	{
		
		var data=JSON.parse(localStorage.tennisApp);
		if(data.membership=="NONE"||!data.membership){
			alert('You need to activate this device. \nSee HELP for more details.');
			return;
		}	

		$('#scoreBoard').removeClass('ui-disabled');		
		$('#start').addClass('ui-disabled');
		$('#serverOne').show();
		match.status="ON";
		currentServer=1;
		$('#post').removeClass('ui-disabled');
		$('#editTitle').addClass('ui-disabled');
		$('#editPlayers').addClass('ui-disabled');
		$('#editScore').addClass('ui-disabled');
	}
	
	function stopMatch()
	{
		if(!confirm('Are you sure you want to reset')) return;
		reset();
		document.location="playMatch.html";
	}
	
	
	function undo()  // ************ undo point *****
	{
		points.pop();
		current=points.length;
		point=JSON.parse(points[current-1]);
		showScore(point);
		if(current<2) $('#undoPoint').addClass('ui-disabled');
		$('#scoreBoard').removeClass('ui-disabled');
		if(sessionStorage.uid&&navigator.onLine) $('#post').removeClass('ui-disabled');
	}

	function reset()
	{
		match={
			"status":"OVER",
			"playerOneName":"Player One",
			"playerTwoName":"Player Two",
			"umpire":false,
			"title":"The match"
			};
			
		point={
			"server":1,
			"set3P1":0,
			"set3P2":0,
			"set2P1":0,
			"set2P2":0,
			"setsP1":0,
			"setsP2":0,
			"s1":0,
			"s2":0,
			"gamesP1":0,
			"gamesP2":0,
			"pointsP1":0,
			"pointsP2":0,
			"pointType":'Normal',
			"setNumber":1
			
			};
			
		clearArray(points);
		points.push(JSON.stringify(point));
		current=0;
		setNumber=1;
		setsP1=0;
		setsP2=0;
		currentServer=1;
		//showScore(point);
		
	}
	
	
	//*********************** data at start ********************
	function loadData()
	{
		$('#mainHdr').text(match.title);
		$('#buttonOne').text(match.playerOneName);
		$('#buttonTwo').text(match.playerTwoName);
	}
	
	//************************* show score ********************
	function showScore(p)
	{
		var pointDescOne=p.pointsP1;
		var pointDescTwo=p.pointsP2;
		if(p.pointType!='tieBreak')
		{			
			pointDescOne=pointNames[pointDescOne];
			pointDescTwo=pointNames[pointDescTwo];
		}
		
		$('#S3P1').text(p.set3P1);
		$('#S3P2').text(p.set3P2);
		$('#S2P1').text(p.set2P1);
		$('#S2P2').text(p.set2P2);
		$('#GAMESP1').text(p.gamesP1);
		$('#GAMESP2').text(p.gamesP2);		
		$('#PP1').text(pointDescOne);
		$('#PP2').text(pointDescTwo);
		
	}
	
	//************************ update point *********************
	function putPoint(p)
	{
		pointsPlayerOne=point.pointsP1;
		pointsPlayerTwo=point.pointsP2;
		pointType=point.pointType;
		wonPoint=p;
		(p===1) ? pointsPlayerOne++ : pointsPlayerTwo++;
		point.pointsP1=pointsPlayerOne;
		point.pointsP2=pointsPlayerTwo;

		if(pointType=='Deuce') {
			playDeuce();
			return
		}
		if(pointType=='tieBreak'){
			playTieBreak();
			return;
		}
		if(pointsPlayerOne===3&&pointsPlayerTwo===3) {
			point.pointType='Deuce';
			updPoints();
			return;
		}
		
		if(isGameOver()===false) updPoints();
	}		
	
	
	function updPoints()
	{
		current++;
		points.push(JSON.stringify(point));
		$('#undoPoint').removeClass('ui-disabled');
		match.status='ON';
		showScore(point);
	}
	
	
	//************************ check is game over ********************
	function isGameOver()
	{
		if(pointsPlayerOne<4&&pointsPlayerTwo<4) return false; // no player has reached 40
		updGames();  //game over
		return true;
	}
	
	//*********************** update games ********************************
	function updGames()
	{
		var games=0;
		
		if(wonPoint===1)
		{
			games=point.gamesP1;
			games++;
			point.gamesP1=games;
			
		}
		else
		{
			games=point.gamesP2;
			games++;
			point.gamesP2=games;
		
		}
		if(isSetOver()===false)	newGame();
	}

	
	//*************************** tiebreak ***************************
	function playTieBreak()
	{
		if(oldServer===0) oldServer=currentServer;
		tieBreakPoint++;
		var dif=Math.abs(pointsPlayerOne-pointsPlayerTwo);
		if(tieBreakPoint===2)
		{
			changeServer();
			tieBreakPoint=0;
		}
				
		if(pointsPlayerOne>6&&dif>1)
		{
			point.gamesP1=7;
			setOver();
			return;
		}
		if(pointsPlayerTwo>6&&dif>1)
		{
			point.gamesP2=7;
		 	setOver();
			return;
		}
		updPoints();
		
	}
	
	//*************************** check is set over ***********************
	function isSetOver()
	{
		var games1=point.gamesP1;
		var games2=point.gamesP2;
		if(games1<6&&games2<6) return false;
		if(games1===6&&games2===6)  // tiebreak
		{
			point.pointType='tieBreak';
			tieBreakPoint=1;
			oldServer=0;
			updPoints();
			return false;
		}
		var dif=Math.abs(games1-games2);
		if(dif<2) return false;
		if(games1>5||games2>5){
			 setOver();
			return true;
		}
	}
	
	
	function setOver()
	{
		//showObject(point);
		setsP1=point.s1;
		setsP2=point.s2;
		setNumber=point.setNumber;
		
		(wonPoint===1) ? setsP1++ : setsP2++;
		
		point.set3P1=point.set2P1;
		point.set3P2=point.set2P2;
		
		if(setNumber===1)
		{	
			point.set2P1=point.gamesP1;
			point.set2P2=point.gamesP2;
		}
				
		if(setNumber===2)
		{	
			point.set2P1=point.gamesP1;
			point.set2P2=point.gamesP2;
		}
		
		
		setNumber++;
		point.setNumber=setNumber;
		if(oldServer>0&&currentServer===oldServer) changeServer();  // set decided by tie-break, server is whoever served first point of breaker
		
		if(setsP1===2||setsP2===2){
			matchIsOver();
			return true;
		}
		
		point.pointType='Normal';
		point.s1=setsP1;
		point.s2=setsP2;
		point.gamesP1=0;
		point.gamesP2=0;
		newGame();
		return true;		
	}
	
	//************************* check is match over *************************
	function matchIsOver()
	{
		updPoints();
		if(setNumber==3)
		{
			$('#GAMESP1').text('');
			$('#GAMESP2').text('');
			
		}	
		$('#PP1').text('');
		$('#PP2').text('');
		$('#scoreBoard').addClass('ui-disabled');
		match.status='OVER';
	}

	
	// ************************************ deuce ************************
	function playDeuce()
	{
		
		if(pointsPlayerOne===4&&pointsPlayerTwo===4)
		{
			point.pointsP1=3;
			point.pointsP2=3;
			updPoints();
			return;
		}
		if(pointsPlayerOne===5||pointsPlayerTwo===5){
			point.pointType='Normal';
			updGames();  // game over
			return;
		}
		updPoints();
	}
		
		
	//************************** new game **********************
	function newGame()
	{
		if(match.status=='OVER') return;
		point.pointsP1=0;
		point.pointsP2=0;
		changeServer();
		updPoints();
	}
	
	//************************** change server *****************
	function changeServer()
	{
		currentServer=point.server;
		if(currentServer==1)
		{
			$('#serverOne').hide();
			$('#serverTwo').show();
			point.server=2;
		}
		else
		{
			$('#serverOne').show();
			$('#serverTwo').hide();
			point.server=1;
		}
	}
	
//********************** update title ***********************
	function updTitle()
	{
		var E=document.getElementById("matchTitle");
		var title=E.value;
		if(title.length>2){
			match.title=title;
			$('#mainHdr').text(match.title);
		}
		return true;
	}
	
	//*************** update player names ********
	function updPlayers()
	{
		ok=true;
		var playerOneName=document.getElementById('playerOneName').value;
		var playerTwoName=document.getElementById('playerTwoName').value;
		if(playerOneName.length<3){
			showError('Server name must be at least 3 characters');
			ok=false;
			}
		else{
			$('#buttonOne').text(playerOneName);
			match.playerOneName=playerOneName;
		}
		
		if(playerTwoName.length<3){
			showError('Receiver name must be at least 3 characters');
			ok=false;
			}
		else{
			$('#buttonTwo').text(playerTwoName);
			match.playerTwoName=playerTwoName;
		}

		return ok;
	}
	
	//*************** swap players ****************************
	function swapPlayers()
	{
		
		var p1=match.playerOneName;
		var p2=match.playerTwoName;
		
		document.getElementById('playerOneName').value=p2;
		match.playerOneName=p2;
		
		document.getElementById('playerTwoName').value=p1;
		match.playerTwoName=p1;

	}
	
	
	function setHeadings()
	{
		$('#mainHdr').text(match.title);
		$('#buttonOne').text(match.playerOneName);
		$('#buttonTwo').text(match.playerTwoName);
		$('#serverOne').hide();
		$('#serverTwo').hide();
	}
	
		
	