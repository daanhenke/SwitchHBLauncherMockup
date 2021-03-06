import {WaterWidget} from "./objects/Water";
import {TitleScene} from "./scenes/TitleScene";
import {CreditsScene} from "./scenes/CreditsScene";

class Menu {
    constructor() {
        this.container = document.querySelector('#appContainer');

        this.foregroundCanvas = document.querySelector('#foregroundCanvas');
        this.foregroundContext = this.foregroundCanvas.getContext('2d');

        this.backgroundCanvas = document.querySelector('#backgroundCanvas');
        this.backgroundContext = this.backgroundCanvas.getContext('2d');

        this.waterWidget = new WaterWidget();

        this.scenes = [
            new TitleScene(),
            new CreditsScene()
        ];
        this.currentScene = 0;

        this.setResolution(1280, 720);
        this.waterWidget.baseHeight = this.waterWidget.canvas.height;
        this.scenes[this.currentScene].transitionTo(this);
    }

    setResolution(width, height) {
        this.width = width;
        this.height = height;

        this.foregroundCanvas.width = width;
        this.foregroundCanvas.height = height;

        this.backgroundCanvas.width = width;
        this.backgroundCanvas.height = height;

        this.waterWidget.setResolution(width, height);

        this.switchScenes(this.currentScene);
    }

    draw() {
        this.scenes[this.currentScene].drawBackground(this.backgroundCanvas, this.backgroundContext);
        this.waterWidget.draw();
        this.scenes[this.currentScene].drawForeground(this.foregroundCanvas, this.foregroundContext);
    }

    switchScenes(to) {
        let previousScene = this.scenes[this.currentScene];
        let newScene = this.scenes[to];

        previousScene.transitionFrom(this, () => {
            this.currentScene = to;
            newScene.transitionTo(this, () => {

            });
        });
    }

    handleInput(key) {
        this.scenes[this.currentScene].handleInput(key);
    }
}

window.addEventListener('load', () => {
    window.menu = new Menu();

    function tick() {
        requestAnimationFrame(tick);
        window.menu.draw();
    }

    requestAnimationFrame(tick);

    document.addEventListener('keypress', event => {
        let key;

        let keyCode = event.charCode | event.key.charCodeAt(0);
        switch (keyCode) {
            case 69:
                key = 'start';
                break;
            case 97:
                key = 'a';
                break;
            case 98:
                key = 'b';
                break;

            default:
                console.log(keyCode);
                break;
        }

        console.log(key);

        if (key !== undefined)
            window.menu.handleInput(key);
    });

    let waveHeightSlider = document.querySelector('#waveHeight');
    waveHeightSlider.addEventListener('click', () => {
        window.menu.waterWidget.baseHeight = waveHeightSlider.value;
    });

    let hd = false;
    document.querySelector('#toggleRes').addEventListener('click', () => {
        if (hd) {
            window.menu.container.classList.toggle("mode-720p");
            window.menu.container.classList.toggle("mode-1080p");
            window.menu.setResolution(1280, 720);
        }
        else{
            window.menu.container.classList.toggle("mode-1080p");
            window.menu.container.classList.toggle("mode-720p");
            window.menu.setResolution(1920, 1080);
        }

        hd = !hd;
    });
});

// window.onerror = function (message) {
//     alert(message);
// };