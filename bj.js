const blackjack = {
    cards: [],
    nominals: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
    colors: ['clubs', 'hearts', 'spades', 'diamonds'],
    cardsCodes: {'clubs' : '&clubs;', 'hearts' : ' &hearts;', 'diamonds' : '&diams;', 'spades' : '&spades;'},
    in_game: [],
    player: [],
    casino: [],
    playerScore: 0,
    casinoScore: 0,
    gameActive: false,
    doItakeCard: true,
    defaultMsg: '<h3>Press Play to Start!</h3>',

    makeSet: function(){
        blackjack.nominals.map(function (nominal) {
            blackjack.colors.map(function (color) {
                blackjack.cards.push({nominal, color})
            })
        });
        this.playerScore = this.casinoScore = 0;
        const PlayerDiv = document.getElementById('player');
        PlayerDiv.innerHTML = '';
        const CasinoDiv = document.getElementById('casino');
        CasinoDiv.innerHTML = '';
        this.player = [];
        this.casino = [];
        this.gameActive = true;
    },
    shuffle: function()
    {
        this.clearMessage();
        this.showMessage('New game!');
        this.makeSet();
        for (let i = 0; i < 2; i++)
        {
            this.getCard('player');
            this.getCard('casino');
        }
        this.showResult();
        this.showMessage('Your move!');
        this.switchButtons(true);
    },

    getCard: function (direction) {
        if (this.gameActive)
        {
            let index = Math.floor(Math.random() * blackjack.cards.length);
            const card = blackjack.cards[index];
            let inGame = false;
            if (direction === 'casino')
            {
                inGame = true;
            }
            else if (direction === 'player')
            {
                inGame = true;
            }
            if (inGame)
            {
                blackjack.in_game.push(card);
                blackjack.cards.splice(index, 1);
                if (direction === 'casino')
                {
                    blackjack.casino.push(card);
                    blackjack.showMessage('Casino gets ' + card.nominal + ' of ' + card.color)
                }
                else if (direction === 'player')
                {
                    blackjack.player.push(card);
                    blackjack.showMessage('Player gets ' + card.nominal + ' of ' + card.color)
                }
            }
        }

    },

    calculateHand: function () {
        let casino, player;
        this.casinoScore = this.calcOneHand('casino');
        this.playerScore = this.calcOneHand('player');

    },
    calcOneHand: function (hand) {
        let sum = 0;
        let aceCalced = 0;
        if (blackjack[hand])
        {
            blackjack[hand].map(function (card) {
                if (card.nominal)
                {
                    if (+card.nominal)
                    {
                        sum += parseInt(card.nominal);
                    }
                    else if (card.nominal === 'A')
                    {
                        if (sum < 10)
                        {
                            sum += 11;
                            aceCalced++;
                        }
                        else sum += 1;
                    }
                    else
                    {
                        sum += 10;
                    }
                }
            })
        }
        if (sum > 21 && aceCalced)
        {
            sum -= 10;
        }
        return sum;
    },


    showResult: function(){
        const PlayerDiv = document.getElementById('player');
        const CasinoDiv = document.getElementById('casino');
        PlayerDiv.innerHTML = '';
        CasinoDiv.innerHTML = '';
        let casino = 'Casino: ';
        let player = 'Player: ';
        this.casino.map(function (card) {
            casino += ' ' + blackjack.displayCard(card);
        });
        this.player.map(function (card) {
            player += ' ' + blackjack.displayCard(card);

        });
        this.calculateHand();

        PlayerDiv.innerHTML = player + ' Your score: ' + this.playerScore;

        CasinoDiv.innerHTML = casino + ' My score: ' + this.casinoScore;
    },


    displayCard: function (card) {
        let html = 'Unknown card';
        let c;
        if (card.nominal && card.color)
        {
            if (card.color === 'clubs' || card.color === 'spades') c = 'black';
            else c = 'red';
            html = '<span style="color: ' + c + '">' + blackjack.cardsCodes[card.color] + ' ' + card.nominal + '</span>';
        }
        return html;
    },

    checkScore: function(){
        if (this.playerScore < 22)
        {
            if (this.casinoScore < 22)
            {
                return -1;
            }
            else
            {
                this.gameActive = false;
                this.switchButtons(false);
                return 1;
            }
        }
        else
        {
            this.gameActive = false;
            this.switchButtons(false);
            return 0;
        }
    },

    draw: function () {
        this.showMessage('You draw!!!');
        this.analizeSituation();
        if (this.gameActive && this.doItakeCard)
        {
            this.myTurn();
            if (this.doItakeCard) this.draw();
        }
        if (this.casinoScore < 22)
        {
            if (this.casinoScore > this.playerScore) this.showMessage('You lost!!!');
            else if (this.playerScore > this.casinoScore) this.showMessage('You won!!!');
            else this.showMessage('No one wins!!!');
        }
        else
        {
            this.showMessage('You won!!!');
        }
        this.switchButtons(false);

    },

    myTurn: function(){
        this.showMessage('');
        this.analizeSituation();
        if (blackjack.doItakeCard)
        {
            blackjack.showMessage('I take a card');
            blackjack.getCard('casino');
            blackjack.showResult();
            check = blackjack.checkScore();
            if (check === 1)
            {
                blackjack.showMessage(blackjack.getMessage(check));
            }

        }
        else
        {
            blackjack.showMessage('No more cards for me!');
        }
    },

    newTurn: function () {
        if (this.gameActive)
        {
            this.getCard('player');
            this.showResult();
            let check = this.checkScore();
            this.showMessage(this.getMessage(check));
            if (check === -1)
            {
                let timer = setTimeout(function () {
                    blackjack.myTurn();

                }, 2000);
            }

        }

    },
    analizeSituation: function () {
        this.calculateHand();
        if (this.casinoScore < 15)
        {
            this.doItakeCard = true;
        }
        else
        {
            if (this.casinoScore >= this.playerScore)
            {
                this.doItakeCard = false;
            }
            else if (this.playerScore > this.casinoScore)
            {
                this.doItakeCard = true;
            }
            else console.log('Out of range');
        }
    },

    getMessage: function (check) {
        let msg = '';
        if (!check)
        {
            msg = 'You lost!!!';
        }
        else
        {
            if (check === 1)
            {
                msg = 'You won!!!';
            }
            else
            {
                msg = 'My move!';
            }
        }
        return msg;
    },

    showMessage: function(msg)
    {
        const gameInfo = document.getElementById('messageWindow');
        gameInfo.innerHTML += '<br>' + '<i>...' + msg + '</i>';
    },

    clearMessage: function(){
        const gameInfo = document.getElementById('messageWindow');
        gameInfo.innerHTML = '';
    },

    switchButtons: function (on) {
        const card = document.getElementById('getcard');
        const draw = document.getElementById('draw');
        card.disabled = !on;
        draw.disabled = !on;
    }
};