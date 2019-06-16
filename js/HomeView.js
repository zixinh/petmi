const genders = ['Male', 'Female'];
const species = ['Dog', 'Cat'];
let dogBreeds;
let catBreeds;

let filterGender = 'Any';
let filterSpecies = 'Any';
let filterBreed = 'Any';

let petProfiles = [];
let curUser;
let selectedPetId;
let filteredPets = [];
let curCarouselPetId;


function getUserPets(username){
    return new Promise((resolve, reject) => {
        if(!username)
            return reject("Session expired, directing to Landing Page");
        $.ajax({
            // /owner/:ownerUsername
            type: 'get',
            url: '/pet/owner/' + username,
            // dataType: 'json',
            success: function (res) {
                console.log("on success", res);
                if (res.error || !res.data) {
                    reject("Invalid user state, directing to Landing Page");
                } else {
                    //get pet profiles from server
                    resolve(res.data);
                }
            },
            error: function (err) {
                console.log("error occurred when finding pets", err);
            }
        });
    });
}
function getAllPets() {
    return new Promise((resolve, reject) => {
        $.ajax({
            // /owner/:ownerUsername
            type: 'get',
            url: '/pet/all',
            success: function (res) {
                console.log("on success", res);
                if (res.error || !res.data) {
                    reject("Invalid user state, directing to Landing Page");
                } else {
                    //get pet profiles from server
                    resolve(res.data);
                }
            },
            error: function (err) {
                console.log("error occurred when finding pets", err);
            }
        });
    });

}


function getCurrentUser() {
    // OBTAIN data from server.
    return new Promise((resolve, reject) => {
        // if(!username)
        //     return reject("Session expired, directing to Landing Page");
        $.ajax({
            type: 'get',
            // url: '/user?username=' + username,
            url: "/user",
            // dataType: 'json',
            success: function (res) {
                console.log("on success", res);
                if (res.error || !res.data) {
                    reject("Session expired, directing to Landing Page");
                } else {
                    let user = res.data;
                    //get pet profiles from server
                    resolve(user);
                }
            },
            error: function (err) {
                console.log("error occurred when find user", err);
            }
        });
    });
}

function showCurrentUser() {
    console.log("cur pets: ", curUser.pets);
    const petList = $('ul.pets')
    for (let i = 0; i < curUser.pets.length; i++) {
        const curPet = curUser.pets[i];
        if (i === 0) {
            selectedPetId = curPet._id;
        }
        const pet = document.createElement('li')
        pet.classList.add('pet', 'list-inline-item')
        pet.setAttribute('id', curPet._id)

        const picContainer = document.createElement('div')
        if (i === 0) {
            picContainer.classList.add('selected')
        }
        picContainer.classList.add('circle')
        const petProfilePic = document.createElement('img')
        petProfilePic.classList.add('rounded-circle')
        //add event listener of overlay for each circle
        petProfilePic.addEventListener("click", displayOverlay);
        petProfilePic.setAttribute("petId", curPet._id);
        petProfilePic.setAttribute('src', curPet.profilePic.src)
        picContainer.append(petProfilePic)
        pet.append(picContainer)

        const nameCounter = document.createElement('div')
        nameCounter.classList.add('name-counter')
        const name = document.createElement('h4')
        const nameTxt = document.createTextNode(curPet.name)
        const matchesBadge = document.createElement('span')
        matchesBadge.id = "span" + curPet._id;
        matchesBadge.classList.add('badge', 'badge-primary')
        name.append(nameTxt)
        nameCounter.append(name)
        nameCounter.append(matchesBadge)
        matchesBadge.innerText = curPet.matchedIds.length.toString();
        pet.append(nameCounter)
        petList.append(pet)
    }

    const selectList = $('div.select-pet div.btn-group')

    for (let i = 0; i < curUser.pets.length; i++) {
        const pet = curUser.pets[i]
        const petButton = document.createElement('button')

        if (i === 0) {
            petButton.classList.add('btn', 'btn-outline-primary', 'active')
        } else {
            petButton.classList.add('btn', 'btn-outline-primary')
        }

        petButton.setAttribute('type', 'button');
        petButton.setAttribute('id', 'button'+pet._id);

        const petButtonText = document.createTextNode(pet.name)
        petButton.append(petButtonText)
        selectList.append(petButton)
    }
}

