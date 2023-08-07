import './style.scss'

import * as THREE from "three";
import { GroundProjectedSkybox } from 'three/addons/objects/GroundProjectedSkybox.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import {OrbitControls} from "three/addons/controls/OrbitControls.js"
import Voronoi from "voronoi";

const appElement=document.querySelector<HTMLDivElement>('#app')!;
appElement.innerHTML = `
<canvas id="renderCanvas"></canvas>
`;

interface Size{
  width:number;
  height:number;
};

function getSize():Size{
  const width=appElement.clientWidth;
  const height=appElement.clientHeight;
  return {
    width,
    height,
  }
}


const renderCanvasElement=document.querySelector<HTMLCanvasElement>("#renderCanvas")!;


const scene = new THREE.Scene();
const hdrLoader = new RGBELoader();
hdrLoader.loadAsync( 'textures/equirectangular/blouberg_sunrise_2_1k.hdr' ).then((envMap:THREE.Texture)=>{
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  const skybox=new GroundProjectedSkybox(envMap);
  skybox.scale.setScalar(100);
  skybox.name="Skybox";
  scene.add(skybox);
  scene.environment=envMap;
});


const size=getSize()
const camera = new THREE.PerspectiveCamera( 75, size.width / size.height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas:renderCanvasElement,
});

document.body.appendChild( renderer.domElement );

{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x00ff00,
    metalness:0,
    roughness:0,
    ior:1.7,
    transmission:0.75,
    thickness:0.2,
  });
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
  cube.position.y=1;
}

{

  const points2d:{x:number,y:number}[]=[];
  const group = new THREE.Group();
  group.position.y=2;
  scene.add(group);
  const length=3;
  const temporaryVector2D=new THREE.Vector2();
  for(let i=0;i<250;i+=1){
    temporaryVector2D.random().subScalar(0.5).multiplyScalar(length*2);
    points2d.push({
      x:temporaryVector2D.x,
      y:temporaryVector2D.y,
    });
  }


  const voronoi = new Voronoi();

  const diagram=voronoi.compute(points2d,{
    xl:length*-0.5,
    xr:length*0.5,
    yt:length*-0.5,
    yb:length*0.5,
  });
  const meshList:THREE.Mesh[]=[];



  for(let cell of diagram.cells){
    const geometryPoints:THREE.Vector3[]=[];
    for(let i=0;i<cell.halfedges.length;i+=1){
      const halfedges=cell.halfedges[i];
      const {x,y}=halfedges.site;
      const {va,vb}=halfedges.edge;
      const pointO=new THREE.Vector3(x,y,0.1);
      const pointA=new THREE.Vector3(va.x,va.y,0);
      const pointB=new THREE.Vector3(vb.x,vb.y,0);
      geometryPoints.push(pointO,pointA,pointB);

    }
    const geometry = new THREE.BufferGeometry().setFromPoints(geometryPoints);
    geometry.computeVertexNormals();
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x00ff00,
      metalness:0,
      roughness:0,
      ior:1.7,
      transmission:0.75,
      thickness:0.2,
      side:THREE.DoubleSide,// TODO:反転処理
    });
    const mesh=new THREE.Mesh(geometry,material);
    group.add(mesh);
    meshList.push(mesh);
    
  }
}


camera.position.y = 2;
camera.position.z = 5;

const orbitControls=new OrbitControls(camera,renderer.domElement);
orbitControls.target.set( 0, 2, 0 );
orbitControls.autoRotate=true;
orbitControls.update();




const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
ambientLight.name="AmbientLight";
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-6, 10, 3);
directionalLight.name="DirectionalLight";
scene.add(directionalLight);


function onResize(){
  const size=getSize();
  camera.aspect=size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width,size.height);
}
window.addEventListener("resize",onResize);
onResize();


function animate() {
	requestAnimationFrame( animate );

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;
  orbitControls.update();
	renderer.render( scene, camera );
}

animate();

