class Resources{
    constructor(){
        this.toLoad = {
            background: "./sprites/maps/open-space.png",
            hitsplat: "./sprites/glock/glock-hitsplat.png",
        };
        
        this.images = {}; // store all images

        Object.keys(this.toLoad).forEach((key) => {
            const img = new Image();
            img.src = this.toLoad[key];

            this.images[key] = { image: img, loaded: false }; // store the image and its load status

            img.onload = () => {
                this.images[key].loaded = true;
            };
        });


        
    }
}

export const resources = new Resources();