function setFilterOptions() {
    const speciesSelect = $('select#species')
    for (let i = 0; i < species.length; i++) {
        const speciesOption = document.createElement('option')
        speciesOption.setAttribute('value', species[i])
        const speciesText = document.createTextNode(species[i])
        speciesOption.appendChild(speciesText)
        speciesSelect.append(speciesOption)
    }

    const genderSelect = $('select#gender')
    for (let i = 0; i < genders.length; i++) {
        const genderOption = document.createElement('option')
        genderOption.setAttribute('value', genders[i])
        const genderText = document.createTextNode(genders[i])
        genderOption.appendChild(genderText)
        genderSelect.append(genderOption)
    }
}

function updateBreed(species) {
    $('select#breed option').each(function () {
        if ($(this).val() !== 'Any') {
            $(this).remove()
        }
    })

    if (species !== 'Any') {
        const breed = $('select#breed')
        let breeds = null

        if (species === 'Dog') {
            breeds = dogBreeds
        } else {
            breeds = catBreeds
        }

        for (let i = 0; i < breeds.length; i++) {
            const breedOption = document.createElement('option')
            breedOption.setAttribute('value', breeds[i])
            const breedText = document.createTextNode(breeds[i])
            breedOption.appendChild(breedText)
            breed.append(breedOption)
        }
    }
}

// Filter criteria: selected filter options, not already liked by selected pet,
// not disliked by selected pet, carousel pet doesn't dislike selected pet
function filterPets(filter) {
    // OBTAIN data from server.
    const selectedPet = getUserPet(selectedPetId);
    filteredPets = petProfiles.filter((pet)=>{
        return pet.ownerUsername !== curUser.username
            && !pet.dislikedBy.includes(selectedPetId) && !pet.dislikes.includes(selectedPetId)
            && !selectedPet.likes.includes(pet._id) && !selectedPet.matchedIds.includes(pet._id)
        && !selectedPet.favouriteIds.includes(pet._id);
    });

    if (filter === 'Gender') {
        filteredPets = filteredPets.filter((pet) => {
            if (filterGender !== 'Any') {
                if (pet.gender === filterGender) {
                    return pet
                }
            } else {
                return pet
            }
        })
    }

    if (filter === 'Species') {
        filteredPets = filteredPets.filter((pet) => {
            if (filterSpecies !== 'Any') {
                if (pet.species === filterSpecies) {
                    return pet
                }
            } else {
                return pet
            }
        })
    }

    if (filter === 'Breed') {
        filteredPets = filteredPets.filter((pet) => {
            if (filterBreed !== 'Any') {
                if (pet.breed === filterBreed) {
                    return pet
                }
            } else {
                return pet
            }
        })
    }
}

function carouselNoResults() {
    $('div.photo img, div.photo h3').remove()
    $('div.photo-chooser button').remove()
    const sorryPic = document.createElement('h3')
    const sorryPicTxt = document.createTextNode(':[ Sorry...')
    sorryPic.append(sorryPicTxt)
    $('div.photo').append(sorryPic)

    $('div.information h3, div.information ul li, div.information p').empty()
    const sorryMsg = document.createTextNode('There doesn\'t seem to be any pets that fit your filter...')
    $('div.information p').append(sorryMsg)
}

