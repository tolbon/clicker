import { GameResource } from "../GameResource";

export abstract class Batiment {
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
};