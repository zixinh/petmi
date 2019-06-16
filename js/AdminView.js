let userProfiles = []
let petProfiles = []
const userOffset = 100
const numPets = 4
let curUser = null;
let userPets;
let curPet = null;
let curPets = null;
let dogBreeds;
let catBreeds;

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

function loadBreeds(breeds, select) {
    select.innerHTML = "";
    breeds.forEach(function (breed) {
        const opt = document.createElement('option');
        opt.appendChild(document.createTextNode(breed));
        select.appendChild(opt)
    })
}

function getCurrentUser() {
    // OBTAIN data from server.
    const randContact = new Contact('snoopydogg@gmail.com', '647 - 739 - 1042', 'Goats29', 'MushyBread')
    const randLocation = new Location('Canada', 'Ontario', 'Toronto')
    const randSecurity = new SecurityQA('What\'s your favourite colour?', 'Blue')
    const randPets = []
    generatePets(numPets, randPets, userOffset, 1337)
    const randUser = new User('1337', 'csc369', 'Barack', 'Obama', 'I like cheesecake.', randContact, randLocation, randSecurity, randPets)
    return randUser
}

function getCurrentPet() {
    // OBTAIN data from server.
    return curUser.pets[0]
}

function validatePetInfo() {
    let pet = {
        ownerUsername: curUser.username,
        name: $("#name").val().trim(),
        age: $("#age").val().trim(),
        gender: $("#gender").val(),
        species: $("#species").val().trim(),
        breed: $("#breed").val().trim(),
        biography: $("#biography").val().trim(),
        //profilePic: "",
        relationshipGoal: $("#relationshipGoal").val()
    };
    for (let field in pet) {
        if (pet.hasOwnProperty(field)) {
            if(!pet[field])
                return alert("Please enter your pet's " + field.toLowerCase());
            if(!validInput(field, pet[field]))
                return alert("The input " + field.toLowerCase() + " for pet is invalid")
        }
    }
    return pet;
}

///////// Helper Function ///////////

async function getUserByUsername(username) {
    // OBTAIN data from server.
    try {
        const user = await getUserRequest(username);
        if (!user)
            return alert('No User Found');
        return user;
    } catch (e) {
        console.log(e);
    }
}

async function getPetById(petId) {
    try{
        const pet = await getPetByIdReq(petId)
        if (!pet) 
            return alert('No Pet Found');
        return pet;
    } catch (e) {
        console.log(e);
    }
}


// function getPetById(petId) {
//     // OBTAIN data from server.
//     console.log('getPetById')
//     console.log(petProfiles)
//     for (petIndex in petProfiles) {
//         console.log(petProfiles[petIndex].id)
//         if (petProfiles[petIndex].id == petId) {
//             return petProfiles[petIndex]
//         }
//     }
//     return alert('No Pet Found')
// }


