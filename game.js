const storytextElement = document.getElementById('prompt') 
const choiceButtonsElement = document.getElementById('choice-buttons')

storytextElement.classList.add("textColor")

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

const promptNodes = [
    {
        id: 1,
        text: "This is just a placeholder. Choose an action.",
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
                nextText: 3
            },
            {
                text: "Fake being asleep",
                nextText: 4
            }
        ]
    },
    {
        id: 4,
        text: "Placeholder but I still don't know how you'd think that would work. You see the glint of a knife in the doorway.",
        choices: [
            {
                text: "Restart, loser.", 
                nextText: -1
            }
        ]
    }
]

startGame()