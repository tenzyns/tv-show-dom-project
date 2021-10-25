//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();

  const rootElem = document.getElementById("root");
  allEpisodes.forEach(episode => {
    const cardEl = document.createElement("article");
    cardEl.className = "card";
    
    rootElem.appendChild(cardEl);

   let headingEl = document.createElement("h2");
    headingEl.textContent = `S${String(episode.season).padStart(2, 0)}E${String(episode.number).padStart(2, 0)}
    ${episode.name}`;
    
    let thumbNail = document.createElement("img");
    thumbNail.src = episode.image.medium;
    thumbNail.alt = "episode thumbnail";
    thumbNail.className = "thumb-nail";

    
    cardEl.appendChild(headingEl);
    cardEl.appendChild(thumbNail);
    //cardEl.innerHTML = episode.summary;
    });
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got why ${episodeList.length} episode(s)`;
}

window.onload = setup;
