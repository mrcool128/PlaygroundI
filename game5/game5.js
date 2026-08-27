// spaghetti code, but it works
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const gravity = 0.6;
  let moveSpeed = 4;
  let jumpStrength = 16;
  const WIND_FORCE = 0.75;
  const victorySound = new Audio('victory.mp3')
  const death = new Audio('death-sound.wav');
  const rechargeSound = new Audio('recharge.mp3');
  let currentLevel = 1;
  const jumpSoundEffect = new Audio('jump.mp3')
  jumpSoundEffect.volume = 0.05
  const boostSound = new Audio('speed.mp3')
  const nextLevelSound = new Audio('next_level.mp3');
  let difficulty;
  const windSound = new Audio('wind.mp3')
  windSound.loop = true;
  windSound.volume = 0.05

  function stopAllSounds() {
    [death, rechargeSound, jumpSoundEffect, boostSound, nextLevelSound, windSound]
      .forEach(sound => sound.pause());
    document.querySelectorAll('audio').forEach(sound => sound.pause());
  }

  const eggImg = new Image();
eggImg.src = "egg.png";
  const flagImg = new Image();
  flagImg.src = "flag.png";
    const FLAG_SCALE = 4; // visual + collision scale for flags
  let lastDirection = 0;
  let manualJumpDisabled = false;
  let canResetLastLevel = true;
  let autoJumpInterval = null;
  let continuousMovement = false; 

  const keys = { left: false, right: false, jump: false };
  const rules = {
    1: `If the level counter is odd :
    left: A; right: D.
    If the level counter is even :
    left: J; right: L`,
    2: `The jump button is the level counter in hexadecimal. Press "R" to reset the level.`,
    3: `If the level counter is prime, a wind appears which slowly moves you left or right...`,
    4: `JumpStrength is divided by 1.5 every time you touch the enemy. To restore your jump strength to the previous level's value, you must press C, which sends you back 1 level on levels having 2 or less syllables.`,
    5: `If the level counter is divisible by 5, the left and right movements don't stop.`,
    6: `If the level counter is divisible by 3, you auto jump every 2 seconds and you can't jump.`,
    7: `If the level counter in Binary contains only ones, there's no gravity in the y axis. The fall button is "Shift".`,
    8: `If you touch the egg, the movement speed AND the jump height is divided by 1.5. Press "C" to restore them.`,
    9: `You can now kill the enemies (not eggs) by jumping on them. But on odd levels, they kill you no matter what.`,
    10: `If you press "Space", you gain a speed boost for 5 seconds, but you can't jump while boosted. Jump is 'A'`,
    11: `Every 5 seconds, you get sent back 150px left (Goes through walls).`,
    12: `Left & Right keys has changed ! They're now "V" and "B" accordingly. And you need to defeat all enemies in this level to continue.`,
    13: `Last level. On this level, you have only one jump until you touch the recharge platform (purple), then it gives back 1 jump. Enemies go through recharge platforms.`
  }

  const levelNames = {
    1: "Level 1 - Left ? Right ? Who knows.",
    2: "Level 2 - What the Hex ?",
    3: "Level 3 - Get Blown Away",
    4: "Level 4 - The Enemy Tax",
    5: "Level 5 - Need a Driver's Licence",
    6: "Level 6 - Can't Jump ? Get Jumped !",
    7: "Level 7 - Binary 1 - Gravity 0",
    8: "Level 8 - Egg Cracked, You Cracked!",
    9: "Level 9 - Avoiding Taxes... Sometimes.",
    10: "Level 10 - Speedy & Jumpn't",
    11: "Level 11 - 150 Pixels of Regerts",
    12: "Level 12 - Identity Depression",
    13: "Level 13 - One Last Jump"
};

  const RulesActivated = {
    1: {
      keys: "A / D" 
    },
    2: {
      keys: "J / L",
      jump: "2"
    },
    3: {
      keys: "A / D",
      jump: "3",
      wind: "True"
    },
    4: {
      keys: "J / L",
      jump: "4",
      wind: "False",
      RestoringJumpGoesBack: "True"
    },
    5: {
      keys: "A / D",
      jump: "5",
      wind: "True",
      continuousMovement: "True",
      RestoringJumpGoesBack: "True"
    },
    6: {
      keys: "J / L",
      jump: "auto jump",
      wind: "False",
      continuousMovement: "False",
      autoJump: "True",
      RestoringJumpGoesBack: "True"
    },
    7: {
      keys: "A / D",
      jump: "7",
      wind: "True",
      continuousMovement: "False",
      autoJump: "False",
      noGravity: "True",
      RestoringJumpGoesBack: "True",
  },
  8: {
      keys: "J / L",
      jump: "8",
      wind: "False",
      continuousMovement: "False",
      autoJump: "False",
      noGravity: "False",
      RestoringJumpGoesBack: "True",
  },
  9: {
      keys: "A / D",
      jump: "auto jump",
      wind: "False",
      continuousMovement: "False",
      autoJump: "True",
      noGravity: "False",
      enemyJumpKill: "False",
      RestoringJumpGoesBack: "True",
  },
  10: {
    keys: "J / L",
    jump: "A",
    wind: "False", 
    continuousMovement: "True",
    autoJump: "False",
    noGravity: "False",
    enemyJumpKill: "True",
    RestoringJumpGoesBack: "True",
  },
  11: {
    keys: "A / D",
    jump: "B",
    wind: "True",
    continuousMovement: "False",
    autoJump: "False",
    noGravity: "False",
    enemyJumpKill: "False",
    RestoringJumpGoesBack: "False",
  },
  12: {
    keys: "V / B",
    jump: "auto jump",
    wind: "False",
    continuousMovement: "False",
    autoJump: "True",
    noGravity: "False",
    enemyJumpKill: "True",
    RestoringJumpGoesBack: "True",

  },
  13: {
    keys: "V / B",
    jump: "D",
    wind: "True",
    continuousMovement: "False",
    autoJump: "False",
    noGravity: "False",
    enemyJumpKill: "False",
    RestoringJumpGoesBack: "True",
    oneJumpUntilRechargePlatform: "True"}
}

