
function setup() {
  const allShow = getAllShows();
  console.log(allShow.length);
  makePageForEpisodes(allShow);

}

function makePageForEpisodes(showList) {

  // select element for picking a show
  const showDiv = document.getElementById("show-list");
  const selectShowEl = document.createElement("select");
  selectShowEl.style.textAlignLast = "center";
  selectShowEl.id = "allShows";
  const option = document.createElement("option");
  option.value = "";
  option.textContent = "--Select a TV show--";
  option.selected = "selected";
  showDiv.appendChild(selectShowEl);
  selectShowEl.appendChild(option);

  //----Listing all shows under selector----
  showList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  //above for sorting list in alphabetical order

  showList.forEach(show => {
    const optionEl = document.createElement("option");
    optionEl.value = show.name;
    optionEl.innerText = show.name;
    // if (show.id === 82) {
    //   optionEl["Game of Thrones"].selected = "selected";
    // }
    selectShowEl.appendChild(optionEl);

    let showId = show.id;
    let showApi = `https://api.tvmaze.com/shows/${showId}/episodes`;
    
    //EventListener for selected show
   // selectShowEl.addEventListener("DOMContentLoaded", showAllEpisodes); this is not working
    selectShowEl.addEventListener("change", showAllEpisodes);

    function showAllEpisodes() {
      let selectedValue = selectShowEl.options[selectShowEl.selectedIndex].value;

      if (selectedValue === show.name) {
        window.scrollTo(0, 0); //scrolls to top after selecting a new show
        fetch(showApi)
        .then((response) => response.json())
        .then((data) => {
        
          const rootElem = document.getElementById("root");
          while (rootElem.firstChild) {
            // this removes the previous show's all episodes
            rootElem.removeChild(rootElem.firstChild);
          }
          
          //extracting each of the episode data
          data.forEach(episode => {            
            const cardEl = document.createElement("article");
            cardEl.className = "card";
            cardEl.setAttribute("id", episode.id.toString());
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
          //---Select and option for episodes of each show----
          let selectEl = document.getElementById("select-episode");
          while (selectEl.firstChild) {
            //this removes all episodes of previously selected show
            selectEl.removeChild(selectEl.firstChild);
          }
          data.forEach(episode => {
            let optEl = document.createElement("option");
            optEl.value = `S${String(episode.season).padStart(2, 0)}E${String(episode.number).padStart(2, 0)}: ${episode.name}`;
            optEl.textContent = `S${String(episode.season).padStart(2, 0)}E${String(episode.number).padStart(2, 0)}: ${episode.name}`;
            let anchorEl = document.createElement("a");
            anchorEl.href = `${episode.id}`; //episode id is assigned as href attribute for navigation
            optEl.appendChild(anchorEl);            
            selectEl.appendChild(optEl);
            
            selectEl.addEventListener("change", showEpisode);
            function showEpisode() {
              let selectedValue = selectEl.options[selectEl.selectedIndex].value;
              if (selectedValue === `S${String(episode.season).padStart(2, 0)}E${String(episode.number).padStart(2, 0)}: ${episode.name}`) {
                window.location.href = `#${episode.id}`;
              } 
            }
          });  
        })
        .catch((err) => alert(`Something's wrong: ${err}`));

        
      } //need an else statement to show when no show is selected??
    }
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
      //Shows search result count
      spanEl.innerHTML = `Showing ${resultCount}/${allCards.length} episodes`;
      
      //if search box is clear, count result text disappears
      if (searchTerm === "") {
        spanEl.style.display = "none";
      } else {
        spanEl.style.display = "inline";
      }
    }  
    
  }

}
  

window.onload = setup;
