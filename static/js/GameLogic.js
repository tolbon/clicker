import { GameResource } from "./GameResource";
export class GameLogic {
    constructor() {
        this.collectIntervalId = 0;
        this.resourcePlayer = new GameResource();
        this.autoCollectResourcePlayer = new GameResource();
        this.listEvent = new Array();
        this.batimentList = new Array();
    }
}
//# sourceMappingURL=GameLogic.js.map