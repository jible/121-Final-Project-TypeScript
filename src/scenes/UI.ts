//#region --------------------------------------- IMPORTS

import { globalConstants } from "../utils/GlobalConsts";
import { InputHandler } from "../utils/InputHandler";
import { constructTextButton } from "../utils/ButtonMaker.ts"

import { Play } from "./Play";

//#endregion

export class UI extends Phaser.Scene {
  BUTTON_LAYER = 100;
  TILE_SIZE = globalConstants.tileSize;
  SAVE_NAME: string;

  constructor() {
    super({ key: "uiScene", active: true });
  }

  create() {
    // running checks
    console.log("%cMENU SCENE :^)", globalConstants.testColor);
  }

  displayPlayUI() {
    // Tick Button
    constructTextButton(this,this.TILE_SIZE, this.TILE_SIZE, 10, 6, "t", () =>
      this.tick()
    );

    // Save Button
    constructTextButton(this,4 * this.TILE_SIZE, this.TILE_SIZE, 10, 6, "s", () =>
      this.save()
    );

    // Undo Button
    constructTextButton(this,7 * this.TILE_SIZE, this.TILE_SIZE, 10, 6, "u", () =>
      this.undo()
    );

    // Redo Button
    constructTextButton(this,10 * this.TILE_SIZE, this.TILE_SIZE, 10, 6, "r", () =>
      this.redo()
    );

    // Up Button
    const uiZoneHeight= globalConstants.uiZone.top;
    constructTextButton(this,4 * this.TILE_SIZE, uiZoneHeight , 10, 6, "^", 
      () =>InputHandler.up = true,
      () =>InputHandler.up = false
    );

    constructTextButton(this,4 * this.TILE_SIZE, uiZoneHeight +(3 *this.TILE_SIZE), 10, 6, "_", 
      () => InputHandler.down = true
    , () => InputHandler.down = false
    );
    
    constructTextButton(this,1 * this.TILE_SIZE,uiZoneHeight +(3 *this.TILE_SIZE), 10, 6, "<", 
      () => InputHandler.left = true
    , () => InputHandler.left = false
    );

    constructTextButton(this,7 * this.TILE_SIZE, uiZoneHeight +(3 *this.TILE_SIZE), 10, 6, ">", 
      () => InputHandler.right = true
    , () => InputHandler.right = false
    );

    constructTextButton(this,11 * this.TILE_SIZE, uiZoneHeight , 10, 6, "}", 
      () => InputHandler.reap = true
    , () => InputHandler.reap = false
    );

    constructTextButton(this,11 * this.TILE_SIZE, uiZoneHeight +(3 *this.TILE_SIZE), 10, 6, "{", 
      () => InputHandler.sow = true
    , () => InputHandler.sow = false
    );
  }



  tick() {
    const playScene = this.scene.get("playScene")
    if (playScene instanceof Play ){
      playScene.gameManager.tick();
    }
    this.save();
  }

  save() {
    const playScene = this.scene.get("playScene")
    if(playScene instanceof Play){ playScene.gameManager.save()};
  }

  undo() {
    const playScene = this.scene.get("playScene")
    if(playScene instanceof Play) { playScene.gameManager.timeLine.undo()};
  }

  redo() {
    const playScene = this.scene.get("playScene")
    if (playScene instanceof Play){ playScene.gameManager.timeLine.redo()};
  }
}
