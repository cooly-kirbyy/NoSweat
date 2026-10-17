/*variables*/
const storytextElement = document.getElementById('prompt') 
const choiceButtonsElement = document.getElementById('choice-buttons')
const linkElement = document.getElementById('gamelink')
const inputName = document.getElementById('input_name')
const loadingElement = document.getElementById('loading-screen')

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

    }, 20000)
}

/*making sure storytext element is only used on gamehtml to not show error*/
if (storytextElement) {
    storytextElement.classList.add("textColor")
}

let playerState = {}
const backPackElement = document.getElementById('bp-content')

function startGame() {
    playerState = {}
    updateBackPack()
    showPromptNode(1)
}

/*backpack system */

function updateBackPack () {
    const items = Object.keys(playerState).filter(
        item => playerState[item] === true
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
    return choice.requiredState == null || choice.requiredState(playerState)
}

function selectChoice(choice) {  /*restart*/
    const nextpromptNodeId = choice.nextText
    if (nextpromptNodeId <= 0) {
        return startGame()
    } /*could be inccorect, changing playerstate */
    playerState = Object.assign(playerState, choice.setplayerState) 
    showPromptNode(nextpromptNodeId)
}

/*establishing playername variable for game.html */
const playerName = sessionStorage.getItem('playername') || 'Survivor'
console.log(`Player Name: ${playerName}`)

/* text prompt paths */
const promptNodes = [
    {
        id: 1,
        text: `This is just a placeholder. Choose an action, ${playerName}.`, /*backticks were used */
        choices: [
            {
                text: "Yell for help. Surely, someone has to be here.",
                nextText: 2
            },
            {
                text: "Reach in your pocket",
                setplayerState: { knife: true},
                nextText: 2
            }
        ]
    },
    {
        id: 2,
        text: "Welcome to the second prompt! Just a placeholder.",
        choices: [
            {
                text: "Cut the rope around wrist",
                requiredState: (currentPlayerState) => currentPlayerState.knife,
                setplayerState: {freehand: true},
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
        text: "Still a placeholder. Thank you for being patient",
        choices: [
            {
                text: "Try and cut the rope from the rest of your body",
                requiredState: (currentPlayerState) => currentPlayerState.knife,
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
                requiredState: (currentPlayerState) => currentPlayerState.freehand,
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