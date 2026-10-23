const API_URL = "https://rickandmortyapi.com/api/character";
const characterGrid = document.querySelector("#character-grid");
const message = document.querySelector("#explorer-message");
let searchTimer;
let characters = [];

const characterCard = ({ id, name, image, status, species, location }) => `
    <article class="group flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg sm:flex-row"
             data-character-id="${id}" tabindex="0" role="button" aria-label="View details for ${name}">
        <img class="h-48 w-full object-cover sm:h-auto sm:w-36 lg:w-40" src="${image}" alt="${name}">
        <div class="flex flex-1 flex-col justify-between p-5">
            <div>
                <h2 class="text-xl font-bold">${name}</h2>
                <p class="mt-1 text-slate-600">${status} - ${species}</p>
                <p class="mt-3 text-slate-600">Location: ${location.name}</p>
            </div>
        </div>
    </article>
`;

const getCharacterDetails = async ({ episode, location }) => {
    const [episodeResponse, locationResponse] = await Promise.all([
        fetch(episode[0]),
        fetch(location.url)
    ]);

    const [episodeData, locationData] = await Promise.all([
        episodeResponse.json(),
        locationResponse.json()
    ]);

    return {
        episode: `${episodeData.name} (#${episodeData.id})`,
        location: `${locationData.name} (${locationData.dimension})`
    };
};

const renderCharacters = (characters) => {
    characterGrid.innerHTML = characters.map(characterCard).join("");
    message.textContent = `${characters.length} character(s) found.`;
    return characters;
};

const searchCharacters = async (name) => {
    if (!name.trim()) {
        characterGrid.innerHTML = "";
        message.textContent = "Type a name to search.";
        return;
    }

    message.textContent = "Loading characters...";

    try {
        const response = await fetch(`${API_URL}/?name=${encodeURIComponent(name)}`);
        if (!response.ok) {
            throw new Error("No characters found.");
        }

        const { results } = await response.json();
        characters = renderCharacters(results);
    } catch (error) {
        characterGrid.innerHTML = "";
        message.textContent = error.message;
    }
};

const loadInitialCharacters = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Could not load characters.");
        }

        const { results } = await response.json();
        characters = renderCharacters(results);
    } catch (error) {
        message.textContent = error.message;
    }
};

document.querySelector("#character-search").addEventListener("input", ({ target }) => {
    clearTimeout(searchTimer);
    message.textContent = "Waiting four seconds before searching...";
    searchTimer = setTimeout(() => searchCharacters(target.value), 4000);
});

characterGrid.addEventListener("click", async ({ target }) => {
    const card = target.closest("[data-character-id]");
    if (!card) {
        return;
    }

    const characterId = Number(card.dataset.characterId);
    const modalContent = document.querySelector("#character-modal-content");
    modalContent.textContent = "Loading episode and location...";
    document.querySelector("#character-modal").showModal();

    try {
        const characterResponse = await fetch(`${API_URL}/${characterId}`);
        if (!characterResponse.ok) {
            throw new Error("Could not load character.");
        }

        const character = await characterResponse.json();
        const { episode, location } = await getCharacterDetails(character);
        modalContent.innerHTML = `
            <div class="flex items-start justify-between gap-4">
                <h2 class="text-2xl font-bold">${character.name}</h2>
                <button class="text-2xl text-slate-500" data-close-character-modal aria-label="Close">&times;</button>
            </div>
            <img class="mt-4 h-64 w-full rounded-lg object-cover" src="${character.image}" alt="${character.name}">
            <div class="mt-4 grid gap-2 text-slate-600 sm:grid-cols-2">
                <p><strong>Status:</strong> ${character.status}</p>
                <p><strong>Species:</strong> ${character.species}</p>
                <p><strong>Gender:</strong> ${character.gender}</p>
                <p><strong>Origin:</strong> ${character.origin.name}</p>
                <p><strong>First episode:</strong> ${episode}</p>
                <p><strong>Location:</strong> ${location}</p>
            </div>
        `;
    } catch (error) {
        modalContent.textContent = "Could not load character details.";
    }
});

characterGrid.addEventListener("keydown", (event) => {
    const card = event.target.closest("[data-character-id]");
    if (card && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        card.click();
    }
});

loadInitialCharacters();

document.querySelector("#character-modal").addEventListener("click", ({ target }) => {
    if (target.matches("[data-close-character-modal]")) {
        document.querySelector("#character-modal").close();
    }
});
