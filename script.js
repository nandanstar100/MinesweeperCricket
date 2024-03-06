var components = {
    num_of_fielders: 11,
    alive: true,
   balls:0,
   out:0,
   prevscore:0,
   prevballs:0,
   target:0,
   highscore:0,
   highSR:0,
   highscoreid:"player0",//initiales to player0
   highSRid:"playerSR0",
   duck:'🐤',
   bat:'🏏'
  };

  function startGame() {
    var gridSize = document.getElementById('gridSize').value;
    //takes gridsize as Input
    var wickets= document.getElementById('wickets').value;
    //takes number of wickets as input
    var num_of_rows = gridSize;
    generatetarget(wickets);
    components.fielders = placeFielders(num_of_rows);
    document.getElementById('field').innerHTML = createTable(num_of_rows);
    //changes the layout.displays some elements and hides rest of the elements
    document.getElementById('field').style.backgroundImage="url('cricketphoto.jpg')";

    document.getElementById('score').textContent = 'Score: 0' ;

    document.getElementById('gamestart').style.display="none";

    document.getElementById('scorecard').style.display="block";

    document.getElementById('scoreballwicket').style.display="block";

    document.getElementById('targetdisplay').style.display="block";

    document.getElementById('rules').style.display="none";

    window.scrollTo(0,document.body.scrollHeight);//scrolls the page down
  }

  function placeFielders(num_of_rows) {
    //places 11 fielders randomly and runs until all 11 fielders are placed
    var fielders = [];
    var fielders_count = 0;
    while (fielders_count <components.num_of_fielders) {
      //considers the table as matrix and generates indices for row and column randomly for where the fielders has to be placed
      var nrow = Math.floor(Math.random() * num_of_rows);
      var ncol = Math.floor(Math.random() * num_of_rows);
  
      if (!fielders[nrow]) {
        fielders[nrow] = [];
      }
  
      if (!fielders[nrow][ncol]) {
        fielders[nrow][ncol] = true;
        fielders_count++; // Increment the counter
      }
    }

    return fielders;
    //returns it to startgame function
  }


  function createTable(num_of_rows) {
    //create table
    var table = '<tbody>';

    for (var i = 0; i < num_of_rows; i++) {
      table += '<tr>';

      for (var j = 0; j < num_of_rows; j++) {
        table += '<td onclick="handleCellClick(this, ' + i + ', ' + j + ')"></td>';
      }
    }
    return table;
  }

  function scorecardcreate(wickets) {
      // Creates scorecard elements and gets updated after every wicket
      if (components.out != wickets) {
        // Create a container element to hold the 3 elements
        var container = document.createElement('div');
        container.style.display = 'flex'; // Set the container to use flexbox layout
        
        // Create the element to show the batsman's score
        var newElement = document.createElement('p');
        var playerId = "player" + components.out;
        newElement.id = playerId;
        newElement.textContent = 'player' + components.out + '🏏: ' + 0;
        container.appendChild(newElement); // Append to the container
        
        // Create the element to show how many balls the batsman had placed
        var newElementball = document.createElement('p');
        var playerBallId = "playerball" + components.out;
        newElementball.id = playerBallId;
        newElementball.textContent = 'balls' +  ':' + 0;
        newElementball.style.fontSize='27px';

        // Create the element to show strikerate
        var newElementSR = document.createElement('p');
        var playerSRId = "playerSR"+components.out;
        newElementSR.id = playerSRId;
        newElementSR.textContent = 'SR' + ':' + 0;
        newElementSR.style.fontSize='27px';
        container.appendChild(newElementball); 
        container.appendChild(newElementSR); 

        //combine all three elements
        var scorecardContainer = document.getElementById('scorecard');
        scorecardContainer.appendChild(container);
      }
    }
    


  function generatetarget(wickets){
    //generates target based on number of wickets
      if(wickets==1){
          components.target=(Math.floor(Math.random() * 40)+1)
      }
      if(wickets==2){
          components.target=(20+Math.floor(Math.random() * 60))
      }
      if(wickets==5){
          components.target=(40+Math.floor(Math.random() * 60));
      }
      if(wickets==6){
          components.target=(60+Math.floor(Math.random() * 60))
      }
      document.getElementById('target').textContent=components.target;
  }
  function usescore(){
    return parseInt(document.getElementById('score').textContent.split(':')[1].trim(), 10) 
    //returns the element printed as score in webpage
  }
  
  //handles each cellclick
  function handleCellClick(cell, i, j) {
    if (!components.alive || components.target<=usescore()||cell.textContent||cell.style.backgroundImage) {
      window.scrollTo(0,document.body.scrollHeight);
      return;
    }

    if (components.fielders[i] && components.fielders[i][j]) {
      cell.style.backgroundImage="url('wickets.jpeg')"//places an image in the cell
      cell.style.backgroundSize="100%";//fits image in cell
      components.balls=components.balls +1;
      Overs();//updates overs
      generaterunrate(); //updates Runrate

      var wickets= document.getElementById('wickets').value;
      components.out=components.out+1;//updates how many are out
      scorecardcreate(wickets); //adds scorecard for new player
      components.prevscore= usescore();//stores the sum of scores of all previous batsmen
      components.prevballs= components.balls;//stores the sum of balls played by all the previous batsmen

      var justoudidball= "playerball"+(components.out-1); //id of element who just got out
      var justoudid= "player"+(components.out-1);
      if(parseInt(document.getElementById(justoudid).textContent.split(':')[1].trim(), 10)==0){
        document.getElementById(justoudid).textContent='player'+(components.out-1)+':'+components.duck;
      }

      if(components.out==1){
          document.getElementById(justoudidball).textContent='balls:'+components.balls;
          var x=document.getElementById(justoudid).textContent.split(':')[1].trim();
          document.getElementById(justoudid).textContent='player0:'+x;
          //do this part immediately after first wicket
      }
      else{
          var prevb=parseInt(document.getElementById(justoudidball).textContent.split(':')[1].trim(), 10);
          var prevs=document.getElementById(justoudid).textContent.split(':')[1].trim();
          document.getElementById(justoudid).textContent='player'+(components.out-1)+':'+prevs;
          document.getElementById(justoudidball).textContent='balls:'+(prevb+1 );}

      document.getElementById('wicketstaken').textContent='wickets:'+(parseInt(document.getElementById('wicketstaken').textContent.split(':')[1].trim())+1);
      SRgenerator(components.out-1)//updates Strikerate
      if(components.out==wickets){
               gameOver();  //condition checks whether game is over
      }

    } else {
      
      //updates balls bowled after every ball
      var score = Math.floor(Math.random() * 7);//generates a random number between 0 and 6(included) which is the runs you get that ball
      cell.textContent = score;
      cell.style.fontSize='30px';
      cell.style.color='yellow';
      cell.style.backgroundColor='green'
      components.balls=components.balls +1;
      Overs();
      updateScore(score);//updates score after every ball
      generaterunrate();
      var notoudid = "player"+components.out;
      var notoudidball= "playerball"+components.out;
      //below code is used for updating scorecard
      if(components.out==0){
          document.getElementById(notoudid).textContent='player0🏏:'+usescore();
          document.getElementById(notoudidball).textContent='balls:'+components.balls;
      }
      else{
      document.getElementById(notoudid).textContent='player'+components.out+'🏏:'+(usescore()-components.prevscore);
      document.getElementById(notoudidball).textContent='balls:'+(components.balls-components.prevballs);
      }
      SRgenerator(components.out)
      checkwin();//checks if target is reached
    }
  }

  function updateScore(score) {
    //updates the displayed code
    var scoreElement = document.getElementById('score');
    var currentScore = parseInt(scoreElement.textContent.split(':')[1].trim(), 10);
    scoreElement.textContent = 'Score: ' + (currentScore + score);
    sixmeter(score);

  }
  
  function checkwin(){
    //if target is reached following things are done
  if(components.target<=parseInt(document.getElementById('score').textContent.split(':')[1].trim(), 10)){
    components.alive = false; //stops the game
    document.getElementById('lost').style.display="block";
    document.getElementById('lost').innerHTML = "YOU WON BY " + (document.getElementById('wickets').value-components.out)+ " wickets";
    //displays by how many wickets did you win
    var newGameButton = document.createElement('button');
    newGameButton.type = "button";
    newGameButton.innerHTML = "NEW GAME";
    newGameButton.onclick = function() {
    location.reload();
     };
     //creates a button by which on clicking a new game starts
    document.getElementById('lost').appendChild(newGameButton); //places new game button adjacent to text
    document.getElementById('field').style.display="none";//removes the table
    document.getElementById('image').style.display="block";//adds an image that you won
    var newElement = document.createElement('p');
    var Id="manofthematch"//creates an id to display man of the match at bottom of the scorecard
    newElement.id = Id;
    var container = document.getElementById('scorecard');
    container.appendChild(newElement);
    var newElement = document.createElement('p');
    var Id="strikerofthematch"//creates an id to display striker of the match at below man of the match
    newElement.id = Id;
    container.appendChild(newElement);
    manofthematch();
    strikerofthematch();
    document.getElementById('scorecard').style.width='100%';
      }

  }
  
  function gameOver() {
    //runs if you lost
    components.alive = false; //stops game
    document.getElementById('lost').style.display="block";
    document.getElementById('lost').innerHTML = "ALL OUT lost by " + (components.target - parseInt(document.getElementById('score').textContent.split(':')[1].trim(), 10)) + " runs";
    var newGameButton = document.createElement('button');//again creates a new button
    newGameButton.type = "button";
    newGameButton.innerHTML = "TRY AGAIN";
    newGameButton.onclick = function() {
    location.reload();
     };
    document.getElementById('lost').appendChild(newGameButton);//places button beside text
    document.getElementById('image').src="youlost.jpeg";
    document.getElementById('field').style.display="none";
    document.getElementById('image').style.display="block";
  }
  function reload(){
    //refreshes the entire webpage
      window.location.reload();
    }
  function manofthematch(){
    //searches for the batsman who hit the maximum score and awards him man of the match
    for(i=0;i<components.out+1;i++){
      var scoreElement="player"+i
      playerscore=parseInt(document.getElementById(scoreElement).textContent.split(':')[1].trim(), 10)
      if(playerscore>components.highscore){
        components.highscore=playerscore;
        components.highscoreid=scoreElement;
      }
    }
    document.getElementById('manofthematch').textContent='man of the match is '+(components.highscoreid);
    document.getElementById('manofthematch').style.fontSize='40px';
  }
  function sixmeter(score){
    //whenever a score in a cell becomes 6 it updates the number of sixes
     if(score==6){
      var sixes=parseInt(document.getElementById('sixmeter').textContent.split(':')[1].trim());
      document.getElementById('sixmeter').textContent='Six-O-meter:'+(sixes+1);
     }
  }
  function Overs(){
    //displays overs happened till now and updates after every click
      document.getElementById('overs').textContent='Overs:'+(parseInt(components.balls/6))+'.'+(components.balls%6)
  }
  function SRgenerator(x){
     //generates strikerate for each batsman and updates after everyclick
      var SRid='playerSR'+x;//id for strikerate of player
      var scoreid='player'+x;//id for score of player
      var ballid='playerball'+x;//id for balls faced by a player
      if(parseInt(document.getElementById(ballid).textContent.split(':')[1].trim())!=0){
          if(document.getElementById(scoreid).textContent.split(':')[1].trim()!=components.duck)
          document.getElementById(SRid).textContent='SR:'+Math.floor(100*(parseInt(document.getElementById(scoreid).textContent.split(':')[1].trim()))/parseInt(document.getElementById(ballid).textContent.split(':')[1].trim()))
      }
  }
  function strikerofthematch(){
    //displays which batsman has the highest strikerate 
      for(i=0;i<components.out+1;i++){
          var SRid="playerSR"+i
          playerSR=parseInt(document.getElementById(SRid).textContent.split(':')[1].trim(), 10)
          if(playerSR>components.highscore){
            components.highscore=playerSR;
            components.highscoreid=SRid;
          }
        }
        document.getElementById('strikerofthematch').textContent='superstriker of the match is player'+(components.highscoreid.split('R')[1]);
        document.getElementById('strikerofthematch').style.fontSize='40px';

  }
  function generaterunrate(){
    //displays runrate and updates after every click
      var scoreElement = document.getElementById('score');
      var currentScore = parseInt(scoreElement.textContent.split(':')[1].trim(), 10);
      document.getElementById('RR').textContent='RunRate:'+Math.floor(6*100*currentScore/components.balls)/100
  }
