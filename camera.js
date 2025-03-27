export class Camera {
    constructor(mapWidth, mapHeight, viewportWidth, viewportHeight) {
        this.x = 0; // Top-left X of camera
        this.y = 0; // Top-left Y of camera
        this.width = viewportWidth;  // Camera viewport width
        this.height = viewportHeight; // Camera viewport height
        this.mapWidth = mapWidth;  // Map's full width
        this.mapHeight = mapHeight; // Map's full height
    }

    follow(target) {
        // Center camera on target
        this.x = target.x - this.width / 2;
        this.y = target.y - this.height / 2;

        // Keep camera within bounds of the map
        this.x = Math.max(0, Math.min(this.x, this.mapWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, this.mapHeight - this.height));
    }
}
