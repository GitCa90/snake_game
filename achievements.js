//type, target, value
//prettier-ignore
export const stars = {
    normal: [
        { requiredPoints: 2, unlocked: false, description: `Unlocks Carrot`, effect: ["unlockFood,carrot"]},
        { requiredPoints: 5, unlocked: false, description: `Unlocks Perks`, effect: ["unlockPerk"]},
        { requiredPoints: 12, unlocked: false, description: `Unlocks Hard Mode`, effect: ["unlockMode,hard"]},
        { requiredPoints: 12, unlocked: false, description: `Adds 2 seconds to Carrot spawns`, effect: ["addSpawnTime,carrot,2000"]},
        { requiredPoints: 150, unlocked: false, description: `...` },
    ],
    hard: [
        { requiredPoints: 5, unlocked: false, description: `Unlocks Banana`, effect: ["unlockFood,banana"] },
        { requiredPoints: 8, unlocked: false, description: `increase banana chance`, effect: ["spawnChance,banana,20"]},
        { requiredPoints: 12, unlocked: false, description: `Unlocks Expert Mode`, effect: ["unlockMode,expert"] },
        { requiredPoints: 15, unlocked: false, description: `...` },
        { requiredPoints: 18, unlocked: false, description: `...` },
    ],
    expert: [
        { requiredPoints: 200, unlocked: false, description: `Unlocks Apricot`, effect: ["unlockFood,apricot"]},
        { requiredPoints: 22, unlocked: false, description: `...` },
        { requiredPoints: 20, unlocked: false, description: `Unlocks Master Mode`, effect: ["unlockMode,master"] },
        { requiredPoints: 150, unlocked: false, description: `Increases spawn chance of Apricot by 10%`, effect: ["spawnChance,apricot,10"]},
        { requiredPoints: 150, unlocked: false, description: `...` },
    ],
    master: [
        { requiredPoints: 100, unlocked: false, description: `Unlocks Watermelon`, effect: ["unlockFood,watermelon"]},
        { requiredPoints: 150, unlocked: false, description: `...` },
        { requiredPoints: 30, unlocked: false, description: `Unlocks Inferno Mode`, effect: ["unlockMode,inferno"] },
        { requiredPoints: 150, unlocked: false, description: `....` },
        { requiredPoints: 150, unlocked: false, description: `...` },
    ],
    inferno: [
        { requiredPoints: 100, unlocked: false, description: `Unlocks Avocado`, effect: ["unlockFood,avocado"]},
        { requiredPoints: 150, unlocked: false, description: `...` },
        { requiredPoints: 250, unlocked: false, description: `Removes wall collision` },
        { requiredPoints: 150, unlocked: false, description: `Adds 5 seconds to Avocado spawns` },
        { requiredPoints: 150, unlocked: false, description: `You win the game` },
    ],
};

//prettier-ignore
export const perks = {
    apple: [
        { level: 1, collectRequired: 2, reward: 2, unlocked: false },
        { level: 2, collectRequired: 5, reward: 4, unlocked: false },
        { level: 3, collectRequired: 8, reward: 6, unlocked: false },
        { level: 4, collectRequired: 10, reward: 8, unlocked: false },
        { level: 5, collectRequired: 12, reward: 10, unlocked: false },
    ],
    carrot: [
        { level: 1, collectRequired: 50, reward: 2, unlocked: false },
        { level: 2, collectRequired: 720, reward: 4, unlocked: false },
        { level: 3, collectRequired: 140, reward: 6, unlocked: false },
        { level: 4, collectRequired: 150, reward: 8, unlocked: false },
        { level: 5, collectRequired: 360, reward: 10, unlocked: false },
    ],
    banana: [
        { level: 1, collectRequired: 50, reward: 2, unlocked: false },
        { level: 2, collectRequired: 720, reward: 4, unlocked: false },
        { level: 3, collectRequired: 140, reward: 6, unlocked: false },
        { level: 4, collectRequired: 150, reward: 8, unlocked: false },
        { level: 5, collectRequired: 360, reward: 10, unlocked: false },
    ],
    apricot: [
        { level: 1, collectRequired: 10, reward: 2, unlocked: false },
        { level: 2, collectRequired: 20, reward: 4, unlocked: false },
        { level: 3, collectRequired: 40, reward: 6, unlocked: false },
        { level: 4, collectRequired: 50, reward: 8, unlocked: false },
        { level: 5, collectRequired: 60, reward: 10, unlocked: false },
    ],
    watermelon: [
        { level: 1, collectRequired: 10, reward: 2, unlocked: false },
        { level: 2, collectRequired: 20, reward: 4, unlocked: false },
        { level: 3, collectRequired: 40, reward: 6, unlocked: false },
        { level: 4, collectRequired: 50, reward: 8, unlocked: false },
        { level: 5, collectRequired: 60, reward: 10, unlocked: false },
    ],
    avocado: [
        { level: 1, collectRequired: 10, reward: 2, unlocked: false },
        { level: 2, collectRequired: 20, reward: 4, unlocked: false },
        { level: 3, collectRequired: 40, reward: 6, unlocked: false },
        { level: 4, collectRequired: 50, reward: 8, unlocked: false },
        { level: 5, collectRequired: 60, reward: 10, unlocked: false },
    ],
};
