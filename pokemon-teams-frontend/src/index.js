const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`


window.addEventListener('DOMContentLoaded', function() {
    renderAllCards();
})

function renderAllCards() {
    fetchTrainers().then(trainers => displayTrainers(trainers));
}

function fetchTrainers() {
    return fetch(TRAINERS_URL).
    then(response => response.json())
}

function displayTrainers(trainers) {
    const main = document.querySelector('main');
    main.innerHTML = ""
    
    trainers.forEach(trainer => {
        const div = document.createElement('div');
        div.className = 'card';
        div.dataset.id = trainer.id;
        div.addEventListener('click', addOrRelease);
        
        const nameP = document.createElement('p');
        nameP.innerHTML = trainer.name;
        div.appendChild(nameP);
        
        const addButton = document.createElement('button');
        addButton.innerText = "Add Pokemon";
        addButton.dataset.trainerId = trainer.id;
        addButton.className = 'add'
        div.appendChild(addButton);

        const ul = document.createElement('ul');
        div.appendChild(ul);

        trainer.pokemons.forEach(pokemon => renderPokemon(pokemon, ul))
        
        main.appendChild(div);
    });
}

function renderPokemon(pokemon, ul) {
    const li = document.createElement('li');

    li.innerHTML = `
    ${pokemon.nickname} <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
    `
    ul.appendChild(li);
}

function addOrRelease(event) {
    const button = event.target;
    if (button.className === 'add') {
        fetch(POKEMONS_URL, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                accept: "application/json"
            },
            body: `{"trainer_id": ${button.dataset.trainerId}}`
            })
            .then(response => {return response.json()})
            .then(pokemon => {
                if (!pokemon.error) {
                    renderAllCards();
                }
                else {
                    alert(pokemon.error)
                }
            })
    }
    else if (button.className === 'release') {
        const pokemonId = button.dataset.pokemonId;

        fetch(`${POKEMONS_URL}/${pokemonId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(pokemon => {
            renderAllCards();
        })
    }
}