function validInput(field, value) {
    let reg;
    //todo: add requirement for location/relationship goal/species/breed
    switch (field){
        case "email":
            reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return reg.test(String(value).toLowerCase());
        case "firstName":
        case "lastName":
            reg = /^\w{1,30}$/;
            return reg.test(String(value).toLowerCase());
        case "name":
            reg = /^\w{0,20}\s?\w{0,20}$/;
            return reg.test(String(value).toLowerCase());
        case "password":
            reg = /^(?=.*\w)(?=.*\d)[\w\W]{6,}$/;
            return reg.test(String(value).toLowerCase());
        case "phone":
            reg = /^\d{10}$/;
            return reg.test(String(value).toLowerCase());
        case "age":
            reg = /^\d{1,2}$/;
            return reg.test(String(value).toLowerCase());
        case "gender":
            return value ==="Male" || value === "Female";
        case "relationshipGoal":
            return value ==="Mating" || value === "Friendship";
        default:
            reg = /^[^<>"']*$/;
            return reg.test(String(value).toLowerCase());
    }
}

//////// Update HTML /////// 
function updatePetTabs(curUser) {
    const ulNav = document.getElementById('petTabs')
    ulNav.innerHTML = ''
    for (let i = 1; i < curUser.pets.length + 1; i++) {
        let petNameTag = 'Pet' + i.toString()
        let liPet = document.createElement('li')
        liPet.className = 'nav-item'
        let aPet = document.createElement('a')
        aPet.appendChild(document.createTextNode(petNameTag))
        aPet.className = 'nav-link'
        aPet.id = petNameTag + '-tab'
        aPet.setAttribute('data-toggle', 'tab')
        aPet.setAttribute('href', '#' + petNameTag)
        aPet.setAttribute('role', 'tab')
        aPet.setAttribute('aria-controls', petNameTag)
        aPet.setAttribute('aria-selected', 'false')
        const funcName = 'updatePet(curUser.pets[' + (i-1).toString() + '])'
        aPet.setAttribute('onclick', funcName)
        liPet.appendChild(aPet)
        ulNav.appendChild(liPet)
    }

}

// function updateMFTabs() {
//     document.querySelector("#n_matches").innerText = curPet.matchedIds.length
//     document.querySelector("#n_favourites").innerText = curPet.favouriteIds.length
// }

function resetPetTabs() {
    const ulNav = document.getElementById('petTabs')
    ulNav.innerHTML = ''
}

// function resetMFTabs() {
//     document.querySelector("#n_matches").innerText = ''
//     document.querySelector("#n_favourites").innerText = ''
// }

/////// Generate, Load Data and Update Form ////////
function getUserForm() {
    //Basic Info header
    const divBasicInfo = document.createElement('div')
    divBasicInfo.className = 'form-group'
    const h4BasicInfo = document.createElement('h4')
    h4BasicInfo.appendChild(document.createTextNode('Basic Information'))
    divBasicInfo.appendChild(h4BasicInfo)

    // name
    const divName = document.createElement('div')
    divName.className = 'form-row'
    // first name
    const divFirstName = document.createElement('div')
    divFirstName.classList.add('form-group', 'col-md-6')
    const labelFirstName = document.createElement('label')
    labelFirstName.appendChild(document.createTextNode('First Name'))
    labelFirstName.setAttribute('for', 'firstName')
    const inputFirstName = document.createElement('input')
    inputFirstName.className = 'form-control'
    inputFirstName.id = 'firstName'
    inputFirstName.setAttribute('type', 'text')
    inputFirstName.setAttribute('placeholder', 'First Name')
    divFirstName.appendChild(labelFirstName)
    divFirstName.appendChild(inputFirstName)
    // last name
    const divLastName = document.createElement('div')
    divLastName.classList.add('form-group', 'col-md-6')
    const labelLastName = document.createElement('label')
    labelLastName.appendChild(document.createTextNode('Last Name'))
    labelLastName.setAttribute('for', 'lastName')
    const inputLastName = document.createElement('input')
    inputLastName.className = 'form-control'
    inputLastName.id = 'lastName'
    inputLastName.setAttribute('type', 'text')
    inputLastName.setAttribute('placeholder', 'Last Name')
    divLastName.appendChild(labelLastName)
    divLastName.appendChild(inputLastName)
    divName.appendChild(divFirstName)
    divName.appendChild(divLastName)

    // email and cell row
    const divEmailCell = document.createElement('div')
    divEmailCell.className = 'form-row'
    // Email
    const divEmail = document.createElement('div')
    divEmail.classList.add('form-group', 'col-md-6')
    const labelEmail = document.createElement('label')
    labelEmail.appendChild(document.createTextNode('Email'))
    labelEmail.setAttribute('for', 'email')
    const inputEmail = document.createElement('input')
    inputEmail.className = 'form-control'
    inputEmail.id = 'email'
    inputEmail.setAttribute('type', 'text')
    inputEmail.setAttribute('placeholder', 'Email')
    divEmail.appendChild(labelEmail)
    divEmail.appendChild(inputEmail)
    // Cell
    const divCell = document.createElement('div')
    divCell.classList.add('form-group', 'col-md-6')
    const labelCell = document.createElement('label')
    labelCell.appendChild(document.createTextNode('Cell'))
    labelCell.setAttribute('for', 'cell')
    const inputCell = document.createElement('input')
    inputCell.className = 'form-control'
    inputCell.id = 'cell'
    inputCell.setAttribute('type', 'text')
    inputCell.setAttribute('placeholder', 'Cell')
    divCell.appendChild(labelCell)
    divCell.appendChild(inputCell)
    divEmailCell.appendChild(divEmail)
    divEmailCell.appendChild(divCell)

    // social media row
    const divSocialMedia = document.createElement('div')
    divSocialMedia.className = 'form-row'
    // whatsapp
    const divWhatsapp = document.createElement('div')
    divWhatsapp.classList.add('form-group', 'col-md-6')
    const labelWhatsapp = document.createElement('label')
    labelWhatsapp.appendChild(document.createTextNode('Whatsapp'))
    labelWhatsapp.setAttribute('for', 'whatsapp')
    const inputWhatsapp = document.createElement('input')
    inputWhatsapp.className = 'form-control'
    inputWhatsapp.id = 'whatsapp'
    inputWhatsapp.setAttribute('type', 'text')
    inputWhatsapp.setAttribute('placeholder', 'Whatsapp')
    divWhatsapp.appendChild(labelWhatsapp)
    divWhatsapp.appendChild(inputWhatsapp)
    // Cell
    const divFacebook = document.createElement('div')
    divFacebook.classList.add('form-group', 'col-md-6')
    const labelFacebook = document.createElement('label')
    labelFacebook.appendChild(document.createTextNode('Facebook'))
    labelFacebook.setAttribute('for', 'facebook')
    const inputFacebook = document.createElement('input')
    inputFacebook.className = 'form-control'
    inputFacebook.id = 'facebook'
    inputFacebook.setAttribute('type', 'text')
    inputFacebook.setAttribute('placeholder', 'Facebook')
    divFacebook.appendChild(labelFacebook)
    divFacebook.appendChild(inputFacebook)
    divSocialMedia.appendChild(divWhatsapp)
    divSocialMedia.appendChild(divFacebook)

    // location row
    const divLocation = document.createElement('div')
    divLocation.className = 'form-row'
    // City
    const divCity = document.createElement('div')
    divCity.classList.add('form-group', 'col-md-4')
    const labelCity = document.createElement('label')
    labelCity.appendChild(document.createTextNode('City'))
    labelCity.setAttribute('for', 'city')
    const inputCity = document.createElement('input')
    inputCity.className = 'form-control'
    inputCity.id = 'city'
    inputCity.setAttribute('type', 'text')
    inputCity.setAttribute('placeholder', 'City')
    divCity.appendChild(labelCity)
    divCity.appendChild(inputCity)
    // State
    const divState = document.createElement('div')
    divState.classList.add('form-group', 'col-md-4')
    const labelState = document.createElement('label')
    labelState.appendChild(document.createTextNode('State'))
    labelState.setAttribute('for', 'provicestate')
    const inputState = document.createElement('input')
    inputState.className = 'form-control'
    inputState.id = 'provicestate'
    inputState.setAttribute('type', 'text')
    inputState.setAttribute('placeholder', 'State')
    divState.appendChild(labelState)
    divState.appendChild(inputState)
    // Country
    const divCountry = document.createElement('div')
    divCountry.classList.add('form-group', 'col-md-4')
    const labelCountry = document.createElement('label')
    labelCountry.appendChild(document.createTextNode('Country'))
    labelCountry.setAttribute('for', 'country')
    const inputCountry = document.createElement('input')
    inputCountry.className = 'form-control'
    inputCountry.id = 'country'
    inputCountry.setAttribute('type', 'text')
    inputCountry.setAttribute('placeholder', 'Country')
    divCountry.appendChild(labelCountry)
    divCountry.appendChild(inputCountry)

    divLocation.appendChild(divCity)
    divLocation.appendChild(divState)
    divLocation.appendChild(divCountry)

    // Biography
    const divBiography = document.createElement('div')
    divBiography.className = 'form-group'
    const labelBiography = document.createElement('label')
    labelBiography.appendChild(document.createTextNode('Biography'))
    labelBiography.setAttribute('for', 'biography')
    const inputBiography = document.createElement('input')
    inputBiography.className = 'form-control'
    inputBiography.id = 'biography'
    inputBiography.setAttribute('type', 'text')
    inputBiography.setAttribute('placeholder', 'Biography')
    divBiography.appendChild(labelBiography)
    divBiography.appendChild(inputBiography)

    //Security Info header
    const divSecurityInfo = document.createElement('div')
    divSecurityInfo.className = 'form-group'
    const h4SecurityInfo = document.createElement('h4')
    h4SecurityInfo.appendChild(document.createTextNode('Security Information'))
    divSecurityInfo.appendChild(h4SecurityInfo)

    // password
    const divPassword = document.createElement('div')
    divPassword.className = 'form-group'
    const labelPassword = document.createElement('label')
    labelPassword.setAttribute('for', 'password')
    const divSubPassword = document.createElement('div')
    divSubPassword.classList.add('form-row')
    const divInputPassword = document.createElement('div')
    divInputPassword.classList.add('form-group', 'col-md-6')
    const inputPassword = document.createElement('input')
    inputPassword.className = 'form-control'
    inputPassword.id = 'password'
    inputPassword.setAttribute('type', 'password')
    inputPassword.setAttribute('placeholder', 'Password')
    const divChangePassword = document.createElement('div')
    divChangePassword.id = "divChange";
    divChangePassword.classList.add('form-group', 'col-md-6')
    const buttonPassword = document.createElement('button')
    buttonPassword.className = 'btn btn-outline-primary'
    buttonPassword.setAttribute('type', 'submit')
    buttonPassword.id = "changePassword";
    buttonPassword.onclick = changePassword;
    buttonPassword.appendChild(document.createTextNode('Change Password'))

    divInputPassword.appendChild(inputPassword)
    divChangePassword.appendChild(buttonPassword)
    divSubPassword.appendChild(divInputPassword)
    divSubPassword.appendChild(divChangePassword)
    divPassword.appendChild(labelPassword)
    divPassword.appendChild(divSubPassword)

    // security Q&A row
    const divSecurityQA = document.createElement('div')
    divSecurityQA.className = 'form-row'
    // question
    const divQuestion = document.createElement('div')
    divQuestion.classList.add('form-group', 'col-md-6')
    const labelQuestion = document.createElement('label')
    labelQuestion.appendChild(document.createTextNode('Question'))
    labelQuestion.setAttribute('for', 'question')
    const inputQuestion = document.createElement('input')
    inputQuestion.className = 'form-control'
    inputQuestion.id = 'question'
    inputQuestion.setAttribute('type', 'text')
    inputQuestion.setAttribute('placeholder', 'Question')
    divQuestion.appendChild(labelQuestion)
    divQuestion.appendChild(inputQuestion)
    // answer
    const divAnswer = document.createElement('div')
    divAnswer.classList.add('form-group', 'col-md-6')
    const labelAnswer = document.createElement('label')
    labelAnswer.appendChild(document.createTextNode('Answer'))
    labelAnswer.setAttribute('for', 'Answer')
    const inputAnswer = document.createElement('input')
    inputAnswer.className = 'form-control'
    inputAnswer.id = 'answer'
    inputAnswer.setAttribute('type', 'password')
    inputAnswer.setAttribute('placeholder', 'Answer')
    divAnswer.appendChild(labelAnswer)
    divAnswer.appendChild(inputAnswer)
    divSecurityQA.appendChild(divQuestion)
    divSecurityQA.appendChild(divAnswer)

    // save button
    const buttonSaveUser = document.createElement('button')
    buttonSaveUser.className = 'btn btn-outline-primary'
    buttonSaveUser.id = "submitForm";
    buttonSaveUser.innerText = "Save";

    const divMain = document.getElementById('details')
    divMain.innerHTML = ''
    const formUser = document.createElement('form')
    formUser.id = 'profileForm'
    formUser.appendChild(divBasicInfo)
    formUser.appendChild(divName)
    formUser.appendChild(divEmailCell)
    formUser.appendChild(divSocialMedia)
    formUser.appendChild(divLocation)
    formUser.appendChild(divBiography)
    formUser.appendChild(divSecurityInfo)
    formUser.appendChild(divPassword)
    formUser.appendChild(divSecurityQA)
    formUser.appendChild(buttonSaveUser)
    divMain.appendChild(formUser)

    $("#submitForm").click(function (e) {
        e.preventDefault();
        console.log("text---------------", e.target.innerText);
        if(e.target.innerText === "Create")
            submitCreationForm(e);
        else
            submitUpdateForm(e);
    });
}

function getPetForm(petId) {
    const divFormrowPic = document.createElement('div')
    divFormrowPic.className = 'form-row'

    //Profile Picture
    const divFormgroupPic = document.createElement('div')
    divFormgroupPic.classList.add('form-group', 'col-md-6')

    const labelPic = document.createElement('label')
    labelPic.appendChild(document.createTextNode('Profile Picture'))

    const divPic = document.createElement('div')
    const imgPic = document.createElement('img')
    divPic.setAttribute('style', 'margin-bottom: 1rem')
    imgPic.setAttribute('style', 'width: 12rem')
    imgPic.id = 'profilePic'
    divPic.appendChild(imgPic)

    divFormgroupPic.appendChild(labelPic)
    divFormgroupPic.appendChild(divPic)

    // Carousal 
    const divFormgroupSlides = document.createElement('div')
    divFormgroupSlides.classList.add('form-group', 'col-md-6')

    const labelSlides = document.createElement('label')
    labelSlides.appendChild(document.createTextNode('Gallery'))

    const divCarousel = document.createElement('div')
    divCarousel.classList.add('carousel', 'slide')
    divCarousel.setAttribute('data-ride', 'carousel')
    divCarousel.setAttribute('style', 'width: 12rem')
    divCarousel.setAttribute('id', 'carouselIndicator')

    const olCarousel = document.createElement('ol')
    olCarousel.className = 'carousel-indicators'
    olCarousel.id = "buttons";

    const divCarouselInner = document.createElement('div')
    divCarouselInner.className = 'carousel-inner'
    divCarouselInner.id = "gallery";
    const aControlPrev = document.createElement('a')
    aControlPrev.className = 'carousel-control-prev'
    aControlPrev.setAttribute('href', '#carouselIndicator')
    aControlPrev.setAttribute('role', 'button')
    aControlPrev.setAttribute('data-slide', 'prev')

    const spanControlPrev = document.createElement('span')
    spanControlPrev.classList.add('carousel-control-prev-icon')
    spanControlPrev.setAttribute('aria-hidden', 'true')

    const spanControlPrevSr = document.createElement('span')
    spanControlPrevSr.appendChild(document.createTextNode('Previous'))
    spanControlPrevSr.className = 'sr-only'

    aControlPrev.appendChild(spanControlPrev)
    aControlPrev.appendChild(spanControlPrevSr)

    const aControlNext = document.createElement('a')
    aControlNext.className = 'carousel-control-next'
    aControlNext.setAttribute('href', '#carouselIndicator')
    aControlNext.setAttribute('role', 'button')
    aControlNext.setAttribute('data-slide', 'next')

    const spanControlNext = document.createElement('span')
    spanControlNext.className = 'carousel-control-next-icon'
    spanControlNext.setAttribute('aria-hidden', 'true')

    const spanControlNextSr = document.createElement('span')
    spanControlNextSr.appendChild(document.createTextNode('Next'))
    spanControlNextSr.className = 'sr-only'

    aControlNext.appendChild(spanControlNext)
    aControlNext.appendChild(spanControlNextSr)

    divCarousel.appendChild(olCarousel)
    divCarousel.appendChild(divCarouselInner)
    divCarousel.appendChild(aControlPrev)
    divCarousel.appendChild(aControlNext)

    divFormgroupSlides.appendChild(labelSlides)
    divFormgroupSlides.appendChild(divCarousel)

    divFormrowPic.appendChild(divFormgroupPic)
    divFormrowPic.appendChild(divFormgroupSlides)

    // Change Picture  
    const divFormrowChangePic = document.createElement('div')
    divFormrowChangePic.setAttribute('style', 'margin-bottom: 0.5rem')
    divFormrowChangePic.className = 'form-row'

    const divChangePic = document.createElement('div')
    divChangePic.className = 'col-md-6'
    const divFile = document.createElement('div')
    divFile.classList.add('custom-file')
    const inputFile = document.createElement('input')
    inputFile.className = 'custom-file-input'
    inputFile.id = 'validatedCustomFile'
    inputFile.setAttribute('type', 'file')
    inputFile.required = true
    const labelFile = document.createElement('label')
    labelFile.className = 'custom-file-label'
    labelFile.setAttribute('for', 'validatedCustomFile')
    labelFile.appendChild(document.createTextNode('Change Picture'))

    divFile.appendChild(inputFile)
    divFile.appendChild(labelFile)
    divChangePic.appendChild(divFile)

    const divAddPic = document.createElement('div')
    divAddPic.classList.add('col-md-3')
    labelAddPic = document.createElement('label')
    labelAddPic.className = 'btn btn-outline-primary'
    const inputAddPic = document.createElement('input')
    inputAddPic.id = 'addToGallery'
    inputAddPic.setAttribute('type', 'file')
    inputAddPic.hidden = true
    labelAddPic.appendChild(document.createTextNode('Add Picture'))
    labelAddPic.appendChild(inputAddPic)
    divAddPic.appendChild(labelAddPic)

    const divRemovePic = document.createElement('div')
    divRemovePic.classList.add('col-md-3')
    const buttonRemovePic = document.createElement('button')
    buttonRemovePic.id = 'RemoveFromGallery'
    buttonRemovePic.className = 'btn btn-outline-primary'
    buttonRemovePic.setAttribute('type', 'button')
    buttonRemovePic.appendChild(document.createTextNode('Remove Picture'))
    divRemovePic.appendChild(buttonRemovePic)

    divFormrowChangePic.appendChild(divChangePic)
    divFormrowChangePic.appendChild(divAddPic)
    divFormrowChangePic.appendChild(divRemovePic)

    // name, age & gender
    divFormRowNAG = document.createElement('div')
    divFormRowNAG.className = 'form-row'

    const divName = document.createElement('div')
    divName.classList.add('form-group', 'col-md-6')
    const labelName = document.createElement('label')
    labelName.appendChild(document.createTextNode('Name'))
    labelName.setAttribute('for', 'name')
    const inputName = document.createElement('input')
    inputName.className = 'form-control'
    inputName.id = 'name'
    inputName.setAttribute('type', 'text')
    inputName.setAttribute('placeholder', 'Name')
    divName.appendChild(labelName)
    divName.appendChild(inputName)

    const divAge = document.createElement('div')
    divAge.classList.add('form-group', 'col-md-3')
    const labelAge = document.createElement('label')
    labelAge.appendChild(document.createTextNode('Age'))
    labelAge.setAttribute('for', 'age')
    const inputAge = document.createElement('input')
    inputAge.className = 'form-control'
    inputAge.id = 'age'
    inputAge.setAttribute('type', 'text')
    inputAge.setAttribute('placeholder', 'Age')
    divAge.appendChild(labelAge)
    divAge.appendChild(inputAge)

    const divGender = document.createElement('div')
    divGender.classList.add('form-group', 'col-md-3')
    const labelGender = document.createElement('label')
    labelGender.appendChild(document.createTextNode('gender'))
    labelGender.setAttribute('for', 'gender')
    const selectGender = document.createElement('select')
    selectGender.id = 'gender'
    selectGender.className = 'form-control'
    const option1 = document.createElement('option')
    option1.appendChild(document.createTextNode('Choose...'))
    option1.selected = true
    const option2 = document.createElement('option')
    option2.appendChild(document.createTextNode('Male'))
    const option3 = document.createElement('option')
    option3.appendChild(document.createTextNode('Female'))
    selectGender.appendChild(option1)
    selectGender.appendChild(option2)
    selectGender.appendChild(option3)
    divGender.appendChild(labelGender)
    divGender.appendChild(selectGender)

    divFormRowNAG.appendChild(divName)
    divFormRowNAG.appendChild(divAge)
    divFormRowNAG.appendChild(divGender)

    // species & breed
    divFormRowSB = document.createElement('div')
    divFormRowSB.className = 'form-row'

    const divSpecies = document.createElement('div')
    divSpecies.classList.add('form-group', 'col-md-4')
    const labelSpecies = document.createElement('label')
    labelSpecies.appendChild(document.createTextNode('Species'))
    labelSpecies.setAttribute('for', 'species')
    const selectSpecies = document.createElement('select');
    selectSpecies.className = 'form-control'
    selectSpecies.id = 'species';
    const opt1 = document.createElement('option');
    opt1.appendChild(document.createTextNode('Dog'))
    const opt2 = document.createElement('option')
    opt2.appendChild(document.createTextNode('Cat'))
    selectSpecies.appendChild(opt1)
    selectSpecies.appendChild(opt2)
    divSpecies.appendChild(labelSpecies)
    divSpecies.appendChild(selectSpecies)

    const divBreed = document.createElement('div')
    divBreed.classList.add('form-group', 'col-md-4')
    const labelBreed = document.createElement('label')
    labelBreed.appendChild(document.createTextNode('Breed'))
    labelBreed.setAttribute('for', 'breed')
    const selectBreeds = document.createElement('select')
    selectBreeds.className = 'form-control'
    selectBreeds.id = 'breed';
    loadBreeds(dogBreeds, selectBreeds);
    divBreed.appendChild(labelBreed);
    divBreed.appendChild(selectBreeds);

    divFormRowSB.appendChild(divSpecies)
    divFormRowSB.appendChild(divBreed)

    selectSpecies.onchange = function(){
        if($("#species").val()==="Dog"){
            loadBreeds(dogBreeds, selectBreeds)
        } else{
            loadBreeds(catBreeds, selectBreeds)
        }
    };

    //relationship goal
    const divRelation = document.createElement('div');
    divRelation.classList.add('form-group', 'col-md-4');
    const labelRelation = document.createElement('label');
    labelRelation.appendChild(document.createTextNode('Relationship Goal'));
    labelRelation.setAttribute('for', 'relationshipGoal');
    const selectRelation = document.createElement('select');
    selectRelation.id = 'relationshipGoal';
    selectRelation.className = 'form-control';
    const type = document.createElement('option');
    type.appendChild(document.createTextNode('Choose...'));
    type.selected = true;
    const type1 = document.createElement('option');
    type1.appendChild(document.createTextNode('Mating'))
    const type2 = document.createElement('option')
    type2.appendChild(document.createTextNode('Friendship'))
    selectRelation.appendChild(type)
    selectRelation.appendChild(type1)
    selectRelation.appendChild(type2)
    divRelation.appendChild(labelRelation)
    divRelation.appendChild(selectRelation)
    divFormRowSB.appendChild(divRelation)

    // Biography
    const divBio = document.createElement('div')
    divBio.className = 'form-group'
    const labelBio = document.createElement('label')
    labelBio.appendChild(document.createTextNode('Biography'))
    labelBio.setAttribute('for', 'biography')
    const inputBio = document.createElement('input')
    inputBio.className = 'form-control'
    inputBio.id = 'biography'
    inputBio.setAttribute('type', 'text')
    inputBio.setAttribute('placeholder', 'Biography')
    divBio.appendChild(labelBio)
    divBio.appendChild(inputBio)

    // save
    const buttonSave = document.createElement('button')
    buttonSave.className = 'btn btn-outline-primary'
    buttonSave.setAttribute('type', 'submit')
    buttonSave.appendChild(document.createTextNode('Save'))
    // buttonSave.id="update";
    buttonSave.onclick = function (e) {
        e.preventDefault();
        if(petId)
            updatePetReq(petId);
        else
            createPet();
    };

    const form = document.createElement('form')
    form.appendChild(divFormrowPic)
    form.appendChild(divFormrowChangePic)
    form.appendChild(divFormRowNAG)
    form.appendChild(divFormRowSB)
    form.appendChild(divBio)
    form.appendChild(buttonSave)

    const main = document.getElementById('details')
    main.innerHTML = ''
    main.appendChild(form)
    //for hard coding purpose only

}

async function loadUserTable(users) {
    const tbodyUser = document.getElementById('tableUsers').getElementsByTagName('tbody')[0]
    for (let userIndex in users) {
        let trRow = document.createElement('tr')
        let th = document.createElement('th')
        th.setAttribute('scope', 'row')
        let buttonUser = document.createElement('button')
        buttonUser.id = users[userIndex].username;
        buttonUser.className = 'btn btn-link'
        buttonUser.type = 'button'
        buttonUser.setAttribute('style', 'color: black')
        let paramName = 'searchUser( \"' + buttonUser.id + '\")';
        buttonUser.setAttribute('onclick', paramName)
        buttonUser.innerText = buttonUser.id;
        // buttonUser.appendChild(document.createTextNode(users[userIndex].userId.toString()))
        th.appendChild(buttonUser)
        trRow.appendChild(th)

        for (let petIndex in users[userIndex].pets) {
            let td = document.createElement('td')
            let buttonPet = document.createElement('button')
            let pet = await getPetById(users[userIndex].pets[petIndex])
            buttonPet.id = pet._id
            buttonPet.className = 'btn btn-link'
            buttonPet.type = 'button'
            buttonPet.setAttribute('style', 'color: black')
            let paramName = 'searchPet(\"' + buttonPet.id + '\")';
            buttonPet.setAttribute('onclick', paramName)
            buttonPet.appendChild(document.createTextNode(pet.name))
            td.appendChild(buttonPet)
            trRow.appendChild(td)
        }
        tbodyUser.appendChild(trRow)
    }
}

function loadUserForm() {
    // updatePetTabs(curUser)
    for (let key in curUser) {
        if (curUser[key] != null) {
            if (key === "contact" || key === "location" || key === "securityQA") {
                for (let subkey in curUser[key]) {
                    if (curUser[key][subkey] != null) {
                        let idName = '#' + subkey;
                        $(idName).val(curUser[key][subkey]);
                    }
                }
            } else {
                let idName = '#' + key;
                $(idName).val(curUser[key]);
            }
        }
    }
}

function loadPetForm() {
    $('#name').val(curPet.name)
    $('#age').val(curPet.age)
    $('#gender').val(curPet.gender)
    $('#species').val(curPet.species)
    $('#breed').val(curPet.breed)
    $('#biography').val(curPet.biography)

    // $('#profilePic').attr('src', curPet.profilePic.path)
    // $('#profilePic').attr('alt', curPet.profilePic.description)

    const carouselIndicator = document.getElementsByClassName('carousel-indicators')[0]
    const carouselInner = document.getElementsByClassName('carousel-inner')[0]
    for (picIndex in curPet.gallery) {
        let liImg = document.createElement('li')
        liImg.setAttribute('data-target', '#carouselIndicator')
        liImg.setAttribute('data-slide-to', picIndex.toString())
        if (picIndex == 0) {
            liImg.className = 'active'
        }
        carouselIndicator.appendChild(liImg)

        let divImage = document.createElement('div')
        divImage.className = 'carousel-item'
        if (picIndex == 0) {
            divImage.classList.add('active')
        }
        let imageItem = document.createElement('img')
        imageItem.src = curPet.gallery[picIndex].path
        imageItem.alt = curPet.gallery[picIndex].description
        imageItem.className = "d-block w-100"
        divImage.appendChild(imageItem)
        carouselInner.appendChild(divImage)
    }

}


// function AddFavForm() {
//     const FavTable = document.getElementById('FavsTable')
//     if (!FavTable){
//         return alert('please select favorites tab')
//     }

//     const addForm = document.createElement('form')
//     divFormRow = document.createElement('div')
//     divFormRow.className = 'form-row'

//     const divPetId = document.createElement('div')
//     divPetId.classList.add('form-group', 'col-md-6')
//     const labelPetId = document.createElement('label')
//     labelPetId.appendChild(document.createTextNode('PetId'))
//     labelPetId.setAttribute('for', 'petId')
//     const inputPetId = document.createElement('input')
//     inputPetId.className = 'form-control'
//     inputPetId.id = 'petId'
//     inputPetId.setAttribute('type', 'text')
//     inputPetId.setAttribute('placeholder', 'petId')
//     divPetId.appendChild(labelPetId)
//     divPetId.appendChild(inputPetId)

//     const divAddButton = document.createElement('div')
//     divAddButton.classList.add('form-group', 'col-md-6')
//     const labelAddButton = document.createElement('label')
//     labelAddButton.appendChild(document.createTextNode('Press Add once fill in petId'))
//     labelAddButton.setAttribute('for', 'addButton')
//     const buttonAdd = document.createElement('button')
//     buttonAdd.className = 'btn btn-outline-primary'
//     buttonAdd.setAttribute('type', 'submit')
//     buttonAdd.id = 'addButton'
//     buttonAdd.appendChild(document.createTextNode('Add'))

//     addForm.appendChild(divPetId)
//     addForm.appendChild(buttonAdd)
//     FavTable.appendChild(addForm)

//     $("#addButton").click(function (e){
//         e.preventDefault()
//         let petId = $('#petId').val().trim()
//         addFav(petId)
//     })

// }

// function AddMatchForm() {
//     const MatchTable = document.getElementById('MatchTable')
//     if (!MatchTable){
//         return alert('please select matches tab')
//     }

//     const addForm = document.createElement('form')
//     divFormRow = document.createElement('div')
//     divFormRow.className = 'form-row'

//     const divPetId = document.createElement('div')
//     divPetId.classList.add('form-group', 'col-md-6')
//     const labelPetId = document.createElement('label')
//     labelPetId.appendChild(document.createTextNode('PetId'))
//     labelPetId.setAttribute('for', 'petId')
//     const inputPetId = document.createElement('input')
//     inputPetId.className = 'form-control'
//     inputPetId.id = 'petId'
//     inputPetId.setAttribute('type', 'text')
//     inputPetId.setAttribute('placeholder', 'petId')
//     divPetId.appendChild(labelPetId)
//     divPetId.appendChild(inputPetId)

//     const divAddButton = document.createElement('div')
//     divAddButton.classList.add('form-group', 'col-md-6')
//     const labelAddButton = document.createElement('label')
//     labelAddButton.appendChild(document.createTextNode('Press Add once fill in petId'))
//     labelAddButton.setAttribute('for', 'addButton')
//     const buttonAdd = document.createElement('button')
//     buttonAdd.className = 'btn btn-outline-primary'
//     buttonAdd.setAttribute('type', 'submit')
//     buttonAdd.id = 'addButton'
//     buttonAdd.appendChild(document.createTextNode('Add'))

//     addForm.appendChild(divPetId)
//     addForm.appendChild(buttonAdd)
//     MatchTable.appendChild(addForm)

//     $("#addButton").click(function (e){
//         e.preventDefault()
//         let petId = $('#petId').val().trim()
//         addMatch(petId)
//     })

// }

// function updateMatchesTable(curPet) {
//     // SEND data to server.
//     const tableMatches = document.createElement('table')
//     tableMatches.classList.add('table', 'table-hover')
//     tableMatches.id = 'MatchTable'

//     const tableHead = document.createElement('thead')
//     const trHead = document.createElement('tr')
//     const thHeadPetId = document.createElement('th')
//     thHeadPetId.appendChild(document.createTextNode('PetId'))
//     thHeadPetId.setAttribute('scope', 'col')
//     const thHeadPetName = document.createElement('th')
//     thHeadPetName.appendChild(document.createTextNode('PetName'))
//     thHeadPetName.setAttribute('scope', 'col')
//     const thHeadDelete = document.createElement('th')
//     thHeadDelete.appendChild(document.createTextNode('Delete'))
//     thHeadDelete.setAttribute('scope', 'col')
//     trHead.appendChild(thHeadPetId)
//     trHead.appendChild(thHeadPetName)
//     trHead.appendChild(thHeadDelete)
//     tableHead.appendChild(trHead)
//     tableMatches.appendChild(tableHead)

//     const tableBody = document.createElement('tbody')
//     for (matchid in curPet.matchedIds.length) {
//         let trRow = document.createElement('tr')
//         let tdPetId = document.createElement('td')
//         tdPetId.appendChild(document.createTextNode(curPet.matchedIds[matchid]))
//         let tdPetName = document.createElement('td')
//         tdPetId.appendChild(document.createTextNode(curPet.name))
//         let tdDeleteButton = document.createElement('button')
//         tdDeleteButton.appendChild(document.createTextNode('Delete'))
//         tdDeleteButton.className = 'btn btn-link'
//         tdDeleteButton.classList.add('deleteMatch')
//         tdDeleteButton.id = curPet.matchedIds[matchid]
//         tdDeleteButton.setAttribute('type', 'button')
//         tdDeleteButton.setAttribute('style', 'color: black')
//         trRow.appendChild(tdPetId)
//         trRow.appendChild(tdDeleteButton)
//         tableBody.appendChild(trRow)
//     }
//     tableMatches.appendChild(tableBody)
//     const divMain = document.getElementById('details')
//     divMain.innerHTML = ''
//     divMain.appendChild(tableMatches)

//     $('.deleteMatch').each(function(){
//         let petId = $(this).attr('id')
//         deleteMatch(petId)
//     })
// }

// function updateFavoritesTable(curPet) {
//     // SEND data to server.
//     const tableFavs = document.createElement('table')
//     tableFavs.classList.add('table', 'table-hover')
//     tableFavs.id = 'FavTable'

//     const tableHead = document.createElement('thead')
//     const trHead = document.createElement('tr')
//     const thHeadPetId = document.createElement('th')
//     thHeadPetId.appendChild(document.createTextNode('PetId'))
//     thHeadPetId.setAttribute('scope', 'col')
//     const thHeadPetName = document.createElement('th')
//     thHeadPetName.appendChild(document.createTextNode('PetName'))
//     thHeadPetName.setAttribute('scope', 'col')
//     const thHeadDelete = document.createElement('th')
//     thHeadDelete.appendChild(document.createTextNode('Delete'))
//     thHeadDelete.setAttribute('scope', 'col')
//     trHead.appendChild(thHeadPetId)
//     trHead.appendChild(thHeadPetName)
//     trHead.appendChild(thHeadDelete)
//     tableHead.appendChild(trHead)
//     tableFavs.appendChild(tableHead)

//     const tableBody = document.createElement('tbody')
//     for (favid in curPet.favouriteIds) {
//         let trRow = document.createElement('tr')
//         let tdPetId = document.createElement('td')
//         tdPetId.appendChild(document.createTextNode(curPet.favouriteIds[favid]))
//         let tdPetName = document.createElement('td')
//         tdPetId.appendChild(document.createTextNode(name))
//         let tdDeleteButton = document.createElement('button')
//         tdDeleteButton.appendChild(document.createTextNode('Delete'))
//         tdDeleteButton.className = 'btn btn-link'
//         tdDeleteButton.classList.add('deleteFav')
//         tdDeleteButton.id = curPet.favouriteIds[favid]
//         tdDeleteButton.setAttribute('type', 'button')
//         tdDeleteButton.setAttribute('style', 'color: black')
//         trRow.appendChild(tdPetId)
//         trRow.appendChild(tdDeleteButton)
//         tableBody.appendChild(trRow)
//     }
//     tableFavs.appendChild(tableBody)
//     const divMain = document.getElementById('details')
//     divMain.innerHTML = ''
//     divMain.appendChild(tableFavs)

//     $('.deleteFav').each(function(){
//         let petId = $(this).attr('id')
//         deleteFav(petId)
//     })

// }

function updateUser(curUser) {
    //resetMFTabs()
    updatePetTabs(curUser)
    getUserForm()
    loadUserForm()
}

function updatePet(pet) {
    if(pet){
        curPet = pet;
    } else {
        const ulNav = document.getElementById('petTabs');
        ulNav.innerHTML = ""
    }
    // updateMFTabs()
    getPetForm(curPet._id)
    loadPetForm()
}

/////// server calls //////
function getAllUsers() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: '/user/users',
            dataType: 'json',
            success: function (res) {
                if (res.error) {
                    reject(res.error);
                } else {
                    resolve(res.data);
                }
            },
            error: function (err) {
                reject(err);
            }
        });
    });
    // generateUserProfiles(15)
}

