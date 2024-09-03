let quote;
let tempName = 1;
let clientId = null;
// let clientName = '';
let clientColor = '';
let gameId = null;
let playerColor = null;
let completed = false;

// let ws = new WebSocket("100.20.92.101:9090");
// let ws = new WebSocket("wss://typing-master-multiplayer.onrender.com");
let ws = new WebSocket("http://localhost:3000/");
// let ws = new WebSocket("https://websocket-multiplayer-typing-game.onrender.com");

const divGamePlay = document.getElementById("divGamePlay");
// const timer = document.getElementById('timer');
const btnPlayerName = document.getElementById('btnName');
const player = document.getElementById('nameInput');
const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
const txtGameId = document.getElementById("txtGameId");
const mainContainer = document.getElementById("mainContainer");
const creating = document.getElementById('creating');
const invalid = document.getElementById('invalid');
const result = document.getElementById('result');


//event listeners

btnPlayerName.addEventListener('click', e => {
    // let clientName = '';
    // if (player.value == null) {
    //     const clientName = `Player ${tempName} :`
    //     tempName += 1
    // } else {
    //     clientName = player.value
    // }
    // console.log(clientName)
    const c1 = document.querySelector('#btnCreate')
    const c2 = document.querySelector('#btnJoin')
    const c3 = document.querySelector('#txtGameId')

    // c1.style.cursor = 'degault';
    c1.disabled = false
    // c2.style.cursor = 'pointer';
    c2.disabled = false 
    c3.disabled = false 

})

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
    console.log(clientName)

    const payload = {
        "method": "join",
        "playerName": clientName,
        "clientId": clientId,
        "gameId": gameId
    }
    // console.log(payload.clientId)    
    ws.send(JSON.stringify(payload));
})


btnCreate.addEventListener("click", createNewGame)


function createNewGame() {
    let clientName;
    if (player.value == null) {
        clientName = `Player ${tempName} :`
        tempName += 1
    } else {
        clientName = player.value
    }
    const payload = {
        "method": "create",
        "playerName": clientName,
        "clientId": clientId,
        "admin": true
    }
    // console.log(payload.clientId)
    ws.send(JSON.stringify(payload));

    const creatingGame = document.createElement('div')
    creatingGame.id = 'creatingGame'
    creating.appendChild(creatingGame)

    // const name = document.querySelector('.playerName')

    while (invalid.firstChild)
        invalid.removeChild(invalid.firstChild)
    
    // if (name.hasChildNodes()) {
    //     name.replaceChildren();
    // }

}    

