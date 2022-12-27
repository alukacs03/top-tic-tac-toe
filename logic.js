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
                    game.display.refreshDisplay();

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

        let commDisplay = document.createElement('div');
        commDisplay.id="communicationdisplay";
        let nextMoveDisplay = document.createElement('span');
        nextMoveDisplay.id="name";

        const main = document.querySelector('main');
        main.prepend(commDisplay);
        commDisplay.appendChild(nextMoveDisplay);
        nextMoveDisplay.textContent = currPlayer.sign

        let refreshDisplay = () => {
            commDisplay.textContent = `Next move: ${currPlayer.sign}`
        }

        refreshDisplay();

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
                console.log(`Winner: ${this.currPlayer.sign}`);
                display.commDisplay.textContent = `Winner: ${this.currPlayer.sign}`
                this.alreadyWon = true;
            }
        });
        if (game.alreadyWon == false && checkIfFull()) { // if there hasn't been a winner yet, check whether the grid is full
            display.commDisplay.textContent = `The game is a TIE`
        }
    }

    function nextPlayer() { //switches to the next player
        if (this.currPlayer === playerOne){
            this.currPlayer = playerTwo;
        } else {
            this.currPlayer = playerOne;
        }
        display.refreshDisplay();
    }

    function checkIfFull() { // checks if the grid is full (meaning there has been a tie if true, otherwise a winner would have been selected)
        valueArray = [];
        board.fields.forEach(e => valueArray.push(e.textContent))
        return (valueArray.includes('')) ? false : true;
    }

    return { currPlayer, nextPlayer, checkWinner, resetInitPlayer, alreadyWon, display }
})();