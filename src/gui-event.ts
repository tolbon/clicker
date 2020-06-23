"use strict";

import { GameResource } from "./GameResource";
import { GameEvent } from "./GameEvent";
import { Batiment } from "./Batiment/Batiment";
import { GameLogic } from "./GameLogic";

let gl = new GameLogic();

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

    let grTmp = new GameResource();
    gl.batimentList.filter((b:Batiment) => {
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
    batiments.forEach((b: Batiment) => {
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
