export class GameResource {
    constructor() {
        this.rock = 0.0;
        this.gold = 0.0;
        this.eat = 0.0;
    }
    add(gl) {
        this.rock += gl.rock;
        this.gold += gl.gold;
        this.eat += gl.eat;
    }
    getCollectedDuringTime(timeInSecs) {
        let grTmp = new GameResource();
        grTmp.rock = timeInSecs * this.rock;
        grTmp.gold = timeInSecs * this.gold;
        grTmp.eat = timeInSecs * this.eat;
        return grTmp;
    }
}
//# sourceMappingURL=GameResource.js.map