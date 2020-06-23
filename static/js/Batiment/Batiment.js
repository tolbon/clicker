import { GameResource } from "../GameResource";
export class Batiment {
    constructor() {
        this.collect = new GameResource();
        this.level = 0;
        this.pause = false;
        this.underConstruction = false;
        this.autoCollect = false;
        this.guid = (Math.round(Math.random() * 100)).toString(10) + (Math.round(Math.random() * 100)).toString(10);
    }
    setPause(pause) {
        this.pause = pause;
    }
    isPause() {
        return this.pause;
    }
    isAutoCollect() {
        return this.autoCollect;
    }
    getCollectResource() {
        return this.collect;
    }
}
;
//# sourceMappingURL=Batiment.js.map