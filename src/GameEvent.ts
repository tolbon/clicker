import { GameResource } from "./GameResource";
import { Batiment } from "./Batiment/Batiment";

export class GameEvent {
    public changeBatimentState: Batiment[] = [];
    public whenThisEventFire: number = 0;
    public gameResourceCollecte?: GameResource = undefined;
}