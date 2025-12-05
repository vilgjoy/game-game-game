import GameObject from './GameObject.js'

export default class Triangle extends GameObject {
    constructor(game, x, y, width, height, color = 'pink') {
        super(game, x, y, width, height)
        this.color = color

        // Hastighet i x och y riktning
        this.velocityX = 0
        this.velocityY = 0
        
        // Studs-faktor (1.0 = perfekt studs, 0.8 = tappar energi)
        this.bounce = 1.0
    }

    update(deltaTime) {
        // Flytta baserat på hastighet
        this.x += this.velocityX * deltaTime
        this.y += this.velocityY * deltaTime

        // Studsa mot väggarna
        if (this.x < 0 || this.x + this.width > this.game.width) {
            this.velocityX = -this.velocityX * this.bounce  // Byt X-riktning
        }
        if (this.y < 0 || this.y + this.height > this.game.height) {
            this.velocityY = -this.velocityY * this.bounce  // Byt Y-riktning
        }
    }

    draw(ctx) {
        // ctx.save()
        // ctx.rotate((Math.PI / 180) * 25)
        // Rita triangeln
        ctx.fillStyle = this.color
        ctx.beginPath()
        // Top point (spets)
        ctx.moveTo(this.x + this.width / 2, this.y)
        // Bottom right
        ctx.lineTo(this.x + this.width, this.y + this.height)
        // Bottom left
        ctx.lineTo(this.x, this.y + this.height)
        // Close the path back to top
        ctx.closePath()
        ctx.fill()
        ctx.restore()
    }
}