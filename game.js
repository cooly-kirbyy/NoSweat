const storytextElement = document.getElementById('prompt') 
const choiceButtonsElement = document.getElementById('choice-buttons')
const linkElement = document.getElementById('gamelink')
const inputName = document.getElementById('input_name')

if (linkElement && inputName) {
    linkElement.addEventListener('click', function() {
        const playerName = inputName.value.trim()
        sessionStorage.setItem('playername', playerName)
        console.log(playerName)

    })
}

if (storytextElement) {
    storytextElement.classList.add("textColor")
}

let playerState = {}

function startGame() {
    playerState = {}
    showPromptNode(1)
}

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
}

function showChoice(choice) {
    return choice.requiredState == null || choice.requiredState(playerState)
}

function selectChoice(choice) {
    const nextpromptNodeId = choice.nextText
    if (nextpromptNodeId <= 0) {
        return startGame()
    }
    playerState = Object.assign(playerState, choice.setplayerState)
    showPromptNode(nextpromptNodeId)
}

const playerName = sessionStorage.getItem('playername') || 'Survivor'
console.log(playerName)

const promptNodes = [
    {
        id: 1,
        text: `This is just a placeholder. Choose an action, ${playerName}.`,
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