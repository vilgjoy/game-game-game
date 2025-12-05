import Rectangle from './Rectangle.js'
import InputHandler from './InputHandler.js'
import Circle from './Circle.js'
import Triangle from './Triangle.js'

export default class Game {
    constructor(width, height) {
        this.width = width
        this.height = height
        
        this.inputHandler = new InputHandler(this)
        
        // Skapa alla objekt i spelet - STICKMAN!
        this.gameObjects = [
            new Circle(this, 425, 190, 30, 'black'), //huvud
            new Rectangle(this, 415, 220, 20, 80, 'black'), // kropp
            new Rectangle(this, 340, 225, 75, 15, 'black'), //l arm
            new Rectangle(this, 435, 225, 75, 15, 'black'), //r arm
            new Rectangle(this, 395, 300, 20, 80, 'black'), //l ben
            new Rectangle(this, 435, 300, 20, 80, 'black'), // r ben
            new Triangle(this, 395, 130, 60, 50, 'red'), // hat

            new Rectangle(this, 340, 165, 9, 80, 'silver'), // yxa bas
            new Triangle(this, 330, 145, 20, 25, 'gray'), // yxa tip

            new Rectangle(this, 200, 280, 40, 100, '#8B4513'), // trunk
            new Triangle(this, 170, 180, 100, 120, 'green'), // top foliage
            new Triangle(this, 185, 250, 70, 80, 'green') // bottom foliage
        ]

        // Generate random snowballs
        const snowballCount = Math.floor(Math.random() * 20) + 10; // 10-30 bollar
        for (let i = 0; i < snowballCount; i++) {
            const randomX = Math.random() * this.width;
            const randomY = Math.random() * this.height;
            const randomRadius = Math.floor(Math.random() * 15) + 5; // Random size mellan 5-20
            this.gameObjects.push(new Circle(this, randomX, randomY, randomRadius, 'white'));
        }
    }

    update(deltaTime) {
        // Uppdatera spelet utifrån deltaTime
        this.gameObjects.forEach(obj => obj.update(deltaTime))

        // Exempel på input-hantering, detta bör hanteras av rektanglarna själva
        if (this.inputHandler.keys.has('r')) {
            this.gameObjects[0].velocityX += 0.001 * deltaTime
        }
        if (this.inputHandler.keys.has('b')) {
            this.gameObjects[1].velocityY -= 0.001 * deltaTime
        }
        if (this.inputHandler.keys.has('g')) {
            this.gameObjects[2].velocityY -= 0.001 * deltaTime
        }
    }

    draw(ctx) {
        // Rita alla spelobjekt
        this.gameObjects.forEach(obj => obj.draw(ctx))
    }
}