function getAllPets(){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: '/pet/all',
            dataType: 'json',
            success: function (res) {
                if (res.error) {
                    reject(res.error);
                } else {
                    resolve(res.data);
                }
            },
            error: function (err) {
                reject(err);
            }
        });
    })
}

function getUserRequest(username) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: '/user?username=' + username,
            data: {username: username},
            // dataType: 'json',
            success: function (res) {
                if (res.error) {
                    reject(res.error);
                } else {
                    resolve(res.data);
                }
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}

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

function getPetByIdReq(petId){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: '/pet/' + petId,
            dataType: 'json',
            success: function (res) {
                if (res.error) {
                    reject(res.error);
                } else {
                    resolve(res.data);
                }
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}

function getPetsByUsername(username) {
    return new Promise((resolve, reject) => {
        if (!username) {
            return reject('Session expired, directing to admin main page')
        }
        $.ajax({
            type: 'GET',
            url: '/pet/owner/' + username,
            success: function (res) {
                console.log("on success", res)
                if (res.error || !res.data) {
                    reject('Invalid image state, directing to admin main page')
                } else {
                    let pets = res.data
                    resolve(pets)
                }
            },
            error: function (err) {
                console.log('error occurred when getting pets by username', err)
            }
        })
    })}

// imageId = curPet.profilePic.imageId or curPet.gallery[i].imageId
// image = curPet.profilePic or curPet.gallery[i]
function postImageReq(image) {
    // return a mongodb id of posted picture, need to add it to imageId in object
    $.ajax({
        type: 'POST',
        url: '/image/',
        data: image,
        dataType: "json",            
        success: function (res) {
            console.log("on success", res)
            if (res.error || !res.data) {
                return alert('Invalid image state, directing to admin main page')
            } else {
                let imageId = res.data._id
                return imageId
            }
        },
        error: function (err) {
            console.log('error occurred when delete image', err)
        }
    })
}

function sendNewImageRequest(formData){
    console.log("sending image request!!!!!");
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/image/profilePic',
            data: formData,
            type: 'POST',
            contentType: false,
            processData: false,
            success: function (res) {
                console.log("on success for image", res);
                if (res.error) {
                    return reject(res.error);
                } else {
                    resolve(res.msg);
                }
            },
            error: function (err) {
                console.log("error occurred when uploading image", err);
            }
        });
    })
}

