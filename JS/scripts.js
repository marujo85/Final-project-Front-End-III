const cardsContainer = document.getElementById('cards-container')
const buttonPrevious = document.getElementById('btn-previous')
const buttonNext = document.getElementById('btn-next')
const displayCurrentPage = document.getElementById('display-currentPage')
const searchInput = document.getElementById('search-bar')

let pageN = 1


async function getCharactersWithLastEpisode(pageNumber, searchName) {
  let characterUrl = `/character?page=${pageNumber}`
  // console.log("SEARCH " + searchName)
  if (searchName != undefined) {
    characterUrl += `&name=${searchName}`
  }
  // console.log(characterUrl)
  const result = await api.get(characterUrl)
  const listResult = result.data.results
  let promises = [];

  listResult.forEach(async (character, index) => {
    const lastEpisodeUrl = character.episode[character.episode.length - 1]
    const promise = axios.get(`${lastEpisodeUrl}`).then(responseEpi =>
      character.lastEpisodeName = responseEpi.data.name)
    promises.push(promise)
  })
  await Promise.all(promises)
  const next = result.data.info.next
  const prev = result.data.info.prev
  return { "list": listResult, "next": next, "prev": prev }
}


async function getCharacters(pageNumber, searchName) {
  try {
    cardsContainer.innerHTML = ''
    const result = await getCharactersWithLastEpisode(pageNumber, searchName)
    const listResult = result.list
    console.log(result)
    let wrapper = document.createElement('div')
    wrapper.classList.add ('row', 'mb-3')

    let counter = 0

    listResult.forEach((character, index) => {

      let statusEmoji;
      switch (character.status) {
        case 'Alive':
          statusEmoji = '🟢';
          break
        case 'Dead':
          statusEmoji = '🔴';
          break
        case 'unknown':
          statusEmoji = '⚫';
          break
      }
      const cardHTML = `
      <div class="col-md-4 mb-2 ">
      <div class="h-100 card" data-bs-toggle="modal" data-bs-target="#characterModal-${character.id}" id="card-content">
        <img src="${character.image}" alt="image of current character">
        <div class="card-body" id="card-body">
        <h1 class="mb-0">${character.name}</h1>
        <h4>${statusEmoji} ${character.status} - ${character.species}</h4>
        </div>
      </div>
    </div>
  <div class="modal fade" id="characterModal-${character.id}" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered ">
      <div class="modal-content" id="modal-content">
        <div class="modal-header">
          <h1 class="modal-title" id="exampleModalLabel">${character.name} Details</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="card-resume">
            <p class="h3"id="subtitles">Last known location:</p>
            <p class="h2"><strong>${character.location.name}</strong></p>
            <p class="h3"id="subtitles" >Last seen in:</p>
            <p class="h2"><strong id="last-episode-${character.id}">${character.lastEpisodeName}</strong></p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success btn-lg" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
`
   
        
      wrapper.innerHTML += cardHTML

      if ((index + 1) % 3 === 0 || index == listResult.length - 1) {
        cardsContainer.innerHTML += wrapper.outerHTML
        wrapper.innerHTML = ''
      }
    })

    displayCurrentPage.innerHTML = pageNumber

    buttonNext.disabled = !result.next
    buttonPrevious.disabled = !result.prev

  } catch (error) {
    console.log(error)
    alert('Erro ao tentar pesquisar pela personagem', error)
    cardsContainer.innerHTML = `<p>Erro ao tentar pesquisar pela personagem</p>`
  }
}

function previousPage() {
  if (pageN <= 1) return
  pageN--
  getCharacters(pageN)
}

function nextPage() {
  if (pageN >= 42) return
  pageN++
  getCharacters(pageN)
}

function searchCallback() {
  console.log('search callback')
  console.log(searchInput.value)
  getCharacters(pageN, searchInput.value)
}


buttonPrevious.addEventListener('click', previousPage)
buttonNext.addEventListener('click', nextPage)
searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchCallback()
  }
});


getCharacters(pageN)












