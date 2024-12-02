import { globalConstants } from './utils/globalConsts';
import { Load } from './scenes/Load';
// import { Menu } from './scenes/Menu';
// import { Play } from './scenes/Play';

import { Game, Types } from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    render: {
        pixelArt:true,
    },
    width: globalConstants.gameDimensions.width,
    height: globalConstants.gameDimensions.height,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    zoom: Math.min(
        window.innerHeight / globalConstants.gameDimensions.height - 0.5,
        window.innerWidth / globalConstants.gameDimensions.width - 0.1,
    ),
    scene: [
        Load,
    ]
};

export default new Game(config);
