import GameObject from './GameObject.js'

export default class Coin extends GameObject {
    constructor(game, x, y, size = 20, value = 10, color = 'yellow') {
        super(game, x, y, size, size)
        this.size = size
        this.color = color
        this.value = value
        
        // Bob animation
        this.bobOffset = Math.random() * Math.PI * 2 // slumpa start så inte alla gungar exakt samtidigt (cool)
        this.bobSpeed = 0.006 
        this.bobDistance = 5 // fem pixlar upp coh ner

        this.angle = 0
        this.rotationSpeed = 0.05 
    }

    update(deltaTime) {
        this.bobOffset += this.bobSpeed * deltaTime
        this.angle += this.rotationSpeed
    }

    draw(ctx) {
        const bobY = Math.sin(this.bobOffset) * this.bobDistance

        ctx.save()
        
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2 + bobY)
        
        ctx.rotate(this.angle)
        
        ctx.fillStyle = this.color
        ctx.beginPath()

        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
        ctx.fill()

        // detalj för att se om det snurrar (ett "gläns"?)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.fillRect(-2, -this.size / 2, 4, this.size) // ett smalt streck i mitten

        ctx.restore() //  återställ så inte resten av spelet roterar
    }
}
