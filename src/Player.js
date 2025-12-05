import GameObject from './GameObject.js'

export default class Player extends GameObject {
    constructor(game, x, y, width, height, color) {
        super(game, x, y, width, height)
        this.color = color
        
        // Nuvarande hastighet (pixels per millisekund)
        this.velocityX = 0
        this.velocityY = 0

        // Rörelsehastighet (hur snabbt spelaren accelererar/rör sig)
        this.moveSpeed = 0.5
        this.directionX = 0
        this.directionY = 0

        this.idleTimer = 0
        // tiden (i millisekunder) innan spelaren blir ledsen
        this.sadTime = 4000
    }

    update(deltaTime) {
        // Styr spelaren med piltangenterna
        if (this.game.inputHandler.keys.has('ArrowUp')) {
            this.velocityY = -this.moveSpeed
            this.directionY = -1
        } else if (this.game.inputHandler.keys.has('ArrowDown')) {
            this.velocityY = this.moveSpeed
            this.directionY = 1
        } else {
            this.velocityY = 0
            this.directionY = 0
        }

        if (this.game.inputHandler.keys.has('ArrowLeft')) {
            this.velocityX = -this.moveSpeed
            this.directionX = -1
        } else if (this.game.inputHandler.keys.has('ArrowRight')) {
            this.velocityX = this.moveSpeed
            this.directionX = 1
        } else {
            this.velocityX = 0
            this.directionX = 0
        }

        // om man rör sig (hastigheten inte 0), nollställ timer och bli glad
        if (this.velocityX !== 0 || this.velocityY !== 0) {
            this.idleTimer = 0
        } else {
            // Om vi står still, lägg till tid till timern
            this.idleTimer += deltaTime
        }

        // Uppdatera position baserat på hastighet
        this.x += this.velocityX * deltaTime
        this.y += this.velocityY * deltaTime
    }

    draw(ctx) {
        // Rita spelaren som en rektangel
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)

        // Rita ögon
        ctx.fillStyle = 'white'
        ctx.fillRect(this.x + this.width * 0.2, this.y + this.height * 0.2, this.width * 0.2, this.height * 0.2)
        ctx.fillRect(this.x + this.width * 0.6, this.y + this.height * 0.2, this.width * 0.2, this.height * 0.2)
        
        // Rita pupiller
        ctx.fillStyle = 'black'
        ctx.fillRect(
            this.x + this.width * 0.25 + this.directionX * this.width * 0.05, 
            this.y + this.height * 0.25 + this.directionY * this.width * 0.05, 
            this.width * 0.1, 
            this.height * 0.1
        )
        ctx.fillRect(
            this.x + this.width * 0.65 + this.directionX * this.width * 0.05, 
            this.y + this.height * 0.25 + this.directionY * this.width * 0.05, 
            this.width * 0.1, 
            this.height * 0.1
        )

        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        ctx.beginPath()

        const mouthCenterX = this.x + this.width * 0.5
        // sätter Y lite olika beroende på om den är glad eller ledsen för att det ska se snyggt ut
        let mouthCenterY = this.y + this.height * 0.65 
        const mouthRadius = this.width * 0.2

        if (this.idleTimer > this.sadTime) {
            // ledsen: ritar en båge moturs (ser ut som ett uppochnervänt U)
            // flyttar ner centern lite så bågen inte hamnar mitt i ansiktet
            mouthCenterY = this.y + this.height * 0.8
            ctx.arc(mouthCenterX, mouthCenterY, mouthRadius, 0, Math.PI, true) 
        } else {
            // glad: ritar en båge medurs (ser ut som ett U)
            ctx.arc(mouthCenterX, mouthCenterY, mouthRadius, 0, Math.PI, false)
        }
        
        ctx.stroke()
    }
}