function updateCarousel() {
    // OBTAIN data from server.
    if (filteredPets.length === 0) {
        carouselNoResults()
    } else {
        const pet = filteredPets[Math.floor(Math.random() * filteredPets.length)]
        curCarouselPetId = pet._id

        $('div.photo img, div.photo h3').remove()
        $('div.photo-chooser button').remove()
        $('div.information h3, div.information ul li, div.information p').empty()

        const carouselPhotoFrame = $('div.photo')
        const chooserButtons = $('div.photo-chooser div.btn-group')

        const profilePic = document.createElement('img')
        profilePic.setAttribute('src', pet.profilePic.src)
        profilePic.setAttribute('id', '1')

        const profilePicButton = document.createElement('button')
        profilePicButton.setAttribute('type', 'button')
        profilePicButton.setAttribute('id', '1')
        profilePicButton.classList.add('btn', 'btn-outline-secondary')
        const profilePicButtonText = document.createTextNode('1')
        profilePicButton.append(profilePicButtonText)
        chooserButtons.append(profilePicButton)
        carouselPhotoFrame.append(profilePic)

        for (let i = 0; i < pet.gallery.length; i++) {
            const galleryPic = document.createElement('img')
            galleryPic.setAttribute('src', pet.gallery[i].src)
            galleryPic.setAttribute('id', i + 2)

            const galleryPicButton = document.createElement('button')
            galleryPicButton.setAttribute('type', 'button')
            galleryPicButton.setAttribute('id', (i + 2).toString())
            galleryPicButton.classList.add('btn', 'btn-outline-secondary')
            const galleryPicButtonText = document.createTextNode(i + 2)
            galleryPicButton.append(galleryPicButtonText)
            chooserButtons.append(galleryPicButton)
            carouselPhotoFrame.append(galleryPic)
            $(galleryPic).hide()
        }

        $('div.photo-chooser div.btn-group button').click(function (e) {
            $('div.carousel div.photo img:visible').hide()
            $('div.photo img').each(function () {
                if ($(this).attr('id') === $(e.target).attr('id')) {
                    $(this).show()
                }
            })
        })

        const name = document.createTextNode(pet.name)
        const gender = document.createTextNode(pet.gender)
        const age = document.createTextNode(pet.age)
        const bio = document.createTextNode(pet.biography)

        $('div.information #name').append(name)
        $('div.information #gen').append(gender)
        $('div.information #age').append(age)
        $('div.information #biography').append(bio)
    }
}

function selectPet(newPet) {
    $("#button" + selectedPetId).removeClass("active");
    $("li#" + selectedPetId + " div.circle").removeClass("selected");
    $("li#" + newPet + " div.circle").addClass("selected");
    selectedPetId = newPet;
}

function updateBadge(petId, numMatches) {
    // OBTAIN data from server.
    const badge = document.getElementById("span"+petId);
    badge.innerText = numMatches;
}

function getUserPet(petId) {
    // OBTAIN data from server.
    return curUser.pets.find((p) => p._id === petId)
}

function getOtherPet(petId) {
    // OBTAIN data from server.
    return petProfiles.find((p) => p._id === petId)
}


function updatePetMatchesRequest(pet) {
    $.ajax({
        type: 'PATCH',
        url: '/pet/match/'+pet._id,
        data: pet,
        dataType: 'json',
        traditional: true,
        success: function (res) {
            console.log("on success", res);
            if (res.error) {
                return alert(res.error);
            } else{
                console.log("pet updated as-------", res.data);
            }
        },
        error: function (err) {
            console.log("error occurred when updating new matches", err);
        }
    });
}

function updateLike() {
    if (filteredPets.length > 0) {
        const selectedPet = getUserPet(selectedPetId);
        const carouselPet = getOtherPet(curCarouselPetId);

        if(selectedPet.likedBy.includes(curCarouselPetId)){
            selectedPet.matchedIds.push(curCarouselPetId);
            let index = selectedPet.likedBy.indexOf(curCarouselPetId);
            if (index > -1) {selectedPet.likedBy.splice(index, 1);}
            index = carouselPet.likes.indexOf(selectedPetId);
            if (index > -1) {carouselPet.likes.splice(index, 1);}
            carouselPet.matchedIds.push(selectedPetId);
            //update new matches
            selectedPet.newMatches++;
            carouselPet.newMatches++;
            updateBadge(selectedPetId, selectedPet.matchedIds.length);
        } else {
            selectedPet.likes.push(carouselPet._id);
            if (!carouselPet.likedBy.includes(selectedPet._id)) {
                carouselPet.likedBy.push(selectedPet._id)
            }
        }
        updatePetMatchesRequest(selectedPet);
        updatePetMatchesRequest(carouselPet);
    }
}

function updateDislike() {
    if (filteredPets.length > 0) {
        const selectedPet = getUserPet(selectedPetId)
        const carouselPet = getOtherPet(curCarouselPetId)

        selectedPet.dislikes.push(curCarouselPetId);
        carouselPet.dislikedBy.push(selectedPetId);

        updatePetMatchesRequest(selectedPet);
        updatePetMatchesRequest(carouselPet);
    }
}



// Overlay functions

function resetNewMatches(petId) {
    let idx = curUser.pets.findIndex((p) => p._id === petId);
    curUser.pets[idx].newMatches = 0;
    let pet = curUser.pets[idx];
    if(!pet)
        return;
    pet.newMatches = 0;
    updatePetMatchesRequest(pet);
}

let displayedPetId;

