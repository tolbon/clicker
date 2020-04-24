"use strict";
interface Array<T> {
    findIndex(callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any): number;
}

if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
        value: function(predicate: any) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return k.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return k;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return -1.
            return -1;
        },
        configurable: true,
        writable: true
    });
}

class GameLogic {
    public collectIntervalId: number = 0;
    public resourcePlayer: GameResource = new GameResource();
    public autoCollectResourcePlayer: GameResource = new GameResource();
    public listEvent: Array<GameEvent> = new Array<GameEvent>();
    public batimentList: Array<Batiment> = new Array<Batiment>();
}

abstract class Batiment {
    public guid: string;
    protected collect: GameResource = new GameResource();
    protected level: number = 0;
    protected pause: boolean = false;
    protected underConstruction: boolean = false;
    protected autoCollect: boolean = false;

    public constructor() {
        this.guid = (Math.round(Math.random() * 100)).toString(10) + (Math.round(Math.random() * 100)).toString(10)
    }

    public abstract getByLevel(level: number): void;

    public setPause(pause: boolean): void {
        this.pause = pause;
    }

    public isPause(): boolean {
        return this.pause;
    }

    public isAutoCollect(): boolean {
        return this.autoCollect;
    }

    public getCollectResource(): GameResource {
        return this.collect;
    }
}

class GoldManualCollect extends Batiment {
    public getByLevel(level: number): void {
        this.collect.gold = level;
    }
}

class EatManualCollect extends Batiment {
    public getByLevel(level: number): void {
        this.collect.eat = level;
    }
}

class RockManualCollect extends Batiment {
    public getByLevel(level: number): void {
        this.collect.rock = level;
    }
}

class RockAutoCollect extends Batiment {
    public constructor() {
        super();

        this.collect.gold = 10;

        this.pause = false;
        this.level = 1;
        this.autoCollect = true;
    }

    getByLevel(level: number): void {
    }
}

class GameResource {
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

class GameEvent {
    public changeBatimentState: Array<Batiment> = [];
    public whenThisEventFire: number = 0;
    public gameResourceCollecte?: GameResource = undefined;
}

let gl = new GameLogic();

const collectRockElHTML = document.getElementById("rockButton");
const collectGoldElHTML = document.getElementById("goldButton");
const collectEatElHTML = document.getElementById("meetButton");

if (collectRockElHTML === null ||
    collectGoldElHTML === null ||
    collectEatElHTML === null) {
    alert("Probleme de Template");
    throw "Probleme de Template";
}
collectRockElHTML.addEventListener("click", collectRockAction);
collectGoldElHTML.addEventListener("click", collectGoldAction);
collectEatElHTML.addEventListener("click", collectEatAction);

let b = new RockAutoCollect();
gl.batimentList.push(b);
recomputeAutoCollect();


document.getElementById("testButton")?.addEventListener("click", () => {
    let ge = new GameEvent();
    ge.whenThisEventFire = Date.now();

    const bPrime = b;
    bPrime.setPause(true);

    ge.changeBatimentState.push(bPrime);

    gl.listEvent.push(ge);
});

gl.collectIntervalId = setInterval(autoCollectAction, 1000);

function recomputeAutoCollect() {

    let grTmp = new GameResource();
    gl.batimentList.filter((b: Batiment) => {
        return b.isAutoCollect() === true && b.isPause() === false;
    }).forEach((b: Batiment) => {
        grTmp.add(b.getCollectResource());
    });

    gl.autoCollectResourcePlayer = grTmp;
}

function collectGoldAction() {
    let collectGold = new GameEvent();
    collectGold.whenThisEventFire = Date.now();
    let gameResource = new GameResource();
    gameResource.gold = 1;
    collectGold.gameResourceCollecte = gameResource;

    insertGameEvent(gl.listEvent, collectGold);
}

function collectRockAction() {
    let collectGold = new GameEvent();
    collectGold.whenThisEventFire = Date.now();
    let gameResource = new GameResource();
    gameResource.rock = 1;
    collectGold.gameResourceCollecte = gameResource;

    insertGameEvent(gl.listEvent, collectGold);
}

function collectEatAction() {
    let collectGold = new GameEvent();
    collectGold.whenThisEventFire = Date.now();
    let gameResource = new GameResource();
    gameResource.eat = 1;
    collectGold.gameResourceCollecte = gameResource;

    insertGameEvent(gl.listEvent, collectGold);
}

function insertGameEvent(listEvent: Array<GameEvent>, gameEvent: GameEvent) {
    let index: number = listEvent.findIndex((gEvent: GameEvent) => {
        return gEvent.whenThisEventFire > gameEvent.whenThisEventFire;
    });

    listEvent.splice(index, 0, gameEvent);
}

function autoCollectAction() {
    const newTimestamp = Date.now();
    let resumeEvent = new GameEvent();
    resumeEvent.whenThisEventFire = newTimestamp;

    gl.listEvent.push(resumeEvent);

    startSimulation2(newTimestamp);
}

let lastTimestamp = Date.now();
function startSimulation2(endDate: number) {

    const listEvent = gl.listEvent.filter((ge: GameEvent) => {
        return ge.whenThisEventFire <= endDate;
    });

    let lastTimestampLocal = lastTimestamp;
    listEvent.forEach((ge: GameEvent) => {
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

    gl.listEvent = gl.listEvent.filter((ge: GameEvent) => {
        return ge.whenThisEventFire > endDate;
    });

    lastTimestamp = endDate;
    console.dir(gl.resourcePlayer);

}

function applyBatimentState(batiments: Array<Batiment>) {
    batiments.forEach((b) => {
        const index: number = gl.batimentList.findIndex((btmt: Batiment) => {
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
    let pauseEvent = new GameEvent();
    pauseEvent.whenThisEventFire = Date.now();

    gl.listEvent.unshift(pauseEvent);
}

function handleVisibilityChange() {
    console.log(document.hidden)
    if (document.hidden === true) {
        pauseSimulation();
    } else {
        let resumeEvent = new GameEvent();
        resumeEvent.whenThisEventFire = Date.now();

        gl.listEvent.push(resumeEvent);
        startSimulation2(Date.now());
    }
}
