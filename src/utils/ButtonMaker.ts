//#region --------------------------------------- IMPORTS AND INITS

import { globalConstants } from "./GlobalConsts";
import Phaser from "phaser";

// Use the game's tile size from global constants
const tileSize = globalConstants.tileSize;

//#endregion

export function constructTextButton(
    scene: Phaser.Scene,
    // positioning
    x: number,
    y: number,
    // text formatting
    textSize: number,
    padding: number,
    text: string = "default text",
    // asscosciated buttons
    downResult: (pointer: Phaser.Input.Pointer) => void, // Callback for pointerdown event
    upResult?: (pointer: Phaser.Input.Pointer) => void, // Optional callback for pointerup event
    font: string = "en",
) {
    // Create text content for the button
    const content: Phaser.GameObjects.BitmapText = scene.add.bitmapText(
        x + padding / 2,
        y + padding / 2,
        font,
        text,
        textSize
    );
    //content.height = textSize;
    content.setOrigin(0).setZ(100).setDepth(1);

    // Create box as button frame
    const UIBox = scene.add.rectangle(
        x,
        y,
        Math.ceil((content.width + padding) / tileSize) * tileSize,
        content.height + padding,
        0xff0000
    );
    UIBox.setOrigin(0);
    UIBox.setInteractive().on("pointerdown", downResult)
    if (upResult) {
        UIBox.setInteractive().on("pointerup", upResult)
    }

    // Assemble and return button
    const button = { content, UIBox };
    return button;
}



//#region --------------------------------------- IMPORTS AND INITS


export function constructImgButton(
    scene: Phaser.Scene,
    // positioning
    x: number,
    y: number,
    // text formatting
    imgSize: number,
    padding: number,
    key: string = "default text",
    index: number,
    // asscosciated buttons
    downResult: (pointer: Phaser.Input.Pointer) => void, // Callback for pointerdown event
    upResult?: (pointer: Phaser.Input.Pointer) => void // Optional callback for pointerup event
) {
    // Create text content for the button
    const content: Phaser.GameObjects.Sprite = scene.add.sprite(
        x + padding / 2,
        y + padding / 2,
        key,
        index
    );
    content.setDisplaySize(imgSize, imgSize)
    content.setOrigin(0).setZ(100).setDepth(1);

    // Create box as button frame
    const UIBox = scene.add.rectangle(
        x,
        y,
        Math.ceil((content.width + padding) / tileSize) * tileSize,
        content.height + padding,
        0xff0000
    );
    UIBox.setOrigin(0);
    UIBox.setInteractive().on("pointerdown", downResult)
    if (upResult) {
        UIBox.setInteractive().on("pointerup", upResult)
    }

    // Assemble and return button
    const button = { content, UIBox };
    return button;
}

