import tool from './tool'
import macro from './macro'

class Controller{
    constructor(){
        this.child = null
        this.buttonUpPos = {
            x: tool.gameWidth() - tool.gridSize(),
            y: tool.gameHeight() - tool.gridSize()*2,
        }
        this.buttonRightPos = {
            x: tool.gameWidth() - tool.gridSize(),
            y: tool.gameHeight() - tool.gridSize()/1.5,
        }
        this.radius = tool.gridSize() / 2
        
        this.onTouchStart = this.onTouchStart.bind(this)
        GameGlobal.g.gameEventListener.register(macro.EventTouchStart, this, this.onTouchStart)
    }

    setChild(child){
        this.child = child
    }

    update(elapsed){

    }

    draw(context){
        this.buttonUp(context)
        this.buttonRight(context)
    }

    buttonUp(context){
        const x = this.buttonUpPos.x
        const y = this.buttonUpPos.y
        context.save()
        context.beginPath()
        context.fillStyle = 'red'
        context.arc(x, y, this.radius, 0, 2 * Math.PI)
        context.fill()

        const fontHeight = 24
        context.font = `${fontHeight}px Arial`
        context.fillStyle = 'white'
        context.textAlign = 'center'
        context.fillText('↑', x, y + fontHeight/3)
        context.restore()
    }

    buttonRight(context){
        const x = this.buttonRightPos.x
        const y = this.buttonRightPos.y
        context.save()
        context.beginPath()
        context.fillStyle = 'red'
        context.arc(x, y, this.radius, 0, 2 * Math.PI)
        context.fill()

        const fontHeight = 24
        context.font = `${fontHeight}px Arial`
        context.fillStyle = 'white'
        context.textAlign = 'center'
        context.fillText('→', x, y + fontHeight/3)
        context.restore()
    }

    onTouchStart(args){
        if(GameGlobal.g.gameState != macro.StateGame) return
        const pos = args.pos
        let dis = tool.distancePos(pos, this.buttonUpPos) 
        if(dis <= this.radius){
            this.child.moveUp()
            return
        }

        dis = tool.distancePos(pos, this.buttonRightPos) 
        if(dis <= this.radius){
            this.child.moveRight()
            return
        }

    }
}

export default Controller