//socket
ws.onmessage = message => {
    const response = JSON.parse(message.data);
    // console.log(response + "response")
    //connect
    if (response.method === "connect") {
        clientId = response.clientId;
        console.log("clientId sent" + clientId)
    }

    // //create
    // if (response.method === "create"){
    //     gameId = response.game.id
    //     quote = response.game.displayText
    //     // console.log("game created successfully " + response.game.id )

    //     creating.removeChild(creating.firstChild)

    //     //Game ID
    //     const publicGameId = document.createElement("div")
    //     publicGameId.id = 'publicGameId'

    //     publicGameId.textContent = `Game ID: ${response.game.id} Waiting for others to join`
    //     creating.appendChild(publicGameId)
    // }

    //join
    if (response.method === "join") {
        gameId = response.game.id
        quote = response.game.displayText
        const game = response.game
        clientColor = response.game.clients.color
        const gameElement = document.querySelector('.gameElement')
        // const btnCreate = document.getElementsByClassName('btnCreate')
        const divPlayers = document.querySelector('#divPlayers')
        let g = document.querySelector('.game')

        while (creating.firstChild)
            creating.removeChild(creating.firstChild)

        // while(g){
        //     gameElement.removeChild(g)
        //     console.log(typeof(document.querySelector('.game')))
        // } 
        if (gameElement.hasChildNodes()) {
            gameElement.replaceChildren();
        }
        while (divPlayers.firstChild)
            divPlayers.removeChild(divPlayers.firstChild)

        //Game ID
        const publicGameIdDiv = document.createElement("div")
        const publicGameId = document.createElement("div")
        publicGameIdDiv.id = 'publicGameIdContainer'
        publicGameId.id = 'publicGameId'

        publicGameId.textContent = `Game ID: ${response.game.id} Waiting for others to join`
        gameElement.appendChild(publicGameIdDiv)
        publicGameIdDiv.appendChild(publicGameId)
        // gameElement.style.height = '7vh'

        // const name = document.getElementsByClassName('playerName')

        while (mainContainer.firstChild)
            mainContainer.removeChild(mainContainer.firstChild)

        
        // if (name.hasChildNodes()) {
        //     name.replaceChildren();
        // }

        //defining elements
        const container = document.createElement("div")
        const typingSection = document.createElement("div")
        const quoteDisplayElement = document.createElement("div")
        const quoteInputElement = document.createElement("textarea")

        //adding classes
        container.classList.add('container')
        typingSection.classList.add('typingSection')
        quoteDisplayElement.classList.add('quote-display')
        quoteInputElement.classList.add('quote-input')

        //container
        container.style.width = "800px";

        //quoteDisplay
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
        // gameElement.appendChild(container)
        container.appendChild(typingSection);
        typingSection.appendChild(timer)
        typingSection.appendChild(quoteDisplayElement);
        typingSection.appendChild(quoteInputElement);
        //start button

        // console.log(response.admin + "admin status")

        const btnStart = document.createElement('button')
        if (response.admin) {
            btnStart.classList.add('btnStart')
            btnStart.textContent = 'Start'
            container.append(btnStart)

        }

        btnStart.addEventListener("click", (e) => {
            const payload = {
                "method": "start",
                "clientId": clientId,
                "gameId": gameId
            }
            // console.log(payload.clientId)
            ws.send(JSON.stringify(payload));

            // const container = document.getElementsByClassName('container')
            while (container.contains(btnStart))
                container.removeChild(btnStart)


        })

        const leaderboardHeight = game.clients.length * 50 + 5
        //leaderboard
        const leaderboard = document.createElement('div')
        const leaderboardHeading = document.createElement('div')
        leaderboard.classList.add('leaderboard')
        leaderboardHeading.classList.add('leaderboardHeading')
        leaderboard.style.height = `${leaderboardHeight}px`
        leaderboardHeading.textContent = 'Dexterities'

        game.clients.forEach(c => {
            const playerDiv = document.createElement("div")
            const playerIdentity = document.createElement("h3")
            const playerProgress = document.createElement("div")
            const percentage = document.createElement("div")
            const fill = document.createElement("div")

            playerDiv.classList.add('playerDiv')
            playerIdentity.classList.add('identity')
            playerProgress.classList.add('progress-bar')

            // gameElement.style.height = '60vh';
            playerDiv.style.backgroundColor = c.color
            playerIdentity.textContent = `${c.playerName} :`;
            // console.log(playerName)

            percentage.classList.add('progress-bar-value')
            percentage.textContent = 0
            fill.classList.add('progress-bar-fill')
            fill.id = c.color

            mainContainer.appendChild(leaderboard)
            leaderboard.appendChild(playerDiv)
            playerDiv.appendChild(playerIdentity)
            playerDiv.appendChild(playerProgress)
            playerProgress.appendChild(percentage)
            playerProgress.appendChild(fill)

            if (c.clientId === clientId)
                playerColor = c.color;
        })


        //socket event listner
        quoteInputElement.addEventListener('input', () => {
            const arrayQuote = quoteDisplayElement.querySelectorAll('span')
            const arrayInput = quoteInputElement.value.split('')
            const quoteLength = quote.length
            const arrayInputLength = arrayInput.length
            const textProgress = (1 - (quoteLength - arrayInput.length) / quoteLength) * 100



            // console.log(textProgress)
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
            // console.log(payload.clientId)
            ws.send(JSON.stringify(payload));

            if (arrayInputLength === quoteLength) {
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
                ws.send(JSON.stringify(payload));
                // console.log("success sent")

            }
        })


        // generate display text
        async function generateQuote() {
            // const quote = response.quote
            quote = response.game.displayText
            quoteDisplayElement.innerHTML = ''
            quote.split('').forEach(character => {
                const characterSpan = document.createElement('span')
                characterSpan.classList.add('quote-character')
                characterSpan.innerText = character
                quoteDisplayElement.appendChild(characterSpan)
            })
            quoteInputElement.value = null
            // startTimer()
            // console.log(quote)
        }


        generateQuote()


    }

    //start
    if (response.method === "start") {

        //timer
        // const timer = document.createElement('div')
        // const timerElement = document.createElement("div")
        // timer.classList.add('timer')
        // timerElement.classList.add('timerValue')
        // const typingSection = document.querySelector('typingSection')

        // console.log("added timer1")
        // console.log("added timer2")
        // timer.appendChild(timerElement);
        // if (typingSection.firstChild) {
        //     typingSection.insertBefore(timer, typingSection.firstChild);
        //     console.log("added timer")
        // } else {
        //     typingSection.appendChild(timer); // If there are no children, just append it
        // }


        // const timer = document.getElementsByClassName('timer')
        const timerElement = document.querySelector('.timerValue')
        const countDown = document.createElement('div')
        const countDownBg = document.createElement('div')


        mainContainer.appendChild(countDown)
        mainContainer.appendChild(countDownBg)
        const quoteInputElement = document.getElementById('dynamicInput')
        let startTime = new Date()
        let duration

        let animationToggle = true;

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
                            if (completed == true) {
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

    if (response.method === "invalid entry") {
        // console.log("client recieved invalid entry")
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

    if (response.method === "progress") {
        // const playerProgress = document.getElementById('playerProgress')

        // const clientLength = Object.keys(response.game.clients).length
        response.game.clients.forEach(c => {
            const progressBar = document.getElementById(`${c.color}`)
            const progressValue = document.getElementsByClassName(`progress-bar-value`)
            progressBar.style.width = `${c.progress}%`
            progressValue.textContent = c.progress

        })
    }

    if (response.method === "result") {
        if (result.hasChildNodes()) {
            result.replaceChildren();
        }

        const resultHeading = document.createElement('h2')
        resultHeading.style.color = 'white'
        resultHeading.textContent = 'Individual Score'
        result.appendChild(resultHeading)

        response.game.clients.forEach(c => {
            if (c.score !== 0) {
                // console.log(c.score + "Score")
                const playerScore = document.createElement('div')
                playerScore.style.padding = "10px"
                playerScore.style.backgroundColor = c.color
                playerScore.textContent = `${c.playerName} scored ${c.score}`

                result.appendChild(playerScore)
            }
        })
    }

}



