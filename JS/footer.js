const totalCharacters = document.getElementById('total-characters')
const locations = document.getElementById('locations')
const totalEpisodes = document.getElementById('total-episodes')

async function getAllCharactersRyM (){
	try{
		const allRyM = await api.get('/character')
		const result = allRyM.data.info.count
		console.log(result)
		totalCharacters.innerHTML = `CHARACTERS: <strong>${result}</strong>` 

	}catch(error){
		alert('erro ao requisitar todos os personagens', error)
	}
}

getAllCharactersRyM()




async function getAllLocations(){
	try{
		const location = await api.get('/location')
		const allLocationsRyM = location.data.info.count
		console.log(allLocationsRyM)
		locations.innerHTML = `LOCATIONS: <strong>${allLocationsRyM}</strong>`

	}catch(error){
		alert('erro ao requisitar todas as localizações', error)
	}
}

getAllLocations()



async function getAllEpisodes (){
	try{
		const totalEps = await api.get('/episode')
		const allEpisodesRyM = totalEps.data.info.count
		console.log(allEpisodesRyM)

		totalEpisodes.innerHTML = `EPISODES: <strong>${allEpisodesRyM}</strong> `
	}catch(error){
		alert('erro ao requisitar numero total de episodios', error)
	}
}
getAllEpisodes()
