import GameObject from './GameObject.js'

export default class Player extends GameObject {
    constructor(game, x, y, width, height, color) {
        super(game, x, y, width, height)
        this.color = color
        
        // Nuvarande hastighet (pixels per millisekund)
        this.velocityX = 0
        this.velocityY = 0

        // Rörelsehastighet (hur snabbt spelaren accelererar/rör sig)
        this.moveSpeed = 0.3
        this.directionX = 0
        this.directionY = 0

        // Fysik egenskaper
        this.jumpPower = -0.5 // negativ hastighet för att hoppa uppåt
        this.isGrounded = false // om spelaren står på marken
        this.jumpCount = 0 // räknare för dubbelhopp
        this.maxJumps = 2

        // dash
        this.dashSpeed = 0.6
        this.dashDuration = 200
        this.dashTimer = 0
        this.isDashing = false
        this.canDash = true
        this.facingDirection = 1 // 1 för höger, -1 för vänster
    }

    update(deltaTime) {
        if (this.game.inputHandler.keys.has('a')) {
            this.facingDirection = -1
        }
        if (this.game.inputHandler.keys.has('d')) {
            this.facingDirection = 1
        }

        // starta dashen (så man kan dasha medans man går)
        if (this.game.inputHandler.keys.has('j') && !this.isDashing && this.canDash) {
            this.isDashing = true
            this.canDash = false
            this.dashTimer = this.dashDuration
        }

        if (this.isDashing) {
            this.velocityX = this.facingDirection * this.dashSpeed
            this.velocityY = 0 // inte faller när man dashar

            this.dashTimer -= deltaTime
            if (this.dashTimer <= 0) {
                this.isDashing = false
                this.velocityX = 0
            }
        } else {
            if (this.game.inputHandler.keys.has('a')) {
                this.velocityX = -this.moveSpeed
                this.directionX = -1
            } else if (this.game.inputHandler.keys.has('d')) {
                this.velocityX = this.moveSpeed
                this.directionX = 1
            } else {
                this.velocityX = 0
                this.directionX = 0
            }
        }

        // Hopp - endast om spelaren är på marken
        if (this.game.inputHandler.keys.has(' ') && this.jumpCount < this.maxJumps) {
            this.game.inputHandler.keys.delete(' ') // förhindra kontinuerligt hopp när mellanslag hålls nere
            this.velocityY = this.jumpPower
            this.jumpCount++
            this.isGrounded = false
        }  else if (this.isGrounded) {
            this.jumpCount = 0 // återställ hopp räknaren när spelaren är på marken
            this.canDash = true // can dasha när du landar igen
        }
        

        // Applicera gravitation
        this.velocityY += this.game.gravity * deltaTime
        
        // Applicera luftmotstånd (friktion)
        if (this.velocityY > 0) {
            this.velocityY -= this.game.friction * deltaTime
            if (this.velocityY < 0) this.velocityY = 0
        }

        // Sätt directionY baserat på vertikal hastighet för ögonrörelse
        if (this.velocityY < -0.1) {
            this.directionY = -1 // tittar upp när man hoppar
        } else if (this.velocityY > 0.1) {
            this.directionY = 1 // tittar ner när man faller
        } else {
            this.directionY = 0
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
        // rita mun som ett streck
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(this.x + this.width * 0.3, this.y + this.height * 0.65)
        ctx.lineTo(this.x + this.width * 0.7, this.y + this.height * 0.65)
        ctx.stroke()
    }
}