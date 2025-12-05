import GameObject from "./GameObject";

export default class Circle extends GameObject {
    constructor(game, x, y, radius, color = 'green') {
        super(game, x, y, radius, radius) // radius som width och height
        this.radius = radius
        this.color = color

        this.velocityX = 0
        this.velocityY = 0

        this.bounce = 1.0
    }



    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}