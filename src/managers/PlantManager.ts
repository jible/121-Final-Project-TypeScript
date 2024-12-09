//#region --------------------------------------- IMPORTS

import { GameManager } from "./GameManager";

import { World } from "../prefabs/World";
import { Plant } from "../prefabs/Plants";

import { Vector } from "../utils/Vector";

//#endregion

export class PlantManager {
  scene: Phaser.Scene;
  gameManager: GameManager;
  world: World;
  plantCollection: Map<string, Plant>;

  plantTypes = {
    EMPTY: 0,
    TREE: 1,
    Flower: 2,
    BUSH: 3,
  };
  plantAttributes = [
    {
      name: "empty",
    },
    {
      name: "lily",
      sprite: "lily",
      waterReq: 0,
      sunReq: 0,
      neighborReq: 8,
    },
    {
      name: "sunflower",
      sprite: "sunflower",
      waterReq: 1,
      sunReq: 1,
      neighborReq: 0,
    },
    {
      name: "daisy",
      sprite: "daisy",
      waterReq: 1,
      sunReq: 1,
      neighborReq: 8,
    },
  ];
  constructor(scene: Phaser.Scene, gameManager: GameManager) {
    this.scene = scene;
    this.gameManager = gameManager;
    this.world = gameManager.world;
    this.plantCollection = new Map();
  }

  tick() {
    this.plantCollection.forEach((value) => {
      value.tick();
    });
  }

  generatePlantKey(pos: Vector) {
    return pos.x.toString + ":" + pos.y.toString();
  }

  addPlant(pos: Vector, species = Math.floor(Math.random() * 3) + 1, growthLevel = 0) {
    if (!this.world.checkPlantable(pos)) return null;
    const newPlant = new Plant(this.gameManager, pos, species);
    newPlant.setGrowth(growthLevel);
    this.world.addPlant(pos, newPlant);
    this.plantCollection.set(this.generatePlantKey(pos), newPlant);
    return newPlant;
  }

  removePlant(pos: Vector) {
    this.plantCollection.delete(this.generatePlantKey(pos));
    return this.world.removePlant(pos);
  }


}
