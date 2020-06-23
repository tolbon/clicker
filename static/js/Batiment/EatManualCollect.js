import { Batiment } from "./Batiment";
export class EatManualCollect extends Batiment {
    constructor() {
        super();
        this.collect.gold = 10;
        this.pause = false;
        this.level = 1;
        this.autoCollect = true;
    }
    getByLevel(level) {
    }
}
EatManualCollect.EAT_BATIMENT_LEVEL = [
    0,
    1,
    2,
    3,
    5,
    10,
    15,
    25,
    50,
    75,
    100
];
//# sourceMappingURL=EatManualCollect.js.map