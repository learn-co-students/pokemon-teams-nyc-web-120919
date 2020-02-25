window.addEventListener('DOMContentLoaded', function() {
  indexFetch()
  postFetch()
})

const BASE_URL = "http://localhost:3000/"
const TRAINERS_URL = BASE_URL + 'trainers'
const POKEMONS_URL = BASE_URL + 'pokemons'

function indexFetch() {
  return fetch(TRAINERS_URL)
  .then(resp => resp.json())
  .then(trainers => renderCards(trainers))
}

function renderCards(trainers) {
  let main = document.querySelector('main')
  trainers.forEach(function(trainer) {
    let div = document.createElement('div')
    div.className = "card"
    div.dataset.id = `${trainer.id}`
    div.innerHTML = `<p>${trainer.name}</p>
    <button data-trainer-id="${trainer.id}">Add Pokemon</button>
    <ul>
        ${trainer.pokemons.map( pokemon => {
          return `<li>${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
        }).join('') 
      }  
    </ul>
    `
    div.addEventListener('click', buttonHandling)
    main.appendChild(div)
  })
}

// POST Functions:

function postFetch(trainerId) {
  return fetch(POKEMONS_URL, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'trainer_id': trainerId
    }),
  })
  .then(resp => resp.json())
}

function buttonHandling(e) {
  if (e.target.tagName === "BUTTON") {
    if (e.target.innerText === "Add Pokemon") {
      postFetch(parseInt(e.target.dataset.trainerId))
      .then(pokemon => {
        let div = document.querySelector(`div[data-id="${pokemon.trainer_id}"]`)
        let pokeList = div.querySelector('ul')
        pokeList.innerHTML += `<li>${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
      })
    }
    else {
      e.target.parentNode.remove()
      console.log(e.target.dataset.pokemonId)
      deleteFetch(parseInt(e.target.dataset.pokemonId)) 
    }
  }
}

// DELETE Functions

function deleteFetch(pokemonId) {
  return fetch(POKEMONS_URL+`/${pokemonId}`, {
    method: 'DELETE', 
  })
  .then(resp => resp.json())
}