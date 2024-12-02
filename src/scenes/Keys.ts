import { globalConstants, keys } from "../utils/globalConsts";

export class Keys extends Phaser.Scene {
    constructor() {
        super({ key: "keysScene", active: true });
    }

    create() {
        // Running checks
        console.log("%cKEYS SCENE :^)", globalConstants.testColor);
        window.localStorage
            ? console.log("%cLocal storage supported by this cat! (^･･^=)\\~", globalConstants.goodColor)
            : console.log("%cLocal storage not supported by this cat \\~(=^･･^)", globalConstants.badColor);

        // Initialize the `keys` object with properly typed values
        const keyboard = this.input.keyboard;
        if (!keyboard) return;
        keys.cursors = keyboard.createCursorKeys();
        keys.space = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keys.eKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        keys.gKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
    }
}