function postStoreImageReq(image) {
    $.ajax({
        type: 'POST',
        url: '/image/save',
        data: image,
        dataType: "json",            
        success: function (res) {
            console.log("on success", res)
            if (res.error || !res.data) {
                return alert('Invalid image state, directing to admin main page')
            } else {
                let imageId = res.data._id
                return imageId
            }
        },
        error: function (err) {
            console.log('error occurred when delete image', err)
        }
    })

}

function deleteImageReq(imageId) {
    $.ajax({
        type: 'DELETE',
        url: '/image/' + imageId,
        success: function (res) {
            console.log("on success", res)
            if (res.error || !res.data) {
                return alert('Invalid image state, directing to admin main page')
            } else {
                let image = res.data
                return image
            }
        },
        error: function (err) {
            console.log('error occurred when delete image', err)
        }
    })
}

function getImageReq(imageId) {
    $.ajax({
        type: 'GET',
        url: '/image/' + imageId,
        success: function (res) {
            console.log("on success", res)
            if (res.error || !res.data) {
                return alert('Invalid image state, directing to admin main page')
            } else {
                let image = res.data
                return image
            }
        },
        error: function (err) {
            console.log('error occurred when find image', err)
        }
    })
}

function patchImageReq(image) {
    $.ajax({
        type: 'PATCH',
        url: '/image/' + image.imageId,
        data: JSON.stringify({path: image.path, description: image.description}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",            
        success: function (res) {
            console.log("on success", res)
            if (res.error || !res.data) {
                return alert('Invalid image state, directing to admin main page')
            } else {
                let imageId = res.data._id
                return imageId
            }
        },
        error: function (err) {
            console.log('error occurred when delete image', err)
        }
    })
}

function patchStoreImageReq(image) {
    $.ajax({
        type: 'PATCH',
        url: '/image/save/' + image.imageId,
        data: image,
        dataType: "json",            
        success: function (res) {
            console.log("on success", res)
            if (res.error || !res.data) {
                return alert('Invalid image state, directing to admin main page')
            } else {
                let imageId = res.data._id
                return imageId
            }
        },
        error: function (err) {
            console.log('error occurred when delete image', err)
        }
    })
}

function updatePetReq(petId) {
    const pet = validatePetInfo();
    console.log("pet in updatePet", pet);
    if(pet){
        $.ajax({
            type: 'PATCH',
            url: '/pet/'+petId,
            data: pet,
            dataType: 'json',
            success: function (res) {
                console.log("on success", res);
                if (res.error) {
                    return alert(res.error);
                } else {
                    alert(res.msg);
                    //location.reload();
                }
            },
            error: function (err) {
                console.log("error occurred when signup", err);
            }
        });
    }
}

function createPet() {
    const pet = validatePetInfo();
    if(pet){
        $.ajax({
            type: 'POST',
            url: '/pet/add',
            data: pet,
            dataType: 'json',
            success: function (res) {
                if (res.error) {
                    return alert(res.error);
                } else {
                    alert(res.msg);
                    //location.reload();
                    updateUserPets(res.data._id);
                    //update pets in pet profile
                }
            },
            error: function (err) {
                console.log("error occurred when signup", err);
            }
        });
    }
}

function updateUserPets(petId) {
    $.ajax({
        type: 'PATCH',
        url: '/user/add?username=' + curUser.username + "&petId="+petId,
        dataType: 'json',
        success: function (res) {
            if (res.error) {
                return alert(res.error);
            }
        },
        error: function (err) {
            console.log("error occurred when adding pet to user", err);
        }
    });
}

function deletePetReq(petId){
    if(petId){
        $.ajax({
            type: 'DELETE',
            url: '/pet/' + petId,
            success: function (res) {
                if (res.error) {
                    return alert(res.error);
                } else {
                    return alert(res.msg);
                }
            },
            error: function (err) {
                console.log("error occurred when signup", err);
            }
        });
    }    
}

//interaction functions
async function searchUser(username) {
    curUser = await getUserByUsername(username);
    userPets = await getUserPets(username);
    curUser.pets = userPets;
    console.log("curUser", curUser);
    if (curUser !== undefined) {
        updateUser(curUser)
    }
}

async function searchPet(petId) {
    curPet = await getPetById(petId)
    console.log("searching", petId, "curPet", curPet);
    if (curPet !== undefined) {
        curUser = await getUserByUsername(curPet.ownerUsername);
        //resetMFTabs()
        //updatePetTabs(curUser)
        updatePet(curPet)
    }
}

async function submitCreationForm(e) {
    console.log("submiting form");
    e.preventDefault();
    if($("#password").val()!==$("#re-password").val())
        return alert("The retyped password does not match");
    //use regex to validate user input
    if(!$("#password").val())
        return alert("Please enter password");

    //gather form data
    let user = {
        username: $("#email").val(),
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        password:$("#password").val(),
        city:$("#city").val(),
        province:$("#province").val(),
        country:$("#country").val(),
        biography:$("#biography").val(),
        email:$("#email").val(),
        phone:$("#cell").val(),
        whatsapp: $("#whatsapp").val(),
        facebook: $("#facebook").val(),
        question:$("#question").val(),
        answer:$("#answer").val()
    };

    //check if username already existed
    let userFound = await validateEmail(user.email);
    if(userFound)
        return displayFormError("Email already taken, please use another one");

    //use regex to validate user input
    for (let field in user) {
        if (user.hasOwnProperty(field)) {
            if(!user[field]&& field!=="biography" && field!=="whatsapp" && field!=="facebook" && field!=="username")
                return displayFormError("Please enter your " + field.toLowerCase());
            if(!validInput(field, user[field]))
                return displayFormError("The input " + field.toLowerCase() + " for user is invalid")
        }
    }

    //get pet object ids from server call
    try{
        user.pets = await getPetsByUsername(user.username);
    } catch (e) {
        displayFormError(e);
    }

    $.ajax({
        type: 'POST',
        url: '/user/add',
        data: user,
        dataType: 'json',
        success: function(res) {
            console.log("on success", res);
            if(res.error){
                return alert(res.error);
            }else{
                console.log(res.msg, res.data);
                alert(res.msg);
                window.location.reload();
            }
        },
        error: function (err) {
            console.log("error occurred when signup",err);
        }
    });
}

function submitUpdateForm(e) {
    console.log("updating form");
    e.preventDefault();
    //use regex to validate user input

    //gather form data
    let user = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        city:$("#city").val(),
        province:$("#province").val(),
        country:$("#country").val(),
        biography:$("#biography").val(),
        email:$("#email").val(),
        phone:$("#cell").val(),
        whatsapp: $("#whatsapp").val(),
        facebook: $("#facebook").val(),
        question:$("#question").val(),
        answer:$("#answer").val()
    };

    $.ajax({
        type: 'PATCH',
        url: '/user?username=' + curUser.username,
        data: user,
        dataType: 'json',
        success: function(res) {
            console.log("on success", res);
            if(res.error){
                return alert(res.error);
            }else{
                console.log(res.msg, res.data);
                alert(res.msg);
                //location.reload();
            }
        },
        error: function (err) {
            alert("Failed to update user information due to internal error");
        }
    });
}

