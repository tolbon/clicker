import { GameResource } from "./GameResource";
import { GameEvent } from "./GameEvent";
import { Batiment } from "./Batiment/Batiment";

export class GameLogic {
    public collectIntervalId: number = 0;
    public resourcePlayer: GameResource = new GameResource();
    public autoCollectResourcePlayer: GameResource = new GameResource();
    public listEvent: Array<GameEvent> = new Array<GameEvent>();
    public batimentList: Array<Batiment> = new Array<Batiment>();
}