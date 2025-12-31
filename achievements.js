//type, target, value
//prettier-ignore
export const stars = {
    normal: [
        { requiredPoints: 20, unlocked: false, description: `Unlocks Perks`, effect: ["unlockPerk"]},
        { requiredPoints: 40, unlocked: false, description: `Unlocks Carrot`, effect: ["unlockFood,carrot"]},
        { requiredPoints: 100, unlocked: false, description: `Unlocks Hard Mode`, effect: ["unlockMode,hard"]},
        { requiredPoints: 150, unlocked: false, description: `Adds 2 seconds to Carrot spawns`, effect: ["addSpawnTime,carrot,2000"]},
        { requiredPoints: 200, unlocked: false, description: `...` }, //UNLOCK FRUIT SPAWN CHANCE STATS
    ],
    hard: [
        { requiredPoints: 120, unlocked: false, description: `Unlocks Banana`, effect: ["unlockFood,banana"] },
        { requiredPoints: 200, unlocked: false, description: `Increases chance of Banana spawn by 20%`, effect: ["spawnChance,banana,20"]},
        { requiredPoints: 300, unlocked: false, description: `Unlocks Expert Mode`, effect: ["unlockMode,expert"] },
        { requiredPoints: 350, unlocked: false, description: `...` },
        { requiredPoints: 400, unlocked: false, description: `Adds 4 seconds to Banana spawns`, effect: ["addSpawnTime,banana,4000"] },
    ],
    expert: [
        { requiredPoints: 20, unlocked: false, description: `Unlocks Apricot`, effect: ["unlockFood,apricot"]},
        { requiredPoints: 22, unlocked: false, description: `...` },
        { requiredPoints: 20, unlocked: false, description: `Unlocks Master Mode`, effect: ["unlockMode,master"] },
        { requiredPoints: 20, unlocked: false, description: `Increases spawn chance of Apricot by 10%`, effect: ["spawnChance,apricot,10"]},
        { requiredPoints: 150, unlocked: false, description: `...` },
    ],
    master: [
        { requiredPoints: 20, unlocked: false, description: `Unlocks Watermelon`, effect: ["unlockFood,watermelon"]},
        { requiredPoints: 150, unlocked: false, description: `...` },
        { requiredPoints: 30, unlocked: false, description: `Unlocks Inferno Mode`, effect: ["unlockMode,inferno"] },
        { requiredPoints: 150, unlocked: false, description: `....` },
        { requiredPoints: 150, unlocked: false, description: `...` },
    ],
    inferno: [
        { requiredPoints: 20, unlocked: false, description: `Unlocks Avocado`, effect: ["unlockFood,avocado"]},
        { requiredPoints: 150, unlocked: false, description: `...` },
        { requiredPoints: 250, unlocked: false, description: `Removes wall collision` },
        { requiredPoints: 25, unlocked: false, description: `Adds 10 seconds to Avocado spawns`, effect: ["addSpawnTime,avocado, 10000"]},
        { requiredPoints: 150, unlocked: false, description: `You win the game` },
    ],
};

//prettier-ignore
export const perks = {
    apple: [
        { level: 1, collectRequired: 50, reward: 2, unlocked: false },
        { level: 2, collectRequired: 100, reward: 4, unlocked: false },
        { level: 3, collectRequired: 150, reward: 6, unlocked: false },
        { level: 4, collectRequired: 250, reward: 8, unlocked: false },
        { level: 5, collectRequired: 400, reward: 10, unlocked: false },
    ],
    carrot: [
        { level: 1, collectRequired: 25, reward: 2, unlocked: false },
        { level: 2, collectRequired: 50, reward: 4, unlocked: false },
        { level: 3, collectRequired: 100, reward: 6, unlocked: false },
        { level: 4, collectRequired: 150, reward: 8, unlocked: false },
        { level: 5, collectRequired: 250, reward: 10, unlocked: false },
    ],
    banana: [
        { level: 1, collectRequired: 20, reward: 2, unlocked: false },
        { level: 2, collectRequired: 40, reward: 4, unlocked: false },
        { level: 3, collectRequired: 80, reward: 6, unlocked: false },
        { level: 4, collectRequired: 140, reward: 8, unlocked: false },
        { level: 5, collectRequired: 200, reward: 10, unlocked: false },
    ],
    apricot: [
        { level: 1, collectRequired: 10, reward: 2, unlocked: false },
        { level: 2, collectRequired: 20, reward: 4, unlocked: false },
        { level: 3, collectRequired: 50, reward: 6, unlocked: false },
        { level: 4, collectRequired: 100, reward: 8, unlocked: false },
        { level: 5, collectRequired: 150, reward: 10, unlocked: false },
    ],
    watermelon: [
        { level: 1, collectRequired: 8, reward: 2, unlocked: false },
        { level: 2, collectRequired: 15, reward: 4, unlocked: false },
        { level: 3, collectRequired: 30, reward: 6, unlocked: false },
        { level: 4, collectRequired: 60, reward: 8, unlocked: false },
        { level: 5, collectRequired: 80, reward: 10, unlocked: false },
    ],
    avocado: [
        { level: 1, collectRequired: 5, reward: 2, unlocked: false },
        { level: 2, collectRequired: 10, reward: 4, unlocked: false },
        { level: 3, collectRequired: 20, reward: 6, unlocked: false },
        { level: 4, collectRequired: 40, reward: 8, unlocked: false },
        { level: 5, collectRequired: 60, reward: 10, unlocked: false },
    ],
};
