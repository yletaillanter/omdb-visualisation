data = '{"id":19995,"imdb_id":"tt0499549","overview":"In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.","poster_path":"/tcqb9NHdw9SWs2a88KCDD4V8sVR.jpg","release_date":"2009-12-10","status":"Released","tagline":"Enter the World of Pandora.","title":"Avatar","vote_average":7.1,"actors":[{"cast_id":"242","character":"Jake Sully","credit_id":"5602a8a7c3a3685532001c9a","id":65731,"name":"Sam Worthington","order":0,"profile_path":"/9XzAE3ZnCnazub4xrSY8YBN7sNq.jpg"},{"cast_id":245,"character":"Neytiri","credit_id":"52fe48009251416c750ac9cb","id":8691,"name":"Zoe Saldana","order":1,"profile_path":"/g8nuPwQ9CXxfTVWK4r3TaxfQGqI.jpg"},{"cast_id":25,"character":"Dr. Grace Augustine","credit_id":"52fe48009251416c750aca39","id":10205,"name":"Sigourney Weaver","order":2,"profile_path":"/bcDb0vbfWZBHo1QEh9oQVRs3vx2.jpg"},{"cast_id":4,"character":"Col. Quaritch","credit_id":"52fe48009251416c750ac9cf","id":32747,"name":"Stephen Lang","order":3,"profile_path":"/tqF6ibURpLvRPlgvLRvjCQqWaa2.jpg"},{"cast_id":5,"character":"Trudy Chacon","credit_id":"52fe48009251416c750ac9d3","id":17647,"name":"Michelle Rodriguez","order":4,"profile_path":"/v37VK0MNuRuJOCKPKJcZAJXRA5r.jpg"},'+
'{"cast_id":8,"character":"Selfridge","credit_id":"52fe48009251416c750ac9e1","id":1771,"name":"Giovanni Ribisi","order":5,"profile_path":"/mLQrEU7X7GD5V7i1clGRqpg8PVk.jpg"},{"cast_id":7,"character":"Norm Spellman","credit_id":"52fe48009251416c750ac9dd","id":59231,"name":"Joel David Moore","order":6,"profile_path":"/y6AyGCsQHLoi4LegSS7VRtgRyJe.jpg"},{"cast_id":9,"character":"Moat","credit_id":"52fe48009251416c750ac9e5","id":30485,"name":"CCH Pounder","order":7,"profile_path":"/4Xu155Rt87p42HVxI2L6Hf9AB4w.jpg"},{"cast_id":11,"character":"Eytukan","credit_id":"52fe48009251416c750ac9ed","id":15853,"name":"Wes Studi","order":8,"profile_path":"/xwmhqIx6HU2dACyZ2BxGnCWJoXz.jpg"},{"cast_id":10,"character":"Tsu\'Tey","credit_id":"52fe48009251416c750ac9e9","id":10964,"name":"Laz Alonso","order":9,"profile_path":"/6zqlURffzAErl4g4d8kiUWYWmoz.jpg"}]}';
var obj = JSON.parse(data);

var renderer, scene, camera, geometry, raycaster, object3d, INTERSECTED;
var distance = 500;
var particles = [];
var projector, mouse = { x: 0, y: 0 };

geometry  = new THREE.Geometry();
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();
camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
scene = new THREE.Scene();
renderer = new THREE.CanvasRenderer();
//object3d = new THREE.Object3D();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
scene.add(camera);




// Création d'un noeud central pour le film
var main = new THREE.Sprite( 
		new THREE.SpriteCanvasMaterial({
			color:Math.random() * 0x808080 + 0x808080,
			opacity: 1,
			program: function ( context ) {
				context.lineWidth = 0.025;
				context.beginPath();
				context.arc( 0, 0, 1, 0, Math.PI * 2, true );
				context.closePath();
				context.fill();
			},
		})
	);

for (var i=0; i<100; i++) {
	var particle = new THREE.Sprite( 
		new THREE.SpriteCanvasMaterial({
			color: Math.random() * 0x808080 + 0x808080,
			opacity: 1,
			program: function ( context ) {
				context.lineWidth = 0.025;
				context.beginPath();
				context.arc( 0, 0, 1, 0, Math.PI * 2, true );
				context.closePath();
				context.fill();
			},
		})
	);

	particle.userData = { 
		titre: "frozen",
		year: "2015"};

	particle.position.x = Math.random() * distance * 2 - distance;
	particle.position.y = Math.random() * distance * 2 - distance;
	particle.position.z = Math.random() * distance * 2 - distance;
	// dimension de la particule
	particle.scale.x = particle.scale.y = Math.random() * 10 + 5;

	window.addEventListener('mousedown', onDocumentMouseDown, false);

	//lien entre particle
	geometry.vertices.push(new THREE.Vector3(particle.position.x, particle.position.y, particle.position.z)); 

	scene.add( particle );	
	particles.push( particle );
}

var line = new THREE.Line( geometry, 
	new THREE.LineBasicMaterial({ 
		color: "#AAA",
		opacity: 0.8
	})
);

scene.add(line);



window.addEventListener('mousemove', onDocumentMouseMove, false);
window.requestAnimationFrame(render);

function onDocumentMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	//camera.position.x = (mouse.x- camera.position.x) * 0.05;
	//camera.position.y = (mouse.y - camera.position.y) * 0.05;

	camera.position.x = event.clientX - window.innerWidth/2;
	camera.position.y = event.clientY - window.innerHeight/2;

	camera.lookAt(scene.position);
	renderer.render( scene, camera );
}

//renderer.domElement.addEventListener('mousedown', onClickOnParticle, false);


// initialize object to perform world/screen calculations
projector = new THREE.Projector();

var mouseVector = new THREE.Vector3(); 	

function onDocumentMouseDown( event ) {
	// update the picking ray with the camera and mouse position	
	raycaster.setFromCamera( mouse, camera );	

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( particles );

	if(intersects.length > 0) {
		//intersects[ 0 ].object.material.color.set( 0xff0000 );
		console.log("TEST : "+intersects[ 0 ].object.userData.titre);
		console.log("TEST : "+intersects[ 0 ].object.userData.year);
		alert("Test");
		//camera.lookAt(intersects[ 0 ].object);
	}
	
	renderer.render( scene, camera );
}

//camera.position.z = 100;
//camera.lookAt(scene.position);

function render() {
	// update the picking ray with the camera and mouse position	
	raycaster.setFromCamera( mouse, camera );	

	document.addEventListener('keydown',onDocumentKeyDown,false);

	// calculate objects intersecting the picking ray
	//var intersects = raycaster.intersectObjects( particles );

	//for ( var i = 0; i < intersects.length; i++ ) {

		//camera.lookAt(intersects[ i ].object);
		//intersects[ i ].object.material.color.set( 0xff0000 );
	
	//}
	renderer.render( scene, camera );
}


function onDocumentKeyDown(event){
	var delta = 2;
	event = event || window.event;
	var keycode = event.keyCode;
	
	switch(keycode){
		case 37 : //left arrow
			console.log("left click");
			camera.position.x = camera.position.x - delta;
			camera.updateProjectionMatrix();
			render();
			break;
		case 38 : // up arrow 
			camera.position.z = camera.position.z - delta;
			camera.updateProjectionMatrix();
			render()
			break;
		case 39 : // right arrow
			camera.position.x = camera.position.x + delta;
			camera.updateProjectionMatrix();
			render()
			break;
		case 40 : //down arrow
			camera.position.z = camera.position.z + delta;
			camera.updateProjectionMatrix();
			render()
			break;
		}
	document.addEventListener('keyup',onDocumentKeyUp,false);
}

render();
