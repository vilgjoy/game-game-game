export default class UserInterface {
    constructor(game) {
        this.game = game
        this.fontSize = 24
        this.fontFamily = 'Arial'
        this.textColor = '#FFFFFF'
        this.shadowColor = '#000000'
    }

    draw(ctx) {
        ctx.save()
        
        // Konfigurera tex
        ctx.font = `${this.fontSize}px ${this.fontFamily}`
        ctx.fillStyle = this.textColor
        ctx.shadowColor = this.shadowColor
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
        ctx.shadowBlur = 3
        
        // Rita score
        const scoreText = `Score: ${this.game.score}`
        ctx.fillText(scoreText, 20, 40)
        
        // Rita coins collected
        const coinsText = `Coins: ${this.game.coinsCollected}`
        ctx.fillText(coinsText, 20, 70)
        
        ctx.restore()
    }
}
