const fs = require('fs');
const path = require('path');
const { transform } = require('camaro');

const baseDir = './node_modules/AATool/AATool/assets/game_versions/1.16.2+/advancements';
const files = fs.readdirSync(baseDir);

const groupTemplate = [
    'group', {
        name: '@name',
        advancements: ['advancement', {
            id: '@id',
            name: '@name',
            icon: '@icon',
            criteria: ['criteria', {
                goal: '@goal',
                criterion: ['criterion', {
                    id: '@id',
                    name: '@name',
                    icon: '@icon',
                }],
            }],
        }],
    },
];

async function getAdvancements() {
    const advancementsByGroup = {};
    for (file of files) {
        const filePath = path.join(baseDir, file);
        const xml = fs.readFileSync(filePath).toString();
        const groups = await transform(xml, groupTemplate);
        for (group of groups) {
            advancementsByGroup[group.name] = group.advancements;
        }
    }
    return advancementsByGroup;
}

async function writeAdvancements() {
    const advancements = await getAdvancements();
    fs.writeFileSync('./src/advancement-definitions.json', JSON.stringify(advancements, undefined, 2));
}

writeAdvancements();
