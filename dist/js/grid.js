
// const urlparams = new URLSearchParams(window.location.search);
// const username = urlparams.get('username');
// const password = urlparams.get('password');
let token;
// console.log("username",username, "token", token);

// let text = document.getElementById("username-text");
// text.innerHTML = `<strong>${username}'s</strong>`;

// // get models to render

// axios.post('http://localhost:8000/api/users/login', { "user":{"email": `${username}`, "password": `${password}`}})
// .then(({ data }) => {
//     token = data.token;
// })
// .catch(err => console.log(err))

// axios.get('http://localhost:8000/api/users/current', {data: { "user":{"email": `${username}`, "password":`${password}`} }, headers: {"authorization": `Token ${token}`, "content-type": "application/json"}})
// .then(({ data }) => {
// 	console.log(data)
// 	// use json list of buildings to render ??
// 	for (let b = 0; b < length(data.building); b++) {
//         renderModel(`../assets/buildings/${building.name}`, (building.xValue, building.yValue))
//     }
// 	//	identify model for building
// 	// renderModel( model_path, building_position, buidling_rotation)
// })
// .catch(err => console.log(err))

// test rendering building list

// set up
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); 
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, 0.7 * window.innerHeight );

let gridWindow = document.getElementById("gridWindow");
gridWindow.appendChild(renderer.domElement);

let canvas = renderer.domElement;

// lights, camera, --
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 1 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );
const dirLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
dirLight.position.set( - 3, 10, -10 );
scene.add( dirLight );

camera.position.x = 0;
camera.position.y = 3;
camera.position.z = 20;

// scene.rotation.x = -Math.PI/4;
scene.background = new THREE.Color( 0x4472CF );

// grid visuals (green plane and grid lines)
const planeGeom = new THREE.PlaneGeometry(40,40, 1, 1);
const planeMat = new THREE.MeshBasicMaterial( {color: 0x19ba41}) ;
const plane = new THREE.Mesh(planeGeom, planeMat);
plane.rotation.x = -Math.PI/2;
scene.add( plane );
const gridHelper = new THREE.GridHelper(40,40, 0x138f32,0x138f32);
// gridHelper.colorGrid = new THREE.Color(0x19ba47);
scene.add(gridHelper);

// grid array
// let grid = [...Array(30)].map(e => Array(30).fill('foo'));
// scene.add(grid);
const loader = new THREE.GLTFLoader();
// const loader = new THREE.FBXLoader();


let buildings = [
	{'name': 'house', 'xValue': 1, 'yValue':0},
	{'name': 'house', 'xValue': 4, 'yValue':5},

	// {'name': 'bank', 'xValue': 2, 'yValue':2},
	// {'name': 'tree', 'xValue': 3, 'yValue':3}
];

for (let i = 0; i < buildings.length; i++) {
	renderModel(`./assets/models/gltf/${buildings[i].name}.glb`, buildings[i].xValue, buildings[i].yValue);
}

function renderModel(path, x, y) {

	loader.load(path, function ( gltf ) {
		gltf.scene.position.set(x, -0.01, y);
		// gltf.scene.rotation.x = Math.PI/4;

		console.log(gltf.scene);

		gltf.scene.traverse( function ( child )  {
			if (child.isMesh ) {
				child.geometry.center()
			}
		});
		scene.add( gltf.scene );

		console.log("added model");

		renderer.render(scene, camera);
	
	}, undefined, function ( error ) {
	
		console.error( error );
	
	} );
}

renderer.render(scene, camera);

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, .7* window.innerHeight)
    render()
}

