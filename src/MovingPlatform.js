import Platform from "./Platform.js";

export default class MovingPlatform extends Platform {
    constructor(game, x, y, width, height, speedX, speedY, minX, minY, color = 'blue') {
        super(game, x, y, width, height)
        this.color = color
    }

    update(deltaTime) {
        
    }
}