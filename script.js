
function setup() {
  const allShow = getAllShows();
  makePageForShows(allShow);
}

function makePageForShows(showList) {

  // select element for picking a TV show
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
  const rootElem = document.getElementById("root");

  //Sorting list in alphabetical order
  showList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  
  //Show search eventListener 
  const showSearch = document.getElementById("show-search");
  showSearch.addEventListener("keyup", searchShow);

  function searchShow() {
    let searchTerm = showSearch.value.toUpperCase();
    const showCards = document.getElementsByClassName("show-card");
    console.log(showCards.length);
    const spanElem = document.getElementById("show-count");
    let resultCount = 0;
    for (let i = 0; i < showCards.length; i++) {
      const genre = showCards[i].getElementsByTagName("li")[1];
      const showName = showCards[i].getElementsByTagName("h2")[0];
      const summary = showCards[i].getElementsByTagName("p")[0];
      const showText = showName.textContent || showName.innerText;
      const genreText = genre.textContent || genre.innerText;

      const summaryText = summary.textContent || summary.innerText;
      if (showText.toUpperCase().includes(searchTerm) || summaryText.toUpperCase().indexOf(searchTerm) > -1 || genreText.toUpperCase().includes(searchTerm)) {
        showCards[i].style.display = "";
        resultCount++;
      } else {
        showCards[i].style.display = "none";
      }      
      //Shows search result count
      spanElem.innerHTML = `Showing ${resultCount}/${showCards.length} shows`;

      //if search-box is clear, count-result text disappears
      if (searchTerm === "") {
        spanElem.style.display = "none";
      } else {
        spanElem.style.display = "inline";
      }
    }
  } 

  mainPage();
  // navigation link on episodes page to get back to all shows page
  const navLink = document.getElementById("nav-link");
  navLink.addEventListener("click", mainPage);

  // To load the page containing all the shows
  function mainPage () {
    while (rootElem.firstChild) {
      // this removes the previous page's all elements
      rootElem.removeChild(rootElem.firstChild);
    }
    //hiding navigation link, couldn't do without declaring the navLink again 
    const navLink1 = document.getElementById("nav-link");
    navLink1.style.display = "none";

    //hiding episodes search box
    const episodeInput = document.getElementsByClassName("episode-visibility");
    for (let i = 0; i < episodeInput.length; i++) {
      episodeInput[i].style.display = "none";
    }
    //displaying TV show search box
    const showSearch = document.getElementById("show-search-div");
    showSearch.style.display = "block";

    //Using the given show list to load the selector and to fetch each show's episodes----
    showList.forEach(show => {
      const optionEl = document.createElement("option");
      optionEl.value = show.name;
      optionEl.innerText = show.name;
      selectShowEl.appendChild(optionEl);
      
      let showId = show.id;
      let showApi = `https://api.tvmaze.com/shows/${showId}/episodes`;
      selectShowEl.addEventListener("change", selectEvent);

      //selectEvent call-back function to display all episodes
      function selectEvent() {
        let selectedValue = selectShowEl.options[selectShowEl.selectedIndex].value;
        if (selectedValue === show.name) {
          showAllEpisodes();
        } else {
          while (rootElem.firstChild) {
            // this removes the previous show's all episodes
            rootElem.removeChild(rootElem.firstChild);
          }
        }
      }

      loadAllShows();

      // Creating tv shows' DOM html 
      function loadAllShows() {
        rootElem.style.top = "9rem";
        const showCard = document.createElement("article");
        showCard.className = "show-card";
        rootElem.appendChild(showCard);
        const h2El = document.createElement("h2");
        h2El.textContent = show.name;
        showCard.appendChild(h2El);

        //divEl to wrap image, summary and show-info
        const divShow = document.createElement("div");
        divShow.className = "div-show";
        showCard.appendChild(divShow);
        // show image
        const showImg = document.createElement("img");
        showImg.className = "show-img";
        showImg.style.cursor = "pointer";
        if (show.image !== null) {
          showImg.src = show.image.medium;
        }
        showImg.alt = `Cover-image for the show ${show.name}`;
        divShow.appendChild(showImg);

        const showSummary = document.createElement("p");
        showSummary.className = "show-summary";
        showSummary.innerHTML = show.summary;
        divShow.appendChild(showSummary);

        const showUnorderedLi = document.createElement("ul");
        showUnorderedLi.className = "show-ul";
        showUnorderedLi.style.listStyle = "none";
        divShow.appendChild(showUnorderedLi);
        const li1 = document.createElement("li");
        li1.textContent = `Rated: ${show.rating.average}`;
        const li2 = document.createElement("li");
        li2.textContent = `Genres: ${show.genres.join(" | ")}`;
        const li3 = document.createElement("li");
        li3.textContent = `Status: ${show.status}`;
        const li4 = document.createElement("li");
        li4.textContent = `Runtime: ${show.runtime} min`;
        showUnorderedLi.appendChild(li1);
        showUnorderedLi.appendChild(li2);
        showUnorderedLi.appendChild(li3);
        showUnorderedLi.appendChild(li4);

        showImg.addEventListener("click", showAllEpisodes);    
      }

      //function to display all episodes of a chosen show using Fetch promise
      function showAllEpisodes() {  
        window.scrollTo(0, 0); //scrolls to top after selecting a new show
        const navLink1 = document.getElementById("nav-link");
        navLink1.style.display = "block";

        rootElem.style.top = "15.5rem";
        
        //To display episode search and select box using class
        for (let i = 0; i < episodeInput.length; i++) {
          episodeInput[i].style.display = "block";
        }
        //hiding TV show search box
        const showSearch = document.getElementById("show-search-div");
        showSearch.style.display = "none";

        //fetching api data
        fetch(showApi)
        .then((response) => response.json())
        .then((data) => {             
          while (rootElem.firstChild) {
            // this removes the previous show's all episodes
            rootElem.removeChild(rootElem.firstChild);
          }        
          //Creating DOM HTML with episodes
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
            if (episode.image !== null) {
              thumbNail.src = episode.image.medium;
            }
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
                //to scroll up a bit
                window.scrollBy(0, -250);
              } 
            }
          });  
        })
        .catch((err) => alert(`Something's wrong: ${err}`));       
        
      }
    });
  }
  //---------Input element for episode search ------------
  const searchBox = document.getElementById("search");
  searchBox.addEventListener("keyup", searchEpisodes);

  function searchEpisodes() {
    let searchTerm = searchBox.value.toUpperCase();
    const allCards = document.getElementsByClassName("card");
    const spanEl = document.getElementById("result-count");
    let resultCount = 0;

    for(let i = 0; i < allCards.length; i++){  
      const episodeName = allCards[i].getElementsByTagName("h2")[0];
      const episodeText = episodeName.textContent || episodeName.innerText;
      
      //Handling null for episodes having no summary
      if (allCards[i].querySelector("p") !== null) {      
        const summary = allCards[i].getElementsByTagName("p")[0];
        const summaryText = summary.textContent || summary.innerText;
        if (episodeText.toUpperCase().includes(searchTerm) || summaryText.toUpperCase().includes(searchTerm)) {
          allCards[i].style.display = "";
          resultCount++;        
        } else {
          allCards[i].style.display = "none";          
        } 
      } else {
        if (episodeText.toUpperCase().includes(searchTerm)) {
          allCards[i].style.display = "";
          resultCount++;
        } else {
          allCards[i].style.display = "none";
        }
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
