import drawing from './drawing'
import Child from './child'
import Door from './door'
import Mom from './mom'
import Rebuild from './rebuild'
import macro from './macro'
import { Grid } from './grid'
import tool from './tool'
import Fence from './fence'
import Milk from './milk'
import Hole from './hole'
import Eye from './eye'
import Ball from './ball'
import Shield from './shield'
import Controller from './controller'
import ScoreBoard from './scoreBoard'
import PageMgr from './pageMgr'

class MainScene {
    constructor(context) {
        this.context = context
        this.previous = undefined
        this.frame = this.frame.bind(this)
        this.fps = 0
        this.pause = false
        this.child = undefined
        this.rebuild = new Rebuild()
        this.loadFlag = 0
        this.drawMask = true
        this.controller = new Controller()
        this.scoreBoard = new ScoreBoard()
        this.pageMgr = new PageMgr()

        GameGlobal.g.gameEventListener.register(macro.EventRestart, this, () => { this.restartGame() })
        GameGlobal.g.gameEventListener.register(macro.EventReady, this, () => { this.readyForGame() })
        GameGlobal.g.gameEventListener.register(macro.EventLoadFinish, this, () => { this.readyForGame() })
        GameGlobal.requestAnimationFrame(this.frame)
    }

    readyForGame() {
        GameGlobal.g.gameState = macro.StateReady
        GameGlobal.g.gameLv = 1
        GameGlobal.g.gameScore = 0
    }

    restartGame() {
        GameGlobal.g.gameState = macro.StateGame
        GameGlobal.g.gameLv = 1
        GameGlobal.g.gameScore = 0
        this.resetGame()
    }

    resetGame() {
        GameGlobal.g.map.reset()

        this.grid = new Grid()
        let pos = tool.grid2coord(tool.maxRow(), 2)
        this.child = new Child(pos.x, pos.y)
        this.controller.setChild(this.child)
        GameGlobal.g.child = this.child
        pos = tool.grid2coord(tool.maxRow(), 0)
        this.mom = new Mom(pos.x, pos.y)
        this.door = new Door(
            this.context.canvas.width - tool.gridSize(),
            tool.gridSize(),
        )
    }

    levelUp() {
        GameGlobal.g.gameState = macro.StateLevelUp
        GameGlobal.g.gameLv += 1
        this.resetGame()
        setTimeout(() => {
            GameGlobal.g.gameState = macro.StateGame
        }, 2 * 1000)
    }

    reachDoor() {
        const dis = tool.distance(this.child, this.door)
        return dis < (this.child.radius + this.door.radius)
    }

    momCatchChild() {
        const dis = tool.distance(this.child, this.mom)
        return dis < (this.mom.radius)
    }

    handleCollision(obj, index) {
        if (obj instanceof Milk) {
            GameGlobal.g.map.milks.splice(index, 1)
            this.addScore(obj.x, obj.y, macro.ScoreMilk)
            switch (this.child.mode) {
                case macro.ChildModeNormal:
                    this.child.changeMode(macro.ChildModeDrink)
                    break
                case macro.ChildModeWarrior:
                    GameGlobal.g.map.createExplosion(obj.img, obj.x, obj.y)
                    break
            }
        } else if (obj instanceof Fence) {
            GameGlobal.g.map.fences.splice(index, 1)
            GameGlobal.g.map.createExplosion(obj.img, obj.x, obj.y)
            this.addScore(obj.x, obj.y, macro.ScoreFence)
        } else if (obj instanceof Hole) {
            this.rebuild.reset(obj)
            GameGlobal.g.gameState = macro.StateRebuild
            GameGlobal.g.map.holes.splice(index, 1)
        } else if (obj instanceof Ball) {
            this.child.changeMode(macro.ChildModeWarrior)
            GameGlobal.g.map.balls.splice(index, 1)
        } else if (obj instanceof Eye) {
            this.drawMask = false
        } else if (obj instanceof Shield) {
            obj.holdShield(this.child)
        }
    }

    childCollisionMapObj() {
        const all = GameGlobal.g.map.allDraws()
        let objList, obj
        let targetObj, targetIndex
        for (let i = 0; i < all.length; i++) {
            objList = all[i]
            for (let j = 0; j < objList.length; j++) {
                obj = objList[j]
                const dis = tool.distance(this.child, obj)
                if (dis < 1) {
                    targetObj = obj
                    targetIndex = j
                    break
                }
            }
        }
        if (targetObj) this.handleCollision(targetObj, targetIndex)
    }

    setPause(bool) {
        this.pause = bool
        if (this.pause) this.previous = undefined
    }

    gameEnd() {
        GameGlobal.g.gameState = macro.StateGameOver
    }

    addScore(posX, posY, score) {
        GameGlobal.g.floatingMgr.popFloating(posX, posY, score)
        GameGlobal.g.gameScore += score
        GameGlobal.g.gameEventListener.dispatch(macro.EventScore)
    }

    frame(timestamp) {
        if (this.pause) return
        this.previous = this.previous || timestamp
        const elapsed = (timestamp - this.previous) / 1000
        this.previous = timestamp
        this.update(elapsed)
        this.draw()
        GameGlobal.requestAnimationFrame(this.frame)
    }

    update(elapsed) {
        this.fps = 1 / elapsed
        this.drawMask = true
        this.controller.update(elapsed)
        switch (GameGlobal.g.gameState) {
            case macro.StateRebuild:
                this.rebuild.update(elapsed)
                break
            case macro.StateGame:
                if (this.reachDoor()) {
                    this.addScore(this.door.x, this.door.y, macro.ScoreLevel)
                    GameGlobal.g.gameState = macro.StateReachDoor
                    setTimeout(() => { this.levelUp() }, 2 * 1000)
                    return
                }
                if (this.momCatchChild()) {
                    this.gameEnd()
                    return
                }
                GameGlobal.g.map.update(elapsed)
                this.childCollisionMapObj()
                this.child.update(elapsed)
                this.mom.update(this.child, elapsed)
                this.grid.update(elapsed, this.child)
                GameGlobal.g.floatingMgr.update(elapsed)
                break
            case macro.StateReachDoor:
                this.child.update(elapsed)
                GameGlobal.g.floatingMgr.update(elapsed)
                break
            default:
                break
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
        drawing.drawCover(this.context, 'black')
        switch (GameGlobal.g.gameState) {
            case macro.StateLoad:
            case macro.StateReady:
                break
            case macro.StateLevelUp:
                drawing.drawLabel(
                    this.context,
                    `Level ${GameGlobal.g.gameLv}`,
                    this.context.canvas.width / 2,
                    this.context.canvas.height / 2, { pt: 30, color: 'white' }
                )
                break
            case macro.StateRebuild:
                this.grid.draw(this.context)
                GameGlobal.g.map.draw(this.context)
                this.rebuild.draw(this.context)
                this.door.draw(this.context)
                break
            default:
                this.grid.draw(this.context)
                GameGlobal.g.map.draw(this.context)
                if (this.drawMask) this.grid.drawMask(this.context)
                this.door.draw(this.context)

                this.child.draw(this.context)
                this.mom.draw(this.context)
                GameGlobal.g.floatingMgr.draw(this.context)
                this.controller.draw(this.context)
                this.scoreBoard.draw(this.context)
                break
        }
        this.pageMgr.draw(this.context)
        GameGlobal.g.render()
    }
}

export default MainScene