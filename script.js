document.addEventListener('DOMContentLoaded', () => {
    const publicKey = '83ff2fcc28abf55c4403a6573718b67d';
    const privateKey = '77b04a14c130b8920d85a22b199af35c67744d76';
    const ts = new Date().getTime();
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
    const apiUrl = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    const searchInput = document.getElementById('search');
    const resultsDiv = document.getElementById('results');
    const favoritesDiv = document.getElementById('favorites');

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        if (query) {
            fetch(`${apiUrl}&nameStartsWith=${query}`)
                .then(response => response.json())
                .then(data => {
                    resultsDiv.innerHTML = '';
                    data.data.results.forEach(character => {
                        const card = createCharacterCard(character);
                        resultsDiv.appendChild(card);
                    });
                });
        } else {
            resultsDiv.innerHTML = '';
        }
    });

    function createCharacterCard(character) {
        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
        img.className = 'card-img-top';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = character.name;

        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'btn btn-primary favorite-btn';
        favoriteBtn.textContent = 'Add to Favorites';
        favoriteBtn.onclick = () => addToFavorites(character);

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(favoriteBtn);

        card.appendChild(img);
        card.appendChild(cardBody);

        return card;
    }

    function addToFavorites(character) {
        if (!favorites.some(fav => fav.id === character.id)) {
            favorites.push(character);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        }
    }

    function removeFromFavorites(characterId) {
        favorites = favorites.filter(fav => fav.id !== characterId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites();
    }

    function renderFavorites() {
        favoritesDiv.innerHTML = '';
        favorites.forEach(character => {
            const card = document.createElement('div');
            card.className = 'card';

            const img = document.createElement('img');
            img.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
            img.className = 'card-img-top';

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.textContent = character.name;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-danger';
            removeBtn.textContent = 'Remove from Favorites';
            removeBtn.onclick = () => removeFromFavorites(character.id);

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(removeBtn);

            card.appendChild(img);
            card.appendChild(cardBody);

            favoritesDiv.appendChild(card);
        });
    }

    renderFavorites();
});
