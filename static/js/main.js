System.register("GameResource", [], function (exports_1, context_1) {
    "use strict";
    var GameResource;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            GameResource = class GameResource {
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
            };
            exports_1("GameResource", GameResource);
        }
    };
});
System.register("Batiment/Batiment", ["GameResource"], function (exports_2, context_2) {
    "use strict";
    var GameResource_1, Batiment;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (GameResource_1_1) {
                GameResource_1 = GameResource_1_1;
            }
        ],
        execute: function () {
            Batiment = class Batiment {
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
            };
            exports_2("Batiment", Batiment);
            ;
        }
    };
});
System.register("GameEvent", [], function (exports_3, context_3) {
    "use strict";
    var GameEvent;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            GameEvent = class GameEvent {
                constructor() {
                    this.changeBatimentState = [];
                    this.whenThisEventFire = 0;
                    this.gameResourceCollecte = undefined;
                }
            };
            exports_3("GameEvent", GameEvent);
        }
    };
});
System.register("GameLogic", ["GameResource"], function (exports_4, context_4) {
    "use strict";
    var GameResource_2, GameLogic;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (GameResource_2_1) {
                GameResource_2 = GameResource_2_1;
            }
        ],
        execute: function () {
            GameLogic = class GameLogic {
                constructor() {
                    this.collectIntervalId = 0;
                    this.resourcePlayer = new GameResource_2.GameResource();
                    this.autoCollectResourcePlayer = new GameResource_2.GameResource();
                    this.listEvent = new Array();
                    this.batimentList = new Array();
                }
            };
            exports_4("GameLogic", GameLogic);
        }
    };
});
System.register("gui-event", ["GameResource", "GameEvent", "GameLogic"], function (exports_5, context_5) {
    "use strict";
    var GameResource_3, GameEvent_1, GameLogic_1, gl, rockStockElHTML, goldStockElHTML, eatStockElHTML, upEatAutoCollectElHTML, upRockAutoCollectElHTML, upGoldAutoCollectElHTML, upEatManualCollectElHTML, upRockManualCollectElHTML, upGoldManualCollectElHTML, collectRockElHTML, collectGoldElHTML, collectEatElHTML, lastTimestamp;
    var __moduleName = context_5 && context_5.id;
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
        startSimulation2(newTimestamp);
    }
    function startSimulation2(endDate) {
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
            startSimulation2(Date.now());
        }
    }
    return {
        setters: [
            function (GameResource_3_1) {
                GameResource_3 = GameResource_3_1;
            },
            function (GameEvent_1_1) {
                GameEvent_1 = GameEvent_1_1;
            },
            function (GameLogic_1_1) {
                GameLogic_1 = GameLogic_1_1;
            }
        ],
        execute: function () {
            gl = new GameLogic_1.GameLogic();
            rockStockElHTML = document.getElementById("rockStock");
            goldStockElHTML = document.getElementById("goldStock");
            eatStockElHTML = document.getElementById("eatStock");
            upEatAutoCollectElHTML = document.getElementById("upgradeEatAutoCollect");
            upRockAutoCollectElHTML = document.getElementById("upgradeRockAutoCollect");
            upGoldAutoCollectElHTML = document.getElementById("upgradeGoldAutoCollect");
            upEatManualCollectElHTML = document.getElementById("upgradeEatManualCollect");
            upRockManualCollectElHTML = document.getElementById("upgradeRockManualCollect");
            upGoldManualCollectElHTML = document.getElementById("upgradeGoldManualCollect");
            collectRockElHTML = document.getElementById("rockButton");
            collectGoldElHTML = document.getElementById("goldButton");
            collectEatElHTML = document.getElementById("meetButton");
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
            lastTimestamp = Date.now();
        }
    };
});
System.register("Batiment/EatAutoCollect", ["Batiment/Batiment"], function (exports_6, context_6) {
    "use strict";
    var Batiment_1, EatAutoCollect;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (Batiment_1_1) {
                Batiment_1 = Batiment_1_1;
            }
        ],
        execute: function () {
            EatAutoCollect = class EatAutoCollect extends Batiment_1.Batiment {
                constructor() {
                    super();
                    this.collect.gold = 10;
                    this.pause = false;
                    this.level = 1;
                    this.autoCollect = true;
                }
                getByLevel(level) {
                }
            };
            exports_6("EatAutoCollect", EatAutoCollect);
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
        }
    };
});
System.register("Batiment/EatManualCollect", ["Batiment/Batiment"], function (exports_7, context_7) {
    "use strict";
    var Batiment_2, EatManualCollect;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (Batiment_2_1) {
                Batiment_2 = Batiment_2_1;
            }
        ],
        execute: function () {
            EatManualCollect = class EatManualCollect extends Batiment_2.Batiment {
                constructor() {
                    super();
                    this.collect.gold = 10;
                    this.pause = false;
                    this.level = 1;
                    this.autoCollect = true;
                }
                getByLevel(level) {
                }
            };
            exports_7("EatManualCollect", EatManualCollect);
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
        }
    };
});
System.register("Batiment/GoldAutoCollect", ["Batiment/Batiment"], function (exports_8, context_8) {
    "use strict";
    var Batiment_3, GoldAutoCollect;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (Batiment_3_1) {
                Batiment_3 = Batiment_3_1;
            }
        ],
        execute: function () {
            GoldAutoCollect = class GoldAutoCollect extends Batiment_3.Batiment {
                constructor() {
                    super();
                    this.collect.gold = 10;
                    this.pause = false;
                    this.level = 1;
                    this.autoCollect = true;
                }
                getByLevel(level) {
                }
            };
            exports_8("GoldAutoCollect", GoldAutoCollect);
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
        }
    };
});
System.register("Batiment/GoldManualCollect", ["Batiment/Batiment"], function (exports_9, context_9) {
    "use strict";
    var Batiment_4, GoldManualCollect;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (Batiment_4_1) {
                Batiment_4 = Batiment_4_1;
            }
        ],
        execute: function () {
            GoldManualCollect = class GoldManualCollect extends Batiment_4.Batiment {
                constructor() {
                    super();
                    this.collect.gold = 10;
                    this.pause = false;
                    this.level = 1;
                    this.autoCollect = true;
                }
                getByLevel(level) {
                }
            };
            exports_9("GoldManualCollect", GoldManualCollect);
            GoldManualCollect.EAT_BATIMENT_LEVEL = [
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
        }
    };
});
System.register("Batiment/RockAutoCollect", ["Batiment/Batiment"], function (exports_10, context_10) {
    "use strict";
    var Batiment_5, RockAutoCollect;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (Batiment_5_1) {
                Batiment_5 = Batiment_5_1;
            }
        ],
        execute: function () {
            RockAutoCollect = class RockAutoCollect extends Batiment_5.Batiment {
                constructor() {
                    super();
                    this.collect.gold = 10;
                    this.pause = false;
                    this.level = 1;
                    this.autoCollect = true;
                }
                getByLevel(level) {
                }
            };
            exports_10("RockAutoCollect", RockAutoCollect);
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
        }
    };
});
System.register("Batiment/RockManualCollect", ["Batiment/Batiment"], function (exports_11, context_11) {
    "use strict";
    var Batiment_6, RockManualCollect;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (Batiment_6_1) {
                Batiment_6 = Batiment_6_1;
            }
        ],
        execute: function () {
            RockManualCollect = class RockManualCollect extends Batiment_6.Batiment {
                constructor() {
                    super();
                    this.collect.gold = 10;
                    this.pause = false;
                    this.level = 1;
                    this.autoCollect = true;
                }
                getByLevel(level) {
                }
            };
            exports_11("RockManualCollect", RockManualCollect);
            RockManualCollect.EAT_BATIMENT_LEVEL = [
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
        }
    };
});
//# sourceMappingURL=main.js.map