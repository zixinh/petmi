let numOfPets = 0;
let unusedIndexes = [];
let dogBreeds;
let catBreeds;

$(document).ready(async function () {
    const breeds = await getBreeds();
    dogBreeds = breeds.Dog;
    catBreeds = breeds.Cat;

    $('#newPet').click(function (e) {
        e.preventDefault();
        if (numOfPets===5){
            return displayFormError("Sorry, one account can have at most 5 pets.")
        }
        addPetForm();
        numOfPets++;
    });

    $("#submitForm").click(function (e) {
        // e.preventDefault();
        submitForm(e);
    });
});

function loadBreeds(breeds, select) {
    select.innerHTML = "";
    breeds.forEach(function (breed) {
        const opt = document.createElement('option');
        opt.appendChild(document.createTextNode(breed));
        select.appendChild(opt)
    })
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

//give each pet form a unique id
function addPetForm() {
    let petIndex = unusedIndexes.length > 0 ? unusedIndexes.pop() : numOfPets;

    console.log("getting pet form");
    const divFormrowPic = document.createElement('div');
    divFormrowPic.className = 'form-row';

    //Profile Picture
    const divFormgroupPic = document.createElement('div');
    divFormgroupPic.classList.add('form-group', 'col-md-6');

    const labelPic = document.createElement('label');
    labelPic.appendChild(document.createTextNode('Profile Picture'));

    const divPic = document.createElement('div');
    const imgPic = document.createElement('img');
    divPic.setAttribute('style', 'margin-bottom: 1rem');
    imgPic.setAttribute('style', 'width: 12rem');
    imgPic.id = 'profilePic' + petIndex;
    divPic.appendChild(imgPic);

    divFormgroupPic.appendChild(labelPic);
    divFormgroupPic.appendChild(divPic);

    // Carousal
    const divFormgroupSlides = document.createElement('div');
    divFormgroupSlides.classList.add('form-group', 'col-md-6');

    const labelSlides = document.createElement('label');
    labelSlides.appendChild(document.createTextNode('Gallery'));

    const divCarousel = document.createElement('div');
    divCarousel.classList.add('carousel', 'slide');
    divCarousel.setAttribute('data-ride', 'carousel');
    divCarousel.setAttribute('style', 'width: 12rem');
    divCarousel.setAttribute('id', 'carouselIndicator');

    const olCarousel = document.createElement('ol');
    olCarousel.className = 'carousel-indicators';
    olCarousel.id = "buttons";

    const divCarouselInner = document.createElement('div');
    divCarouselInner.className = 'carousel-inner';
    divCarouselInner.id = "gallery" + petIndex;
    const aControlPrev = document.createElement('a');
    aControlPrev.className = 'carousel-control-prev';
    aControlPrev.setAttribute('href', '#carouselIndicator');
    aControlPrev.setAttribute('role', 'button');
    aControlPrev.setAttribute('data-slide', 'prev');
    const spanControlPrev = document.createElement('span');
    spanControlPrev.classList.add('carousel-control-prev-icon');
    spanControlPrev.setAttribute('aria-hidden', 'true');

    const spanControlPrevSr = document.createElement('span');
    spanControlPrevSr.appendChild(document.createTextNode('Previous'));
    spanControlPrevSr.className = 'sr-only';

    aControlPrev.appendChild(spanControlPrev);
    aControlPrev.appendChild(spanControlPrevSr);

    const aControlNext = document.createElement('a');
    aControlNext.className = 'carousel-control-next';
    aControlNext.setAttribute('href', '#carouselIndicator');
    aControlNext.setAttribute('role', 'button');
    aControlNext.setAttribute('data-slide', 'next');

    const spanControlNext = document.createElement('span');
    spanControlNext.className = 'carousel-control-next-icon';
    spanControlNext.setAttribute('aria-hidden', 'true');

    const spanControlNextSr = document.createElement('span');
    spanControlNextSr.appendChild(document.createTextNode('Next'));
    spanControlNextSr.className = 'sr-only';

    aControlNext.appendChild(spanControlNext);
    aControlNext.appendChild(spanControlNextSr);
    divCarousel.appendChild(olCarousel);
    divCarousel.appendChild(divCarouselInner);
    divCarousel.appendChild(aControlPrev);
    divCarousel.appendChild(aControlNext);

    divFormgroupSlides.appendChild(labelSlides);
    divFormgroupSlides.appendChild(divCarousel);

    divFormrowPic.appendChild(divFormgroupPic);
    divFormrowPic.appendChild(divFormgroupSlides);

    // Change Picture
    const divFormrowChangePic = document.createElement('div');
    divFormrowChangePic.setAttribute('style', 'margin-bottom: 0.5rem');
    divFormrowChangePic.className = 'form-row';

    const divChangePic = document.createElement('div');
    divChangePic.className = 'col-md-6';
    const divFile = document.createElement('div');
    divFile.classList.add('custom-file');
    const inputFile = document.createElement('input');
    inputFile.className = 'custom-file-input';
    inputFile.id = 'validatedCustomFile'+ petIndex;
    inputFile.setAttribute('type', 'file');
    inputFile.required = true;
    inputFile.onchange = function (evt) {
        var tgt = evt.target || window.event.srcElement,
            files = tgt.files;
        if (FileReader && files && files.length) {
            let size = files[0].size / 1024/1024;
            if(validImage(files[0].name, size)){
                var fr = new FileReader();
                fr.onload = function () {
                    document.getElementById("profilePic"+petIndex).src = fr.result;
                }
                fr.readAsDataURL(files[0]);
            } else{
                displayFormError("Invalid image file, only jpg, jpeg, png with size less than 5MB are allowed");
            }
        }
    };

    const labelFile = document.createElement('label');
    labelFile.className = 'custom-file-label';
    labelFile.setAttribute('for', 'validatedCustomFile');
    labelFile.appendChild(document.createTextNode('Upload Profile Picture'));

    divFile.appendChild(inputFile);
    divFile.appendChild(labelFile);
    divChangePic.appendChild(divFile);

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

    const divRemovePic = document.createElement('div');
    divRemovePic.classList.add('col-md-3');
    const buttonRemovePic = document.createElement('button');
    buttonRemovePic.id = 'RemoveFromGallery';
    buttonRemovePic.className = 'btn btn-outline-primary';
    buttonRemovePic.setAttribute('type', 'button');
    buttonRemovePic.appendChild(document.createTextNode('Remove Picture'));
    divRemovePic.appendChild(buttonRemovePic);

    divFormrowChangePic.appendChild(divChangePic);
    divFormrowChangePic.appendChild(divAddPic);
    divFormrowChangePic.appendChild(divRemovePic);

    // name, age & gender
    divFormRowNAG = document.createElement('div');
    divFormRowNAG.className = 'form-row';

    const divName = document.createElement('div');
    divName.classList.add('form-group', 'col-md-6');
    const labelName = document.createElement('label');
    labelName.appendChild(document.createTextNode('Name'));
    labelName.setAttribute('for', 'name');
    const inputName = document.createElement('input');
    inputName.className = 'form-control';
    inputName.id = 'name' + petIndex;
    inputName.setAttribute('type', 'text');
    inputName.setAttribute('placeholder', 'Name');
    divName.appendChild(labelName);
    divName.appendChild(inputName);

    const divAge = document.createElement('div');
    divAge.classList.add('form-group', 'col-md-3');
    const labelAge = document.createElement('label');
    labelAge.appendChild(document.createTextNode('Age'));
    labelAge.setAttribute('for', 'age');
    const inputAge = document.createElement('input');
    inputAge.className = 'form-control';
    inputAge.id = 'age' + petIndex;
    inputAge.setAttribute('type', 'text');
    inputAge.setAttribute('placeholder', 'Age');
    divAge.appendChild(labelAge);
    divAge.appendChild(inputAge);

    const divGender = document.createElement('div');
    divGender.classList.add('form-group', 'col-md-3');
    const labelGender = document.createElement('label');
    labelGender.appendChild(document.createTextNode('gender'));
    labelGender.setAttribute('for', 'gender');
    const selectGender = document.createElement('select');
    selectGender.id = 'gender' + petIndex;
    selectGender.className = 'form-control';
    const option1 = document.createElement('option');
    option1.appendChild(document.createTextNode('Choose...'));
    option1.selected = true;
    const option2 = document.createElement('option');
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
    selectSpecies.id = 'species' + petIndex;
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
    selectBreeds.id = 'breed' + petIndex;
    loadBreeds(dogBreeds, selectBreeds);
    divBreed.appendChild(labelBreed);
    divBreed.appendChild(selectBreeds);

    divFormRowSB.appendChild(divSpecies)
    divFormRowSB.appendChild(divBreed)

    selectSpecies.onchange = function(){
        if($("#species" + petIndex).val()==="Dog"){
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
    selectRelation.id = 'relationshipGoal' + petIndex;
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
    labelBio.setAttribute('for', 'bio')
    const inputBio = document.createElement('input')
    inputBio.className = 'form-control'
    inputBio.id = 'bio' + petIndex;
    inputBio.setAttribute('type', 'text')
    inputBio.setAttribute('placeholder', 'Biography')
    divBio.appendChild(labelBio)
    divBio.appendChild(inputBio)
    //
    //  remove form
    const buttonRemove = document.createElement('button')
    buttonRemove.className = 'btn btn-outline-primary';
    buttonRemove.id = "remove" + petIndex;
    buttonRemove.appendChild(document.createTextNode('Remove Pet'));
    buttonRemove.addEventListener("click", function (e) {
        document.getElementById("petForm").removeChild(e.target.parentElement);
        unusedIndexes.push(e.target.id.substring(6));
        numOfPets--;
    });

    const form = document.getElementById('petForm');
    // form.innerHTML = ''
    let petForm = document.createElement("div");
    petForm.className = "petForms";

    let petTitle = document.createElement("div");
    petTitle.innerHTML = "<h4>Pet Information</h4>";
    petTitle.className = "form-group";
    petForm.appendChild(petTitle);
    petForm.appendChild(divFormrowPic);
    petForm.appendChild(divFormrowChangePic);
    petForm.appendChild(divFormRowNAG);
    petForm.appendChild(divFormRowSB);
    petForm.appendChild(divBio);
    petForm.appendChild(buttonRemove);

    form.appendChild(petForm);
    //for hard coding purpose only

}

function sendNewPetRequest(username, i) {
    return new Promise((resolve, reject) => {
        console.log()
        let img = document.getElementById("profilePic"+i).src;

        let pet = {
            ownerUsername: username,
            name: $("#name" + i).val().trim(),
            age: $("#age" + i).val().trim(),
            gender: $("#gender" + i).val(),
            species: $("#species" + i).val().trim(),
            breed: $("#breed" + i).val().trim(),
            biography: $("#bio" + i).val().trim(),
            src: img? img:"" ,
            description: "pet profile image",
            relationshipGoal: $("#relationshipGoal" + i).val()
        };
        for (let field in pet) {
            if (pet.hasOwnProperty(field)) {
                if(!pet[field])
                    return displayFormError("Please enter your pet's " + field.toLowerCase());
                if(!validInput(field, pet[field]))
                    return displayFormError("The input " + field.toLowerCase() + " for pet is invalid")
            }
        }
        $.ajax({
            type: 'POST',
            url: '/pet/add',
            data: pet,
            dataType: 'json',
            success: function (res) {
                console.log("on success", res);
                if (res.error) {
                    return reject(res.error);
                } else {
                    resolve(res.data._id);
                }
            },
            error: function (err) {
                console.log("error occurred when signup", err);
            }
        });
    });
}

async function createPets(username) {
    let pets = [];
    for (let i = 0; i < numOfPets; i++) {
        if (unusedIndexes.indexOf(i.toString()) !== -1) {
            continue;
        }
        try{
            const petId = await sendNewPetRequest(username, i);
            pets.push(petId);

        } catch (e) {
            throw e;
        }
    }
    return pets;
}

async function submitForm(e) {
    e.preventDefault();
    console.log("submiting form");
    if (numOfPets <= 0)
        return displayFormError("Please register at least one pet");
    if ($("#password").val() !== $("#re-password").val())
        return displayFormError("The retyped password does not match");

    let user = {
        firstName: $("#firstName").val().trim(),
        lastName: $("#lastName").val().trim(),
        password: $("#password").val().trim(),
        city: $("#city").val().trim(),
        province: $("#province").val().trim(),
        country: $("#country").val().trim(),
        biography: $("#biography").val().trim(),
        email: $("#email").val().trim(),
        phone: $("#cell").val().trim(),
        whatsapp: $("#whatsapp").val().trim(),
        facebook: $("#facebook").val().trim(),
        question: $("#question").val().trim(),
        answer: $("#answer").val().trim(),
        username: $("#email").val().trim()
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

    try{
        user.pets = await createPets(user.username);
    } catch (e) {
        displayFormError(e);
    }

    $.ajax({
        type: 'POST',
        url: '/user/add',
        data: user,
        dataType: 'json',
        traditional: true,
        success: function (res) {
            console.log("on success", res);
            if (res.error) {
                return displayFormError(res.error);
            } else {
                location.href = "HomeView.html";
            }
        },
        error: function (err) {
            console.log("error occurred when signup", err);
        }
    });
}


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

function displayFormError(msg) {
    $("#formError").text(msg);
    setTimeout(function () {
        $("#formError").text("");
    }, 3000);
}

function validateEmail(username) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'get',
            url: '/user?username=' + username,
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

function validImage(name, size) {
    let doc = name.indexOf(".");
    console.log("validating", size);
    // console.log("doc",name, doc, name.substring(doc+1) );
    if(size<5 && doc!==-1 && doc!==name.length-1 && (name.substring(doc+1)==="jpeg" || name.substring(doc+1)==="png"
        || name.substring(doc+1)==="jpg")){
        return true;
    } else {
        return false;
    }



}