async function displayOverlay(event) {
    // Get the petId of the pet badge being clicked
    let petId = event.target.getAttribute("petId");
    displayedPetId = petId;
    document.getElementById("profile_pic").src = event.target.getAttribute("src");
    resetNewMatches(petId);
    let userPet = getUserPet(petId);
    updateBadge(petId, 0);
    prepareHeaderDiv(userPet);
    await prepareContentDiv(userPet);
    $('#overlayModal').modal('toggle');
}

function prepareHeaderDiv(pet) {
    document.querySelector("#pet-name").innerText = pet.name;
    document.querySelector("#pet-age").innerText = pet.age;
    document.querySelector("#pet-gender").innerText = pet.gender;
    document.querySelector("#pet-species").innerText = pet.species;
    document.querySelector("#pet-breed").innerText = pet.breed;
    document.querySelector("#pet-relationship").innerText = pet.relationshipGoal;
    document.querySelector("#pet-biography").innerText = pet.biography;
}

function getPetProfileById(petId) {
    // OBTAIN data from server.
    // return petProfiles.find((p) => p._id === petId)
    return new Promise((resolve, reject) => {
        $.ajax({
            // /owner/:ownerUsername
            type: 'get',
            url: '/pet/' + petId,
            // dataType: 'json',
            success: function (res) {
                console.log("on success", res);
                if (res.error || !res.data) {
                    reject("Failed to get pet profile");
                } else {
                    resolve(res.data);
                }
            },
            error: function (err) {
                console.log("error occurred when finding pets", err);
            }
        });
    });
}

function getContactByOwnerUsername(username) {
    return new Promise((resolve, reject) => {
        // if(!username)
        //     return reject("Session expired, directing to Landing Page");
        $.ajax({
            type: 'get',
            url: '/user?username=' + username,
            // dataType: 'json',
            success: function (res) {
                console.log("on success", res);
                if (res.error || !res.data) {
                    reject("Failed to get user contact");
                } else {
                    resolve(res.data.contact);
                }
            },
            error: function (err) {
                console.log("error occurred when find user", err);
            }
        });
    });
}

async function prepareContentDiv(pet) {
    document.querySelector("#n_matches").innerText = pet.matchedIds.length;
    document.querySelector("#n_favourites").innerText = pet.favouriteIds.length;

    let matches = document.querySelector("#matches");
    $(matches).empty();
    // matches.innerHTML = "";
    pet.matchedIds.forEach(async function (id) {
        matches.appendChild(await getPetProfileCardById(id));
    });
    let favos = document.querySelector("#favourites");
    $(favos).empty();
    // favos.innerHTML = "";
    pet.favouriteIds.forEach(async function (id) {
        favos.appendChild(await getPetProfileCardById(id));
    });
}

async function getPetProfileCardById(petId) {
    let pet = await getPetProfileById(petId);
    let contact = await getContactByOwnerUsername(pet.ownerUsername);

    let card = document.createElement("div");
    card.className = "card";
    card.id = petId;
    card.setAttribute("draggable", "true");
    card.setAttribute("ondragstart", "drag(event)");

    let profilePic = document.createElement("img");
    profilePic.className = "card-img-top";
    profilePic.src = pet.profilePic.src;
    card.appendChild(profilePic);

    let body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML = "<ul class=\"list-group list-group-flush\">" +
        "<li class=\"list-group-item\">Name <em id=\"name\">" + pet.name + "</em></li>" +
        "<li class=\"list-group-item\">Gender<em id=\"gender\">" + pet.gender + "</em></li>" +
        "<li class=\"list-group-item\">Age<em id=\"age\">" + pet.age + "</em></li>" +
        "<li class=\"list-group-item\">Contact<em id=\"contact\">" + contact.cell + "</em></li></ul>";
    card.appendChild(body);
    return card;
}

function isInFavourites(petId) {
    // OBTAIN data from server.
    const selectedPet = getUserPet(displayedPetId);
    return selectedPet.favouriteIds.includes(petId);
}

function removeFromFavourites(petId) {
    // SEND data to server.
    let idx = curUser.pets.findIndex((p) => p._id === displayedPetId);
    let pet = curUser.pets[idx];
    let spliceIdx = pet.favouriteIds.indexOf(petId);
    pet.favouriteIds.splice(spliceIdx, 1);
    updatePetMatchesRequest(pet);
}
function removeFromMatches(petId) {
    // SEND data to server.
    let idx = curUser.pets.findIndex((p) => p._id === displayedPetId);
    let pet = curUser.pets[idx];
    let spliceIdx = curUser.pets[idx].matchedIds.indexOf(petId);
    pet.matchedIds.splice(spliceIdx, 1);
    updatePetMatchesRequest(pet);
}

