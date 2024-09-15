//constants-------------------------------------------------------------------
let quote;
let tempName = 1;
let clientId = null;
let clientColor = '';
let gameId = null;
let admin = false;
let playerColor = null;
let completed = false;


//connecting with websocket server--------------------------------------------
// let ws = new WebSocket("http://localhost:3000/");
let ws = new WebSocket("https://websocket-multiplayer-typing-game.onrender.com");

//getting some pre-existing elements from html-------------------------------- 
const divGamePlay = document.getElementById("divGamePlay");
const btnPlayerName = document.getElementById('btnName');
const player = document.getElementById('nameInput');
const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
const txtGameId = document.getElementById("txtGameId");
const mainContainer = document.getElementById("mainContainer");
const creating = document.getElementById('creating');
const invalid = document.getElementById('invalid');
const result = document.getElementById('result');

//until websocket is not connected, a message must be shown
const connectionState = document.createElement('div');
const connectionStateBg = document.createElement('div');
connectionState.classList.add('connectionState');
connectionStateBg.classList.add('connectionStatebg');
connectionState.textContent = 'connecting with the server, please wait...';
creating.appendChild(connectionStateBg)
connectionStateBg.appendChild(connectionState)


//event listeners---------------------------------------------------------------
// Listen for messages
ws.addEventListener('message', (event) => {
    while (creating.firstChild)
        creating.removeChild(creating.firstChild)
});

// Handle WebSocket errors
ws.addEventListener('error', () => {
    prompt("Something went wrong while connecting with the server, please refresh the page")
});

//for button "i'm in" while everything else remain disabled
btnPlayerName.addEventListener('click', e => {
    const c1 = document.querySelector('#btnCreate')
    const c2 = document.querySelector('#btnJoin')
    const c3 = document.querySelector('#txtGameId')

    c1.disabled = false
    c2.disabled = false 
    c3.disabled = false 
})

//for button "join game"
btnJoin.addEventListener("click", e => {
    if (gameId === null) {
        gameId = txtGameId.value;
    }
    let clientName;
    if (player.value == null) {
        clientName = `Player ${tempName} :`
        tempName += 1
    } else {
        clientName = player.value
    }
    // console.log(clientName)
    const playerNameInfo = document.querySelector('.playerName') 

    const payload = {
        "method": "join",
        "playerName": clientName,
        "clientId": clientId,
        "gameId": gameId
    }

    //message to server to enter the player into the game    
    ws.send(JSON.stringify(payload));

    //removing all buttons from the game screen for other elements to render
    if (playerNameInfo.hasChildNodes()) {
        playerNameInfo.replaceChildren();
    }
})

//for starting new game
btnCreate.addEventListener("click", createNewGame)

//single function to create new game
function createNewGame() {
    let adminName;
    admin = true;
    
    if (player.value == null) {
        adminName = `Player ${tempName} :`
        tempName += 1
    } else {
        adminName = player.value
    }

    const payload = {
        "method": "create",
        "adminName": adminName,
        "clientId": clientId,
        "admin": true
    }
    // console.log(payload.clientId)
    // console.log(payload.adminName)    

    //message to server to start new game and make a new game id
    ws.send(JSON.stringify(payload));

    const creatingGame = document.createElement('div')
    creatingGame.id = 'creatingGame'
    creating.appendChild(creatingGame)

    const playerNameInfo = document.querySelector('.playerName') 

    //removing all buttons from the game screen for other elements to render
    while (invalid.firstChild)
        invalid.removeChild(invalid.firstChild)
    
    if (playerNameInfo.hasChildNodes()) {
        playerNameInfo.replaceChildren();
    }
}    