function getUserCreationForm() {
    getUserForm();
    $("#changePassword").remove()
    //insert a retype-password field
    const retypePassword = document.createElement('input');
    retypePassword.className = 'form-control'
    retypePassword.id = 're-password'
    retypePassword.setAttribute('type', 'password')
    retypePassword.setAttribute('placeholder', 'Retype Password');
    $("#divChange").append(retypePassword);
    //change button text
    $("#submitForm").text("Create");
}

function changePassword(e) {
    e.preventDefault();
    //validate password

    let oldPwd = curUser.password;
    let newPwd = $("#password").val();
    if(!oldPwd || !newPwd)
        return displayFormMsg("Please enter your password");

    $.ajax({
        type: 'PATCH',
        url: '/user/password?username=' + curUser.username,
        data: {oldPwd: oldPwd, newPwd:newPwd},
        dataType: 'json',
        success: function(res) {
            console.log("on success", res);
            if(res.error){
                return alert(res.error);
            }else{
                console.log(res.msg, res.data);
                alert(res.msg);
                $("#password").val(res.data.password);
            }
        },
        error: function (err) {
            alert("Failed to update user password due to internal error");
        }
    });
}

function deleteUser() {
    if (confirm('Are you sure you want to delete user ' + curUser.username + " ?")) {
        $.ajax({
            type: 'DELETE',
            url: '/user?username=' + curUser.username,
            dataType: 'json',
            success: function(res) {
                console.log("on success", res);
                if(res.error){
                    return alert(res.error);
                }else{
                    console.log(res.msg, res.data);
                    alert(res.msg);
                    //location.reload();
                }
            },
            error: function (err) {
                alert("Failed to delete user due to internal error");
            }
        });
    }
}

