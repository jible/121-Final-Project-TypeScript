import { globalConstants } from "../utils/globalConsts";
import { Play } from "./Play";


export class UI extends Phaser.Scene {
  BUTTON_LAYER = 100;
  TILE_SIZE = globalConstants.tileSize;
  SAVE_NAME: String;

  constructor() {
    super({ key: "uiScene", active: true });
  }

  create() {
    // running checks
    console.log("%cMENU SCENE :^)", globalConstants.testColor);
  }

  displayPlayUI() {
    // Tick Button
    this.constructButton(this.TILE_SIZE, this.TILE_SIZE, 10, 6, "t", () =>
      this.tick()
    );

    // Save Button
    this.constructButton(4 * this.TILE_SIZE, this.TILE_SIZE, 10, 6, "s", () =>
      this.save()
    );

    // Undo Button
    this.constructButton(7 * this.TILE_SIZE, this.TILE_SIZE, 10, 6, "u", () =>
      this.undo()
    );

    // Redo Button
    this.constructButton(10 * this.TILE_SIZE, this.TILE_SIZE, 10, 6, "r", () =>
      this.redo()
    );
  }

  constructButton(
    x: number,
    y: number,
    textSize: number,
    padding: number,
    text: string = "default text",
    result: Function
  ) {
    const content = this.add.text(x + padding / 2, y + padding / 2, text, {
      fontSize: `${textSize - 2}px`,
      lineSpacing: 0,
    });
    content.height = textSize;
    const UIBox = this.add.rectangle(
      x,
      y,
      Math.ceil((content.width + padding) / this.TILE_SIZE) * this.TILE_SIZE,
      content.height + padding,
      0xff0000
    );

    content.setOrigin(0).setZ(1).setDepth(1);
    UIBox.setOrigin(0);

    const button = { content, UIBox };
    UIBox.setInteractive().on("pointerdown", result);

    return button;
  }

  tick() {
    const playScene = this.scene.get("playScene")
    playScene instanceof Play && playScene.gameManager.tick();
    this.save();
  }

  save() {
    const playScene = this.scene.get("playScene")
    playScene instanceof Play && playScene.gameManager.save();
  }

  undo() {
    const playScene = this.scene.get("playScene")
    playScene instanceof Play && playScene.gameManager.timeLine.undo();
  }

  redo() {
    const playScene = this.scene.get("playScene")
    playScene instanceof Play && playScene.gameManager.timeLine.redo();
  }
}
