import macro from './macro'
import PageReady from './pageReady'
import PageEnd from './pageEnd'

class PageMgr{
    constructor(){
       this.pageReady = undefined 
       this.pageEnd = undefined
    }

    draw(context){
        switch(GameGlobal.g.gameState){
            case macro.StateReady:
                if(!this.pageReady) this.pageReady = new PageReady()
                this.pageReady.draw(context)
                break
            case macro.StateGameOver:
                if(!this.pageEnd) this.pageEnd = new PageEnd()
                this.pageEnd.draw(context)
                break
        }
    }
}

export default PageMgr