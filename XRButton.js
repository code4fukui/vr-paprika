export class XRButton {
  static createButton(renderer, sessionInit = {}) {
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType(sessionInit.spaceType);
    //renderer.xr.setReferenceSpaceType("local-floor");

    const button = document.createElement("button");
    button.className = "xrbutton";

    function showStartAR() {
      showStartXR(true);
    }
    function showStartVR() {
      showStartXR(false);
    }
    function showStartXR(isImmersive) {
      /*
      if (sessionInit.domOverlay === undefined) {
        const overlay = document.createElement("div");
        overlay.style.display = "none";
        document.body.appendChild(overlay);

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", 38);
        svg.setAttribute("height", 38);
        svg.style.position = "absolute";
        svg.style.right = "20px";
        svg.style.top = "20px";
        svg.addEventListener("click", function () {
          currentSession.end();
        });
        overlay.appendChild(svg);

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M 12,12 L 28,28 M 28,12 12,28");
        path.setAttribute("stroke", "#fff");
        path.setAttribute("stroke-width", 2);
        svg.appendChild(path);

        if (sessionInit.optionalFeatures === undefined) {
          sessionInit.optionalFeatures = [];
        }
        sessionInit.optionalFeatures.push("dom-overlay");
        sessionInit.domOverlay = { root: overlay };
      }
      */

      //
      let currentSession = null;
      async function onSessionStarted(session) {
        session.addEventListener("end", onSessionEnded);
        /*
        if (true) {
          renderer.xr.setReferenceSpaceType(sessionInit.spaceType || "local-floor");
        } else {
          renderer.xr.setReferenceSpaceType("local");
        }
        */
        await renderer.xr.setSession(session);
        button.textContent = isImmersive ? "STOP AR" : "STOP VR";
        //sessionInit.domOverlay.root.style.display = "";
        currentSession = session;
      }

      function onSessionEnded(/*event*/) {
        currentSession.removeEventListener("end", onSessionEnded);
        button.textContent = isImmersive ? "START AR" : "START VR";
        //sessionInit.domOverlay.root.style.display = "none";
        currentSession = null;
      }

      //
      button.style.display = "";

      /*
      button.style.cursor = "pointer";
      button.style.left = "calc(50% - 50px)";
      button.style.width = "100px";
      */

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

    function disableButton() {
      button.style.display = "";

      /*
      button.style.cursor = "auto";
      button.style.left = "calc(50% - 75px)";
      button.style.width = "150px";
      */

      button.onmouseenter = null;
      button.onmouseleave = null;

      button.onclick = null;
    }
    function showVRNotSupported() {
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
          //message.href = document.location.href.replace(/^http:/, "https:");
          button.textContent = "WebXR needs HTTPS"; // TODO Improve message
        } else {
          //message.href = "https://immersiveweb.dev/";
          button.textContent = "WebXR Not available";
        }
        /*
        const message = document.createElement("a");
        if (window.isSecureContext === false) {
          message.href = document.location.href.replace(/^http:/, "https:");
          message.innerHTML = "WebXR needs HTTPS"; // TODO Improve message
        } else {
          message.href = "https://immersiveweb.dev/";
          message.innerHTML = "WebXR Not available";
        }
        message.style.left = "calc(50% - 90px)";
        message.style.width = "180px";
        message.style.textDecoration = "none";
        stylizeElement(message);
        */
      }
    }
    function showARNotAllowed(exception) {
      disableButton();
      console.warn("Exception when trying to call xr.isSessionSupported", exception);
      button.textContent = "AR NOT ALLOWED";
    }
    function showVRNotAllowed(exception) {
      disableButton();
      console.warn("Exception when trying to call xr.isSessionSupported", exception);
      button.textContent = "VR NOT ALLOWED";
    }
    /*
    function stylizeElement(element) {
      element.style.position = "absolute";
      element.style.bottom = "20px";
      element.style.padding = "12px 6px";
      element.style.border = "1px solid #fff";
      element.style.borderRadius = "4px";
      element.style.background = "rgba(0,0,0,0.1)";
      element.style.color = "#fff";
      element.style.font = "normal 13px sans-serif";
      element.style.textAlign = "center";
      element.style.opacity = "0.5";
      element.style.outline = "none";
      element.style.zIndex = "999";
    }
    */

    if ("xr" in navigator) {
      //button.id = "XRButton";
      //button.style.display = "none";

      //stylizeElement(button);

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
          showVRNotSupported();
        }).catch(() => {
          showVRNotAllowed();
        });
      }).catch(() => {
        showARNotAllowed();
      });
    } else {
      showVRNotSupported();
    }
    return button;
  }
}