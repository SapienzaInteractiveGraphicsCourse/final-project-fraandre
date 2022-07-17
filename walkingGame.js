"use strict";
import * as THREE from 'three';
import {OrbitControls} from './three.js/jsm/controls/OrbitControls.js';
import {GUI} from './three.js/jsm/libs/lil-gui.module.min.js';
import { TWEEN } from './three.js/jsm/libs/tween.module.min.js';
import {OBJLoader} from './three.js/jsm/loaders/OBJLoader.js';
import { Water } from './three.js/jsm/objects/Water2.js';

window.focus();

function main() {

  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas:canvas, antialiasing: true, logarithmicDepthBuffer: true,   powerPreference: "high-performance"});
  const height = window.innerHeight;
  renderer.shadowMap.enabled = true;

  // Pick a random value from an array
  function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
  }


  const resetButton = document.getElementById("ButtonReset");
  const fogButton = document.getElementById("ButtonFog");
  ////////////////////////////CAMERA/////////////////////////////////////
  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 5;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 15, -50);

  //OrbitControls let the user spin or orbit the camera around some point
    const controls = new OrbitControls(camera, canvas);


  var fogOn = 0;
  var density;
  fogButton.addEventListener("mousedown", function () {
    {
      if(fogOn==0){
        density = 0.008;
        fogOn = 1;
      } else {
        density = 0;
        fogOn = 0;
      }
      const color = 'lightgray';
      scene.fog = new THREE.FogExp2(color, density);
    }

  });

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  resetButton.addEventListener("mousedown", function () {
    window.location.href = "walkingGame.html";
  });



////////////////////AMBIENT LIGHT/////////////////////////////////////////
{
const ambientcolor = 0xFFFFFF;
const ambientintensity = 1;
const ambientlight = new THREE.AmbientLight(ambientcolor, ambientintensity);
scene.add(ambientlight);
}

{
const pointcolor = 0xFFFFE0;
const pointintensity = 0.5;
const pointlight = new THREE.PointLight(pointcolor, pointintensity);
pointlight.position.set(0, 200, 30);
pointlight.castShadow = true; //we have to tell th elight to cast a shadow
scene.add(pointlight);
}
//////////////////ENVIRONMENT MODELS/////////////////////////////////////////
///////////////////////////////////sun/////////////////////////////////////

 const sunGeo = new THREE.SphereGeometry(50,32,16);
 const sunMat = new THREE.MeshStandardMaterial({color:"#FFFF00"});
 const sun = new THREE.Mesh(sunGeo, sunMat);
 sun.castShadow = true;
 sun.position.set(10, 200, 450);
 scene.add(sun);
//////////////////////////////////PLANE//////////////////////////
    const planeSize = 500;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('./images/grass.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);


    const planeGeo = new THREE.CircleGeometry(planeSize, 32, 32);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    mesh.receiveShadow = true;
    scene.add(mesh);

    for(let i = 0; i<1000; i++){
    var objLoader3 = new OBJLoader();
      objLoader3.load('./obj/grass.obj', function(grass){
      grass.scale.set(0.02,0.01,0.02);
      grass.position.set(getRandomArbitrary(-400,400), 0 , getRandomArbitrary(-400,400));
      const grassColor = '#4F7942';
      const grassMaterial = new THREE.MeshStandardMaterial({
        color: grassColor
      });
      grass.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = grassMaterial;
        }
      });
      grass.receiveShadow = true;
      grass.castShadow = true;
      grass.rotation.y = getRandomArbitrary(-Math.PI/2, Math.PI/2);
      scene.add(grass);

   });
   }



    /////////////////////////////////SKY///////////////////////////////////////////////

    const skytexture = loader.load('./images/sky2.jpg');
    texture.minFilter = THREE.NearestFilter;
    const skyGeo = new THREE.SphereGeometry(500, 32, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skytexture,
      side: THREE.DoubleSide,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);


//////////////////LAKES////////////////////////////////////////////
let water;
var waterRadius = 30;
var numLakes;

function makeLakes(p1,p3, scale) {
    const waterGeometry = new THREE.CircleGeometry(waterRadius, 30);
    water = new Water( waterGeometry, {
        color: '#aabbcc',
        scale: 4,
        flowDirection: new THREE.Vector2( 1, 1 ),
        textureWidth: 1024,
        textureHeight: 1024
    } );

    const p2 = 1;
    water.scale.set(scale,scale);
    water.position.set(p1, p2, p3);
    water.rotation.x = Math.PI * - 0.5;
    scene.add( water );

    const lakeGeometry = new THREE.CircleGeometry(waterRadius, 30);
    const lakeTexture = loader.load('./images/lake2.png');
    lakeTexture.minFilter = THREE.NearestFilter;
    const lakeMaterial = new THREE.MeshLambertMaterial({map: lakeTexture});
    const lake = new THREE.Mesh(lakeGeometry, lakeMaterial);
    lake.rotation.x = Math.PI * - 0.5;
    lake.scale.set(scale,scale);
    lake.position.set(p1, p2, p3);
    lake.rotation.x = Math.PI * - 0.5;
    lake.receiveShadow = true;
    scene.add(lake);

    for(let i = 0; i<10; i++){
    var objLoader2 = new OBJLoader();
    objLoader2.load('./obj/stones.obj', function(stones){

      const posX = getRandomArbitrary((-waterRadius),(waterRadius));
      const posZ = getRandomArbitrary((-waterRadius),(waterRadius));
      stones.scale.set(scale,scale,scale);
      stones.position.set(posX, posZ , 0);
      const stonesColor = 'gray';
      const stonesMaterial = new THREE.MeshStandardMaterial({
        color: stonesColor
      });
      stones.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = stonesMaterial;
        }
      });
      stones.receiveShadow = true;
      stones.castShadow = true;
      stones.rotation.x = Math.PI/2;

      lake.add(stones);

   });
 }
    return;
}

