import { globalConstants } from "../utils/globalConsts";
import Phaser from "phaser";

const tileSize = globalConstants.tileSize;

export function constructTextButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    textSize: number,
    padding: number,
    text: string = "default text",
    downResult: (pointer: Phaser.Input.Pointer) => void, // Specific function type for pointerdown
    upResult?: (pointer: Phaser.Input.Pointer) => void // Specific function type for pointerup
) {
    const content = scene.add.text(x + padding / 2, y + padding / 2, text, {
        fontSize: `${textSize - 2}px`,
        lineSpacing: 0,
    });
    content.height = textSize;
    const UIBox = scene.add.rectangle(
        x,
        y,
        Math.ceil((content.width + padding) / tileSize) * tileSize,
        content.height + padding,
        0xff0000
    );

    content.setOrigin(0).setZ(100).setDepth(1);
    UIBox.setOrigin(0);

    const button = { content, UIBox };
    UIBox.setInteractive().on("pointerdown", downResult);

    if (upResult) {
        UIBox.setInteractive().on("pointerup", upResult);
    }

    return button;
}

