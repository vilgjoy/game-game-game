import Player from './Player.js'
import InputHandler from './InputHandler.js'
import Platform from './Platform.js'
import Coin from './Coin.js'
import Enemy from './Enemy.js'
import UserInterface from './UserInterface.js'
import Plant from './Plant.js'
export default class Game {
    constructor(width, height) {
        this.width = width
        this.height = height

        // Fysik
        this.gravity = 0.001 // pixels per millisekund^2
        this.friction = 0.00015 // luftmotstånd för att bromsa fallhastighet

        // Game state
        this.ePressed = false 
        this.gameState = 'TITLE' // PLAYING, GAME_OVER, WIN, TITLE
        this.score = 0
        this.coinsCollected = 0
        this.totalCoins = 0 // Sätts när vi skapar coins

        this.inputHandler = new InputHandler(this)
        this.ui = new UserInterface(this)
        
        // Initiera spelet
        this.init()
    }
    
    init() {
        this.ePressed = false
        // Återställ game state
        this.score = 0
        this.coinsCollected = 0

        this.player = new Player(this, 50, 50, 50, 50, 'green')
        this.plant = null 
        
        // slutet av banan, där växten ska vara
        this.levelEndZone = {x: 750, y: this.height - 80, width: 60, height: 40}

        // Skapa plattformar för nivån
        this.platforms = [
            // Marken
            new Platform(this, 0, this.height - 40, this.width, 40, '#654321'),
            
            // Plattformar
            new Platform(this, 150, this.height - 140, 150, 20, '#8B4513'),
            new Platform(this, 400, this.height - 200, 120, 20, '#8B4513'),
            new Platform(this, 100, this.height - 280, 100, 20, '#8B4513'),
            new Platform(this, 550, this.height - 160, 100, 20, '#8B4513'),
            new Platform(this, 350, this.height - 320, 140, 20, '#8B4513'),
        ]

        // Skapa mynt i nivån
        this.coins = [
            new Coin(this, 200, this.height - 180),
            new Coin(this, 240, this.height - 180),
            new Coin(this, 450, this.height - 240),
            new Coin(this, 150, this.height - 320),
            new Coin(this, 190, this.height - 320),
            new Coin(this, 600, this.height - 200),
            new Coin(this, 380, this.height - 360),
            new Coin(this, 420, this.height - 360),
        ]
        this.totalCoins = this.coins.length

        // Skapa fiender i nivån
        this.enemies = [
            new Enemy(this, 200, this.height - 220, 40, 40, 80),
            new Enemy(this, 450, this.height - 240, 40, 40),
            new Enemy(this, 360, this.height - 440, 40, 40, 50),
        ]

        // Skapa andra objekt i spelet (valfritt)
        this.gameObjects = []
    }
    
    restart() {
        this.init()
    }

    playerInLevelEndZone() {
        const p = this.player
        const z = this.levelEndZone

        return (
            p.x < z.x + z.width &&
            p.x + p.width > z.x &&
            p.y < z.y + z.height &&
            p.y + p.height > z.y
        )

    }

