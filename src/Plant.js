import GameObject from './GameObject.js'

export default class Plant extends GameObject {
    constructor(game, x, y, width = 20, maxHeight = 120) {
        super(game, x, y, width, 0)
        this.maxHeight = maxHeight
        this.growthSpeed = 0.1 // pixels per ms
        this.isFullyGrown = false
    }

    update(deltaTime) {
        if (this.isFullyGrown) return

        this.height += this.growthSpeed * deltaTime
        this.y -= this.growthSpeed * deltaTime // växer uppåt

        if (this.height >= this.maxHeight) {
            this.height = this.maxHeight
            this.isFullyGrown = true
        }
    }

    isSolid() {
        return this.isFullyGrown
    }

    draw(ctx) {
        ctx.fillStyle = 'green'
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}