async function changeProfilePic(e){
    e.preventDefault();
    let path = "./images/" + curPet._id;

    let formData = new FormData();
    formData.append('file', $('#validatedCustomFile')[0].files[0]);

    // update database
    if (!curPet.profilePic || !curPet.profilePic.imageId) {
        let image = {
            path: path,
            description: null,
            formData: formData
        }
        curPet.profilePic = new Picture(path, null)
        try {
            const imageId = await postStoreImageReq(image);
            if (!imageId){
                return alert('error: post image profile pic');
            } else {
                curPet.profilePic.imageId = imageId
                console.log('image successfully posted')
            }
        } catch (e) {
            console.log(e);
        }
    } else {
        let image = {
            path: path,
            description: null,
            formData: formData
        }
        curPet.profilePic.path = path
        try {
            const imageId = await patchStoreImageReq(image);
            if (!imageId){
                return alert('ImageId retrieval problem');
            } else {
                console.log('image sucessfully updated')
            }
        } catch (e) {
            console.log(e);
        }
    }

    // update html
    $('#profilePic').attr('src', curPet.profilePic.path)
    $('#profilePic').attr('alt', curPet.profilePic.description)

}

async function deleteCurCarouselPic(e){
    e.preventDefault()

    if (!curPet) {
        return console.log('no pet available')
    }

    let curSlide = document.getElementsByTagName('ol').getElementsByClassName('active')
    let curSlideIndex = curSlide.getAttribute('data-slide-to')

    // image deleted from database
    try {
        const image = await deleteImageReq(curPet.gallery[curSlideIndex].imageId);
        if (!image){
            return alert('error: image delete request');
        } else {
            console.log('image sucessfully updated')
        }
    } catch (e) {
        console.log(e);
    }

    // delete image in server folder
    fs.unlink(curPet.gallery[curSlideIndex].path, (err) => {
        if (err){
            console.log(err)
        }
        console.log(curPet.gallery[curSlideIndex].path + 'was deleted');
    })

    // delete picture object from gallery
    curPet.gallery.splice(curSlideIndex, 1)

    // update html
    loadPetForm()
}