var positionLakesX = [-50, -200, 300, -300, 200, -400, 400];
var positionLakesZ = [50, -200, -300, 300, 200, 100, -100];
var scaleLakes =[ 1, 1.5, 1.5, 1.5, 1.5, 1.5, 1.2];

for (let i=0; i<7; i++){
    makeLakes(positionLakesX[i], positionLakesZ[i], scaleLakes[i]);
}

///////////////////////////APPLE TREES////////////////////////////////////////////////////////
var numTrees = 60;
var positionTreesX = [];
var positionTreesZ = [];
var numApples = 5;
var d = 0;
var positionApplesX = [];
var positionApplesZ = [];

for(let i=0; i<numTrees; i++){
    var objLoader = new OBJLoader();
    objLoader.load('./obj/tree.obj', function(tree){
      const dist11 = Math.round(getRandomArbitrary(-450,450));
      const dist22 = Math.round(getRandomArbitrary(0,0));
      const dist33 = Math.round(getRandomArbitrary(-450,450));
      positionTreesX[i] = dist11;
      positionTreesZ[i] = dist33;
      tree.scale.set(30,getRandomArbitrary(30,50),30);
      tree.position.set(dist11, dist22 , dist33);
      const treeTrunkColor = 0x4b3f2f;
      const treeMaterial = new THREE.MeshLambertMaterial({
        color: treeTrunkColor
      });
      tree.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = treeMaterial;
        }
      });
      tree.receiveShadow = true;
      tree.castShadow = true;
      tree.rotation.y = Math.PI/getRandomArbitrary(-8,8);
      //CROWN
      scene.add(tree);
      var crownPositions = [[0, 1, 0],[0.6, 0.8, 0], [0, 0.8, -0.7], [-0.7, 0.6, 0], [0, 0.7, 0.5]];
      const crownColor = 0x498c2c;
      const crownMaterial = new THREE.MeshLambertMaterial({
        color: crownColor
      });
      //APPLES
      function makeApples(x,y,z, par, scal) {
        const appleObj = new THREE.Object3D();
        //appleObj.position.set(0.15,getRandomArbitrary(0.1,0.09),getRandomArbitrary(0.1,0.09));
        appleObj.position.set(x,y,z);
        par.add(appleObj);
        const appleGeo2 = new THREE.SphereGeometry(1,32,16);
        const appleMat2 = new THREE.MeshStandardMaterial({color:"red"});
        const apple2 = new THREE.Mesh(appleGeo2, appleMat2);
        apple2.receiveShadow = true;
        apple2.castShadow = true;
        apple2.scale.set(scal,scal,scal);
        appleObj.add(apple2);
        const stalkGeo = new THREE.BoxGeometry(0.1,1.2,0.1);
        const stalkMat = new THREE.MeshPhongMaterial({color:"#341E07"});
        const stalk = new THREE.Mesh(stalkGeo, stalkMat);
        stalk.receiveShadow = true;
        stalk.castShadow = true;
        stalk.position.y = 1;
        apple2.add(stalk);

        const leafGeo = new THREE.BoxGeometry(0,0.8,0.8);
        const leafMat = new THREE.MeshPhongMaterial({color:"green"});
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.receiveShadow = true;
        leaf.castShadow = true;
        leaf.position.y = 1.5;
        leaf.position.x = -0.4;
        leaf.rotation.x = Math.PI/4;
        leaf.rotation.y = Math.PI/4;
        apple2.add(leaf);
        return;
      }

      for(let i=0; i<5; i++) {
          var position = crownPositions[i];
          const radius = 0.2;  // ui: radius
          const detail = 0;  // ui: detail
          const crown = new THREE.Mesh(
            new THREE.IcosahedronGeometry(radius, detail),
            crownMaterial
          );
          crown.position.x = position[0];
          crown.position.y = position[1];
          crown.position.z = position[2];
          crown.castShadow = true;
          crown.receiveShadow = true;
          tree.add(crown);

          makeApples(0.15, getRandomArbitrary(0.08,0.09), getRandomArbitrary(0.08,0.09),crown, 0.03);
          makeApples(0.15, getRandomArbitrary(-0.09,-0.08), getRandomArbitrary(-0.09,-0.08), crown, 0.03);
          makeApples(-0.15, getRandomArbitrary(0.08,0.09), getRandomArbitrary(0.08,0.09), crown, 0.03);

        }
        ///////////////////////////////////GROUND APPLES//////////////////////////
        for(let j=0; j<numApples; j++){
          positionApplesX[j+d] = Math.round(getRandomArbitrary(positionTreesX[i]-15, positionTreesX[i]+15));
          positionApplesZ[j+d] = Math.round(getRandomArbitrary(positionTreesZ[i]-15, positionTreesZ[i]+15));
          makeApples(positionApplesX[j+d], 1, positionApplesZ[j+d], scene, 1.2);
          d += numApples;
        }
    })
  }
///////////////////////////////////////BRAMBLES/////////////////////////////////
var numBrambles = 60;
var positionBramblesX = [];
var positionBramblesZ = [];
var numBlub = 10;
var p = 0;
var positionBluX = [];
var positionBluZ = [];

