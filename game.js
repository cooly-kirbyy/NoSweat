/*gamevariables*/
const storytextElement = document.getElementById('prompt') 
const choiceButtonsElement = document.getElementById('choice-buttons')
const backGroundElement = document.getElementById('game-bg')
const backPackElement = document.getElementById('bp-content')
const hitPoints = document.querySelectorAll('.hearticon')
const maxPlayerHealth = hitPoints.length
const tempHeal = document.getElementById('heal-testing')

/*hp variables essentially, not main game */
const linkElement = document.getElementById('gamelink')
const inputName = document.getElementById('input_name')
const loadingElement = document.getElementById('loading-screen')
const skipElement = document.getElementById('skip-btn')



/*homepage name input*/
if (linkElement && inputName) {
    linkElement.addEventListener('click', function() {
        const playerName = inputName.value.trim()
        sessionStorage.setItem('playername', playerName)
        console.log(playerName)
    })
}




/*loading screen */

/*reset the loading screen in console if needed using 
 sessionStorage.removeItem('loaderSeen');
location.reload();
 */
let loaderSeen = sessionStorage.getItem('loaderSeen') === 'true'
console.log(`Loading seen: ${loaderSeen}`)


if (sessionStorage.getItem('loaderSeen') === 'true') {
    loadingElement.style.display = 'none'
} else {
    setTimeout(() => {

        if (loadingElement) {
            loadingElement.classList.add('fade-out')
        };

        sessionStorage.setItem('loaderSeen', 'true')

        loaderSeen = true
        console.log(`Loading seen: ${loaderSeen}`)

    }, 19000)
} 

skipElement.addEventListener('click', function () {
    loadingElement.classList.add('fade-out')
    sessionStorage.setItem('loaderSeen', 'true')
})

if (storytextElement) { /*making sure storytext element is only used on gamehtml to not show error*/

    storytextElement.classList.add("textColor")
}



/*starting function and statuses */
let playerItems = {}
let currentPlayerHealth = maxPlayerHealth

function startGame() {
    playerItems = {}
    currentPlayerHealth = maxPlayerHealth
    updateBackPack()
    showPromptNode(1)
    updateHeartGraphics()
}



/*backpack system */
function updateBackPack () {
    const items = Object.keys(playerItems).filter(
        item => playerItems[item] === true
    )

    backPackElement.innerText = items.length
    if (items.length > 0) {
        backPackElement.innerText = `${items.join(", ")}`
    } else {
        backPackElement.innerText = "You have nothing here."
    }
}



/*prompt/button node logic */
function showPromptNode(promptNodeIndex) {

    const promptNode = promptNodes.find(promptNode => promptNode.id === promptNodeIndex)
    storytextElement.innerText = promptNode.text
    backGroundElement.src = promptNode.image

    while (choiceButtonsElement.firstChild) {
        choiceButtonsElement.removeChild(choiceButtonsElement.firstChild)
    }

    promptNode.choices.forEach(choice => {
        if (showChoice(choice)) {
            const button = document.createElement('button')
            button.innerText = choice.text
            button.classList.add('btn')
            button.addEventListener('click', () => selectChoice(choice))
            choiceButtonsElement.appendChild(button)
        }
    })

    updateBackPack()
}



/*preventing choices from being shown if do not have required state*/
function showChoice(choice) {
    return choice.requiredState == null || choice.requiredState(playerItems)
}
function selectChoice(choice) {  /*restart*/
    const nextpromptNodeId = choice.nextText
    if (nextpromptNodeId <= 0) {
        return startGame()
    } 
    
    updateHealthCount(choice) /*allowing damage to be set in choices */
    
    /*could be inccorect, changing playerItems */
    playerItems = Object.assign(playerItems, choice.setplayerItems) 
    showPromptNode(nextpromptNodeId)
}



/*health system */
function updateHealthCount(choice) {
    const healthLoss = choice.damage || 0

    if (healthLoss < 0) {
        return
    }
    currentPlayerHealth = (currentPlayerHealth -  healthLoss)
    if (currentPlayerHealth <= 0) {
        return startGame()
    }

    updateHeartGraphics()
    console.log(`Player health: ${currentPlayerHealth}`)
}

function updateHeartGraphics() { /*updating the heart icons */
        hitPoints.forEach((heart, index) => {
            heart.classList.toggle('hit', index >= currentPlayerHealth)
        })
}

tempHeal.addEventListener('click', function healing() { /*adding bandage system*/
    const items = Object.keys(playerItems).filter(
        item => playerItems[item] === true
    )  
    if (items == 'Bandage') {
        currentPlayerHealth = Math.min(currentPlayerHealth + 1, maxPlayerHealth)
        updateHeartGraphics()
        console.log('Heal was clicked')
    }
    if (items == 'Medkit') {
        currentPlayerHealth = Math.min(currentPlayerHealth + 3, maxPlayerHealth)
        updateHeartGraphics()
        console.log('Heal was clicked')
    }
    else {
        return
    }
})



/*establishing playername variable for game.html */
const playerName = sessionStorage.getItem('playername') || 'Survivor'
console.log(`Player Name: ${playerName}`)



/* text prompt paths */
const promptNodes = [
    {
        id: 1,
        image: "assets/backgrounds/game-bg.png",
        text: `You stirred in your sleep, stomach growling. Sleeping on a thin medical cot couldn't be said to be the most comfortable. 
        Groans echoed off of the walls of the hallway outside; the whole building almost seemed to have life. As sleep finally seemed 
        to let you go, you tried sitting up, still disoriented. CLANK! You look down. You're handcuffed to the bars... `, /*backticks were used */
        choices: [
            {
                text: `The room is too dark to see. Reach in your backpack
                for your flashlight and try to scan the room? That'd take time,
                though.`,
                nextText: 2,
                damage: 4,
                setplayerItems: { Medkit: true},
            },
            {
                text: `It'd be noisy but you could just...kick it right?
                Surely, something has to give.`,
                damage: 4,
                setplayerItems: { Bandage: true},
                nextText: 2
            }
        ]
    },
    {
        id: 2,
        image: "assets/backgrounds/node2bg.png",
        text: "Welcome to the second prompt! Just a placeholder.",
        choices: [
            {
                text: "Cut the rope around wrist",
                requiredState: (currentPlayerItems) => currentPlayerItems.Knife,
                setplayerItems: {freehand: true},
                nextText: 3
            },
            {
                text: "Fake being asleep",
                nextText: 4
            }
        ]
    },
    {
        id: 3,
        image: "assets/backgrounds/node3bg.png",
        text: "Still a placeholder. Thank you for being patient",
        choices: [
            {
                text: "Try and cut the rope from the rest of your body",
                requiredState: (currentPlayerItems) => currentPlayerItems.knife,
                nextText: 5
            },
            {
                text: "Pretend to be asleep",
                nextText: 5
            }
        ]
    },
    {
        id: 4,
        text: "Placeholder but I still don't know how you'd think that would work.",
        choices: [
            {
                text: "Restart, loser.", 
                nextText: -1
            }
        ]
    },
    {
        id: 5,
        text: "Placeholder. You feel breath on top of your face",
        choices: [
            {
                text: "Punch with your free hand",
                requiredState: (currentPlayerItems) => currentPlayerItems.freehand,
            },
            {
                text: "Keep eyes closed",
                nextText: 4
            }
        ]
    }
]


if (storytextElement && choiceButtonsElement) {
    startGame()
}