function addToFavourites(petId) {
    // SEND data to server.
    let idx = curUser.pets.findIndex((p) => p._id === displayedPetId);
    let pet = curUser.pets[idx];
    pet.favouriteIds.push(petId);
    updatePetMatchesRequest(pet);
}

function addToMatches(petId) {
    let idx = curUser.pets.findIndex((p) => p._id === displayedPetId);
    let pet = curUser.pets[idx];
    pet.matchedIds.push(petId);
    updatePetMatchesRequest(pet);
}

function updatePetProfile(targetTab, cardId) {
    // SEND data to server.
    if (targetTab.id === "bin") {
        if (isInFavourites(cardId)) {
            removeFromFavourites(cardId);
        } else {
            removeFromMatches(cardId);
        }
    } else if (targetTab.id === "matches-tab") {
        removeFromFavourites(cardId);
        addToMatches(cardId);
    } else {
        removeFromMatches(cardId);
        addToFavourites(cardId);
    }

    prepareContentDiv(getUserPet(displayedPetId));
}

function allowDrop(event) {
    event.preventDefault();
    if (event.target.id === "bin")
        event.target.src = "/images/open.PNG";
}

function drag(event) {
    let matchTab = document.getElementById("matches-tab");
    let favoTab = document.getElementById("favourites-tab");
    let bin = document.getElementById("bin");
    if (matchTab.classList.contains("active"))
        favoTab.style.fontWeight = "bolder";
    else
        matchTab.style.fontWeight = "bolder";
    bin.style.display = "block";
    //if the image element is dragged vs. card element is dragged
    let cardId = event.target.classList.contains("card-img-top") ? event.target.parentElement.id : event.target.id;
    event.dataTransfer.setData("cardId", cardId);
}

function restoreTabs() {
    document.getElementById("matches-tab").style.fontWeight = "bold";
    document.getElementById("favourites-tab").style.fontWeight = "bold";
    document.getElementById("bin").style.display = "none";
}

function drop(event) {
    let dropTarget = event.target;
    let cardId = event.dataTransfer.getData("cardId");
    if (dropTarget.id === "bin" || !dropTarget.classList.contains("active")) {
        //if it is a valid drop target
        dropTarget.src = "/images/bin.jpg";
        updatePetProfile(dropTarget, cardId);
    }
    restoreTabs();
}



function getBreeds(){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'get',
            url: '/breeds',
            success: function (res) {
                resolve(res);
            },
            error: function (err) {
                reject("error occurred when loading breeds", err);
            }
        });
    });
}

$(document).ready(async function () {
    try {
        curUser = await getCurrentUser();
        curUser.pets = await getUserPets(curUser.username);
        showCurrentUser();
        petProfiles = await getAllPets();
        const breeds = await getBreeds();
        dogBreeds = breeds.Dog;
        catBreeds = breeds.Cat;
    } catch (err) {
        alert(err);
        window.location.href = "LandingPageView.html";
    }
    // generateLikes();
    filteredPets = petProfiles;
    setFilterOptions();
    filterPets();
    updateCarousel();
});

$('select#species').on('change', function () {
    updateBreed($(this).val())
    filterSpecies = $(this).val()
    filterPets('Species')
    updateCarousel()
});

$('select#gender').on('change', function () {
    filterGender = $(this).val()
    filterPets('Gender')
    updateCarousel()
});

$('select#breed').on('change', function () {
    filterBreed = $(this).val()
    filterPets('Breed')
    updateCarousel()
});

$('div.select-pet div.btn-group').click(function (e) {
    const clickedPet = e.target.id.substring(6);
    if (clickedPet !== selectedPetId) {
        selectPet(clickedPet);
        filterPets();
        updateCarousel();
    }
})

$('button#like').click(function () {
    if (filteredPets.length > 0) {
        updateLike()
        filterPets()
        updateCarousel()
    }
})

$('button#dislike').click(function () {
    if (filteredPets.length > 0) {
        updateDislike()
        filterPets()
        updateCarousel()
    }
})
