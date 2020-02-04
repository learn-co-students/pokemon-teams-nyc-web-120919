const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', () => {
    getTrainers()
})

function getTrainers() {
    fetch(TRAINERS_URL)
        .then(resp => resp.json())
        .then(json => {
            renderTrainers(json)
        })
}

function renderTrainers(allTrainers) {
    const main = document.querySelector('main')
    allTrainers.forEach(trainer => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.dataset.id = trainer.id

        renderTrainer(div, trainer)
        main.appendChild(div)
    })
}

function renderTrainer(div, trainer) {
    const p = document.createElement('p')
    p.innerText = trainer.name;
    div.appendChild(p);

    const button = document.createElement('button')
    button.setAttribute("data-trainer-id", trainer.id);
    button.innerText = 'Add Pokemon'
    button.addEventListener('click', addPokemon)
    div.appendChild(button)

    const ul = document.createElement('ul')
    renderPokemons(ul, trainer.pokemons)
    div.appendChild(ul)
}

function addPokemon(event) {
    const id = event.target.parentElement.dataset.id
    fetch(POKEMONS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "trainer_id": parseInt(id)
        })
    }).then(resp => {
        if(resp.ok)
            return resp.json()
        else
            throw new Error('Party is full')
    })
    .then(json => {
        renderPokemon(event.target.parentElement.children[2], json)
    }).catch(error => {
        alert(error)
    })

}

function renderPokemons(ul, pokemons) {
    pokemons.forEach(pokemon => {
        renderPokemon(ul, pokemon)
    })
}

function renderPokemon(ul, pokemon) {
    const li = document.createElement('li')

    const button = document.createElement('button')
    button.setAttribute("data-pokemon-id", pokemon.id);
    button.innerText = 'Release'
    button.classList.add('release')
    button.addEventListener('click', releasePokmemon)

    li.innerHTML = `${pokemon.nickname} (${pokemon.species})`
    li.appendChild(button)

    ul.appendChild(li)
}

function releasePokmemon(event) {
    const id = event.target.dataset.pokemonId
    event.target.parentElement.remove()

    fetch(`${POKEMONS_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}