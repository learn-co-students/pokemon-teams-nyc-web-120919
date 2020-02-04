const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener("DOMContentLoaded", function(){


function loadPage (){
    fetch(TRAINERS_URL)
    .then(response => response.json())
.then(trainers => trainers.forEach(trainer => renderTrainers(trainer)))
}
loadPage()

function renderTrainers(trainer) {
    const trainerTeamDiv = document.createElement('div')
    trainerTeamDiv.className = 'card'
    trainerTeamDiv.dataset.id = trainer.id
    const target = document.querySelector('main')
    trainerTeamDiv.innerHTML = `
        <p>${trainer.name}</p>
        <button data-id= ${trainer.id}>Add a Pokemon</button>
        `
    trainerTeamDiv.append(createPokemonList(trainer))    
    target.append(trainerTeamDiv);
    }   
    
function createPokemonList(trainer) {
    const ul = document.createElement('ul')
    const pokeArray = trainer.pokemons
    pokeArray.forEach(function(pokemon){
        let li = document.createElement('li');
        li.innerHTML = `${pokemon.nickname} (${pokemon.species}) <button class="release" data-id="${pokemon.id}">Release</button>`
        ul.append(li)
    })
    return ul
}



let main = document.querySelector('main')
main.addEventListener('click', function(e){
    if (e.target.className === "release") {
        let id = parseInt(e.target.dataset.id)
        e.target.parentNode.remove() 
        fetch(`${POKEMONS_URL}/${id}`, {
            method: 'delete'
        })
    } else if (e.target.innerText === "Add a Pokemon") {
        let trainerId = e.target
        let addedPoke = {trainer_id: trainerId.dataset.id}
            fetch(`${POKEMONS_URL}`, {
                method: "post", 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addedPoke)
            })
            .then(resp => resp.json())
            .then(poke => {
                let li = document.createElement('li')
                li.innerHTML = `${poke.nickname} (${poke.species}) <button class="release" data-id="${poke.id}">Release</button>`
                let ul = trainerId.parentNode.querySelector('ul')
                ul.append(li)
            })
            
    }
})


})