    update(deltaTime) {
        if (this.gameState === 'TITLE') {
            if (this.inputHandler.keys.has('Enter') || this.inputHandler.keys.has(' ')) {
                this.gameState = 'PLAYING'
            }
            return
        }


        if (this.gameState === 'WATERING') {
            this.plant.update(deltaTime)

            if (this.plant.isFullyGrown) {
                this.ePressed = false
                this.restart() // senare, next level
            }

            return // stoppar resten av update (spelaren kan inte röra sig medan vattnar)
        }

        // const nearPlant = this.plant && this.player.intersects(this.plant)
        // kan användas senare för fake plants, flera plantor, etc

        if (this.gameState === 'PLAYING' && this.playerInLevelEndZone() && this.player.isGrounded && !this.ePressed && (this.inputHandler.keys.has('e') || this.inputHandler.keys.has('E'))) {
           this.gameState = 'WATERING'
           this.ePressed = true
            // visa text "Press E i draw()?" här
    

            // starta växten om E trycks
            this.plant = new Plant(this, this.levelEndZone.x + this.levelEndZone.width / 2 - 10, this.levelEndZone.y)
        }
        // Kolla restart input
        if (this.inputHandler.keys.has('r') || this.inputHandler.keys.has('R')) {
            if (this.gameState === 'GAME_OVER' || this.gameState === 'WIN') {
                this.restart()
                return
            }
        }
        
        // Uppdatera bara om spelet är i PLAYING state
        if (this.gameState !== 'PLAYING') return
        
        // Uppdatera alla spelobjekt
        this.gameObjects.forEach(obj => obj.update(deltaTime))
        
        // Uppdatera plattformar (även om de är statiska)
        this.platforms.forEach(platform => platform.update(deltaTime))
        
        // Uppdatera mynt
        this.coins.forEach(coin => coin.update(deltaTime))
        
        // Uppdatera fiender
        this.enemies.forEach(enemy => enemy.update(deltaTime))
        
        // Uppdatera spelaren
        this.player.update(deltaTime)
    
        // Antag att spelaren inte står på marken, tills vi hittar en kollision
        this.player.isGrounded = false
    
        // Kontrollera kollisioner med plattformar
        this.platforms.forEach(platform => {
            this.player.handlePlatformCollision(platform)
        })

        // if (this.plant.isFullyGrown) {
        //     this.player.handlePlatformCollision(this.plant)
        // }
    
        // Kontrollera kollisioner för fiender med plattformar
        this.enemies.forEach(enemy => {
            enemy.isGrounded = false // till skillnad från spelaren så behöver vi sätta denna i loopen eftersom det är flera fiender
            
            this.platforms.forEach(platform => {
                enemy.handlePlatformCollision(platform)
            })
            
            // Vänd vid skärmkanter
            enemy.handleScreenBounds(this.width)
        })
        
        // Kontrollera kollisioner mellan fiender
        this.enemies.forEach((enemy, index) => {
            this.enemies.slice(index + 1).forEach(otherEnemy => {
                enemy.handleEnemyCollision(otherEnemy)
                otherEnemy.handleEnemyCollision(enemy)
            })
        })
    
        // Kontrollera kollision med mynt
        this.coins.forEach(coin => {
            if (this.player.intersects(coin) && !coin.markedForDeletion) {
                // Plocka upp myntet
                this.score += coin.value
                this.coinsCollected++
                coin.markedForDeletion = true
            }
        })
        
        // Kontrollera kollision med fiender
        this.enemies.forEach(enemy => {
            if (this.player.intersects(enemy) && !enemy.markedForDeletion) {
                // Spelaren tar skada
                this.player.takeDamage(enemy.damage)
            }
        })
        
        // Ta bort alla objekt markerade för borttagning
        this.coins = this.coins.filter(coin => !coin.markedForDeletion)
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion)
    
        // Förhindra att spelaren går utöver skärmen horisontellt
        if (this.player.x < 0) {
            this.player.x = 0
        }
        if (this.player.x + this.player.width > this.width) {
            this.player.x = this.width - this.player.width
        }
        
        // Kolla win condition - alla mynt samlade
        if (this.coinsCollected === this.totalCoins && this.gameState === 'PLAYING') {
            this.gameState = 'WIN'
        }
        
        // Kolla lose condition - spelaren är död
        if (this.player.health <= 0 && this.gameState === 'PLAYING') {
            this.restart();
        }

    }

    draw(ctx) {
        if (this.gameState === 'TITLE') {
            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, this.width, this.height)

            ctx.fillStyle = 'white'
            ctx.textAlign = 'center'
            ctx.font = '48px Arial'
            ctx.fillText('GROWING PAINS', this.width / 2, 180)

            ctx.font = '16px Arial'
            ctx.fillText('A tiny seed will eventually grow beyond heavenly heights.', this.width / 2, 220)

            if (Math.floor(Date.now() / 500) % 2 === 0) {
                ctx.font = '20px Arial'
                ctx.fillText('PRESS ENTER TO START', this.width / 2, 300)
            }
            return
        }
        // Rita alla plattformar
        this.platforms.forEach(platform => platform.draw(ctx))
        
        // Rita mynt
        this.coins.forEach(coin => coin.draw(ctx))
        
        // Rita fiender
        this.enemies.forEach(enemy => enemy.draw(ctx))
        
        // Rita andra spelobjekt
        this.gameObjects.forEach(obj => obj.draw(ctx))

        if (this.plant) {
            this.plant.draw(ctx)
        }

        // rita level end zone (debug)
        ctx.strokeStyle = 'yellow'
        ctx.strokeRect(this.levelEndZone.x, this.levelEndZone.y, this.levelEndZone.width, this.levelEndZone.height)

        // Visa "Press E" om spelaren är nära växten/zonen
        if (this.playerInLevelEndZone() && this.gameState === 'PLAYING') {
            ctx.fillStyle = 'white'
            ctx.font = '20px Arial'
            ctx.fillText('Press E', this.levelEndZone.x - 10, this.levelEndZone.y - 10)
        }

        if (this.gameState === 'WATERING') {
            ctx.fillStyle = 'white'
            ctx.font = '20px Arial'
            ctx.fillText('Watering...', this.width / 2 - 50, 50)
        }
        
        // Rita spelaren
        this.player.draw(ctx)
        
        // Rita UI sist (så det är överst)
        this.ui.draw(ctx)
    }
}