for(let i=0; i<numBrambles; i++){
    var objLoader = new OBJLoader();
    objLoader.load('./obj/tree.obj', function(bramble){
      const dist111 = Math.round(getRandomArbitrary(-450,450));
      const dist222 = Math.round(getRandomArbitrary(0,0));
      const dist333 = Math.round(getRandomArbitrary(-450,450));
      bramble.scale.set(10,getRandomArbitrary(10,20),10);
      bramble.position.set(dist111, dist222 , dist333);
      positionBramblesX[i] = dist111;
      positionBramblesZ[i] = dist333;
      const brambleTrunkColor = 0x4b3f2f;
      const brambleMaterial = new THREE.MeshLambertMaterial({
        color: brambleTrunkColor
      });
      bramble.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = brambleMaterial;
        }
      });
      bramble.receiveShadow = true;
      bramble.castShadow = true;
      bramble.rotation.y = Math.PI/getRandomArbitrary(-8,8);
      scene.add(bramble);
      //CROWN
      var crown1Positions = [[0, 1, 0],[0.6, 0.8, 0], [0, 0.8, -0.7], [-0.7, 0.6, 0], [0, 0.7, 0.5]];
      const crown1Color = "#355E3B";
      const crown1Material = new THREE.MeshLambertMaterial({
        color: crown1Color
      });

      function makeBlueberries(x,y,z, pat, scal){
        const blueberryGeo = new THREE.SphereGeometry(0.05,32,16);
        const blueberryMat = new THREE.MeshStandardMaterial({color:"#0041C2"});
        const blueberry = new THREE.Mesh(blueberryGeo, blueberryMat);
        blueberry.position.set(x,y,z);
        blueberry.scale.set(scal,scal,scal);
        blueberry.castShadow = true;
        blueberry.receiveShadow = true;
        pat.add(blueberry);
        return;
      }

      for(let i=0; i<5; i++) {
        var position1 = crown1Positions[i];
        const radius1 = 0.5;  // ui: radius
        const detail1 = 0;  // ui: detail
        const crown1 = new THREE.Mesh(
          new THREE.IcosahedronGeometry(radius1, detail1),
          crown1Material
        );
        crown1.position.x = position1[0];
        crown1.position.y = position1[1];
        crown1.position.z = position1[2];
        crown1.castShadow = true;
        crown1.receiveShadow = true;
        bramble.add(crown1);

      makeBlueberries(0.2, getRandomArbitrary(0.2,0.3), getRandomArbitrary(0.2,0.3), crown1,1);
      makeBlueberries(0.2, getRandomArbitrary(-0.2,-0.3), getRandomArbitrary(-0.2,-0.3), crown1,1);
      makeBlueberries(-0.2, getRandomArbitrary(0.2,0.3), getRandomArbitrary(0.2,0.3), crown1,1);
      makeBlueberries(-0.2, getRandomArbitrary(0.2,0.3), getRandomArbitrary(-0.2,-0.3), crown1,1);
    }
    ///////////////////////////////////AVAIABLE APPLES//////////////////////////
    for(let j=0; j<numBlub; j++){
       positionBluX[j+p]= Math.round(getRandomArbitrary(positionBramblesX[i]-15, positionBramblesX[i]+15));
       positionBluZ[j+p] = Math.round(getRandomArbitrary(positionBramblesZ[i]-15, positionBramblesZ[i]+15));
       makeBlueberries(positionBluX[j+p], 1, positionBluZ[j+p], scene, 10);
       p += numBlub;
    }

   })
  }
/////////////////////////////////ANIMATED MODELS///////////////////////////////////////

/////////////////////HUMANOID/////////////////////////////////

const humanoid = new THREE.Object3D();
humanoid.position.set(0,4.5,0);
scene.add(humanoid);

//waist
  const waistGeo = new THREE.SphereGeometry(1,32,16);
  const waistMat = new THREE.MeshLambertMaterial({color:"black"});
  const waist = new THREE.Mesh(waistGeo, waistMat);
  waist.receiveShadow = true;
  waist.castShadow = true;
  waist.position.set(2, 6, 0);
  humanoid.add(waist);

//torso
const lengthT = 3, widthT = 1;

const shapeT = new THREE.Shape();
shapeT.moveTo( 0,0 );
shapeT.lineTo( 0, widthT );
shapeT.lineTo( lengthT, widthT );
shapeT.lineTo( lengthT, 0 );
shapeT.lineTo( 0, 0 );

const extrudeSettingsT = {
steps: 2,
depth: 0.5,
bevelEnabled: true,
bevelThickness: 1,
bevelSize: 1,
bevelOffset: 0,
bevelSegments: 4
};

