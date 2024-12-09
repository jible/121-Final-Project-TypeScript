//#region --------------------------------------- IMPORTS

import { globalConstants } from "../utils/GlobalConsts";
import { InputHandler } from "../utils/InputHandler";
import { constructImgButton } from "../utils/ButtonMaker"

import { Play } from "./Play";

//#endregion

export class UI extends Phaser.Scene {
  BUTTON_LAYER = 100;
  TILE_SIZE = globalConstants.tileSize;
  TEXT_SIZE = 10
  PADDING = 6
  SAVE_NAME: string;

  constructor() {
    super({ key: "uiScene", active: true });
  }

  create() {
    // running checks
    console.log("%cUI SCENE :^)", globalConstants.testColor);
  }

  displayPlayUI(): void {
    
    //#region ----------------------------------- GAME STATE BUTTONS
    const uiButtonName = 'playButtons'
    const buttonConfigs: {
      xMultiplier: number;
      key: string;
      index: number;
      callback: () => void;
    }[] = [
      { xMultiplier: 1, key: uiButtonName, index: 0, callback: () => this.tick() },  // Tick Button
      { xMultiplier: 3.5, key: uiButtonName, index: 1, callback: () => this.save() },  // Save Button
      { xMultiplier: 6, key: uiButtonName, index: 2, callback: () => this.undo() },  // Undo Button
      { xMultiplier: 8.5, key: uiButtonName, index: 3, callback: () => this.redo() }, // Redo Button
      { xMultiplier: 11, key: uiButtonName, index: 4, callback: () => location.reload()}, // Quit Button
    ];
  
    buttonConfigs.forEach((config) => {
      constructImgButton(
        this,
        config.xMultiplier * this.TILE_SIZE,  // X
        this.TILE_SIZE,                       // Y
        this.TILE_SIZE,                       // Text-size
        this.PADDING + 2,                         // Padding
        config.key,
        config.index,
        config.callback
      );
    });

    //#endregion

    //#region------------------------------------ PLAYER INTERACTION BUTTONS

    const uiZoneHeight= globalConstants.uiZone.top;

    const interactionButtonConfigs: {
      xMultiplier: number;
      yOffset: number;
      index: number;
      onPress: () => void;
      onRelease?: () => void;
    }[] = [
      {
        xMultiplier: 4,
        yOffset: 0,
        index: 5,
        onPress: () => (InputHandler.up = true),
        onRelease: () => (InputHandler.up = false),
      },
      {
        xMultiplier: 4,
        yOffset: 3 * this.TILE_SIZE,
        index: 6,
        onPress: () => (InputHandler.down = true),
        onRelease: () => (InputHandler.down = false),
      },
      {
        xMultiplier: 1,
        yOffset: 3 * this.TILE_SIZE,
        index: 7,
        onPress: () => (InputHandler.left = true),
        onRelease: () => (InputHandler.left = false),
      },
      {
        xMultiplier: 7,
        yOffset: 3 * this.TILE_SIZE,
        index: 8,
        onPress: () => (InputHandler.right = true),
        onRelease: () => (InputHandler.right = false),
      },
      {
        xMultiplier: 11,
        yOffset: 0,
        index: 9,
        onPress: () => (InputHandler.reap = true),
        onRelease: () => (InputHandler.reap = false),
      },
      {
        xMultiplier: 11,
        yOffset: 3 * this.TILE_SIZE,
        index: 10,
        onPress: () => (InputHandler.sow = true),
        onRelease: () => (InputHandler.sow = false),
      },
    ];
    
    interactionButtonConfigs.forEach((config) => {
      constructImgButton(
        this,
        config.xMultiplier * this.TILE_SIZE,  // X
        uiZoneHeight + config.yOffset,        // Y
        this.TEXT_SIZE,                       // Text-size
        this.PADDING,                         // Padding
        uiButtonName,
        config.index,                          // Button text
        config.onPress,                       // Button press callback
        config.onRelease                      // Button release callback (end input)
      );
    });
    //#endregion
  }

  //#region ------------------------------------- ON-SCREEN BUTTON ACTIONS

  // Invokes the "tick" operation in the `Play` scene's game manager.
  // Saves game state, creating a continuous auto-save.
  tick() {
    const playScene = this.scene.get("playScene")
    if (playScene instanceof Play ){
      playScene.gameManager.tick();
    }
    this.save();
  }

  // Saves the game state
  save() {
    const playScene = this.scene.get("playScene")
    if(playScene instanceof Play){ playScene.gameManager.save()};
  }

  // Performs the undo operation
  undo() {
    const playScene = this.scene.get("playScene")
    if(playScene instanceof Play) { playScene.gameManager.timeLine.undo()};
  }

  // Performs the redo operation
  redo() {
    const playScene = this.scene.get("playScene")
    if (playScene instanceof Play){ playScene.gameManager.timeLine.redo()};
  }

  //#endregion
}
