"use strict";

class GameLogic {
    public collectIntervalId : number = 0;
    public resourcePlayer: GameResource = new GameResource();
    public autoCollectResourcePlayer: GameResource = new GameResource();
    public listEvent: Array<GameEvent> = new Array<GameEvent>();
    public batimentList: Array<Batiment> = new Array<Batiment>();
}

abstract class Batiment {

    protected collect: GameResource = new GameResource();
    protected level: number = 0;
    protected pause: boolean = false;
    protected underConstruction: boolean = false;
    protected autoCollect: boolean = false;

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

const miningElHTML = document.getElementById("mining");

if (miningElHTML === null) {
    alert("Probleme de Template");
    throw "Probleme de Template";
} 
miningElHTML.addEventListener("click", collectGoldAction);

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

    gl.listEvent = insertGameEvent(gl.listEvent, collectGold);
}

function collectRockAction() {
    let collectGold = new GameEvent();
    collectGold.whenThisEventFire = Date.now();
    let gameResource = new GameResource();
    gameResource.rock = 1;
    collectGold.gameResourceCollecte = gameResource;

    gl.listEvent = insertGameEvent(gl.listEvent, collectGold);
}

function collectEatAction() {
    let collectGold = new GameEvent();
    collectGold.whenThisEventFire = Date.now();
    let gameResource = new GameResource();
    gameResource.eat = 1;
    collectGold.gameResourceCollecte = gameResource;

    gl.listEvent = insertGameEvent(gl.listEvent, collectGold);
}

function insertGameEvent(listEvent: Array<GameEvent>, gameEvent: GameEvent) {
    let index: number = listEvent.findIndex((gEvent : GameEvent) => {
        return gEvent.whenThisEventFire > gameEvent.whenThisEventFire;
    });

    return listEvent.splice(index, 0, gameEvent);
}

function autoCollectAction()
{
    const newTimestamp = Date.now();

    startSimulation2(newTimestamp);
}


function startSimulation2(endDate: number) {

    const listEvent = gl.listEvent.filter((ge: GameEvent) => {
        return ge.whenThisEventFire <= endDate;
    });

    let lastTimestamp = 0;
    listEvent.forEach((ge: GameEvent) => {
        const time = ge.whenThisEventFire - lastTimestamp;
        const grTmp = gl.autoCollectResourcePlayer.getCollectedDuringTime(time);

        gl.resourcePlayer.add(grTmp);

        lastTimestamp = ge.whenThisEventFire;
        //ge.changeBatimentState;
        if (ge.changeBatimentState.length !== 0) {
            //recomputeBatimentState;
        }
    });

    gl.listEvent = gl.listEvent.filter((ge: GameEvent) => {
        return ge.whenThisEventFire > endDate;
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