const torsoGeo = new THREE.ExtrudeGeometry( shapeT, extrudeSettingsT );
const torsoMat = new THREE.MeshStandardMaterial({color:"#A13D2D"});
const torso = new THREE.Mesh(torsoGeo, torsoMat);
torso.receiveShadow = true;
torso.castShadow = true;
torso.position.set(-1.5, 1.4, -0.2);
waist.add(torso);


 //NECK
  const neckGeo = new THREE.SphereGeometry(0.3,32,16);
  const neckMat = new THREE.MeshStandardMaterial({color:"pink"});
  const neck = new THREE.Mesh(neckGeo, neckMat);
  neck.receiveShadow = true;
  neck.castShadow = true;
  neck.position.set(1.4, 2.2, 0.5);
  torso.add(neck);

 //HEAD
  const headGeo = new THREE.SphereGeometry(1,32,16);
  const headMat = new THREE.MeshLambertMaterial({color:"#FFDBAC"});
  const head = new THREE.Mesh(headGeo, headMat);
  head.receiveShadow = true;
  head.castShadow = true;
  head.position.set(0, 1, 0);
  neck.add(head);

  //EYES
  const eyeGeo = new THREE.SphereGeometry(0.2,32,16);
  const eyeMat = new THREE.MeshPhongMaterial({color:0x000000});
  const eye1 = new THREE.Mesh(eyeGeo, eyeMat);
  const eye2 = new THREE.Mesh(eyeGeo, eyeMat);
  eye1.position.set(-0.5,0.25,1);
  eye2.position.set(0.5,0.25,1);
  head.add(eye1);
  head.add(eye2);
  //NOISE
  const noiseGeo = new THREE.SphereGeometry(0.2,32,16);
  const noiseMat = new THREE.MeshPhongMaterial({color:"#FFDBAC"});
  const noise = new THREE.Mesh(noiseGeo, noiseMat);
  noise.position.set(0,0,1);
  head.add(noise);
  //MOUSTACHE
  const moustacheMat = new THREE.MeshPhongMaterial({color:"#281b0d"});
  const moustache= new THREE.Mesh(torsoGeo, moustacheMat);
  moustache.position.set(-0.2,-0.3,1);
  moustache.scale.set(0.15,0.08,0.1);
  head.add(moustache);
  //MOUTH
  const mouthMat = new THREE.MeshPhongMaterial({color:"black"});
  const mouth = new THREE.Mesh(torsoGeo, mouthMat);
  mouth.position.set(-0.1,-0.4,1);
  mouth.scale.set(0.08,0.08,0.1);
  head.add(mouth);
  //HAT
  const hat = new THREE.Object3D();
  hat.position.set(0,0.7,0);
  head.add(hat);
  const hatCGeo = new THREE.CylinderGeometry(2, 2, 0.1, 20);
  const hatCMat = new THREE.MeshPhongMaterial({color:"#E1C16E"});
  const hatC = new THREE.Mesh(hatCGeo, hatCMat);
  hat.add(hatC);
  const hatCCGeo = new THREE.CylinderGeometry(1, 1, 0.8, 20);
  const hatCC = new THREE.Mesh(hatCCGeo, hatCMat);
  hatCC.position.y = 0.5;
  hatC.add(hatCC);
  const hatBGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.2, 20);
  const hatBMat = new THREE.MeshPhongMaterial({color:"#281b0d"});
  const hatB = new THREE.Mesh(hatBGeo, hatBMat);
  hatB.position.y = 0.2;
  hatC.add(hatB);

  //BOTTONS
  const botton1 = new THREE.Mesh(eyeGeo, eyeMat);
  const botton2 = new THREE.Mesh(eyeGeo, eyeMat);
  const botton3 = new THREE.Mesh(eyeGeo, eyeMat);
  const botton4 = new THREE.Mesh(eyeGeo, eyeMat);
  const botton5 = new THREE.Mesh(eyeGeo, eyeMat);
  botton1.position.set(1.5,0.5,1.5);
  botton2.position.set(1.5,0,1.5);
  botton3.position.set(1.5,-0.5,1.5);
  botton4.position.set(1.5,1,1.5);
  botton5.position.set(1.5,1.5,1.5);
  torso.add(botton1);
  torso.add(botton2);
  torso.add(botton3);
  torso.add(botton4);
  torso.add(botton5);

  //SHOULDERS
  const shoulderGeo = new THREE.SphereGeometry(0.7,32,16);
  const shoulderMat = new THREE.MeshLambertMaterial({color:"#A13D2D"});
  const shoulder1 = new THREE.Mesh(shoulderGeo, shoulderMat);
  shoulder1.receiveShadow = true;
  shoulder1.castShadow = true;
  shoulder1.position.set(-1.3, 1.5, 0.3);
  torso.add(shoulder1);
  const shoulder2 = new THREE.Mesh(shoulderGeo, shoulderMat);
  shoulder2.receiveShadow = true;
  shoulder2.castShadow = true;
  shoulder2.position.set(4.3, 1.5, 0.3);
  torso.add(shoulder2);

  //UPPER ARMS
  const upperArmGeo = new THREE.CylinderBufferGeometry(0.5, 0.5, 3, 6);
  const upperArmMat = new THREE.MeshLambertMaterial({color:"#A13D2D"});
  const upperArm1 = new THREE.Mesh(upperArmGeo, upperArmMat);
  upperArm1.receiveShadow = true;
  upperArm1.castShadow = true;
  upperArm1.position.set(0, -1.5, 0);
  shoulder1.add(upperArm1);
  const upperArm2 = new THREE.Mesh(upperArmGeo, upperArmMat);
  upperArm2.receiveShadow = true;
  upperArm2.castShadow = true;
  upperArm2.position.set(0, -1.5, 0);
  shoulder2.add(upperArm2);

  //ELBOWS
  const elbowGeo = new THREE.SphereGeometry(0.5,32,16);
  const elbowMat = new THREE.MeshLambertMaterial({color:"#281b0d"});
  const elbow1 = new THREE.Mesh(elbowGeo, elbowMat);
  elbow1.receiveShadow = true;
  elbow1.castShadow = true;
  elbow1.position.set(0, -1.6, 0);
  upperArm1.add(elbow1);
  const elbow2 = new THREE.Mesh(elbowGeo, elbowMat);
  elbow2.receiveShadow = true;
  elbow2.castShadow = true;
  elbow2.position.set(0, -1.6, 0);
  upperArm2.add(elbow2);

  //LOWER ARMS
  const lowerArmGeo = new THREE.CylinderBufferGeometry(0.5, 0.3, 2.5, 6);
  const lowerArmMat = new THREE.MeshStandardMaterial({color:"#FFDBAC"});
  const lowerArm1 = new THREE.Mesh(lowerArmGeo, lowerArmMat);
  lowerArm1.receiveShadow = true;
  lowerArm1.castShadow = true;
  lowerArm1.position.set(0, -1.5, 0);
  elbow1.add(lowerArm1);
  const lowerArm2 = new THREE.Mesh(lowerArmGeo, lowerArmMat);
  lowerArm2.receiveShadow = true;
  lowerArm2.castShadow = true;
  lowerArm2.position.set(0, -1.5, 0);
  elbow2.add(lowerArm2);

  //WRISTS
  const wristGeo = new THREE.SphereGeometry(0.3,32,16);
  const wristMat = new THREE.MeshStandardMaterial({color:"#FFDBAC"});
  const wrist1 = new THREE.Mesh(wristGeo, wristMat);
  wrist1.receiveShadow = true;
  wrist1.castShadow = true;
  wrist1.position.set(0, -1.2, 0);
  lowerArm1.add(wrist1);
  const wrist2 = new THREE.Mesh(wristGeo, wristMat);
  wrist2.receiveShadow = true;
  wrist2.castShadow = true;
  wrist2.position.set(0, -1.2, 0);
  lowerArm2.add(wrist2);

  //HANDS
  const handGeo = new THREE.BoxGeometry(0.8,1,0.5);
  const handMat = new THREE.MeshStandardMaterial({color:"#FFDBAC"});
  const hand1 = new THREE.Mesh(handGeo, handMat);
  hand1.receiveShadow = true;
  hand1.castShadow = true;
  hand1.position.set(0, -0.5, 0);
  wrist1.add(hand1);
  const hand2 = new THREE.Mesh(handGeo, handMat);
  hand2.receiveShadow = true;
  hand2.castShadow = true;
  hand2.position.set(0, -0.5, 0);
  wrist2.add(hand2);

  //HIPS BONE
  const lengthH = 2, widthH = 0.2;
  const shapeH = new THREE.Shape();
  shapeH.moveTo( 0,0 );
  shapeH.lineTo( 0, widthH );
  shapeH.lineTo( lengthH, widthH );
  shapeH.lineTo( lengthH, 0 );
  shapeH.lineTo( 0, 0 );

  const extrudeSettingsH = {
  steps: 2,
  depth: 0.2,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 1,
  bevelOffset: 0,
  bevelSegments: 4
  };
  const hipsGeo = new THREE.ExtrudeGeometry( shapeH, extrudeSettingsH );
  const hipsMat = new THREE.MeshStandardMaterial({color:"#E1C16E"});
  const hips = new THREE.Mesh(hipsGeo, hipsMat);
  hips.receiveShadow = true;
  hips.castShadow = true;
  hips.position.set(-1, -1.7, -0.2);
  waist.add(hips);

  //HIPS
  const hipGeo = new THREE.SphereGeometry(0.8,32,16);
  const hipMat = new THREE.MeshStandardMaterial({color:"#E1C16E"});
  const hip1 = new THREE.Mesh(hipGeo, hipMat);
  hip1.receiveShadow = true;
  hip1.castShadow = true;
  hip1.position.set(-0.1, -1, 0.3);
  hips.add(hip1);
  const hip2 = new THREE.Mesh(hipGeo, hipMat);
  hip2.receiveShadow = true;
  hip2.castShadow = true;
  hip2.position.set(2, -1, 0.3);
  hips.add(hip2);

  //THIGHS
  const thighGeo = new THREE.CylinderBufferGeometry(1, 0.7, 4, 6);
  const thighMat = new THREE.MeshStandardMaterial({color:"#E1C16E"});
  const thigh1 = new THREE.Mesh(thighGeo, thighMat);
  thigh1.receiveShadow = true;
  thigh1.castShadow = true;
  thigh1.position.set(0, -2, 0);
  hip1.add(thigh1);
  const thigh2 = new THREE.Mesh(thighGeo, thighMat);
  thigh2.receiveShadow = true;
  thigh2.castShadow = true;
  thigh2.position.set(0, -2, 0);
  hip2.add(thigh2);

  //KNEES
  const kneeGeo = new THREE.SphereGeometry(0.7,32,16);
  const kneeMat = new THREE.MeshStandardMaterial({color:"#E1C16E"});
  const knee1 = new THREE.Mesh(kneeGeo, kneeMat);
  knee1.receiveShadow = true;
  knee1.castShadow = true;
  knee1.position.set(0, -1.8, 0);
  thigh1.add(knee1);
  const knee2 = new THREE.Mesh(kneeGeo, kneeMat);
  knee2.receiveShadow = true;
  knee2.castShadow = true;
  knee2.position.set(0, -1.8, 0);
  thigh2.add(knee2);

  //LEGS
  const legGeo = new THREE.CylinderBufferGeometry(0.7, 0.3, 3.5, 6);
  const legMat = new THREE.MeshStandardMaterial({color:"#281b0d"});
  const leg1 = new THREE.Mesh(legGeo, legMat);
  leg1.receiveShadow = true;
  leg1.castShadow = true;
  leg1.position.set(0, -1.5, 0);
  knee1.add(leg1);
  const leg2 = new THREE.Mesh(legGeo, legMat);
  leg2.receiveShadow = true;
  leg2.castShadow = true;
  leg2.position.set(0, -1.5, 0);
  knee2.add(leg2);

  //ANKLES
  const ankleGeo = new THREE.SphereGeometry(0.3,32,16);
  const ankleMat = new THREE.MeshStandardMaterial({color:"#281b0d"});
  const ankle1 = new THREE.Mesh(ankleGeo, ankleMat);
  ankle1.receiveShadow = true;
  ankle1.castShadow = true;
  ankle1.position.set(0, -1.5, 0);
  leg1.add(ankle1);
  const ankle2 = new THREE.Mesh(ankleGeo, ankleMat);
  ankle2.receiveShadow = true;
  ankle2.castShadow = true;
  ankle2.position.set(0, -1.5, 0);
  leg2.add(ankle2);

  //FEET
  const footGeo = new THREE.BoxGeometry(0.8,0.6,2);
  const footMat = new THREE.MeshStandardMaterial({color:"#281b0d"});
  const foot1 = new THREE.Mesh(footGeo, footMat);
  foot1.receiveShadow = true;
  foot1.castShadow = true;
  foot1.position.set(0, -0.5, 0.5);
  ankle1.add(foot1);
  const foot2 = new THREE.Mesh(footGeo, footMat);
  foot2.receiveShadow = true;
  foot2.castShadow = true;
  foot2.position.set(0, -0.5, 0.5);
  ankle2.add(foot2);


  //////////////////////////BEES MODEL///////////////////////
  var positionBeesX = [];
  var positionBeesZ = [];

  const numBees = 200;
  const beeRadius = 2;

  for (let i = 0; i < numBees; ++i) {
    const bee = new THREE.Object3D();
    bee.position.set(10,4,0);
    bee.scale.set(0.25,0.25,0.25);
    scene.add(bee);
    const dist1 = Math.round(getRandomArbitrary(-350,350));
    const dist2 = Math.round(getRandomArbitrary(0,15));
    const dist3 = Math.round(getRandomArbitrary(-350,350));

    positionBeesX[i] = [dist1];
    positionBeesZ[i] = [dist3];

    bee.position.set(dist1, dist2 , dist3);
    scene.add(bee);

    const beeTexture = loader.load('./images/beeTexture.png');
    beeTexture.minFilter = THREE.NearestFilter;

    const beeBodyMat = new THREE.MeshPhongMaterial({
      map: beeTexture,
    });
    const beeBodyGeo = new THREE.SphereGeometry(beeRadius,8,64);
    const beeBody = new THREE.Mesh(beeBodyGeo, beeBodyMat);
    beeBody.receiveShadow = true;
    beeBody.castShadow = true;
    bee.add(beeBody);

    const beeHeadMat = new THREE.MeshPhongMaterial({color:0xFFFFEB3B});
    const beeHeadGeo = new THREE.SphereGeometry(2,8,64);
    const beeHead = new THREE.Mesh(beeHeadGeo, beeHeadMat);
    beeHead.receiveShadow = true;
    beeHead.castShadow = true;
    beeHead.position.z = 3;
    beeBody.add(beeHead);

    const radiusW = 2;  // ui: radius
    const heightW = 5;  // ui: height
    const radialSegmentsW = 8;  // ui: radialSegments
    const heightSegmentsW = 1;  // ui: heightSegments
    const openEnded = true;  // ui: openEnded
    const thetaStart1 = 1.5;  // ui: thetaStart
    const thetaStart2 = 4;  // ui: thetaStart

    const thetaLength = 1;  // ui: thetaLength
    const beeWingGeo1 = new THREE.ConeGeometry(
        radiusW, heightW,
        radialSegmentsW, heightSegmentsW,
        openEnded,
        thetaStart1, thetaLength);
    const beeWingGeo2 = new THREE.ConeGeometry(
        radiusW, heightW,
        radialSegmentsW, heightSegmentsW,
        openEnded,
        thetaStart2, thetaLength);
    const beeWing1 = new THREE.Mesh(beeWingGeo1, new THREE.MeshBasicMaterial({color:0xD3D3D3}));
    const beeWing2 = new THREE.Mesh(beeWingGeo2, new THREE.MeshBasicMaterial({color:0xD3D3D3}));

    beeWing1.position.set(1,0.3,0.1);
    beeWing2.position.set(-1,0.3,0.1);

    beeWing1.rotation.z = Math.PI/4;
    beeWing2.rotation.z = -Math.PI/4;
    beeWing1.receiveShadow = true;
    beeWing1.castShadow = true;
    beeWing2.receiveShadow = true;
    beeWing2.castShadow = true;

    beeBody.add(beeWing1);
    beeBody.add(beeWing2);

    const beeEyeGeo = new THREE.SphereGeometry(1,32,16);
    const beeEyeMat = new THREE.MeshPhongMaterial({color:0x000000});
    const beeEye1 = new THREE.Mesh(beeEyeGeo, beeEyeMat);
    const beeEye2 = new THREE.Mesh(beeEyeGeo, beeEyeMat);

    beeEye1.position.set(-1,0.7,1);
    beeEye2.position.set(1,0.7,1);
    beeHead.add(beeEye1);
    beeHead.add(beeEye2);

    const stingGeo = new THREE.ConeGeometry( 1, 9, 8 );
    const stingMat = new THREE.MeshPhongMaterial( {color: 0x000000} );
    const sting = new THREE.Mesh( stingGeo, stingMat );
    sting.position.set(0,0,-2.5);
    sting.rotation.x = -Math.PI/2;
    beeBody.add( sting );

    //////////////ANIMATION: BEES ////////////////////////////
    var startF = { f1:0, f2:0, f3:0};
    var motion1 = { f1:-Math.PI/4, f2: Math.PI/4, f3:0.5};
    var motion2 = { f1:Math.PI/4, f2:-Math.PI/4, f3:-0.5};
    var tweenM1 = new TWEEN.Tween(startF).to(motion1, 200).easing(TWEEN.Easing.Quadratic.InOut)
    var tweenM2 = new TWEEN.Tween(startF).to(motion2, 200).easing(TWEEN.Easing.Quadratic.InOut).chain(tweenM1)
    tweenM1.chain(tweenM2)
    tweenM1.start()

    const updateF = function () {
      beeWing1.rotation.z = startF.f1;
      beeWing2.rotation.z = startF.f2;
      bee.position.y += startF.f3;
    }
    tweenM1.onUpdate(updateF)
    tweenM2.onUpdate(updateF);
}

