const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points'),
    },

    cardsSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
        
    },

    fieldcards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },

    playerSides:{
    player1: "player-cards",
        player1BOX: document.getElementById('player-cards'),
    computer: "computer-cards",
        computerBOX: document.getElementById('computer-cards'),
    },    
    actions: {
        button: document.getElementById('next-duel'),
    }  
};



const pathImages = "./src/assets/icons/";

// Dados das cartas
const cardData = [
    {
        id: 0,
        name: "Blue-Eyes White Dragon",
        type: "Paper",
        img:`${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img:`${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img:`${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [2],
    }
    
];


// Sorteia um ID de carta aleatório
function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
    
}


// Cria a imagem da carta
function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add('card');

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener( "mouseover", () => {
            drawSelectedCard(IdCard);
        });

    cardImage.addEventListener("click", () => {
        setCardsField(cardImage.getAttribute("data-id"));        
    });
}
    return cardImage;
}


// remove as imagens das cartas do campo
async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = getRandomCardId();

    await showHiddenCardFieldsImage(true);

    await hiddenCardDetail();

    // Atualiza as imagens das cartas no campo
    await drawCardsInField( cardId, computerCardId);
    
    // Verifica o resultado do duelo
    let duelResults = await checkDuelResult(cardId, computerCardId);

    // Atualiza o placar
    await updateScore();
    await drawButton(duelResults)

}


async function drawCardsInField( cardId, computerCardId) {
    state.fieldcards.player.src = cardData[cardId].img;
    state.fieldcards.computer.src = cardData[computerCardId].img;

}

async function showHiddenCardFieldsImage(value) {
    if (value === true) {
        state.fieldcards.player.style.display = "block";
        state.fieldcards.computer.style.display = "block";        
    }
    else {
        // Esconde a imagem de pré-visualização ao iniciar/resetar o jogo
        state.cardsSprites.avatar.style.display = "none";
        state.fieldcards.player.style.display = "none";
        state.fieldcards.computer.style.display = "none";    
    }
}

async function hiddenCardDetail() {
    state.cardsSprites.avatar.src = "";
    state.cardsSprites.name.innerText = "";
    state.cardsSprites.type.innerText = "";    
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win:${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

// Reseta o jogo para a próxima rodada
async function resetDuel() {
    state.cardsSprites.avatar.src = "./src/assets/icons/card-back.png";
    state.actions.button.style.display = "none";

    state.fieldcards.player.style.display = "none";
    state.fieldcards.computer.style.display = "none";

    init();
}



async function checkDuelResult(playerCardId, computerCardId) {
    let duelResult = "DRAW";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResult = "WIN";
        await playAudio(duelResult);
        state.score.playerScore ++;
    } 
    else if (playerCard.LoseOf.includes(computerCardId)) {
        duelResult = "LOSE";
        await playAudio(duelResult);
        state.score.computerScore++;
    }

    return duelResult;
}


// Remove todas as imagens das cartas do campo
async function removeAllCardsImages() {
    let { computerBOX, player1BOX } = state.playerSides;

    let imgElements = computerBOX.querySelectorAll('img');
    imgElements.forEach(img => img.remove());

    imgElements = player1BOX.querySelectorAll('img');
    imgElements.forEach(img => img.remove());
}


// Atualiza a carta do campo do computador com uma carta aleatória
async function drawSelectedCard(index) {
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerText = cardData[index].name;
    state.cardsSprites.type.innerText = "Atribute: " + cardData[index].type;
    
    // ✅ ESTA LINHA CONTINUA CORRETA
    // Altera a visibilidade para "block" para que a imagem apareça
    state.cardsSprites.avatar.style.display = "block";
    
}


// Desenha as cartas no campo
async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }    
}

async function playAudio (status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

// Inicia o jogo
function init() {
    showHiddenCardFieldsImage(false);
    

    drawCards(5, state.playerSides.player1); // ← Use state.playerSides.player1
    drawCards(5, state.playerSides.computer); // ← Use state.playerSides.computer

    const bgm = document.getElementById('bgm');
    bgm.play(); 
    

}


init();