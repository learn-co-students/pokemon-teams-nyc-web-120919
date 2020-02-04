document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "http://localhost:3000"
    const TRAINERS_URL = `${BASE_URL}/trainers`
    const POKEMONS_URL = `${BASE_URL}/pokemons`

    populateTrainers()

    function populateTrainers() {
        fetch(TRAINERS_URL)
            .then(function (response) {
                return response.json();
            })
            .then(function (trainers) {
                trainers.forEach(function (trainer) {
                    displayTrainer(trainer);
                });
            });
    }

    function displayTrainer(trainer) {
        const main = document.getElementsByTagName("main")[0]
        const div = document.createElement('div');
        div.setAttribute('class', 'card');
        div.dataset.id = trainer.id;
        main.appendChild(div);
        trainerInfo(div, trainer);
    }

    function trainerInfo(div, trainer) {
        const p = document.createElement('p');
        p.innerText = trainer.name;
        const addButton = document.createElement('button');
        addButton.dataset.id = trainer.id;
        addButton.innerText = "Add Pokemon";
        div.appendChild(p);
        div.appendChild(addButton);
        pokemonInfo(div, trainer)
        addPokemon(addButton, trainer);
    }

    function pokemonInfo(div, trainer) {
        const ul = document.createElement('ul');

        trainer.pokemons.forEach(function (pokemon) {
            const li = document.createElement('li');
            li.innerText = `${pokemon.nickname} (${pokemon.species})`
            const releaseButton = document.createElement('button');
            releaseButton.setAttribute('class', 'release');
            releaseButton.innerText = "Release";
            releaseButton.dataset.id = pokemon.id;
            li.appendChild(releaseButton)
            ul.appendChild(li)
            releasePokemon(releaseButton);
        });
        div.appendChild(ul)
    }

    function addPokemon(addButton, trainer) {
        addButton.addEventListener("click", function (event) {
            fetch('http://localhost:3000/pokemons', {
                method: 'POST',
                headers:
                {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "trainer_id": trainer.id
                })
            }).then(function (response) {
                return response.json();
            }).then(function (pokemon) {
                const ul = addButton.parentNode.querySelector("ul")
                if (ul.children.length < 6) { 
                    const li = document.createElement('li');
                    li.innerText = `${pokemon.nickname} (${pokemon.species})`
                    const releaseButton = document.createElement('button');
                    releaseButton.setAttribute('class', 'release');
                    releaseButton.innerText = "Release";
                    releaseButton.dataset.id = pokemon.id;
                    releasePokemon(releaseButton)
                    li.appendChild(releaseButton)
                    ul.appendChild(li)
                } else {alert(pokemon.error) }
            });
        })
    }

    function releasePokemon(releaseButton) {
        releaseButton.addEventListener("click", function(event) {
            fetch (`http://localhost:3000/pokemons/${releaseButton.dataset.id}`, {
                method: "delete"
            })
            const li = releaseButton.parentNode
            li.remove()
        })
    }
})