//////////////ANIMATION: WALKING ////////////////////////////
    var start = {
      /*rotaitions*/ s1r:0 , s2r:0, e1r:0, e2r:0, tr:0, h1r:0, h2r:0, k1r:0, k2r:0};
    var target1 = { s1r:Math.PI/8 , s2r:-Math.PI/8, e1r:-Math.PI/6, e2r:-Math.PI/12, tr:-Math.PI/12, h1r:-Math.PI/4, h2r:Math.PI/12, k1r:Math.PI/6, k2r:0};
    var target2 = { s1r:Math.PI/6 , s2r:-Math.PI/6, e1r:-Math.PI/4, e2r:-Math.PI/6, tr:0, h1r:-Math.PI/6, h2r:Math.PI/6, k1r:0, k2r:Math.PI/6};
    var target3 = { s1r:-Math.PI/8 , s2r:Math.PI/8, e1r:-Math.PI/6, e2r:-Math.PI/6, tr:+Math.PI/12, h1r:Math.PI/6, h2r:-Math.PI/4, k1r:Math.PI/6, k2r:Math.PI/6};
    var tween1 = new TWEEN.Tween(start).to(target1, 500).easing(TWEEN.Easing.Quadratic.InOut)
    var tween2 = new TWEEN.Tween(start).to(target2, 200).easing(TWEEN.Easing.Quadratic.InOut)
    var tween3 = new TWEEN.Tween(start).to(target3, 500).easing(TWEEN.Easing.Quadratic.InOut).chain(tween1)

    tween1.chain(tween2);
    tween2.chain(tween3);

    const update = function () {
      hip1.rotation.x = start.h1r;
      hip2.rotation.x = start.h2r;
      torso.rotation.y = start.tr;
      shoulder1.rotation.x = start.s1r;
      shoulder2.rotation.x = start.s2r;
      elbow1.rotation.x = start.e1r;
      elbow2.rotation.x = start.e2r;
      knee1.rotation.x = start.k1r;
      knee2.rotation.x = start.k2r;
    }
    tween1.start();

