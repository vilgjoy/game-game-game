import Player from './Player.js'
import InputHandler from './InputHandler.js'
import Rectangle from './Rectangle.js'

export default class Game {
    constructor(width, height) {
        this.width = width
        this.height = height

        this.inputHandler = new InputHandler(this)

        this.player = new Player(this, 50, 50, 50, 50, 'blue')

        // Skapa alla objekt i spelet
        this.gameObjects = [
            new Rectangle(this, 200, 150, 50, 50, 'red'),
            new Rectangle(this, 400, 300, 100, 100, 'green'),
        ]

        // Sätt starthastighet (pixlar per millisekund)
        // this.gameObjects[0].vx = 0.1
        // this.gameObjects[0].vy = 0.05
        // this.gameObjects[1].vx = -0.08
        // this.gameObjects[1].vy = 0.12
    }

    update(deltaTime) {
        // återställ spelarens färg varje frame
        this.player.color = 'blue'

        // Uppdatera spelet utifrån deltaTime
        this.gameObjects.forEach(obj => obj.update(deltaTime))
        this.player.update(deltaTime)

        // Exempel på input-hantering
        if (this.inputHandler.keys.has('r')) {
            this.gameObjects[0].vx += 0.001 * deltaTime
        }
        if (this.inputHandler.keys.has('b')) {
            this.gameObjects[1].vy -= 0.001 * deltaTime
        }

        this.gameObjects.forEach(obj => {
            if (obj !== this.player && this.player.intersects(obj)) {
                // byter färg för visa att krrockar
                this.player.color = 'yellow'    
                // 1 räkna ut mittenpunkterna
                let playerCenterX = this.player.x + this.player.width / 2
                let playerCenterY = this.player.y + this.player.height / 2
                let objCenterX = obj.x + obj.width / 2
                let objCenterY = obj.y + obj.height / 2

                // 2 räkna ut avståndet mellan objekten (vektor)
                let dx = playerCenterX - objCenterX
                let dy = playerCenterY - objCenterY

                // 3 räkna ut hur brett det totala avståndet "får" vara innan krock
                let combinedHalfWidth = this.player.width / 2 + obj.width / 2
                let combinedHalfHeight = this.player.height / 2 + obj.height / 2

                // 4 äkna ut överlappet (hur djupt in vi är)
                let overlapX = combinedHalfWidth - Math.abs(dx)
                let overlapY = combinedHalfHeight - Math.abs(dy)

                // 5 olla vilken ledd som har MINST överlapp. Det är "vägen ut".
                if (overlapX < overlapY) {
                    // krock i sidled (X) är den minsta inträngningen -> åtgärda X
                    if (dx > 0) { 
                        // spelaren är till höger om objektet -> putta åt höger
                        this.player.x = obj.x + obj.width
                    } else { 
                        // spelaren är till vänster -> putta åt vänster
                        this.player.x = obj.x - this.player.width
                    }
                    // viktigt?: nollställ hastighet vid krock
                    this.player.velocityX = 0 
                } else {
                    // krock i höjdled (Y) är den minsta inträngningen -> åtgärda Y
                    if (dy > 0) { 
                        // spelaren är under objektet -> putta neråt
                        this.player.y = obj.y + obj.height
                    } else { 
                        // spelaren är över objektet -> putta uppåt
                        this.player.y = obj.y - this.player.height
                    }
                    // viktigt=?: nollställ hastighet vid krock
                    this.player.velocityY = 0
                }
            }
        })
    }

    draw(ctx) {
        // Rita alla spelobjekt
        this.gameObjects.forEach(obj => obj.draw(ctx))
        this.player.draw(ctx)
    }
}