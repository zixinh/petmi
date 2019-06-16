const log = console.log
let curUser = null;
let curPets = null;
let dogBreeds;
let catBreeds;

function getBreeds() {
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
    // const randContact = new Contact('snoopydogg@gmail.com', '647 - 739 - 1042', 'Goats29', 'MushyBread')
    // const randLocation = new Location('Canada', 'Ontario', 'Toronto')
    // const randSecurity = new SecurityQA('What\'s your favourite colour?', 'Blue')
    //get current user from cooki
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'get',
            url: '/user',
            // dataType: 'json',
            success: function (res) {
                console.log("on success", res);
                if (res.error || !res.data) {
                    reject("Invalid user state, directing to Landing Page");
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

function getAllPets(username) {
    return new Promise((resolve, reject) => {
        if (!username)
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

function submitForm(e) {
    e.preventDefault();
    console.log("submiting form");
    //use regex to validate user input

    //gather form data
    let user = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        city: $("#city").val(),
        province: $("#province").val(),
        country: $("#country").val(),
        biography: $("#biography").val(),
        email: $("#email").val(),
        phone: $("#cell").val(),
        whatsapp: $("#whatsapp").val(),
        facebook: $("#facebook").val(),
        question: $("#question").val(),
        answer: $("#answer").val()
    };

    $.ajax({
        type: 'PATCH',
        url: '/user?username=' + curUser.username,
        data: user,
        dataType: 'json',
        success: function (res) {
            console.log("on success", res);
            if (res.error) {
                return displayFormMsg(res.error);
            } else {
                console.log(res.msg, res.data);
                displayFormMsg(res.msg);
                location.reload();
            }
        },
        error: function (err) {
            displayFormMsg("Failed to update user information due to internal error");
            console.log("error occurred when update user", err);
        }
    });
}

function displayFormMsg(msg) {
    $("#formMsg").text(msg);
    setTimeout(function () {
        $("#formMsg").text("");
    }, 3000);
}


function changePassword(e) {
    e.preventDefault();
    //validate password
    let oldPwd = $("#old-password").val();
    let newPwd = $("#new-password").val();
    if (!oldPwd || !newPwd)
        return displayFormMsg("Please enter your password");

    $.ajax({
        type: 'PATCH',
        url: '/user/password?username=' + curUser.username,
        data: {
            oldPwd: oldPwd,
            newPwd: newPwd
        },
        dataType: 'json',
        success: function (res) {
            console.log("on success", res);
            if (res.error) {
                return displayFormMsg(res.error);
            } else {
                console.log(res.msg, res.data);
                displayFormMsg(res.msg);
                $("#old-password").val("");
                $("#new-password").val("");
            }
        },
        error: function (err) {
            displayFormMsg("Failed to update user information due to internal error");
            console.log("error occurred when update user", err);
        }
    });
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
        // profilePic: "",
        relationshipGoal: $("#relationshipGoal").val()
    };
    for (let field in pet) {
        if (pet.hasOwnProperty(field)) {
            if (!pet[field])
                return alert("Please enter your pet's " + field.toLowerCase());
            if (!validInput(field, pet[field]))
                return alert("The input " + field.toLowerCase() + " for pet is invalid")
        }
    }
    return pet;
}

function updatePet(petId) {
    const pet = validatePetInfo();
    console.log("pet in updatePet", pet);
    if (pet) {
        $.ajax({
            type: 'PATCH',
            url: '/pet/' + petId,
            data: pet,
            dataType: 'json',
            success: function (res) {
                console.log("on success", res);
                if (res.error) {
                    return alert(res.error);
                } else {
                    alert(res.msg);
                    location.reload();
                }
            },
            error: function (err) {
                console.log("error occurred when manage profile", err);
            }
        });
    }
}

function createPet() {
    const pet = validatePetInfo();
    if (pet) {
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
                    location.reload();
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

function validInput(field, value) {
    let reg;
    //todo: add requirement for location/relationship goal/species/breed
    switch (field) {
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
            return value === "Male" || value === "Female";
        case "relationshipGoal":
            return value === "Mating" || value === "Friendship";
        default:
            reg = /^[^<>"']*$/;
            return reg.test(String(value).toLowerCase());
    }
}

function updateUserPets(petId) {
    $.ajax({
        type: 'PATCH',
        url: '/user/add?username=' + curUser.username + "&petId=" + petId,
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

class Picture {
    constructor(image, description) {
        this.image = image
        this.description = description
    }
}

const colors = {
    bgColor: '',
    txtColor: '',
    btnColor: '',
    btnFocus: ''
}

function HSLtoRGB(h, s, l) {
    let r, g, b;

    const rd = (a) => {
        return Math.floor(Math.max(Math.min(a * 256, 255), 0));
    };

    const hueToRGB = (m, n, o) => {
        if (o < 0) o += 1;
        if (o > 1) o -= 1;
        if (o < 1 / 6) return m + (n - m) * 6 * o;
        if (o < 1 / 2) return n;
        if (o < 2 / 3) return m + (n - m) * (2 / 3 - o) * 6;
        return m;
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hueToRGB(p, q, h + 1 / 3);
    g = hueToRGB(p, q, h);
    b = hueToRGB(p, q, h - 1 / 3);

    return [rd(r), rd(g), rd(b)]
}

function RGBtoHex(r, g, b) {
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

function newColor() {
    const hBase = Math.random();
    const newH = Math.floor(hBase * 360);
    const newL = Math.floor(Math.random() * 16) + 75;

    colors.bgColor = `hsl(${newH}, 100%, ${newL}%)`;
    colors.txtColor = `hsl(${newH}, 100%, 5%)`;
    colors.btnColor = `hsl(${newH}, 100%, 98%)`;
    colors.btnFocus = `hsl(${newH}, 100%, 95%)`;

    const [r, g, b] = HSLtoRGB(hBase, 1, newL * .01);
    return [r.toString(16), g.toString(16), b.toString(16)].join('').toUpperCase()
}

function resetPetForm() {
    $("input#name").val("");
    $("input#age").val("");
    $("select#gender").val("Choose...");
    $("select#breed").val("Unknown");
    $("select#relationshipGoal").val("Choose...");
    $("input#biography").val("");
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

    selectSpecies.onchange = function () {
        if ($("#species").val() === "Dog") {
            loadBreeds(dogBreeds, selectBreeds)
        } else {
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
        if (petId)
            updatePet(petId);
        else
            createPet();
    };

    const form = document.getElementById('profileForm')
    form.innerHTML = ''
    form.appendChild(divFormrowPic)
    form.appendChild(divFormrowChangePic)
    form.appendChild(divFormRowNAG)
    form.appendChild(divFormRowSB)
    form.appendChild(divBio)
    form.appendChild(buttonSave)
    //for hard coding purpose only

}

function getUserForm() {
    $("#personalInfo").click(function (e) {
        e.preventDefault()
        window.location.href = "ProfileCreation.html";
    });
}

function loadUserData(user) {
    // OBTAIN data from server.
    //skip password
    for (let key in user) {
        if (user[key] != null) {
            if (key === "contact" || key === "location" || key === "securityQA") {
                for (let subkey in user[key]) {
                    if (user[key][subkey] != null) {
                        let idName = '#' + subkey;
                        $(idName).val(user[key][subkey]);
                    }
                }
            } else {
                let idName = '#' + key;
                $(idName).val(user[key]);
            }
        }
    }

    const ulNav = document.getElementById('petTabs')
    for (let i = 1; i < curPets.length + 1; i++) {
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
        liPet.appendChild(aPet)

        ulNav.appendChild(liPet)
    }

}

function loadPetData(pet) {
    if (pet) {
        // $("#profilePic").src = pet.profilePic.src;
        for (let key in pet) {
            if (pet[key] != null) {
                let idName = '#' + key;
                $(idName).val(pet[key]);
            }
        }
        // populateGallery(pet);
    }

}

function populateGallery(pet) {
    let gallery = document.querySelector("#gallery");
    gallery.innerHTML = "";
    let buttons = document.querySelector("#buttons");
    buttons.innerHTML = "";
    for (let i = 0; i < pet.gallery.length; i++) {
        let photo = document.createElement("div");
        let img = document.createElement("img");
        let li = document.createElement("li");
        photo.className = "carousel-item";
        if (i === 0) {
            photo.className = "carousel-item active";
            li.className = "active";
        }
        img.className = "d-block w-100";
        img.src = pet.gallery[i].image;
        li.setAttribute('data-target', '#carouselIndicator');
        li.setAttribute('data-slide-to', i.toString());
        photo.appendChild(img);
        gallery.appendChild(photo);
        buttons.appendChild(li);
    }
}

function addPetForm() {
    // SEND data to server.
    //generate a form
    const petNameTag = 'Pet' + (curPets.length + 1).toString()

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

$(document).ready(async function () {
    try {
        curUser = await getCurrentUser();
        curPets = await getAllPets(curUser.username);
        loadUserData(curUser);
        const breeds = await getBreeds();
        dogBreeds = breeds.Dog;
        catBreeds = breeds.Cat;
    } catch (err) {
        alert(err);
        window.location.href = "LandingPageView.html";
    }

    $('#personalInfo').click(function (e) {
        e.preventDefault()
        getUserForm()
    })

    $('#addPet').click(function (e) {
        e.preventDefault()
        addPetForm();
    });

    $(document).on("click", "a[id$='-tab']", function (e) {
        e.preventDefault()
        let tabNum = parseInt(e.target.id.substring(3, 4)) - 1;
        if (curPets[tabNum]) {
            getPetForm(curPets[tabNum]._id);
            loadPetData(curPets[tabNum]);
        } else {
            resetPetForm();
        }
        
    })

    $("#changePassword").click(function (e) {
        changePassword(e);
    });

    $("#submit").click(function (e) {
        submitForm(e);
    });

});