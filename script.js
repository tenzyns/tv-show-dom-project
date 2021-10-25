//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  const rootElem = document.getElementById("root");

  //extracting each of the episode data
  allEpisodes.forEach(episode => {
    const cardEl = document.createElement("article");
    cardEl.className = "card";
    rootElem.appendChild(cardEl);

   const headingEl = document.createElement("h2");
   //getting episode and season number with formatted double digits
    headingEl.textContent = `S${String(episode.season).padStart(2, 0)}E${String(episode.number).padStart(2, 0)}: ${episode.name}`;
    
    //anchor tag to link back to TVmaze for credit
    const urlEpisode = document.createElement("a");
    urlEpisode.href = episode.url;
    urlEpisode.target = "_blank";

    //episode image attached to anchor tag
    const thumbNail = document.createElement("img");
    thumbNail.src = episode.image.medium;
    thumbNail.alt = "episode thumbnail";
    thumbNail.className = "thumb-nail";
    urlEpisode.appendChild(thumbNail);

    //episode summary
    const synopsis = document.createElement("div");
    synopsis.innerHTML = episode.summary;
    cardEl.appendChild(headingEl);
    cardEl.appendChild(urlEpisode);
    cardEl.appendChild(synopsis);

    
    });
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got why ${episodeList.length} episode(s)`;
}

window.onload = setup;
