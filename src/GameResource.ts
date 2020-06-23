export class GameResource {
    public rock: number = 0.0;
    public gold: number = 0.0;
    public eat: number = 0.0;

    public add(gl: GameResource) {
        this.rock += gl.rock;
        this.gold += gl.gold;
        this.eat += gl.eat;
    }

    public getCollectedDuringTime(timeInSecs: number): GameResource {
        let grTmp = new GameResource();

        grTmp.rock = timeInSecs * this.rock;
        grTmp.gold = timeInSecs * this.gold;
        grTmp.eat = timeInSecs * this.eat;

        return grTmp;
    }
}