const ruleCategories = {
    "Jump Rules": [2, 4, 6, 7, 10, 13],
    "Player Movement Rules": [1, 3, 5, 7, 10, 11, 12],
    "Enemy Rules": [4, 9, 12, 13],
    "Egg Rules": [8]
  };
  const player = {
    x: 100, y: 0,
    width: 80, height: 80,
    vx: 0, vy: 0,
    onGround: false,
    jumpsRemaining: 1
  };

  // --- PLATEFORMES + DRAPEAU ---
  const levels = {
    1: {
      platforms: [
        { x: 0, y: 650, width: 1200, height: 50 }
      ],
      flag: { x: 1050, y: 575, width: 20, height: 80 }
    },
    2: {
      platforms: [
        { x: 0, y: 650, width: 1200, height: 50 },        // sol
        { x: 450, y: 520, width: 180, height: 20 },       // plateforme 1
        { x: 825, y: 430, width: 180, height: 20 }        // plateforme 2
      ],
      flag: { x: 1050, y: 200, width: 20, height: 80 }
    },

    3: {
      platforms: [
        { x: 0, y: 650, width: 1200, height: 50 },        // sol
        { x: 225, y: 580, width: 120, height: 20 },
        { x: 390, y: 515, width: 120, height: 20 },
        { x: 555, y: 450, width: 120, height: 20 },
        { x: 720, y: 385, width: 120, height: 20 },
        { x: 885, y: 320, width: 120, height: 20 }
      ],
      flag: { x: 1050, y: 200, width: 20, height: 80 }
    },
    4: {
      platforms: [
        { x: 0, y: 650, width: 1200, height: 50 }
        ,        // sol
        { x: 300, y: 0, width: 20, height: 350 },
        { x: 300, y: 450, width: 20, height: 350 },

        { x: 600, y: 450, width: 20, height: 350 },
        { x: 600, y: 0, width: 20, height: 350 },

        { x: 900, y: 0, width: 20, height: 350 },
        { x: 900, y: 450, width: 20, height: 350 }
      ],
      flag: { x: 1050, y: 380, width: 20, height: 80 },
      enemies: [
        { x: 600, y: 570, width: 60, height: 60, vx: 2 }, 
        { x: 700, y: 570, width: 60, height: 60, vx: -2 }
      ]
    },
    5: {
      platforms: [
        { x: 0, y: 650, width: 1200, height: 50 },
        { x: 150, y: 535, width: 150, height: 20 },
        { x: 365, y: 430, width: 145, height: 20 },
        { x: 570, y: 535, width: 150, height: 20 },
        { x: 775, y: 395, width: 155, height: 20 },
        { x: 315, y: 285, width: 170, height: 20 },
        { x: 700, y: 220, width: 150, height: 20 }
      ],
      flag: { x: 1050, y: 200, width: 20, height: 80 },
      enemies: [
        { x: 430, y: 370, width: 60, height: 60, vx: 1.8 },
        { x: 610, y: 590, width: 60, height: 60, vx: -2.2 },
        { x: 820, y: 335, width: 60, height: 60, vx: 2.1 },
        { x: 1010, y: 440, width: 60, height: 60, vx: -1.6 }
      ]
    },
    6: {
      platforms: [
        { x: 90, y: 600, width: 105, height: 20 },
        { x: 200, y: 400, width: 105, height: 20 },
        { x: 350, y: 200, width: 300, height: 20 },
        { x: 500, y: 0, width: 20, height: 100},
        { x: 500, y: 200, width: 20, height: 500}
      ],
      flag: { x: 850, y: 600, width: 10, height: 60 },
      enemies: [
        { x: 600, y: 450, width: 60, height: 60, vx: 1.8 },
        { x: 800, y: 150, width: 60, height: 60, vy: 1.5 }
      ]
    },
7: {
      platforms: [
        { x: 0, y: 650, width: 1200, height: 50 },
        { x: 0, y: 120, width: 900, height: 20 },
        { x: 300, y: 250, width: 900, height: 20 },
        { x: 0, y: 380, width: 900, height: 20 },
        { x: 900, y: 510, width: 300, height: 20 },
        { x: 900, y: 510, width : 20, height: 300 },
        { x: 750, y: 400, width: 20, height: 155 },
        { x: 450, y: 400, width: 20, height: 155 },
      ],
      flag: { x: 100, y: 500, width: 22.5, height: 100 },
      enemies: [
        { x: 980, y: 160, width: 60, height: 60, vy: 3.5 },
        { x: 120, y: 285, width: 60, height: 60, vx: 2 },
        { x: 980, y: 415, width: 60, height: 60, vy: -1.8 },
        { x: 130, y: 200, width: 60, height: 60, vy: -2.5 },
        { x: 500, y: 540, width: 60, height: 60, vy: -2.5 },
        { x: 350, y: 500, width: 60, height: 60, vy: 2.9 },
      ]
    },
    8: {
      platforms: [
        { x: 0, y: 650, width: 1200, height: 50 },
        { x: 100, y: 540, width: 100, height: 20 },
        { x: 250, y: 470, width: 100, height: 20 },
        { x: 400, y: 400, width: 100, height: 20 },
        { x: 550, y: 330, width: 100, height: 20 },
        { x: 700, y: 330, width: 100, height: 20 },
      ],
      flag: { x: 900, y: 330, width: 20, height: 80 },
      enemies: [
        { x: 420, y: 100, width: 60, height: 60, vx: 2.3 },
      ],
      eggs: [
        { x: 266, y: 370, width: 75, height: 75, vy: 3 },
        { x: 416, y: 200, width: 75, height: 75, vy: -0.8 },
        { x: 566, y: 100, width: 75, height: 75, vy: 1.2 },
        { x: 716, y: 200, width: 75, height: 75, vy: -1.7 }
      ]
    },
    9: {
      platforms: [
        { x: 0, y: 650, width: 1200, height: 50 },
        { x: 350, y: 275, width: 20, height: 295 },
        { x: 750, y: 275, width: 20, height: 295 },
        { x: 350, y: 275, width: 400, height: 20 },
      ],
      flag: { x: 1060, y: 575, width: 20, height: 80 },
      enemies: [
        { x: 400, y: 300, width: 70, height: 70, vy: 2.1 },
        { x: 600, y: 300, width: 70, height: 70, vx: -1.1 },
        { x: 400, y: 500, width: 70, height: 70, vx: 2.7 },
        { x: 600, y: 500, width: 70, height: 70, vy: -1.9 },
        { x: 500, y: 400, width: 70, height: 70, vx: 2.3, vy: -3 },
        { x: 400, y: 400, width: 70, height: 70, vx: -2.3, vy: 3 }
      ]
    },
    10: {
      platforms: [
        { x: 0, y: 650, width: 1200, height: 50 },
        { x: 280, y: 520, width: 140, height: 20 },
        { x: 660, y: 360, width: 140, height: 20 },
      ],
      flag: { x: 1050, y: 160, width: 20, height: 80 },
      enemies: [
        { x: 450, y: 570, width: 60, height: 60, vx: 2.5 },
        { x: 600, y: 570, width: 60, height: 60, vx: 2.5, vy: -2.5 }
      ],
      eggs: [
        { x: 300, y: 500, width: 75, height: 75, vy: -1.5 },
        { x: 700, y: 150, width: 75, height: 75, vy: 0.4 }
      ]
    },
    11: {
      platforms: [
        { x: 0, y: 650, width: 1200, height: 50 },
        { x: 600, y: 550, width: 600, height: 150 },
        { x: 400, y: 555, width: 100, height: 10 },
        { x: 200, y: 300, width: 200, height: 20 },
        { x: 505, y: 450, width: 900, height: 20 },
        { x: 200, y: 0, width: 20, height: 300 },
        { x: 380, y: 450, width: 20, height: 115 },
        { x: 500, y: 450, width: 20, height: 115 },
        { x: 380, y: 0, width: 20, height: 450 },
        { x: 500, y: 350, width: 450, height: 20 },
        { x: 950, y: 0, width: 20, height: 370 },
        { x: 1050, y: 250, width: 50, height: 20 },
        { x: 500, y: 250, width: 460, height: 100 },
      ],
      flag: { x: 300, y: 205, width: 20, height: 80 },
      enemies: [
        { x: 520, y: 480, width: 60, height: 60, vx: 3.5 },
        { x: 1150, y: 480, width: 60, height: 60, vx: -3.5 },
        { x: 835, y: 480, width: 60, height: 60, vx: -1.5 },
        { x: 420, y: 480, width: 60, height: 60, vy: 2.5 },

      ],
      eggs: [
        { x: 1100, y: 100, width: 75, height: 75, vy: 2.5, vx: -1.5 },
        { x: 700, y: 100, width: 75, height: 75, vy: 1.3 },
        { x: 600, y: 100, width: 75, height: 75, vy: 1.3 },

      ]
    },
    12: {
      platforms: [
        { x: 0, y: 650, width: 1200, height: 50 },
        { x: 1050, y: 0, width: 20, height: 800 },
      ],
      flag: { x: 1125, y: 550, width: 20, height: 80 },
      enemies: [
        { x: 300, y: 570, width: 60, height: 60 },
        { x: 450, y: 570, width: 60, height: 60 },
        { x: 600, y: 570, width: 60, height: 60 },
        { x: 750, y: 570, width: 60, height: 60 },
        { x: 900, y: 570, width: 60, height: 60 }
      ],

    },
    13: {
      platforms: [
        { x: 0, y: 650, width: 1200, height: 50 },
        { x: 400, y: 134, width: 20, height: 400},
        { x: 200, y: 534, width: 320, height: 20},
        { x: 200, y: 0, width: 20, height: 540},
        { x: 1180, y: 0, width: 20, height: 800 },
        { x: 950, y: 200, width: 20, height: 320},
        { x: 750, y: 200, width: 200, height: 20},
        { x: 500, y: 0, width: 20, height: 150},
        { x: 400, y: 130, width: 120, height: 20}
      ],
      flag: { 
        x: 450, y: 25, width: 20, height: 80 
},
      enemies: [
        { x: 1050, y: 400, width: 60, height: 60, vy: 4}
      ],
      eggs: [
        { x: 800, y: 50, width: 60, height: 60, vy: 1}
      ],
      rechargePlatforms: [
        { x: 330, y: 400, width: 70, height: 20},
        { x: 970, y: 500, width: 75, height: 20},
        { x: 1105, y: 350, width: 75, height: 20},
        { x: 700, y: 200, width: 50, height: 20},
        { x: 220, y: 250, width: 70, height: 20}
      ]
    }
  };
  const initialEnemies = Object.fromEntries(
    Object.entries(levels).map(([level, levelData]) => [
      level,
      levelData.enemies?.map((enemy) => ({ ...enemy }))
    ])
  );

  function resetEnemies() {
    const enemies = initialEnemies[currentLevel];
    if (enemies) {
      levels[currentLevel].enemies = enemies.map((enemy) => ({ ...enemy }));
    }
  }

  function resetPlayer() {
    resetEnemies();
    player.x = 100;
    player.y = 0;
    player.vx = 0;
    player.vy = 0;
    player.jumpsRemaining = currentLevel === 13 ? 1 : Infinity;
  }
  function handlePlayerEnemyCollision(enemy) {
    jumpStrength /= 1.5;
    resetPlayer();
    death.play();
  }
  function changeRulesList() {
    const rulesListElement = document.getElementById('rulesList');
    const rulesListContent = document.getElementById('rulesListContent');
    rulesListContent.replaceChildren();

    if (currentLevel < 8) {
      for (let level = 1; level <= currentLevel; level++) {
        const ruleEntry = document.createElement('p');
        ruleEntry.className = 'ruleEntry';
        ruleEntry.textContent = `${level}: ${rules[level]}`;
        rulesListContent.appendChild(ruleEntry);
      }
      return;
    }

    for (const [categoryName, categoryLevels] of Object.entries(ruleCategories)) {
      const category = document.createElement('section');
      const categoryButton = document.createElement('button');
      const categoryContent = document.createElement('div');

      category.className = 'rulesCategory';
      categoryButton.className = 'rulesCategoryButton';
      categoryButton.type = 'button';
      categoryButton.textContent = categoryName;
      categoryButton.setAttribute('aria-expanded', 'false');
      categoryContent.className = 'rulesCategoryContent';

      for (const level of categoryLevels) {
        if (level > currentLevel) continue;

        const ruleEntry = document.createElement('p');
        const ruleLevel = document.createElement('span');
        ruleEntry.className = 'ruleEntry';
        ruleLevel.className = 'ruleLevel';
        ruleLevel.textContent = `Level ${level}: `;
        ruleEntry.append(ruleLevel, document.createTextNode(rules[level]));
        categoryContent.appendChild(ruleEntry);
      }

      if (!categoryContent.hasChildNodes()) continue;

      categoryButton.addEventListener('click', () => {
        const wasOpen = categoryContent.classList.contains('open');
        document.querySelectorAll('.rulesCategoryContent.open').forEach((openContent) => {
          openContent.classList.remove('open');
        });
        document.querySelectorAll('.rulesCategoryButton[aria-expanded="true"]').forEach((openButton) => {
          openButton.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          categoryContent.classList.add('open');
          categoryButton.setAttribute('aria-expanded', 'true');
        }
      });

      category.append(categoryButton, categoryContent);
      rulesListContent.appendChild(category);
    }
  }
  function changeRulesCurrentLevel() {
    const rulesCurrentLevelElement = document.getElementById('rulescurrentLevel');
    const rulesCurrentLevelText = rulesCurrentLevelElement.querySelector('.text');
    let rulesCurrentLevelMessage = "";
    for (rule in RulesActivated[currentLevel]) {
      rulesCurrentLevelMessage += rule + ": " + RulesActivated[currentLevel][rule] + "<br>";
    }
    rulesCurrentLevelText.innerHTML = rulesCurrentLevelMessage;
  }
  function handlePlayerEggCollision(egg) {
    moveSpeed /= 1.5;
    jumpStrength /= 1.5;
    death.play();
    resetPlayer();
  }
  function updateEnemies() {
  const enemyList = levels[currentLevel].enemies;
  if (!enemyList) return;

  const platformList = levels[currentLevel].platforms;

  for (let i = enemyList.length - 1; i >= 0; i--) {
    const enemy = enemyList[i];

    enemy.vx = enemy.vx || 0;
    enemy.vy = enemy.vy || 0;

    enemy.x += enemy.vx;
    for (const platform of platformList) {
      const overlapX =
        enemy.x < platform.x + platform.width &&
        enemy.x + enemy.width > platform.x;
      const overlapY =
        enemy.y < platform.y + platform.height &&
        enemy.y + enemy.height > platform.y;

      if (overlapX && overlapY && enemy.vx !== 0) {
        if (enemy.vx > 0) {
          enemy.x = platform.x - enemy.width;
        } else {
          enemy.x = platform.x + platform.width;
        }
        enemy.vx *= -1;
      }
    }

    enemy.y += enemy.vy;
    for (const platform of platformList) {
      const overlapX =
        enemy.x < platform.x + platform.width &&
        enemy.x + enemy.width > platform.x;
      const overlapY =
        enemy.y < platform.y + platform.height &&
        enemy.y + enemy.height > platform.y;

      if (overlapX && overlapY && enemy.vy !== 0) {
        if (enemy.vy > 0) {
          enemy.y = platform.y - enemy.height;
        } else {
          enemy.y = platform.y + platform.height;
        }
        enemy.vy *= -1;
      }
    }

    // --- Collision avec les bords du canvas ---
    if (enemy.x < 0 || enemy.x + enemy.width > canvas.width) {
      enemy.x = Math.max(0, Math.min(enemy.x, canvas.width - enemy.width));
      enemy.vx *= -1;
    }
    if (enemy.y < 0 || enemy.y + enemy.height > canvas.height) {
      enemy.y = Math.max(0, Math.min(enemy.y, canvas.height - enemy.height));
      enemy.vy *= -1;
    }

    // --- Collision avec le joueur ---
    const playerOverlapX =
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x;

    const playerOverlapY =
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y;

    if (playerOverlapX && playerOverlapY) {
      const prevPlayerY = player.y - player.vy;
      const cameFromAbove = prevPlayerY + player.height <= enemy.y && player.vy > 0;

      if (enemyJumpKillActive && cameFromAbove && !enemyJumpKillsPlayerOnOdd) {
        enemyList.splice(i, 1);
        player.vy = -jumpStrength / 1.2;
        player.onGround = false;
      } else {
        handlePlayerEnemyCollision(enemy);
      }
    }
  }
}

function updateTitleText() {
  const titleTextAllRules = document.getElementById("titleTextAllRules");
  if (difficulty === 'Hardcore') {
    titleTextAllRules.textContent = "Available only on Easy or Normal difficulties";
  }

  const titleTextCurrentLevelRules = document.getElementById("titleTextCurrentLevelRules");
  if (difficulty === 'Hardcore' || difficulty === 'Normal') {
    titleTextCurrentLevelRules.textContent = "Available only on Easy difficulty";
  }
}

function updateEggs() {
  const eggList = levels[currentLevel].eggs;
  if (!eggList) return;

  const platformList = levels[currentLevel].platforms;

  for (const egg of eggList) {
    egg.vx = egg.vx || 0;
    egg.vy = egg.vy || 0;

    // --- Déplacement ---
    egg.x += egg.vx;
    egg.y += egg.vy;

    // --- Collision avec les plateformes ---
    for (const platform of platformList) {
      const overlapX =
        egg.x < platform.x + platform.width &&
        egg.x + egg.width > platform.x;

      const overlapY =
        egg.y < platform.y + platform.height &&
        egg.y + egg.height > platform.y;

      if (overlapX && overlapY) {
        const previousX = egg.x - egg.vx;
        const previousY = egg.y - egg.vy;

        const hitFromLeft = previousX + egg.width <= platform.x;
        const hitFromRight = previousX >= platform.x + platform.width;
        const hitFromTop = previousY + egg.height <= platform.y;
        const hitFromBottom = previousY >= platform.y + platform.height;

        if (hitFromLeft || hitFromRight) {
          if (egg.vx > 0) {
            egg.x = platform.x - egg.width;
          } else {
            egg.x = platform.x + platform.width;
          }
          egg.vx *= -1;
        } else if (hitFromTop || hitFromBottom) {
          if (egg.vy > 0) {
            egg.y = platform.y - egg.height;
          } else {
            egg.y = platform.y + platform.height;
          }
          egg.vy *= -1;
        }
      }
    }

    // --- Collision avec les bords du canvas ---
    if (egg.x < 0) {
      egg.x = 0;
      egg.vx *= -1;
    }
    if (egg.x + egg.width > canvas.width) {
      egg.x = canvas.width - egg.width;
      egg.vx *= -1;
    }
    if (egg.y < 0) {
      egg.y = 0;
      egg.vy *= -1;
    }
    if (egg.y + egg.height > canvas.height) {
      egg.y = canvas.height - egg.height;
      egg.vy *= -1;
    }

    // --- Collision avec le joueur ---
    const playerOverlapX =
      player.x < egg.x + egg.width &&
      player.x + player.width > egg.x;

    const playerOverlapY =
      player.y < egg.y + egg.height &&
      player.y + player.height > egg.y;

    if (playerOverlapX && playerOverlapY) {
      handlePlayerEggCollision(egg);
    }
  }
}

  let keyBindings = {
  left: ['a', 'A'],
  right: ['d', 'D'],
  jump: [],
  resetLastLevel: [],
};
  // Rules
  function ruleOne() {
    if (currentLevel % 2 === 1) {
      keyBindings.left = ['a', 'A'];
      keyBindings.right = ['d', 'D'];
    } else {
      keyBindings.left = ['j', 'J'];
      keyBindings.right = ['l', 'L'];
    }
}
  
  function ruleTwo() {
    const jumpKey = currentLevel.toString(16).toLowerCase();
    keyBindings.jump = [jumpKey];
    keyBindings.reset = ['r', 'R'];
  }

  function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

let windDirection = 0;
let windForce = 0;
let enemyJumpKillActive = false;
let enemyJumpKillsPlayerOnOdd = false;

function ruleThree() {
  if (isPrime(currentLevel)) {
    if (windDirection === 0) {
      windDirection = Math.random() < 0.5 ? -1 : 1;
    }
    windForce = windDirection * WIND_FORCE;
    windSound.play();
  } else {
    windForce = 0;
    windSound.pause()
    windDirection = 0;
  }
}
function ruleFour() {
  keyBindings.resetLastLevel = ['c', 'C'];
}

function ruleFive() {
  if (currentLevel % 5 === 0) {
    continuousMovement = true;
  } else {
    continuousMovement = false;
  }
}

function ruleSix() {
  if (currentLevel % 3 === 0) {

    manualJumpDisabled = true; 

    if (!autoJumpInterval) {
      autoJumpInterval = setInterval(() => {
        if (player.onGround) {
          player.vy = -jumpStrength;
          player.onGround = false;
        }
      }, 2000);
    }

  } else {
    if (!player.isBoosting) {
      manualJumpDisabled = false;
    }

    if (autoJumpInterval) {
      clearInterval(autoJumpInterval);
      autoJumpInterval = null;
    }
  }
}
function ruleSeven() {
  const isAllOnes = currentLevel.toString(2).split('').every(bit => bit === '1');

  if (isAllOnes) {
    keyBindings.fall = ['Shift']; // touche pour retomber
  } else {
    keyBindings.fall = [];
  }
}
function ruleNine() {
    enemyJumpKillActive = currentLevel >= 9;
  enemyJumpKillsPlayerOnOdd = currentLevel >= 9 && currentLevel % 2 === 1;
}

function ruleTen() {
  keyBindings.boost = [' ']; // Shift + Space for boost
}

setInterval(() => {
  if (currentLevel >= 11) {
    player.x -= 150;
    if (player.x < 0) player.x = 0; // Prevent going off-screen
  }
}, 5000);
function ruleTwelve() {
  keyBindings.left = ['v', 'V'];
  keyBindings.right = ['b', 'B'];
}
function ruleThirteen() {
if (currentLevel === 13 && !Number.isFinite(player.jumpsRemaining)) {
    player.jumpsRemaining = 1;
  } 
}
  // --- INPUT ---
window.addEventListener('keydown', (e) => {
  for (const action in keyBindings) {
    if (keyBindings[action].includes(e.key) || keyBindings[action].includes(e.code)) {
      keys[action] = true;
    }
  }
});

window.addEventListener('keyup', (e) => {
  for (const action in keyBindings) {
    if (keyBindings[action].includes(e.key) || keyBindings[action].includes(e.code)) {
      keys[action] = false;
    }
  }
});

  // --- PHYSIQUE ---
  function updatePlayer() {
player.vx = 0;
if (continuousMovement) {
  if (keys.left) {
    lastDirection = -1;
    player.vx = -moveSpeed;
  } else if (keys.right) {
    lastDirection = 1;
    player.vx = moveSpeed;
  } else {
    player.vx = lastDirection * moveSpeed;
  }
} else {
  // comportement normal
  player.vx = 0;
  if (keys.left) player.vx = -moveSpeed;
  if (keys.right) player.vx = moveSpeed;
}
  if (keys.reset) {
    resetPlayer(); 
  } else {
    }
    if (keys.boost && !player.isBoosting) {
  player.isBoosting = true;
  moveSpeed *= 2;
    boostSound.play();

  // Pendant le boost, on désactive le saut
  manualJumpDisabled = true;

  setTimeout(() => {
    moveSpeed /= 2;
    player.isBoosting = false;

    // On réactive le saut seulement si la règle 6 ne l'interdit pas
    if (currentLevel % 3 !== 0) {
      manualJumpDisabled = false;
    }
  }, 5000);
}

if (player.isBoosting) {
  manualJumpDisabled = true;
}
    if (keys.resetLastLevel) {
  if (canResetLastLevel && currentLevel > 1) {
    if (currentLevel != 11) {
      currentLevel -= 1
    } 
    resetPlayer();
    canResetLastLevel = false; // empêche les resets multiples
    jumpStrength = 16; // réinitialise la force de saut à la valeur du niveau précédent
    moveSpeed = 4; // réinitialise la vitesse de déplacement à la valeur du niveau précédent
    activateRules();
    manualJumpDisabled = false; // réactive le saut manuel si nécessaire
    if (autoJumpInterval) {
      clearInterval(autoJumpInterval);
      autoJumpInterval = null;
    }
    continuousMovement = false; // réinitialise le mouvement continu si nécessaire
    windForce = 0;
    keyBindings.fall = [];
    keyBindings.boost = [];
    changeRulesCurrentLevel();
  }
} else {
  // Quand la touche est relâchée, on autorise un nouveau reset
  canResetLastLevel = true;
}
    player.vx += windForce;

const isAllOnes = currentLevel.toString(2).split('').every(bit => bit === '1');

if (isAllOnes && !keys.fall && currentLevel >= 7) {
  // Bloque uniquement la chute, pas la montée
  if (player.vy > 0) {
    player.vy = 0;
  }
} else {
  player.vy += gravity;
}

const canJump =
  (!manualJumpDisabled) &&
  (
    player.onGround ||
    (isAllOnes && currentLevel >= 7)   // mid-air jump only when rule applies (levels >= 7)
  ) &&
  (currentLevel !== 13 || player.jumpsRemaining > 0);

    if (keys.jump && canJump) {
      player.vy = -jumpStrength;
      player.onGround = false;
      jumpSoundEffect.play();
      if (currentLevel === 13) {
        player.jumpsRemaining--;
      }
    }

    player.x += player.vx;
    player.y += player.vy;

    if (player.y < 0) {
  player.y = 0;
  player.vy = 0;
}

    const basePlatforms = levels[currentLevel].platforms.filter((platform) => {
      const enemiesRemaining = levels[currentLevel].enemies?.length ?? 0;
      return !(currentLevel === 12 && enemiesRemaining === 0 && platform.x === 1050 && platform.y === 0 && platform.width === 20 && platform.height === 800);
    });
    const flag = levels[currentLevel].flag;
    const displayFlagWidth = Math.round(flag.width * FLAG_SCALE);
    const displayFlagX = flag.x - Math.round((displayFlagWidth - flag.width) / 2);
    const flagPlatform = { x: displayFlagX, y: flag.y + flag.height, width: displayFlagWidth, height: 10 };
    const platforms = basePlatforms.concat(flagPlatform);
    player.onGround = false;

    for (const p of platforms) {
      if (
        player.x < p.x + p.width &&
        player.x + player.width > p.x &&
        player.y < p.y + p.height &&
        player.y + player.height > p.y
      ) {
        const prevY = player.y - player.vy;
        if (prevY + player.height <= p.y) {
          if (currentLevel === 6 && p.y === canvas.height - 50) {
            resetPlayer();
            break;
          }
          player.y = p.y - player.height;
          player.vy = 0;
          player.onGround = true;
        } else if (player.vy < 0 && prevY >= p.y + p.height) {
          player.y = p.y + p.height;
          player.vy = 0;
        } else {
          if (player.x + player.width / 2 < p.x + p.width / 2) {
            player.x = p.x - player.width;
          } else {
            player.x = p.x + p.width;
          }
        }
      }
    }

    if (currentLevel === 13) {
      const rechargePlatforms = levels[currentLevel].rechargePlatforms || [];
      for (const p of rechargePlatforms) {
        if (
          player.x < p.x + p.width &&
          player.x + player.width > p.x &&
          player.y < p.y + p.height &&
          player.y + player.height > p.y
        ) {
          const prevY = player.y - player.vy;
          if (prevY + player.height <= p.y) {
            player.y = p.y - player.height;
            player.vy = 0;
            player.onGround = true;
            if (player.jumpsRemaining === 0) {
              player.jumpsRemaining = 1;
              rechargeSound.play();
            }
          } else if (player.vy < 0 && prevY >= p.y + p.height) {
            player.y = p.y + p.height;
            player.vy = 0;
          } else {
            if (player.x + player.width / 2 < p.x + p.width / 2) {
              player.x = p.x - player.width;
            } else {
              player.x = p.x + p.width;
            }
          }
        }
      }
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) {
      resetPlayer();
      return;
    }

    checkFlagCollision();
  }

  // update the rule text
  function updateRuleText() {
    const ruleDisplay = document.getElementById('ruleDisplay');
    ruleDisplay.textContent = 'Rule ' + currentLevel + ': ' + rules[currentLevel];
    ruleDisplay.style.fontSize = '26px';
    ruleDisplay.style.fontWeight = 'bold';
  }

  // active rules

  function activateRules() {
    if (currentLevel >= 1) {
      ruleOne();
    }
    if (currentLevel >= 2) {
      ruleTwo();
    }
    if (currentLevel >= 3) {
      ruleThree();
    }
    if (currentLevel >= 4) {
      ruleFour();
    }
    if (currentLevel >= 5) {
      ruleFive();
    }
    if (currentLevel >= 6) {
      ruleSix();
    }
    if(currentLevel >= 7) {
      ruleSeven();
    }
    if (currentLevel >= 9) {
      ruleNine();
    }
    if (currentLevel >= 10) {
      ruleTen();
    }
    if (currentLevel >= 12) {
      ruleTwelve();
    }
    if (currentLevel >= 13) {
      ruleThirteen();
    }
  }
  // --- COLLISION AVEC LE DRAPEAU ---
  function checkFlagCollision() {
    const flag = levels[currentLevel].flag;
    const displayFlagWidth = Math.round(flag.width * FLAG_SCALE);
    const displayFlagX = flag.x - Math.round((displayFlagWidth - flag.width) / 2);

    if (
      player.x < displayFlagX + displayFlagWidth &&
      player.x + player.width > displayFlagX &&
      player.y < flag.y + flag.height &&
      player.y + player.height > flag.y
    ) {
      if (currentLevel === 13) {
        victoryPopUp();
        gameLoop = () => {}; // Stop the game loop
      } else {
        nextLevel();
      }
    }
  }
  difficultyPopUp();
  function difficultyPopUp() {
    if (document.getElementById('difficultyPopUp')) return;

    const difficultyMessage = document.createElement('div');
    const difficultyEasyButton = document.createElement('button');
    const difficultyNormalButton = document.createElement('button');
    const difficultyHardcoreButton = document.createElement('button');
    difficultyMessage.id = 'difficultyPopUp';
    difficultyMessage.setAttribute('role', 'dialog');
    difficultyMessage.setAttribute('aria-label', 'Choose your difficulty');
    const difficultyTitle = document.createElement('h1');
    difficultyTitle.textContent = 'Choose your difficulty';
    difficultyEasyButton.textContent = 'Easy';
    difficultyNormalButton.textContent = 'Normal';
    difficultyHardcoreButton.textContent = 'Hardcore';

    const chooseDifficulty = (selectedDifficulty) => {
      difficulty = selectedDifficulty;
      if (difficulty === 'Easy' || difficulty === 'Normal'
      ) {
        changeRulesList();
      }
      if (difficulty === 'Easy') {
        changeRulesCurrentLevel();
      }
      difficultyMessage.remove();
    };

    difficultyEasyButton.addEventListener('click', () => chooseDifficulty('Easy'));
    difficultyNormalButton.addEventListener('click', () => chooseDifficulty('Normal'));
    difficultyHardcoreButton.addEventListener('click', () => chooseDifficulty('Hardcore'));

    difficultyEasyButton.style.color = "lime";
    difficultyNormalButton.style.color = "orange";
    difficultyHardcoreButton.style.color = "red";
    Object.assign(difficultyMessage.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '9',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      fontFamily: 'sans-serif',
      textAlign: 'center'
    });

    for (const button of [difficultyEasyButton, difficultyNormalButton, difficultyHardcoreButton]) {
      Object.assign(button.style, {
        minWidth: '180px',
        padding: '12px 24px',
        fontSize: '1.4rem',
        cursor: 'pointer',
        fontWeight: 'bold',
      });
    }

    difficultyMessage.append(difficultyTitle, difficultyEasyButton, difficultyNormalButton, difficultyHardcoreButton);
    document.body.appendChild(difficultyMessage);
  }
  function victoryPopUp() {
    if (document.getElementById('victoryPopup')) return;

    const victoryMessage = document.createElement('div');
    victoryMessage.id = 'victoryPopup';

    stopAllSounds();
    victorySound.play()
    const victoryText = 'Victory !';
    let displayedText = '';
    Object.assign(victoryMessage.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '10',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'lime',
      fontFamily: 'sans-serif',
      fontSize: 'clamp(4rem, 14vw, 12rem)',
      fontWeight: '900',
      textShadow: '0 0 20px lime'
    });
    document.body.appendChild(victoryMessage);

    const typeNextCharacter = () => {
      displayedText += victoryText[displayedText.length];
      victoryMessage.textContent = displayedText;
      if (displayedText.length < victoryText.length) {
        setTimeout(typeNextCharacter, 250);
      }
    };
    setTimeout(typeNextCharacter, 250);
  }

  function nextLevel() {
  if (currentLevel < Object.keys(levels).length) {
    currentLevel++;
    resetPlayer();

    keys.left = false;
    keys.right = false;
    keys.jump = false;
    keys.reset = false;
    keys.resetLastLevel = false;
    keys.fall = false;
    jumpStrength = 16
    moveSpeed = 4
    player.vx = 0;

    if (difficulty === 'Easy' || difficulty === 'Normal') {
      changeRulesList();
    }
    if (difficulty === 'Easy') {
      changeRulesCurrentLevel();
    }
  }
  nextLevelSound.play();
}

  // --- RENDER ---
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const { flag } = levels[currentLevel];
    const platforms = levels[currentLevel].platforms.filter((platform) => {
      const enemiesRemaining = levels[currentLevel].enemies?.length ?? 0;
      return !(currentLevel === 12 && enemiesRemaining === 0 && platform.x === 1050 && platform.y === 0 && platform.width === 20 && platform.height === 800);
    });

    ctx.fillStyle = '#555';
    for (const p of platforms) ctx.fillRect(p.x, p.y, p.width, p.height);

    const rechargePlatforms = levels[currentLevel].rechargePlatforms || [];
    ctx.fillStyle = 'purple';
    for (const p of rechargePlatforms) ctx.fillRect(p.x, p.y, p.width, p.height);

    // draw a small platform under the flag so it isn't floating
    const displayFlagWidth = Math.round(flag.width * FLAG_SCALE);
    const displayFlagX = flag.x - Math.round((displayFlagWidth - flag.width) / 2);
    ctx.fillStyle = 'darkgray';
    ctx.fillRect(displayFlagX, flag.y-6 + flag.height, displayFlagWidth, 10);
    if (flagImg && flagImg.complete) {
      ctx.drawImage(flagImg, displayFlagX, flag.y, displayFlagWidth, flag.height);
    } else {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(displayFlagX, flag.y, displayFlagWidth, flag.height);
    }

    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';

    ctx.fillText(levelNames[currentLevel], 10, 60);
    const enemies = levels[currentLevel].enemies;
    if (enemies) {
      ctx.fillStyle = 'red';
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      for (const e of enemies) {
        ctx.fillRect(e.x, e.y, e.width, e.height);
        ctx.strokeRect(e.x, e.y, e.width, e.height);
    }
    }
    
   const eggList = levels[currentLevel].eggs;
if (eggList) {
  for (const egg of eggList) {
if (eggImg.complete && eggImg.naturalWidth > 0) {
  ctx.drawImage(eggImg, egg.x, egg.y, egg.width, egg.height);
}  }
}
  }

  function gameLoop() {
    activateRules();
    updatePlayer();
    updateEnemies();
    updateEggs();
    draw();
    updateRuleText();
    updateTitleText();
    requestAnimationFrame(gameLoop);
  }

  resetPlayer();
  gameLoop();