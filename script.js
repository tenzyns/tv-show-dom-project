
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
    thumbNail.alt = `episode thumbnail for ${episode.name}`;
    thumbNail.className = "thumb-nail";
    urlEpisode.appendChild(thumbNail);

    //episode summary
    const synopsis = document.createElement("div");
    synopsis.innerHTML = episode.summary;
    cardEl.appendChild(headingEl);
    cardEl.appendChild(urlEpisode);
    cardEl.appendChild(synopsis);

    
  });

  //---------Search box ------------
  const searchBox = document.getElementById("search");
  searchBox.addEventListener("keyup", searchEpisodes, false);

  function searchEpisodes(){
    let searchTerm = searchBox.value.toUpperCase();
    const allCards = document.getElementsByClassName("card");
    const spanEl = document.getElementById("result-count");
     
      let resultCount = 0;

    for(let i = 0; i < allCards.length; i++){  
      const episodeName = allCards[i].getElementsByTagName("h2")[0];
      const summary = allCards[i].getElementsByTagName("p")[0];
      const episodeText = episodeName.textContent || episodeName.innerText;
      const summaryText = summary.textContent || summary.innerText;
      if (episodeText.toUpperCase().includes(searchTerm)|| summaryText.toUpperCase().indexOf(searchTerm) > -1) {
        allCards[i].style.display = "";
        resultCount++;        
        } else {
          allCards[i].style.display = "none";
          
        }
        spanEl.innerHTML = `Showing ${resultCount}/${allEpisodes.length}`;
        if (searchTerm === "") {
          spanEl.style.display = "none";
        } else {
          spanEl.style.display = "inline";
        }
    }
    
    
  }  
  //---Select box----



}

  
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got why ${episodeList.length} episode(s)`;
}

window.onload = setup;