async function addCarouselPic(e){
    e.preventDefault()

    if (!curPet) {
        return console.log('no pet available')
    } 

    let formData = new FormData();
    formData.append('file', $('#addToGallery')[0].files[0]);

    let newimage = new Picture(null, null)

    // get imageId

    // get imageId
    try {
        const imageId = await postImageReq(newimage);
        if (!imageId){
            return alert('error: image post request');
        } else {
            newimage.imageId = imageId;
            console.log('image successfully posted')
        }
    } catch (e) {
        console.log(e);
    }

    let path = "./images/" + newimage.imageId
    newimage.path = path

    // update database
    try {
        const imageId = await patchStoreImageReq(newimage);
        if (!imageId){
            return alert('error: image update request');
        } else {
            console.log('image sucessfully added')
        }
    } catch (e) {
        console.log(e);
    }

    // update objects
    curPet.gallery.push(newimage) 

    // update html
    loadPetForm()
}

function addPet(curPets) {
    // SEND data to server.
    //generate a form
    const petNameTag = 'Pet' + (curPets.length+1).toString()

    const liNewPet = document.createElement('li')
    liNewPet.className = 'nav-item'
    const aNewPet = document.createElement('a')
    aNewPet.appendChild(document.createTextNode(petNameTag))
    aNewPet.className = 'nav-link'
    aNewPet.id = petNameTag + '-tab'
    aNewPet.setAttribute('data-toggle', 'tab')
    aNewPet.setAttribute('href', '#' + petNameTag)
    aNewPet.setAttribute('role', 'tab')
    aNewPet.setAttribute('aria-controls', petNameTag)
    aNewPet.setAttribute('aria-selected', 'false')
    liNewPet.appendChild(aNewPet)

    const ulNav = document.getElementById('petTabs')
    ulNav.appendChild(liNewPet)

    getPetForm();
    // $("#update").id = "create";
    //add pet profile
    //add pet id to user
}

