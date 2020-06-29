// Source: https://halfbaked.city/tutorials/getting-started-with-webxr-part-3

import { VRButton } from '/VRButton.js';
import { PointerLockControls } from '/PointerLockControls.js';

export default class SessionHandler {
    constructor(renderer, camera) {
        document.body.appendChild(VRButton.createButton(renderer));
        this._controls = new PointerLockControls(camera, document.body);
        document.body.addEventListener('mousedown', (e) => {
            if (e.button === 2)
                this._controls.lock(); 
        });
        document.addEventListener('mouseup', (e) => {
            if (e.button === 2)
                this._controls.unlock();
        })
    }
}