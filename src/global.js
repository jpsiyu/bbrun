import Map from './map'
import macro from './macro'
import GameEventListener from './gameEventListener'
import ResMgr from './resMgr'
import FloatingMgr from './floatingMgr'

class Global {
    constructor(screenContext, context) {
        this.uid = undefined
        this.gameState = macro.StateLoad
        this.gameLv = 1
        this.gameScore = 0
        this.map = undefined
        this.screenContext = screenContext,
        this.context = context
        this.gameEventListener = new GameEventListener()
        this.child = undefined
        this.resMgr = new ResMgr()
        this.floatingMgr = new FloatingMgr()
        this.marginTop = 0
        this.space = 0
    }

    initMap(){
        this.map = new Map(this.context)
    }

    setMarginTop(margin){
        this.marginTop = margin
    }

    render(){
        this.screenContext.drawImage(this.context.canvas, 0, this.marginTop)
    }
}

export default Global