# vr-paprika

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A collection of 3D assets for a paprika character, along with simple WebXR (VR/AR) viewing examples built with three.js.

[Live Demo](https://code4fukui.github.io/vr-paprika/)


![Demo screenshot showing an animated 3D model of a paprika character next to a USDZ QR code link.](https://code4fukui.github.io/vr-paprika/paprika.jpg)


## Demos

The project includes several web-based demos to showcase the 3D models in a browser and in immersive VR/AR environments. Use the `START VR` or `START AR` button on supported devices to enter an immersive session.

-   **[Animation Demo](https://code4fukui.github.io/vr-paprika/anim.html)**: A full-screen view of the paprika character with procedural animation.
-   **[GLB Model Viewer](https://code4fukui.github.io/vr-paprika/glb.html)**: A simple viewer for the combined `paprika.glb` model.
-   **[Box Test](https://code4fukui.github.io/vr-paprika/box.html)**: A basic WebXR test scene with a rotating cube.

## 3D Assets

The paprika character model is available in several formats:

-   **Blender:** `paprika.blend` - The original source file for editing.
-   **USDZ:** `paprika.usdz` - For AR Quick Look on Apple devices.
-   **glTF:**
    -   `paprika.glb`: The complete character as a single model.
    -   `paprika-body.glb`: The character's body only.
    -   `paprika-hand-left.glb`: The character's left hand.
    -   `paprika-hand-right.glb`: The character's right hand.

## Usage Example

The included `egthree.js` module provides a simple way to set up a WebXR scene with `three.js`. You can load and assemble the character parts as shown in the `anim.html` demo.

```javascript
import { createScene, loadGLB, setAnimationLoop } from "./egthree.js";

// Initialize the scene and WebXR button
const scene = createScene(document.body);

// Load model parts
const body = await loadGLB("./paprika-body.glb");
const meshr = await loadGLB("./paprika-hand-right.glb");
const meshl = await loadGLB("./paprika-hand-left.glb");

// Assemble the character
scene.add(body);
body.add(meshr);
body.add(meshl);

// Position parts
meshr.position.set(-.045, .15, 0.03);
meshl.position.set(.05, .16, 0.03);
body.position.set(0, -0.1, -0.28);

// Animate the model procedurally
setAnimationLoop(() => {
  const t = performance.now();
  body.rotation.y += 0.005;
  meshr.rotation.x = Math.cos(t * 0.001) * Math.PI / 2;
  meshl.rotation.x = -Math.cos(t * 0.001) * Math.PI / 2;
});
```

## Dependencies

-   The web demos are built using [three.js](https://threejs.org/).