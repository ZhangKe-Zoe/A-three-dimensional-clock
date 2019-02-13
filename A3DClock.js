
//Initialize webGL
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setClearColor('black');    // set background color

// Create a new Three.js scene with camera and light
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height,
                                          0.1, 1000 );
camera.position.set(0,30,20);
camera.lookAt(scene.position);

const light = new THREE.PointLight();
scene.add(camera);
scene.add( light );
scene.add(new THREE.AmbientLight(0xffffff));

//1 Add main body of the clock
const radiusTop = 5;
const radiusBottom = 5;
const cheight =1;
const radialSegments = 60;

const cylindergeometry = new THREE.CylinderGeometry( radiusTop,radiusBottom,cheight,radialSegments );
const cylindermaterial = new THREE.MeshBasicMaterial( {color: 'white'} );
const cylinder = new THREE.Mesh( cylindergeometry, cylindermaterial );
scene.add( cylinder );

//2 Add small sticks 
//3 Mark the twelve o’clock position
function drawSticks(slength,swidth,scolor,srotation){
const sheight = 1.1;

const stickgeometry = new THREE.BoxGeometry(swidth,sheight,slength);
const stickmaterial = new THREE.MeshBasicMaterial({color: scolor});
const stick = new THREE.Mesh(stickgeometry,stickmaterial );

const rotation = new THREE.Matrix4().makeRotationY(srotation);
const translation = new THREE.Matrix4().makeTranslation(0, 0,radiusBottom-slength/2);
const transformation = rotation.multiply(translation);
stickgeometry.applyMatrix(transformation);

scene.add(stick);

return stick;
}

let slength, swidth, scolor,srotation;

for (let i = 0 ; i<60 ; i ++) {
	if(i==30) 
	{
		scolor = 'lightblue';
		slength = 1;
		swidth = 0.1;
	}
	else if ((i%5==0)&&(i!=30))
	{
		scolor = 'black';
		slength = 1;
		swidth = 0.1;

	}
	else
	{
		slength = 0.5;
        swidth = 0.05;
        scolor = 'black';
	}
	srotation = 2*Math.PI/60*i;
	drawSticks(slength,swidth,scolor,srotation);
}

//4 Add hour-, minute- and seconds-hands 
function drawHand(radius,scale)
{
	const spheregeometry = new THREE.SphereGeometry( radius, 10,8);
    const spherematerial = new THREE.MeshBasicMaterial( {color: 'black'} );
    const sphere = new THREE.Mesh( spheregeometry, spherematerial );
    
    sphere.scale.x = scale;
    sphere.scale.y = scale;

    return sphere;
}


//6 Implement the hour- and minute-hands as squeezed (i.e. scaled) spheres
const radius = 1.5;
const scale = 1.2*0.07;

//hour-hand
const hourGermany = drawHand(radius*1.5,scale);
const hourChina = drawHand(radius*1.5,scale);
hourGermany.position.set(1.5,0.6,0);
hourChina.position.set(0.9,-0.6,0);
scene.add(hourGermany);
scene.add(hourChina);

//minute-hand
const minuteGermany = drawHand(radius*1.7,scale*0.8);
const minuteChina = drawHand(radius*1.7,scale*0.8);
minuteGermany.position.set(0.9,0.6,0);
minuteChina.position.set(0.9,-0.6,0);
scene.add(minuteGermany);
scene.add(minuteChina);

//second-hand
const secondGermany = drawHand(radius*2,scale*0.6);
const secondChina = drawHand(radius*2,scale*0.6);
secondGermany.position.set(0.9,0.6,0);
secondChina.position.set(0.9,-0.6,0);
scene.add(secondGermany);
scene.add(secondChina);


//5 Add a blob in the middle where the hands are mounted
const blobFrontgeo = new THREE.SphereGeometry(radiusBottom*0.08);
const blobFrontmes = new THREE.MeshBasicMaterial( {color: 'darkred'} );
const blobFront = new THREE.Mesh( blobFrontgeo,  blobFrontmes);
blobFront.position.set(0,0.6,0);
const blobBack = blobFront.clone();
blobBack.position.set(0,-0.6,0);

scene.add(blobBack);
scene.add(blobFront);

//8 Add a key control to reset the clock to the original position after it has been rotated

function mycb(event) {

	event.preventDefault();  
        switch (event.keyCode)
		{
			
            case 87:
			{
			controls.reset();
			camera.position.set(0,30,20);
			}
               
        }
    
}
document.addEventListener('keydown',mycb)

//9 Add a cylindrical outer ring of thickness > 0 to protect the clock
const points = [];
for ( let i = 0; i < 60; i ++ ) {
	points.push( new THREE.Vector3( 5.01,(-cheight/2+(cheight/60)*i), 0 ));
}
const geometry = new THREE.LatheGeometry( points,60);
const material = new THREE.MeshBasicMaterial( { color: 'lightblue' } );
const  lathe = new THREE.Mesh( geometry, material );
scene.add( lathe );

//7 One side should show Hamburg time,the other one the time of China
function update() 
{
    
    let time = new Date();
    let hours = time.getHours()%12;
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
	
	// time for Germany
	
	hourGermany.rotation.y = (((Math.PI/6)*hours)*-1)-Math.PI;
    hourGermany.position.z = (0.9)*Math.cos((((Math.PI/6)*hours)*-1)-Math.PI);
    hourGermany.position.x = (0.9)*Math.sin((((Math.PI/6)*hours)*-1)-Math.PI);
	
	minuteGermany.rotation.y = (((Math.PI/30)*minutes)*-1)-Math.PI;
    minuteGermany.position.z = (0.9)*Math.cos((((Math.PI/30)*minutes)*-1)-Math.PI);
    minuteGermany.position.x = (0.9)*Math.sin((((Math.PI/30)*minutes)*-1)-Math.PI);

	secondGermany.rotation.y = (((Math.PI/30)*seconds)*-1)-Math.PI;
  	secondGermany.position.z = (0.9)*Math.cos((((Math.PI/30)*seconds)*-1)-Math.PI);
    secondGermany.position.x = (0.9)*Math.sin((((Math.PI/30)*seconds)*-1)-Math.PI);
	
	
	
	//time for China
    hourChina.rotation.y = (((Math.PI/6)*(hours+7)))-Math.PI;
    hourChina.position.z = (0.9)*Math.cos(((Math.PI/6)*(hours+7))-Math.PI);
    hourChina.position.x = (0.9)*Math.sin(((Math.PI/6)*(hours+7))-Math.PI);


    minuteChina.rotation.y = ((((Math.PI/30)*minutes))-Math.PI);
    minuteChina.position.z = (0.9)*Math.cos((((Math.PI/30)*minutes))-Math.PI);
    minuteChina.position.x = (0.9)*Math.sin((((Math.PI/30)*minutes))-Math.PI);


    secondChina.rotation.y = (((Math.PI/30)*seconds))-Math.PI;
    secondChina.position.z = (0.9)*Math.cos((((Math.PI/30)*seconds))-Math.PI);
    secondChina.position.x = (0.9)*Math.sin((((Math.PI/30)*seconds))-Math.PI);


}

//* Render loop
//scene.add(new THREE.AxisHelper(9));
const computerClock = new THREE.Clock();
const controls = new THREE.TrackballControls( camera );
controls.position0.set(20,10,20);

function render() {

  update();
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}
render();
