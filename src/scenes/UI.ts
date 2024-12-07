//#region --------------------------------------- IMPORTS

import { globalConstants } from "../utils/GlobalConsts";
import { InputHandler } from "../utils/InputHandler";
import { constructTextButton } from "../utils/ButtonMaker"

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
    console.log("%cMENU SCENE :^)", globalConstants.testColor);
  }

  displayPlayUI(): void {
    
    //#region ----------------------------------- GAME STATE BUTTONS

    const buttonConfigs: {
      xMultiplier: number;
      text: string;
      callback: () => void;
    }[] = [
      { xMultiplier: 1, text: "t", callback: () => this.tick() },  // Tick Button
      { xMultiplier: 4, text: "s", callback: () => this.save() },  // Save Button
      { xMultiplier: 7, text: "u", callback: () => this.undo() },  // Undo Button
      { xMultiplier: 10, text: "r", callback: () => this.redo() }, // Redo Button
    ];
  
    buttonConfigs.forEach((config) => {
      constructTextButton(
        this,
        config.xMultiplier * this.TILE_SIZE,  // X
        this.TILE_SIZE,                       // Y
        this.TEXT_SIZE,                       // Text-size
        this.PADDING,                         // Padding
        config.text,
        config.callback
      );
    });

    //#endregion

    //#region------------------------------------ PLAYER INTERACTION BUTTONS

    const uiZoneHeight= globalConstants.uiZone.top;

    const interactionButtonConfigs: {
      xMultiplier: number;
      yOffset: number;
      text: string;
      onPress: () => void;
      onRelease?: () => void;
    }[] = [
      {
        xMultiplier: 4,
        yOffset: 0,
        text: "^",
        onPress: () => (InputHandler.up = true),
        onRelease: () => (InputHandler.up = false),
      },
      {
        xMultiplier: 4,
        yOffset: 3 * this.TILE_SIZE,
        text: "_",
        onPress: () => (InputHandler.down = true),
        onRelease: () => (InputHandler.down = false),
      },
      {
        xMultiplier: 1,
        yOffset: 3 * this.TILE_SIZE,
        text: "<",
        onPress: () => (InputHandler.left = true),
        onRelease: () => (InputHandler.left = false),
      },
      {
        xMultiplier: 7,
        yOffset: 3 * this.TILE_SIZE,
        text: ">",
        onPress: () => (InputHandler.right = true),
        onRelease: () => (InputHandler.right = false),
      },
      {
        xMultiplier: 11,
        yOffset: 0,
        text: "}",
        onPress: () => (InputHandler.reap = true),
        onRelease: () => (InputHandler.reap = false),
      },
      {
        xMultiplier: 11,
        yOffset: 3 * this.TILE_SIZE,
        text: "{",
        onPress: () => (InputHandler.sow = true),
        onRelease: () => (InputHandler.sow = false),
      },
    ];
    
    interactionButtonConfigs.forEach((config) => {
      constructTextButton(
        this,
        config.xMultiplier * this.TILE_SIZE,  // X
        uiZoneHeight + config.yOffset,        // Y
        this.TEXT_SIZE,                       // Text-size
        this.PADDING,                         // Padding
        config.text,                          // Button text
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
