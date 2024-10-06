//import { Vector } from './grid.js';

class Resources{
    constructor(){
        this.toLoad = {
            background: "./sprites/maps/open-space.png",
            hitsplat: "./sprites/glock/glock-hitsplat.png",
        };

       // this.walls = [new Vector(50, 50), new Vector(910, 50), new Vector(50, 660), new Vector(910, 660)];
        
        
        this.images = {}; // store all images

        Object.keys(this.toLoad).forEach((key) => {
            const img = new Image(); // only available in browser (client)
            img.src = this.toLoad[key];

            this.images[key] = { image: img, loaded: false }; // store the image and its load status

            img.onload = () => {
                this.images[key].loaded = true;
            };
        });


        
    }
}

export const resources = new Resources();

// background map size
// top left corner (50, 50)     // top right corner (910, 50)
// bottom left corner (50, 660) -- (910, 660)