//#region --------------------------------------- IMPORTS

import Phaser from "phaser";

//#endregion

//#region --------------------------------------- SIZING

const tileSize = 8;
const worldPadding = 4;
const worldDimensions = { width: 12, height: 8 };
const gameDimensions = {
    width: tileSize * worldDimensions.width + tileSize * 2,
    height: tileSize * worldDimensions.height + tileSize * 3 + tileSize * worldPadding + uiZone.height * tileSize,
}

//#endregion

// Interface defining the shape of keyboard inputs tracked by the game.
export interface KeysObject {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null; // CursorKeys or null
    space: Phaser.Input.Keyboard.Key | null;
    eKey: Phaser.Input.Keyboard.Key | null;
    gKey: Phaser.Input.Keyboard.Key | null;
}

// Represents the keyboard keys used in the game.
export const keys: KeysObject = {
    cursors: null,
    space: null,
    eKey: null,
    gKey: null,
};

//#region --------------------------------------- UI

const uiZone = { width: 12, height: 5, top: tileSize * worldDimensions.height + tileSize * 2 + tileSize * worldPadding};

export const globalConstants = {
    uiZone: uiZone,

    tileSize: tileSize,
    worldPadding: worldPadding,
    worldDimensions : worldDimensions,
    gameDimensions: gameDimensions,

    centerX: gameDimensions.width/2,
    centerY: gameDimensions.height/2,

    // Color constants for various UI and debug elements, with CSS-compatible string formats
    testColor: 'color: #91aa86;',
    goodColor: 'color: #cfd1af;',
    badColor: 'color: #c088ae;',

    // Default save data structure, representing initial states for saving/loading.
    defaultSaveData: {
        currentAction: {
            // Pre-initialize action state mappings (e.g., events 0-95 set to default value of 0)
            [key: number]: number;
        } = Array.from({ length: 96 }).reduce((acc, _, index) => {
            acc[index] = 0;
            return acc;
        }, {} as Record<number, number>),
        formerStates: [] as Array<any>,
        undoneStates: [] as Array<any>,
    },
}

//#endregion