//#region --------------------------------------- IMPORTS

// MANAGERS
import { GameManager } from "../managers/GameManager";
import { PlantManager } from "../managers/PlantManager.ts";
import { WinConManager } from "../managers/WinManager.ts";

// ELSE
import { GridObj } from "./GridObj";
import { Vector } from "../utils/Vector.ts";

//#endregion

export class Plant extends GridObj {
  plantManager: PlantManager
  plantAttributes: {
    sprite: string
    waterReq: number
    sunReq: number
    neighborReq: number
  }
  species: number
  growthLevel: number
  WATER_RULE: number
  SUN_RULE: number
  NEIGHBOR_RULE: number


  constructor(gameManager: GameManager, position: Vector, species = 1) {
    const plantManager = gameManager.plantManager

    super(gameManager, position, plantManager.plantAttributes[species].sprite!)
    this.plantManager = plantManager
    this.plantAttributes = this.plantManager.plantAttributes[species]
    this.species = species
    this.growthLevel = 0

    this.WATER_RULE = this.plantAttributes.waterReq!
    this.SUN_RULE = this.plantAttributes.sunReq!
    this.NEIGHBOR_RULE = this.plantAttributes.neighborReq!
  }

  //#region ------------------------------------- GROW FUNCTIONS

  // Sets the growth level of the plant and updates its appearance.
  setGrowth(level: number): void {
    this.growthLevel = level;
    this.setTint(this.tint + 0xffb3b3 * level);
  }

  // Attempts to grow the plant if growth conditions are met.
  // Deducts the required water level from the tile upon successful growth.
  grow(): void {
    if (this.checkCanGrow()) {
      this.growthLevel++;
      this.setTint(this.tint + 0xffb3b3);
      const tile = this.world.getTile(this.position);
      tile.waterLvl = tile.waterLvl - this.WATER_RULE;
    }
  }

  // Called every game tick to update the plant's state.
  tick(): void {
    this.grow()
  }

  //#endregion

  //#region ------------------------------------- DETECT SURROUNDINGS

  // Checks whether the plant can grow based on water, sunlight, adjacency, and max growth rules.
  checkCanGrow(): boolean {
    const tile = this.world.getTile(this.position);
    const waterReq = tile.waterLvl >= this.WATER_RULE;
    const sunReq = tile.sunLvl >= this.SUN_RULE;
    const adjReq = this.checkPlantNeighbors() < this.NEIGHBOR_RULE;
    return (
      waterReq &&
      sunReq &&
      adjReq &&
      this.growthLevel < WinConManager.WINNING_GROWTH_LEVEL
    );
  }

  // Logs the plant's growth requirements and its tile conditions to the console.
  logCheckCanGrow() {
    const tile = this.world.getTile(this.position);

    console.log(
      "Plant Rules: " +
        this.WATER_RULE +
        " " +
        this.SUN_RULE +
        " " +
        this.NEIGHBOR_RULE
    );
    console.log("Tile Water: " + tile.waterLvl);
    console.log("Tile Sun: " + tile.sunLvl);
    console.log("Plant Neighbors: " + this.checkPlantNeighbors());
  }

  // Checks the number of adjacent tiles containing other plants.
  checkPlantNeighbors() {
    let plantCount = 0;
    for (let dX = -1; dX < 1; dX++) {
      for (let dY = -1; dY < 1; dY++) {
        if (dX == 0 && dY == 0) {
          continue;
        }
        let posi = new Vector(this.position.x + dX, this.position.y + dY);
        let tile = this.world.getTile(posi);
        if (tile != null && tile.plant instanceof Plant) {
          plantCount++;
        }
      }
    }
    return plantCount;
  }

  //#endregion
}