///////////////////////////////EVENT LISTENERS FOR WALKING////////////////////////////////
    var move = 0;
    var move2 = 0;
    var move3 = 0;
    var startAngle = 0;

    window.addEventListener("keydown", function (event) {
      if (move2==2.5){move2=0.5;}
      if(move3==2.5){move3=0.5;}
       if (event.key == "ArrowUp") {
        //if the previous rotation was around right
        if (move==2) {
         if(move2==0.5){
           if (move3==0) {humanoid.position.x -= 1;}
           if (move3==0.5) {humanoid.position.z += 1;}
           if (move3==1) {humanoid.position.x += 1;}
           if (move3==1.5) {humanoid.position.z -= 1;}
           if (move3==2) {humanoid.position.x -= 1;}
         }
         if(move2==1){
           if (move3==0) {humanoid.position.z -= 1;}
           if (move3==0.5) {humanoid.position.x -= 1;}
           if (move3==1) {humanoid.position.z += 1;}
           if (move3==1.5) {humanoid.position.x += 1;}
           if (move3==2) {humanoid.position.z -= 1;}
         }
         if(move2==1.5){
           if (move3==0) {humanoid.position.x += 1;}
           if (move3==0.5) {humanoid.position.z -= 1;}
           if (move3==1) {humanoid.position.x -= 1;}
           if (move3==1.5) {humanoid.position.z += 1;}
           if (move3==2) {humanoid.position.x += 1;}
         }
         if(move2==2){
           if (move3==0) {humanoid.position.z += 1;}
           if (move3==0.5) {humanoid.position.x += 1;}
           if (move3==1) {humanoid.position.z -= 1;}
           if (move3==1.5) {humanoid.position.x -= 1;}
           if (move3==2) {humanoid.position.z += 1;}
        }
      //if the previous rotation is towards left
      }else if (move == 3){
         if(move3==0.5) {
            if(move2==0){humanoid.position.x += 1;}
            if(move2==0.5){humanoid.position.z += 1;}
            if(move2==1){humanoid.position.x -= 1;}
            if(move2==1.5){humanoid.position.z -= 1;}
            if (move2==2) {humanoid.position.x += 1;}
          }
          if(move3==1){
            if(move2==0){humanoid.position.z -= 1;}
            if(move2==0.5){humanoid.position.x += 1;}
            if(move2==1){humanoid.position.z += 1;}
            if(move2==1.5){humanoid.position.x -= 1;}
            if (move2==2) {humanoid.position.z -= 1;}
          }
          if(move3==1.5){
            if(move2==0){humanoid.position.x -= 1;}
            if(move2==0.5){humanoid.position.z -= 1;}
            if(move2==1){humanoid.position.x += 1;}
            if(move2==1.5){humanoid.position.z += 1;}
            if (move2==2) {humanoid.position.x -= 1;}
          }
          if(move3==2){
            if(move2==0){humanoid.position.z += 1;}
            if(move2==0.5){humanoid.position.x -= 1;}
            if(move2==1){humanoid.position.z -= 1;}
            if(move2==1.5){humanoid.position.x += 1;}
            if (move2==2) {humanoid.position.z += 1;}
          }
       } else if (move==0){ humanoid.position.z += 1; }

       return;
      }
     });

  window.addEventListener("keydown", function (event) {
    if (move2==2.5){move2=0.5;}
    if(move3==2.5){move3=0.5;}
        if (event.key == "ArrowRight") {
          var motionR = {x: startAngle-Math.PI/2}
          var startR = { x: startAngle};
          var tweenR = new TWEEN.Tween(startR).to(motionR, 200).easing(TWEEN.Easing.Quadratic.InOut)
          tweenR.start()

          const updateR = function () {
            humanoid.rotation.y = startR.x;
          }
          tweenR.onUpdate(updateR);
          startAngle = startAngle -Math.PI/2;
          move = 2;
          move2 += 0.5;
          return;
        }
  });
  window.addEventListener("keydown", function (event) {
    if (move2==2.5){move2=0.5;}
    if(move3==2.5){move3=0.5;}
        if (event.key == "ArrowLeft") {
          var motionR = {x: startAngle + Math.PI/2}
          var startR = { x: startAngle};
          var tweenR = new TWEEN.Tween(startR).to(motionR, 200).easing(TWEEN.Easing.Quadratic.InOut)
          tweenR.start()
          const updateR = function () {
            humanoid.rotation.y = startR.x;
          }
          tweenR.onUpdate(updateR);
          startAngle = startAngle + Math.PI/2;
          move = 3;
          move3 += 0.5;
          return;
        }
      });
    tween1.onUpdate(update)
    tween2.onUpdate(update)
    tween3.onUpdate(update);

