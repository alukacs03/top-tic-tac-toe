const createPlayer = (sign) => {
    return { sign }
}

const board = (() => {
    let fields = [];

    const load = () => {
        const mainGridDiv = document.querySelector('.maingrid');


        for (let i = 0; i < 9; i++) {
            let newSquare = document.createElement('div');
            newSquare.className = 'gridelement';
            newSquare.id= i;
            newSquare.addEventListener('click', () => {
                if (game.alreadyWon) {
                    return false;
                } else {
                    if (fields[i].textContent == ""){
                        fields[i].textContent = game.currPlayer.sign;
                    }
                    game.checkWinner();
                    game.nextPlayer();
                    if (game.alreadyWon === false) {
                        if (game.alreadyWon == false && game.checkIfFull()) {
                            display.commDisplay.textContent = `The game is a TIE`
                        } else {
                            game.display.refreshDisplay();
                        }
                    }
                }
            })
            mainGridDiv.appendChild(newSquare);
            fields.push(newSquare);
        }
    }

    const reload = () => {
        let boardElements = document.querySelectorAll('.gridelement');
        boardElements.forEach(e => e.remove());
        fields.length = 0;
        game.resetInitPlayer();
        game.alreadyWon = false;
        load();
        game.display.refreshDisplay();
    }

    const reloadButton = document.querySelector('#reload');
    reloadButton.addEventListener('click', reload);
    load();
    return { fields, reload }
})();

const game = (() => {

    // initial load setup (X starts the game)
    const playerOne = createPlayer('X');
    const playerTwo = createPlayer('O');
    var alreadyWon = false;
    var currPlayer = playerOne;
    let valueArray = [];

    const display = (() => {

        const commDisplay = document.createElement('div');
        commDisplay.id="communicationdisplay";
        commDisplay.classList.add('spinner')
        commDisplay.classList.add('spinnable')

        const main = document.querySelector('main');
        main.prepend(commDisplay);

        let refreshDisplay = () => {
            commDisplay.textContent = `Next move: ${game.currPlayer.sign}`;
        }

        return { commDisplay, refreshDisplay }
    })();

    const validWinSituations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]

    // functions
    function resetInitPlayer() { //resets the first player (when pressing the restart button for example)
        this.currPlayer = playerOne;
    }

    function checkWinner(){ // checks whether there is a winner, and if there is, then declares it
        validWinSituations.forEach( (e) => {
            if (board.fields[e[0]].textContent === this.currPlayer.sign && board.fields[e[1]].textContent === this.currPlayer.sign && board.fields[e[2]].textContent === this.currPlayer.sign) {
                display.refreshDisplay();
                console.log(`Winner: ${this.currPlayer.sign}`);
                display.commDisplay.textContent = `Winner: ${this.currPlayer.sign}`
                this.alreadyWon = true;
            }
        });
        if (game.alreadyWon == false && checkIfFull()) { // if there hasn't been a winner yet, check whether the grid is full
            display.commDisplay.textContent = `The game is a TIE`
            console.log('TIEEEE')
        }
    }

    function nextPlayer() { //switches to the next player
        if (this.currPlayer === playerOne){
            this.currPlayer = playerTwo;
        } else {
            this.currPlayer = playerOne;
        }
    }

    function checkIfFull() { // checks if the grid is full (meaning there has been a tie if true, otherwise a winner would have been selected)
        valueArray = [];
        board.fields.forEach(e => valueArray.push(e.textContent))
        return (valueArray.includes('')) ? false : true;
    }

    return { currPlayer, nextPlayer, checkWinner, resetInitPlayer, alreadyWon, display, checkIfFull }
})();

game.display.refreshDisplay(); // draws the initial 'Next move' display

const spinBtn = document.querySelector('#spinBtn');
spinBtn.addEventListener('click', switchSpinning);

function switchSpinning() { // switch the spinner functionality
    let spinnableElements = document.querySelectorAll('.spinnable')
    let spinnyBoys = document.getElementsByClassName('spinner');
    if (spinnyBoys.length > 0) {
        Array.from(spinnyBoys).forEach(e => e.classList.remove('spinner'));
        spinBtn.textContent = "LET 'EM SPIN AGAIN";
    }
    else {
        spinnableElements.forEach(e => e.classList.add('spinner'));
        spinBtn.textContent = "STOP SPINNING";
    }
}

const audio = document.querySelector('audio'); // set the audioplayer to a lower volume by default
audio.volume = 0.2