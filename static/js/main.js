define("GameResource", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GameResource {
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
    exports.GameResource = GameResource;
});
define("Batiment/Batiment", ["require", "exports", "GameResource"], function (require, exports, GameResource_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Batiment {
        constructor() {
            this.collect = new GameResource_1.GameResource();
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
    exports.Batiment = Batiment;
    ;
});
define("GameEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GameEvent {
        constructor() {
            this.changeBatimentState = [];
            this.whenThisEventFire = 0;
            this.gameResourceCollecte = undefined;
        }
    }
    exports.GameEvent = GameEvent;
});
define("GameLogic", ["require", "exports", "GameResource"], function (require, exports, GameResource_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GameLogic {
        constructor() {
            this.collectIntervalId = 0;
            this.resourcePlayer = new GameResource_2.GameResource();
            this.autoCollectResourcePlayer = new GameResource_2.GameResource();
            this.listEvent = new Array();
            this.batimentList = new Array();
        }
    }
    exports.GameLogic = GameLogic;
});
define("gui-event", ["require", "exports", "GameResource", "GameEvent", "GameLogic"], function (require, exports, GameResource_3, GameEvent_1, GameLogic_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let gl = new GameLogic_1.GameLogic();
    const rockStockElHTML = document.getElementById("rockStock");
    const goldStockElHTML = document.getElementById("goldStock");
    const eatStockElHTML = document.getElementById("eatStock");
    const upEatAutoCollectElHTML = document.getElementById("upgradeEatAutoCollect");
    const upRockAutoCollectElHTML = document.getElementById("upgradeRockAutoCollect");
    const upGoldAutoCollectElHTML = document.getElementById("upgradeGoldAutoCollect");
    const upEatManualCollectElHTML = document.getElementById("upgradeEatManualCollect");
    const upRockManualCollectElHTML = document.getElementById("upgradeRockManualCollect");
    const upGoldManualCollectElHTML = document.getElementById("upgradeGoldManualCollect");
    const collectRockElHTML = document.getElementById("rockButton");
    const collectGoldElHTML = document.getElementById("goldButton");
    const collectEatElHTML = document.getElementById("meetButton");
    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (collectRockElHTML === null ||
        collectGoldElHTML === null ||
        collectEatElHTML === null) {
        alert("Probleme de Template");
        throw "Probleme de Template";
    }
    collectRockElHTML.addEventListener("click", collectRockAction);
    collectGoldElHTML.addEventListener("click", collectGoldAction);
    collectEatElHTML.addEventListener("click", collectEatAction);
    gl.collectIntervalId = setInterval(autoCollectAction, 1000);
    function recomputeAutoCollect() {
        let grTmp = new GameResource_3.GameResource();
        gl.batimentList.filter((b) => {
            return b.isAutoCollect() === true && b.isPause() === false;
        }).forEach((b) => {
            grTmp.add(b.getCollectResource());
        });
        gl.autoCollectResourcePlayer = grTmp;
    }
    function collectGoldAction() {
        let collectGold = new GameEvent_1.GameEvent();
        collectGold.whenThisEventFire = Date.now();
        let gameResource = new GameResource_3.GameResource();
        gameResource.gold = 1;
        collectGold.gameResourceCollecte = gameResource;
        insertGameEvent(gl.listEvent, collectGold);
    }
    function collectRockAction() {
        let collectGold = new GameEvent_1.GameEvent();
        collectGold.whenThisEventFire = Date.now();
        let gameResource = new GameResource_3.GameResource();
        gameResource.rock = 1;
        collectGold.gameResourceCollecte = gameResource;
        insertGameEvent(gl.listEvent, collectGold);
    }
    function collectEatAction() {
        let collectGold = new GameEvent_1.GameEvent();
        collectGold.whenThisEventFire = Date.now();
        let gameResource = new GameResource_3.GameResource();
        gameResource.eat = 1;
        collectGold.gameResourceCollecte = gameResource;
        insertGameEvent(gl.listEvent, collectGold);
    }
    function insertGameEvent(listEvent, gameEvent) {
        let index = listEvent.findIndex((gEvent) => {
            return gEvent.whenThisEventFire > gameEvent.whenThisEventFire;
        });
        listEvent.splice(index, 0, gameEvent);
    }
    function autoCollectAction() {
        const newTimestamp = Date.now();
        let resumeEvent = new GameEvent_1.GameEvent();
        resumeEvent.whenThisEventFire = newTimestamp;
        gl.listEvent.push(resumeEvent);
        startSimulation(newTimestamp);
        renderTemplate();
    }
    let lastTimestamp = Date.now();
    function startSimulation(endDate) {
        const listEvent = gl.listEvent.filter((ge) => {
            return ge.whenThisEventFire <= endDate;
        });
        let lastTimestampLocal = lastTimestamp;
        listEvent.forEach((ge) => {
            const time = (ge.whenThisEventFire - lastTimestampLocal) / 1000;
            if (time < 0) {
                console.log(time);
            }
            const grTmp = gl.autoCollectResourcePlayer.getCollectedDuringTime(time);
            gl.resourcePlayer.add(grTmp);
            if (ge.gameResourceCollecte !== undefined) {
                gl.resourcePlayer.add(ge.gameResourceCollecte);
            }
            lastTimestampLocal = ge.whenThisEventFire;
            applyBatimentState(ge.changeBatimentState);
            if (ge.changeBatimentState.length !== 0) {
                recomputeAutoCollect();
            }
        });
        gl.listEvent = gl.listEvent.filter((ge) => {
            return ge.whenThisEventFire > endDate;
        });
        lastTimestamp = endDate;
        console.dir(gl.resourcePlayer);
    }
    function applyBatimentState(batiments) {
        batiments.forEach((b) => {
            const index = gl.batimentList.findIndex((btmt) => {
                return btmt.guid === b.guid;
            });
            if (index === -1) {
                return;
            }
            gl.batimentList[index] = b;
        });
    }
    function pauseSimulation() {
        clearInterval(gl.collectIntervalId);
        let pauseEvent = new GameEvent_1.GameEvent();
        pauseEvent.whenThisEventFire = Date.now();
        gl.listEvent.unshift(pauseEvent);
    }
    function handleVisibilityChange() {
        console.log(document.hidden);
        if (document.hidden === true) {
            pauseSimulation();
        }
        else {
            let resumeEvent = new GameEvent_1.GameEvent();
            resumeEvent.whenThisEventFire = Date.now();
            gl.listEvent.push(resumeEvent);
            startSimulation(Date.now());
            renderTemplate();
        }
    }
    function renderTemplate() {
        rockStockElHTML.innerText = gl.resourcePlayer.rock.toString(10);
        goldStockElHTML.innerText = gl.resourcePlayer.gold.toString(10);
        eatStockElHTML.innerText = gl.resourcePlayer.eat.toString(10);
    }
});
define("Batiment/EatAutoCollect", ["require", "exports", "Batiment/Batiment"], function (require, exports, Batiment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EatAutoCollect extends Batiment_1.Batiment {
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
    exports.EatAutoCollect = EatAutoCollect;
    EatAutoCollect.EAT_BATIMENT_LEVEL = [
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
});
define("Batiment/EatManualCollect", ["require", "exports", "Batiment/Batiment"], function (require, exports, Batiment_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EatManualCollect extends Batiment_2.Batiment {
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
    exports.EatManualCollect = EatManualCollect;
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
});
define("Batiment/GoldAutoCollect", ["require", "exports", "Batiment/Batiment"], function (require, exports, Batiment_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GoldAutoCollect extends Batiment_3.Batiment {
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
    exports.GoldAutoCollect = GoldAutoCollect;
    GoldAutoCollect.GOLD_BATIMENT_LEVEL = [
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
});
define("Batiment/GoldManualCollect", ["require", "exports", "Batiment/Batiment"], function (require, exports, Batiment_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GoldManualCollect extends Batiment_4.Batiment {
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
    exports.GoldManualCollect = GoldManualCollect;
    GoldManualCollect.GOLD_BATIMENT_LEVEL = [
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
});
define("Batiment/RockAutoCollect", ["require", "exports", "Batiment/Batiment"], function (require, exports, Batiment_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RockAutoCollect extends Batiment_5.Batiment {
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
    exports.RockAutoCollect = RockAutoCollect;
    RockAutoCollect.ROCK_BATIMENT_LEVEL = [
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
});
define("Batiment/RockManualCollect", ["require", "exports", "Batiment/Batiment"], function (require, exports, Batiment_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RockManualCollect extends Batiment_6.Batiment {
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
    exports.RockManualCollect = RockManualCollect;
    RockManualCollect.ROCK_BATIMENT_LEVEL = [
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
});
//# sourceMappingURL=main.js.map