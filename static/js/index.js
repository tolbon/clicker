"use strict";

const miningElHTML = document.getElementById("mining");
let rockStockELHTML = document.getElementById("rockStock");
let rockStock = 0;
let autoCollectRock = 1;
let manualCollectRock = 1;

miningElHTML.addEventListener("click", miningAction);


function miningAction(el, ev) {
    rockStock += manualCollectRock;
    rockStockELHTML.innerText = rockStock;
}


let intervalId = setInterval(autoCollectAction, 1000);
let timeStop = Date.now();

function autoCollectAction() {
    rockStock += autoCollectRock;
    rockStockELHTML.innerText = rockStock;
    {
        const now = Date.now();
        const timeElapsed = now - timeStop;

        rockStock += Math.floor((autoCollectRock * timeElapsed) / 1000);
        rockStockELHTML.innerText = rockStock;
    }
    timeStop = Date.now();
}

function pauseSimulation() {
    clearInterval(intervalId);
    timeStop = Date.now();
    console.log(timeStop);
}

function startSimulation() {
    const newTimestamp = Date.now();
    const timeElapsed = newTimestamp - timeStop;

    console.log(timeElapsed);

    rockStock += Math.floor((autoCollectRock * timeElapsed) / 1000);
    rockStockELHTML.innerText = rockStock;
    intervalId = setInterval(autoCollectAction, 1000);
}

function handleVisibilityChange() {
    console.log(document.hidden)
    if (document.hidden === true) {
        pauseSimulation();
    } else {
        startSimulation();
    }
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);