//websocket(server) messages-----------------------------------------------------
ws.onmessage = message => {
    const response = JSON.parse(message.data);

    //connectd to server and got the client Id
    if (response.method === "connect") {
        clientId = response.clientId;
        // console.log("clientId sent" + clientId)
    }

    //join flag to render the next page where players will join now
    if (response.method === "join") {
        gameId = response.game.id
        quote = response.game.displayText
        const game = response.game
        clientColor = response.game.clients.color
        const gameElement = document.querySelector('.gameElement')
        const divPlayers = document.querySelector('#divPlayers')
        let g = document.querySelector('.game')

        //removing the loading effect
        while (creating.firstChild)
            creating.removeChild(creating.firstChild)

        //removing all children of main section where player interacts
        if (gameElement.hasChildNodes()) {
            gameElement.replaceChildren();
        }

        while (divPlayers.firstChild)
            divPlayers.removeChild(divPlayers.firstChild)

        //removing the results in case of rematch
        if (result.hasChildNodes()) {
            result.replaceChildren();
        }

        //Game ID, creating new elements
        const publicGameIdDiv = document.createElement("div")
        const publicGameId = document.createElement("div")
        publicGameIdDiv.id = 'publicGameIdContainer'
        publicGameId.id = 'publicGameId'
        publicGameId.textContent = `Game ID: ${gameId}`

        //appending to existing elements(parents)
        gameElement.appendChild(publicGameIdDiv)
        publicGameIdDiv.appendChild(publicGameId)
        
        while (mainContainer.firstChild)
            mainContainer.removeChild(mainContainer.firstChild)

        //creating new elements
        const container = document.createElement("div")
        const typingSection = document.createElement("div")
        const quoteDisplayElement = document.createElement("div")
        const quoteInputElement = document.createElement("textarea")

        //adding classes
        container.classList.add('container')
        typingSection.classList.add('typingSection')
        quoteDisplayElement.classList.add('quote-display')
        quoteInputElement.classList.add('quote-input')

        //styliing
        container.style.width = "800px";
        quoteDisplayElement.style.width = "75%";

        //textarea
        quoteInputElement.type = "text";
        quoteInputElement.placeholder = "Enter text here";
        quoteInputElement.name = "dynamicInput";
        quoteInputElement.id = "dynamicInput";
        quoteInputElement.disabled = true;

        const timer = document.createElement('div')
        const timerElement = document.createElement("div")
        timer.classList.add('timer')
        timerElement.classList.add('timerValue')

        timer.appendChild(timerElement);

        //main container
        mainContainer.appendChild(container);
        container.appendChild(typingSection);
        typingSection.appendChild(timer);
        typingSection.appendChild(quoteDisplayElement);
        typingSection.appendChild(quoteInputElement);

        //creating start button only for admin
        const btnStart = document.createElement('button')
        if (response.admin) {
            btnStart.classList.add('btnStart')
            btnStart.textContent = 'Start'
            container.append(btnStart)
        }
        
        //event listener for start button 
        btnStart.addEventListener("click", (e) => {
            const payload = {
                "method": "start",
                "clientId": clientId,
                "gameId": gameId
            }

            //message to server to start game for all players
            ws.send(JSON.stringify(payload));

            //removing the start button
            while (container.contains(btnStart))
                container.removeChild(btnStart)


        })

        //dynamic height calculation for Dexterities box
        const leaderboardHeight = game.clients.length * 54 + 35
        
        //leaderboard(creating, styling, adding to parent)
        const leaderboard = document.createElement('div')
        const leaderboardHeading = document.createElement('div')
        leaderboard.classList.add('leaderboard')
        leaderboardHeading.classList.add('leaderboardHeading')
        leaderboardHeading.classList.add('leaderboardHeading')
        leaderboard.style.height = `${leaderboardHeight}px`
        leaderboardHeading.textContent = 'Dexterities'
        leaderboard.appendChild(leaderboardHeading)

        //creating progress-bar for all players
        game.clients.forEach(c => {
            const playerDiv = document.createElement("div")
            const playerIdentity = document.createElement("h3")
            const playerProgress = document.createElement("div")
            const percentage = document.createElement("div")
            const fill = document.createElement("div")

            playerDiv.classList.add('playerDiv')
            playerIdentity.classList.add('identity')
            playerProgress.classList.add('progress-bar')

            playerDiv.style.backgroundColor = c.color
            playerIdentity.textContent = `${c.playerName} :`;
            // console.log(playerName)

            percentage.id=`${c.color}***${c.clientId}`
            percentage.classList.add('progress-bar-value')
            percentage.textContent = 0
            fill.classList.add('progress-bar-fill')
            fill.id = `${c.color}${c.clientId}`

            mainContainer.appendChild(leaderboard)
            leaderboard.appendChild(playerDiv)
            playerDiv.appendChild(playerIdentity)
            playerDiv.appendChild(playerProgress)
            playerProgress.appendChild(percentage)
            playerProgress.appendChild(fill)

            if (c.clientId === clientId)
                playerColor = c.color;
        })


        //event listner to send the typing progress to server
        quoteInputElement.addEventListener('input', () => {
            const arrayQuote = quoteDisplayElement.querySelectorAll('span')
            const arrayInput = quoteInputElement.value.split('')
            const quoteLength = quote.length
            const arrayInputLength = arrayInput.length
            const textProgress = ((1 - (quoteLength - arrayInput.length) / quoteLength) * 100).toFixed(1)
            
            // checking the accurecy of typed words
            let correct = true
            let correctCount = 0
            arrayQuote.forEach((characterSpan, index) => {
                const character = arrayInput[index]
                if (character == null) {
                    characterSpan.classList.remove('incorrect')
                    characterSpan.classList.remove('correct')
                    correct = false
                } else if (character === characterSpan.innerText) {
                    characterSpan.classList.add('correct')
                    characterSpan.classList.remove('incorrect')
                    correctCount += 1
                } else {
                    characterSpan.classList.remove('correct')
                    characterSpan.classList.add('incorrect')
                    correct = false
                    correctCount -= 1
                }
            })
            if (correct) generateQuote()

            const payload = {
                "method": "progress",
                "clientId": clientId,
                "gameId": gameId,
                "progress": textProgress
            }

            // message to server about typing progress
            ws.send(JSON.stringify(payload));

            //checking whether player has completed typing or not
            if (arrayInputLength === quoteLength) {

                //completed is a global variable with default value false. As soon as all the words have
                //got typed (arrayInputLength === quoteLength), it gets true and the timer recieves this 
                //true message and instantly put to stop.
                completed = true

                const quoteInputElement = document.getElementById('dynamicInput')
                quoteInputElement.disabled = true

                const payload = {
                    "method": "progress completed",
                    "clientId": clientId,
                    "gameId": gameId,
                    "accuracy": correctCount,
                    "duration": timerElement.textContent
                }

                //message to server about completion and accuracy and duration report 
                ws.send(JSON.stringify(payload));
            }
        })


        // generate display text
        async function generateQuote() {
            quote = response.game.displayText
            quoteDisplayElement.innerHTML = ''

            //spliting each word into separate span to check for accuracy 
            quote.split('').forEach(character => {
                const characterSpan = document.createElement('span')
                characterSpan.classList.add('quote-character')
                characterSpan.innerText = character
                quoteDisplayElement.appendChild(characterSpan)
            })
            quoteInputElement.value = null
        }
        generateQuote()
    }

    //start flag from server to begin the countdown
    if (response.method === "start") {
        const timerElement = document.querySelector('.timerValue')
        const countDown = document.createElement('div')
        const countDownBg = document.createElement('div')
        mainContainer.appendChild(countDown)
        mainContainer.appendChild(countDownBg)
        const quoteInputElement = document.getElementById('dynamicInput')
        
        let startTime = new Date()
        let duration
        let animationToggle = true;

        //countdown(we use two classes to show the countdown running 
        //and to do that these two classes are keep getting added and removed in sync 
        //with the countdown to show the growing effect which is not possible with a single class)
        function countdown() {
            duration = 5
            countDown.classList.add('animate2');
            countDown.innerText = duration
            countDownBg.classList.add('countDownBg')
            let timeInterval = setInterval(() => {

                if (animationToggle) {
                    countDown.classList.remove('animate2');
                    countDown.classList.add('animate1');
                    animationToggle = !animationToggle;
                } else {
                    countDown.classList.remove('animate1');
                    countDown.classList.add('animate2');
                    animationToggle = !animationToggle;
                }

                const timeLeft = getLeftTime()
                countDown.innerText = timeLeft
                countDown.classList.remove('countDown')
                if (timeLeft === 0) {
                    countDown.innerText = "All the best"
                }
                if (timeLeft < 0) {
                    clearInterval(timeInterval);
                    countDownBg.classList.remove('countDownBg')
                    setTimeout(() => {
                        mainContainer.removeChild(countDown)
                        quoteInputElement.disabled = false
                        quoteInputElement.focus()
                        timerElement.innerText = 0
                        startTime = new Date()
                        let mainClock = setInterval(() => {
                            timerElement.innerText = Math.floor((new Date() - startTime) / 100)
                            if (completed == true) {    // completed is that global variable which as
                                completed = false       //soon as sets to true clears the interval and stops the clock
                                clearInterval(mainClock)
                            }
                        }, 100)
                    })
                }
            }, 1000)
        }
        function getLeftTime() {
            elapsedTime = Math.floor((new Date() - startTime) / 1000)
            return duration - elapsedTime
        }
        countdown()
    }

    //invalid entry flag message from server when someone tries to enter into an already started game
    if (response.method === "invalid entry") {
        const invalidEntryElement = document.createElement('div')
        invalidEntryElement.classList.add('invalid-entry')
        invalidEntryElement.style.padding = '20px'
        invalidEntryElement.style.backgroundColor = 'red'
        invalidEntryElement.textContent = "Sorry buddy, game has already started"
        invalid.appendChild(invalidEntryElement)

        const newGame = document.createElement('button')
        newGame.classList.add('invalid-entry')
        newGame.textContent = "start a new game"
        invalid.appendChild(newGame)
        newGame.addEventListener('click', createNewGame)
    }

    //real-time progress bar values of all players sent from server 
    if (response.method === "progress") {
        response.game.clients.forEach(c => {

            //It's very crucial to note here that both progress-bar-fill and progress-bar-value elements must be accessed
            //using a unique id and not class other-wise all changes will reflect on only one child
            const progressBar = document.getElementById(`${c.color}${clientId}`)
            const percentage = document.getElementById(`${c.color}***${clientId}`)

            progressBar.style.width = `${c.progress}%`
            percentage.textContent = `${c.progress}%`
        })
    }

    //result flag from server to show result of players who have completed typing
    if (response.method === "result") {
        let count = 0;
        // let maxScore = -10000  ---in Beta phase
        const totalPlayers = response.game.clients.length;
        
        if (result.hasChildNodes()) {
            result.replaceChildren();
        }

        const resultHeading = document.createElement('h2')
        resultHeading.style.color = 'white'
        resultHeading.textContent = 'Individual Score'
        result.appendChild(resultHeading)

        response.game.clients.forEach(c => {
            if (c.score !== 0) {
                // if (maxScore < c.score ){
                //     maxScore = c.score
                // }   --in Beta phase
                const playerScore = document.createElement('div')
                playerScore.style.padding = "10px"
                playerScore.style.backgroundColor = c.color
                playerScore.textContent = `${c.playerName} scored ${c.score}`
                result.appendChild(playerScore)
                count += 1
            }

            //only for admin to restart the game. button appears when all have completed
            if (count === totalPlayers && admin){
                const container = document.querySelector('.container')
                const btnPlayAgain = document.createElement('button')
                btnPlayAgain.classList.add('playAgain')
                btnPlayAgain.textContent = "Play Again"
                container.appendChild(btnPlayAgain)   

                //event listner for replaying the game
                btnPlayAgain.addEventListener("click", () => {
                    if (mainContainer.hasChildNodes()) {
                        mainContainer.replaceChildren();
                    }
            
                    // loader element
                    const creatingGame = document.createElement('div')
                    creatingGame.id = 'creatingGame'
                    creating.appendChild(creatingGame)
                    
                    const payload = {
                        "method": "join",
                        "clientId": clientId,
                        "gameId": gameId,
                        "adminStatus": admin,
                        "playAgain": true
                    } 

                    ws.send(JSON.stringify(payload));
                })
            }
        })
    }
}



