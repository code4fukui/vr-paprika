import * as THREE from "three";
import { AsyncGLTFLoader } from "https://code4fukui.github.io/ar-mmd/AsyncGLTFLoader.js";
//import { isVisionPro } from "https://code4fukui.github.io/spatialphoto-viewer/isVisionPro.js";

export { THREE };

const createXRButton = (renderer, sessionInit = {}) => {
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType(sessionInit.spaceType);
  //renderer.xr.setReferenceSpaceType("local-floor");

  const button = document.createElement("button");
  button.className = "xrbutton";

  const showStartAR = () => showStartXR(true);
  const showStartVR = () => showStartXR(false);
  const showStartXR = (isImmersive) => {
    let currentSession = null;
    const onSessionStarted = async (session) => {
      session.addEventListener("end", onSessionEnded);
      await renderer.xr.setSession(session);
      button.textContent = isImmersive ? "STOP AR" : "STOP VR";
      currentSession = session;
    };
    const onSessionEnded = (event) => {
      currentSession.removeEventListener("end", onSessionEnded);
      button.textContent = isImmersive ? "START AR" : "START VR";
      currentSession = null;
    };
    button.textContent = isImmersive ? "START AR" : "START VR";
    button.onmouseenter = () => button.style.opacity = "1.0";
    button.onmouseleave = () => button.style.opacity = "0.5";
    button.onclick = () => {
      if (currentSession === null) {
        const mode = isImmersive ? "immersive-ar" : "immersive-vr";
        navigator.xr.requestSession(mode, sessionInit).then(onSessionStarted);
      } else {
        currentSession.end();
      }
    };
  }

  const disableButton = () => {
    button.onmouseenter = null;
    button.onmouseleave = null;
    button.onclick = null;
  };
  function showXRNotSupported() {
    if (renderer.domElement.requestFullscreen) {
      button.textContent = "FULL";
      button.onmouseenter = () => button.style.opacity = "1.0";
      button.onmouseleave = () => button.style.opacity = "0.5";
      button.onclick = () => {
        renderer.domElement.requestFullscreen();
      };
    } else {
      disableButton();
      if ("xr" in navigator) {
        button.textContent = "WebXR not supported";
      } else if (!isSecureContext) {
        button.textContent = "WebXR needs HTTPS";
      } else {
        button.textContent = "WebXR Not available";
      }
    }
  }
  const showXRNotAllowed = (mode) => {
    disableButton();
    console.warn("Exception when trying to call xr.isSessionSupported");
    button.textContent = mode + " NOT ALLOWED";
  };
  if ("xr" in navigator) {
    navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
      if (supported) {
        showStartAR();
        return;
      }
      navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
        if (supported) {
          showStartVR();
          return;
        }
        showXRNotSupported();
      }).catch((exception) => {
        //showXRNotAllowed("VR");
        showXRNotSupported();
      });
    }).catch(() => {
      //showXRNotAllowed("AR");
      showXRNotSupported();
    });
  } else {
    showXRNotSupported();
  }
  return button;
};


let renderer = null;
let scene = null;
let camera = null;
let bkwidth, bkheight;
let container = null;

export const createScene = (_container) => {
  if (scene) return scene;
  container = _container;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha for AR
  renderer.setPixelRatio(devicePixelRatio);

  renderer.setSize(container.clientWidth, container.clientHeight);
  bkwidth = container.clientWidth;
  bkheight = container.clientHeight;

  container.appendChild(renderer.domElement);
  renderer.domElement.classList.add("three");

  scene = new THREE.Scene();
  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(70, aspect, 0.01, 100);

  /*
  const spotLight = new THREE.SpotLight(0xffffff);
  // スポッドライト(色, 光の強さ, 距離, 照射角, ボケ具合, 減衰率)
  spotLight.position.set(1, 1, 4.5);
  spotLight.castShadow = true;
  scene.add(spotLight);
  */
  const light = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(light);

  const light2 = new THREE.DirectionalLight(0xffffff, 1.5);
  light2.position.x = 1;
  light2.position.z = 1;
  scene.add(light2);

  // WebXR
  //const spaceType = "local-floor"; // not for PC
  //const spaceType = "local";
  const spaceType = "viewer"; // 3DoF
  container.appendChild(createXRButton(renderer, { spaceType }));


  //const offy = isVisionPro ? 1 : 0;
  return scene;
};

const gltfloader = new AsyncGLTFLoader();
export const loadGLB = async (path) => {
  const gltf = await gltfloader.load(path);
  return gltf.scene;
};

let tick = null;
export const setAnimationLoop = (f) => {
  tick = f;
  if (tick) {
    renderer.setAnimationLoop(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w != bkwidth || h != bkheight) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        bkwidth = w;
        bkheight = h;
      }

      tick();
      renderer.render(scene, camera);
    });
  } else {
    renderer.setAnimationLoop(null);
  }
};