////////////////////////////////////////////////////////////////////////////////
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
  //const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  var score = 0;
  var life = 10;

  function render(){
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    controls.target.set(humanoid.position.x, 15, humanoid.position.z); //target to orbit around to 5 units above the origin
    controls.update();
    humanoid.add(camera);

    const time = performance.now() * 0.001;
    document.getElementById("life").innerHTML = life;
    document.getElementById("score").innerHTML = score;

    ////////////////////////HIT BEES
    for(let i = 0; i < numBees; i++){
      var dxb = Math.abs(humanoid.position.x - positionBeesX[i]);
      var dzb = Math.abs(humanoid.position.z - positionBeesZ[i]);

      if ((dxb + dzb)<=beeRadius+1)   {
        life -= 1;
        if (life>0){
              setTimeout(function(){
                  document.getElementById("sting").innerHTML = 'BEE STING!';
              }, 0);
              setTimeout(function(){
                  document.getElementById("sting").innerHTML = '';
              }, 5000);
         }
        if (life==0) {
          window.location.href = "loose.html";
          life = 10;
        }
      }
    }
    /////////////////////////////////FRUITS////////////////////////////
   for(let i = 0; i < numTrees; i++){
      var dxa = Math.abs(humanoid.position.x - positionTreesX[i]);
      var dza = Math.abs(humanoid.position.z - positionTreesZ[i]);

      var dxb = Math.abs(humanoid.position.x - positionBramblesX[i]);
      var dzb = Math.abs(humanoid.position.z - positionBramblesZ[i]);
      /////////////////////////////////APPLES////////////////////////////
      if ((dxa + dza) <= 10)   {
        score += 1;
        if (score < 20){
              setTimeout(function(){
                  document.getElementById("fruit").innerHTML = 'SOME APPLES!';
              }, 0);
              setTimeout(function(){
                  document.getElementById("fruit").innerHTML = '';
              }, 1000);
         }
        if (score==20) {
          window.location.href = "win.html";
          score = 0;
        }
      }
      /////////////////////////////////BLUEBERRIES////////////////////////////
      if ((dxb + dzb) <= 15)   {
        score += 1;
        if (score < 20){
              setTimeout(function(){
                  document.getElementById("fruit").innerHTML = 'SOME BLUBERRIES!';
              }, 0);
              setTimeout(function(){
                  document.getElementById("fruit").innerHTML = '';
              }, 1000);
         }
        if (score==20) {
          window.location.href = "win.html";
          score = 0;
        }
      }
    }

 ///////////////////////FALL IN A LAKE
    for(let i = 0; i < 5; i++) {
      var dx = Math.abs(humanoid.position.x - positionLakesX[i]);
      var dz = Math.abs(humanoid.position.z - positionLakesZ[i]);

      if ((dx + dz)<=(waterRadius*scaleLakes[i])) {
        setTimeout(function(){
            document.getElementById("fall").innerHTML = 'YOU FELL IN THE LAKE!';
        }, 0);
        setTimeout(function(){
            document.getElementById("fall").innerHTML = '';
            window.location.href = "loose.html";
        }, 2000);

      }
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    TWEEN.update();
  }
  render();
}

main();
