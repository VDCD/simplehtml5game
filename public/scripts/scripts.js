		var snd = new Audio("../sounds/PetitPoney.mp3"); // buffers automatically when created
		var sndRUSSIA = new Audio("../sounds/RUSSIA.mp3"); // buffers automatically when created
		var sndLaser = new Audio("../sounds/laser.mp3");
		var sndPiquette = new Audio("../sounds/piquette.mp3");
		snd.play();

window.onload = function() { // Pour accéder au canvas, on va le transformer en objet .
	 // Or : $(document).ready(function({
	 //       });
	//       )
	// Mais toujours mieux d'éviter jQuery

		var game = {};
		game.width = 550;
		game.height = 800;

		game.over = false;
		game.messageOver = false;
		game.win = false;

		game.player = {
			x : game.width/2 - 75/2,
			y : game.height-75 - 25,
			width : 75,
			height : 75,
			speed : 7,
			rendered : false,
			image : 0,
			dead : false,
			deadTime : 10
		}

		game.keys = [];
		game.poneys = [];
		game.bullets = [];
		game.bulletsPoney = [];
		game.stars = [];
		game.images = [];
		game.doneImages = 0; // how many images are loaded
		game.requiredImages = 0; // how many images should be loaded

		game.count = 24;
		game.division = 48;
		game.left = false;
		game.poneySpeed = 3;

		game.fullShootTimer = 10;
		game.shootTimer = game.fullShootTimer; // rate of fire
		game.bulletSpeed = 15;
		game.deadNum = 0;
		game.bulletPoneySpeed = 8;
		game.ennemyShootTimer = 250;
		game.playerDeathCountDown = 0;
		game.difficulty = 0;


	// On va prendre le "context" du canvas, qu'on va utiliser pour dessiner.
	game.contextBackground = document.getElementById("backgroundCanvas").getContext("2d");
	game.contextPlayer = document.getElementById("playerCanvas").getContext("2d");
	game.contextPoney = document.getElementById("poneyCanvas").getContext("2d");
	game.contextBullets = document.getElementById("bulletsCanvas").getContext("2d");
	game.contextBulletsPoney = document.getElementById("bulletsPoneyCanvas").getContext("2d");
	game.contextMessage = document.getElementById("endMessageCanvas").getContext("2d");

	//Presse la touche
	$(document).keydown(function(e){
		game.keys[e.keyCode ? e.keyCode : e.which] = true;  // Pour les autres browsers on met e.wich
	});

	//Relâche la touche
	$(document).keyup(function(e){
		delete game.keys[e.keyCode ? e.keyCode : e.which];  // Pour les autres browsers on met e.wich
	});

	function addBullet(){
		sndLaser.pause();
		sndLaser.currentTime = 0;
		game.bullets.push({
			x : game.player.x +game.player.width/2 -25 - 10,
			y : game.player.y,
			size : 25,
			image : 2
		});
		game.bullets.push({
			x : game.player.x + game.player.width/2 - 25 +35,
			y : game.player.y,
			size : 25,
			image : 2
		});
		sndLaser.play();
	}

	function addBulletPoney(xp, yp){
		game.bulletsPoney.push({
			x : xp,
			y: yp,
			size : 25,
			image : 4
		});
	}

	function init(){

		for(i=0; i<500; i++){
			game.stars.push({
				x : Math.floor(Math.random()*game.width),
				y: Math.floor(Math.random()*game.height -5),
				size : Math.random()*5
			});
		}
		for(i in game.stars){
			// la variable stars[i] a la même configuration que les variables demandées
			// dans la fonction fillRect. On peut le faire car c'est une variable locale
			// contenant les mêmes valeurs que les vraies. On ne peut pas le faire pour
			// changer les valeurs car on ne changerait que celles de la variable locale.
			var star = game.stars[i];
			game.contextBackground.fillRect(star.x, star.y, star.size, star.size);
		}

		//Poneys
		for(y = 0 ; y<4; y++){
			for(x=0; x<5; x++){
				game.poneys.push({
					x : (x* 80) + 85,
					y : (y* 85) + 10,
					width : 70,
					height : 70,
					image : 1,
					dead : false,
					deadTime : 5,
					fireCountDown : Math.floor(Math.random()*game.ennemyShootTimer +game.difficulty)
				});
			}
		}

		loop();
		game.contextPlayer.drawImage(game.images[0],game.player.x, game.player.y, game.player.width,game.player.width);
		// game.contextPoney.drawImage(game.images[1],game.width/4 - 50, 30, 100,100);
		// game.contextPoney.drawImage(game.images[1],game.width/2 - 50, 30, 100,100);
		// game.contextPoney.drawImage(game.images[1],3*game.width/4 - 50, 30, 100,100);
	}


	function addStars(num){
		for(i=0; i<num; i++){
			game.stars.push({
				x : Math.floor(Math.random()*game.width),
				y: -10,
				size : Math.random()*5
			});
		}
	}

	function update(){
		if(!game.over){
			addStars(1);
			game.count++;

			if(game.shootTimer>0) game.shootTimer--;

			for(i in game.stars){
				game.stars[i].y+=3;
				if(game.stars[i].y >= game.height +10){
					game.stars.splice(i,1); // delete the 1 element after the ith position
				}
			}

			// console.log(game.stars.length);
			/*
				UP : 38 &    Z : 90 & W : 87
				DOWN : 40 &  S : 83
				LEFT : 37 &  A : 65 & Q : 81
				RIGHT : 39 & D : 68
				SPACE : 32

			 */
			if(game.keys[38] || game.keys[90] || game.keys[87]){
				game.player.rendered = true;
				game.player.y-=game.player.speed;
			}

			if(game.keys[37] || game.keys[65] || game.keys[81]){
				game.player.rendered = true;
				game.player.x-=game.player.speed;
				if(game.player.x <= -90){
				game.player.x = game.width;
				}
			}

			if(game.keys[39] || game.keys[68]){
				game.player.rendered = true;
				game.player.x+=game.player.speed;
				if(game.player.x >= game.width){
					game.player.x = -25;
				}
			}

			if(game.keys[40] || game.keys[83]){
				game.player.rendered = true;
				game.player.y+=game.player.speed;
				game.player.rendered = true;
			}

			if(game.player.y > game.height -80){
				game.player.y = game.height - 80;
			}
			if(game.player.y < 0){
				game.player.y = 0;
			}



			//timer pour faire bouger le jeu.
			if(game.count % game.division == 0){
				game.left = !game.left;
			}

			//poneys
			for(i in game.poneys){
				if(game.left){
					game.poneys[i].x -= game.poneySpeed;
				}else{
					game.poneys[i].x += game.poneySpeed;
				}
			}

			//bullets

			if(game.keys[32] && game.shootTimer <= 0){
				addBullet();
				game.shootTimer = game.fullShootTimer;
			}

			for(i in game.bullets){
				game.bullets[i].y-= game.bulletSpeed ;
				/*if(game.bullets[i].y <= -game.bullets[i].size){
					game.bullets.splice(i,2);
				}*/
			}

			for(i = game.bullets.length-1;i==0;i-=2){
				if(game.bullets[i].y <= -game.bullets[i].size){
					game.bullets.splice(i,2);
				}
			}

			for (p in game.poneys){
				for(b in game.bullets){
					if(collisionRect(game.poneys[p], game.bullets[b])){
						if(!game.poneys[p].dead){
							game.deadNum++;
							game.contextBullets.clearRect(game.bullets[b].x, game.bullets[b].y-10,game.bullets[b].size, game.bullets[b].size + 30);
							game.poneys[p].dead = true;
						}
						//sndBoom.play()
						game.bullets.splice(b,1);
						game.poneys[p].image = 3;
					};
				}
			}

			for(i in game.poneys){
				if(game.poneys[i].dead){
					game.poneys[i].deadTime--;
				}
				if(game.poneys[i].dead && game.poneys[i].deadTime <= 0){
					game.contextPoney.clearRect(game.poneys[i].x-10, game.poneys[i].y-10, game.poneys[i].width+100, game.poneys[i].height+20);
					game.poneys.splice(i,1);
				}
			}

	// Fire bullets

			for(i in game.poneys){
				if(game.poneys[i].fireCountDown>game.ennemyShootTimer){
					game.poneys[i].fireCountDown = 0;
					//FIIIIIIIIIIIIIIIIRRRRRRREEEEEEEEEEE
					addBulletPoney(game.poneys[i].x + game.poneys[i].width/2, game.poneys[i].y + game.poneys[i].height - 30);
					}
					else{
				game.poneys[i].fireCountDown++;
				}
				if(game.deadNum<=5){
					game.bulletPoneySpeed = 4;
				}else if(game.deadNum <=12){
					game.bulletPoneySpeed=8;
					game.difficulty = 5;
					for(i in game.poneys){
						game.poneys[i].fireCountDown = Math.floor(Math.random()*250 + game.difficulty);
					}
				}else{
					game.bulletPoneySpeed = 12;
					game.difficulty = 10;
					for(i in game.poneys){
						game.poneys[i].fireCountDown = Math.floor(Math.random()*250 + game.difficulty);
					}
				}
			}

			for(i in game.bulletsPoney){
				game.bulletsPoney[i].y+=game.bulletPoneySpeed;
				if(game.bulletsPoney[i].y >= game.height +25){
					game.bulletsPoney.splice(i,1); // delete the 1 element after the ith position
				}
			}

				for(b in game.bulletsPoney){
					if(collisionRect(game.player, game.bulletsPoney[b])){
						game.player.dead = true;
						game.player.image = 3;
						game.contextBulletsPoney.clearRect(game.bulletsPoney[b].x, game.bulletsPoney[b].y-10,game.bulletsPoney[b].size, game.bulletsPoney[b].size + 30);
						game.bulletsPoney.splice(b,1);
						game.over = true;
						for(i in game.poneys){
							game.poneys[i].image = 5;
						}
					};
				}
			}

			if(game.deadNum == 20){
				game.win = true;
			}
	}

	function render(){
		if(!game.over && !game.win){
			game.contextBullets.clearRect(0,0,game.width,game.height);
			game.contextBackground.clearRect(0,0,game.width,game.height);
			game.contextBackground.fillStyle = "white";
			for(i in game.stars){
				// la variable stars[i] a la même configuration que les variables demandées
				// dans la fonction fillRect. On peut le faire car c'est une variable locale
				// contenant les mêmes valeurs que les vraies. On ne peut pas le faire pour
				// changer les valeurs car on ne changerait que celles de la variable locale.
				var star = game.stars[i];
				game.contextBackground.fillRect(star.x, star.y, star.size, star.size);
				if(game.player.rendered){
					game.contextPlayer.clearRect(game.player.x-10,game.player.y - 10,100,100);
					game.contextPlayer.drawImage(game.images[game.player.image],game.player.x, game.player.y, game.player.width,game.player.height);
				}
			}

			for(i in game.poneys){
				var poney = game.poneys[i];
				game.contextPoney.clearRect(poney.x - 10, poney.y, poney.width+10, poney.height);
				game.contextPoney.drawImage(game.images[poney.image],poney.x, poney.y, poney.width, poney.height)
			}

			for(i in game.bullets){
				var proj = game.bullets[i];
				game.contextBullets.clearRect(proj.x,proj.y,proj.size,proj.size+20);
				game.contextBullets.drawImage(game.images[proj.image], proj.x, proj.y, proj.size, proj.size);
			}

			for(i in game.bulletsPoney){
				var projP = game.bulletsPoney[i];
				game.contextBulletsPoney.clearRect(projP.x, projP.y-25, projP.size, projP.size+20);
				game.contextBulletsPoney.drawImage(game.images[projP.image], projP.x, projP.y, projP.size,projP.size);
			}
		}else if(game.over && !game.win){

			game.contextMessage.fillStyle = "white";
			game.contextMessage.fillRect(game.width/2-150, game.height/2 - 150,310,67);

			game.contextMessage.fillStyle = "black";
			game.contextMessage.fillRect(game.width/2-145, game.height/2 - 145,300,57);

			game.contextMessage.fillStyle = "yellow";
			game.contextMessage.font="50px Georgia";
			game.contextMessage.fillText("T'ES NUL !!",game.width/2 - 125,game.height/2-100);
			game.contextPlayer.clearRect(game.player.x-10,game.player.y - 10,100,100);
			game.contextPlayer.drawImage(game.images[game.player.image],game.player.x, game.player.y, game.player.width,game.player.height);

			snd.pause();
			snd.currentTime = 0;

			if(!game.messageOver){
				sndPiquette.currentTime = 0;
				sndPiquette.play();
				game.messageOver = true;
			}

			for(i in game.poneys){
				var poney = game.poneys[i];
				game.contextPoney.clearRect(poney.x - 10, poney.y, poney.width+10, poney.height);
				game.contextPoney.drawImage(game.images[poney.image],poney.x, poney.y, poney.width, poney.height)
			}

			game.contextMessage.drawImage(game.images[7],0, game.height-441, 550,441);
			game.contextBullets.clearRect(0,0,game.width,game.height);
			game.contextBulletsPoney.clearRect(0,0,game.width,game.height);

			game.contextMessage.fillStyle = "white";
			game.contextMessage.fillRect((game.width/2 -170), 20, 350,100);
			game.contextMessage.fillStyle = "black";
			game.contextMessage.fillRect((game.width/2 -165), 25, 340,90);

			game.contextMessage.fillStyle = "yellow";
			game.contextMessage.font="50px Georgia";
			game.contextMessage.fillText("Press ENTER ",game.width/2 - 145,85);

			if(game.keys[13]){
			relaunch();
			}


		}else if(game.win){
			game.contextMessage.fillStyle = "white";
			game.contextMessage.fillRect(game.width/2-185, game.height/2 - 150,390,67);

			game.contextMessage.fillStyle = "black";
			game.contextMessage.fillRect(game.width/2-180, game.height/2 - 145,380,57);

			game.contextMessage.fillStyle = "yellow";
			game.contextMessage.font="50px Georgia";
			game.contextMessage.fillText("TU SENS BON !! ",game.width/2 - 175,game.height/2 -100);

			snd.pause();
			snd.currentTime = 0;

			sndRUSSIA.play();

			game.contextMessage.drawImage(game.images[6],0, game.height-game.width/1.46, game.width,game.width/1.46);
			game.contextBullets.clearRect(0,0,game.width,game.height);
			game.contextBulletsPoney.clearRect(0,0,game.width,game.height);
		}
	}

	function loop(){
		requestAnimFrame(function(){
			loop();
		});
		//Ici on place le jeu
		update();
		render();
	}



	function initImages(paths){
		game.requiredImages = paths.length;
		for(i in paths){
			var img = new Image();
			img.src = paths[i];
			game.images[i] = img;
			game.images[i].onload = function(){
				game.doneImages++; // On signifie que l'image est chargée
			}
		}
	}

	function checkImages(){
		if(game.doneImages>= game.requiredImages){
			init();
		}else{
			setTimeout(function(){
				checkImages();},1);

		}
	}


	function collisionRect(rect1, rect2){

	return !(rect1.x+rect1.width/3 > rect2.x + rect2.size ||
		rect1.x+rect1.width -rect1.width/3<rect2.x ||
		rect1.y+rect1.height/3 > rect2.y + rect2.size||
		rect1.y + rect1.height - rect1.height/3 < rect2.y);
	}
	// game.contextBackground.font = "bold 30px monaco";
	// game.contextBackground.fillStyle = "white";
	// game.contextBackground.fillText("Game is loading", game.width/3, game.height/2 - 30);
	initImages(["../img/player.png","../img/poney.png","../img/bullet.png","../img/explosion.png","../img/bulletPoney.png","../img/taynul.png","../img/poutin.png","../img/taynulFond.png"]);
	checkImages();
	//init();



	// //Comme setInterval mais fait exprès pour les animations et les jeux :)
	// requestAnimationFrame(function(){
	// 	console.log("hue");
	// });

		function relaunch(){
			game.width = 550;
			game.height = 800;

		game.player = {
			x : game.width/2 - 75/2,
			y : game.height-75 - 25,
			width : 75,
			height : 75,
			speed : 7,
			rendered : false,
			image : 0,
			dead : false,
			deadTime : 10
		}

		game.keys = [];
		game.poneys = [];
		game.bullets = [];
		game.bulletsPoney = [];
		game.stars = [];

		game.doneImages = 0; // how many images are loaded
		game.requiredImages = 0; // how many images should be loaded

		for(i in game.poneys){
			splice(game.poneys[i],1);
		}
		for(i in game.bullets){
			splice(game.bullets[i],1);
		}
		for(i in game.bulletsPoney){
			splice(game.bulletsPoney[i],1);
		}
		for(i in game.stars){
			splice(game.stars[i],1);
		}

		game.count = 24;
		game.division = 48;
		game.left = false;
		game.poneySpeed = 3;

		game.fullShootTimer = 10;
		game.shootTimer = game.fullShootTimer; // rate of fire
		game.bulletSpeed = 15;
		game.deadNum = 0;
		game.bulletPoneySpeed = 4;
		game.ennemyShootTimer = 250;
		game.playerDeathCountDown = 0;
		game.difficulty = 0;

		game.over = false;
		game.win = false;

		game.contextBackground.clearRect(0,0,game.width,game.height);
		game.contextMessage.clearRect(0,0,game.width,game.height);
		game.contextPoney.clearRect(0,0,game.width,game.height);
		game.contextPlayer.clearRect(0,0,game.width,game.height);
		game.contextBulletsPoney.clearRect(0,0,game.width,game.height);
		game.contextBullets.clearRect(0,0,game.width,game.height);

		for(i=0; i<500; i++){
			game.stars.push({
				x : Math.floor(Math.random()*game.width),
				y: Math.floor(Math.random()*game.height -5),
				size : Math.random()*5
			});
		}
		for(i in game.stars){
			// la variable stars[i] a la même configuration que les variables demandées
			// dans la fonction fillRect. On peut le faire car c'est une variable locale
			// contenant les mêmes valeurs que les vraies. On ne peut pas le faire pour
			// changer les valeurs car on ne changerait que celles de la variable locale.
			var star = game.stars[i];
			game.contextBackground.fillRect(star.x, star.y, star.size, star.size);
		}

		//Poneys
		for(y = 0 ; y<4; y++){
			for(x=0; x<5; x++){
				game.poneys.push({
					x : (x* 80) + 85,
					y : (y* 85) + 10,
					width : 70,
					height : 70,
					image : 1,
					dead : false,
					deadTime : 5,
					fireCountDown : Math.floor(Math.random()*game.ennemyShootTimer +game.difficulty)
				});
			}
		}
		game.contextPlayer.drawImage(game.images[0],game.player.x, game.player.y, game.player.width,game.player.width);
		sndPiquette.pause();
		sndPiquette.currentTime = 0;
		snd.play();
		}


}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// usage:
// instead of setInterval(render, 16) ....

// place the rAF *before* the render() to assure as close to
// 60fps with the setTimeout fallback.