function removePet() {
    try {
        deletePetReq(curPet.petId)
    } catch (e) {
        console.log(e)
    }

    if (curUser.pets[0]){
        curPet = curUser.pets[0]
    } else {
        curPet = null
    }
    updatePet(curPet)
}

// function addMatch(petId) {
//     try {
//         curPet.matchedIds.push(petId)

//         updatePetReq(petId)

//         updateMatchesTable(curPet)
//     } catch (error) {
//         console.log(error)
//     }
// }

// function deleteMatch(petId) {
//     try {
//         curPet.matchedIds.splice(curPet.matchedIds.indexOf(petId), 1)

//         updatePetReq(petId)

//         updateMatchesTable(curPet)
//     } catch (error) {
//         console.log(error)
//     }
// }

// function addFav(petId) {
//     try {
//         curPet.favouriteIds.push(petId)

//         updatePetReq(petId)

//         updateFavoritesTable(curPet)
//     } catch (error) {
//         console.log(error)
//     }
// }

// function deleteFav(petId) {
//     try {
//         curPet.favouriteIds.splice(curPet.favouriteIds.indexOf(petId), 1)

//         updatePetReq(petId)

//         updateFavoritesTable(curPet)
//     } catch (error) {
//         console.log(error)
//     }

// }


$(document).ready(async function () {
    try {
        const breeds = await getBreeds();
        dogBreeds = breeds.Dog;
        catBreeds = breeds.Cat;
    } catch (err) {
        alert(err)
    }

    getAllUsers().then(function (users) {
        console.log("users got", users);
        loadUserTable(users);
    }).catch(function (err) {
        console.log(err);
    })

    $('#searchUserButton').click(function (e) {
        e.preventDefault();
        const username = document.querySelector('#searchUsername').value;
        searchUser(username);
        })

    $('#searchPetButton').click(function (e) {
        e.preventDefault()
        const petId = document.querySelector('#searchPetId').value
        searchPet(petId)
        })

    $('#personalInfo').click(function (e) {
        e.preventDefault()
        updateUser(curUser)
        })

    $('#addPet').click(async function (e) {
        e.preventDefault()
        if (curUser) {
            let curPets = await getPetsByUsername(curUser.username)
            addPet(curPets)
        } else {
            alert('please select a user to add new pet')
        }
        })

    // $("#matches-tab").click(async function (e) {
    //     e.preventDefault()
    //     let curPets = await getPetsByUsername(curUser.username)
    //     updateMatchesTable(curPet)
    //     })

    // $("#favourites-tab").click(async function (e) {
    //     e.preventDefault()
    //     let curPets = await getPetsByUsername(curUser.username)
    //     updateFavoritesTable(curPet)
    //     })

    $("#create").click(function (e) {
        e.preventDefault()
        getUserCreationForm();
        })

    $("#delete").click(function (e) {
        e.preventDefault()
        deleteUser();
        })

    // $('#addmatchbutton').click(function (e){
    //     e.preventDefault()
    //     AddMatchForm()
    //     })

    // $('#addfavbutton').click(function (e){
    //     e.preventDefault()
    //     AddFavForm()
    //     })

})
















