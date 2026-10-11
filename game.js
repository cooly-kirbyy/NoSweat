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

        }
    })
}

function showChoice(choice) {
    return true
}

function selectChoice(choice) {

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
        id: 2
    }
]

startGame()