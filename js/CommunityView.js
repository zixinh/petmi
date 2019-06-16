const genders = ['Male', 'Female']
const species = ['Dog', 'Cat']
const dogBreeds = ["Affenpinscher", "Afghan Hound", "Airedale Terrier", "Alaskan Malamute", "American Staffordshire Bull Terrier", "Anatolian Shepherd Dog", "Australian Cattle Dog", "Australian Kelpie", "Australian Shepherd Dog", "Australian Silky Terrier", "Australian Terrier", "Basenji", "Basset Fauve de Bretagne", "Basset Hound", "Beagle", "Bearded Collie", "Bedlington Terrier", "Belgian Shepherd Dog Groenendael", "Belgian Shepherd Dog Laekenois", "Belgian Shepherd Dog Malinois", "Belgian Shepherd Dog Tervueren", "Bernese Mountain Dog", "Bichon Frise", "Bloodhound", "Border Collie", "Border Terrier", "Borzoi", "Boston Terrier", "Bouvier des Flandres", "Boxer", "Bracco Italiano", "Briard", "Brittany", "Bull Terrier", "Bull Terrier Miniature", "Bulldog", "Bullmastiff", "Cairn Terrier", "Cavalier King Charles Spaniel", "Cesky Terrier", "Chesapeake Bay Retriever", "Chihuahua (Smooth Coat)", "Chinese Crested", "Chow Chow (Smooth)", "Clumber Spaniel", "Collie (Rough)", "Collie (Smooth)", "Curly-Coated Retriever", "Dachshund (Miniature Long Haired)", "Dachshund (Miniature Smooth Haired)", "Dachshund (Miniature Wire Haired)", "Dachshund (Smooth Haired)", "Dachshund (Wire Haired)", "Dalmatian", "Dandie Dinmont Terrier", "Deerhound", "Dobermann", "Dogue de Bordeaux", "English Setter", "English Springer Spaniel", "English Toy Terrier (Black &amp; Tan)", "Field Spaniel", "Finnish Lapphund", "Finnish Spitz", "Flat-Coated Retriever", "Fox Terrier Smooth Coat", "Fox Terrier Wire Coat", "Foxhound", "French Bulldog", "German Shepherd Dog", "German Short-Haired Pointer", "German Spitz Klein", "German Wire-Haired Pointer", "Golden Retriever", "Gordon Setter", "Great Dane", "Greyhound", "Harrier Hound", "Hungarian Vizsla", "Hungarian Wire-Haired Vizsla", "Ibizan Hound", "Irish Setter", "Irish Terrier", "Irish Water Spaniel", "Irish Wolfhound", "Italian Greyhound", "Japanese Akita", "Japanese Chin", "Japanese Spitz", "Keeshond", "Kerry Blue Terrier", "King Charles Spaniel", "Labrador Retriever", "Lakeland Terrier", "Leonberger", "Lhaso Apso", "Lowchen", "Maltese", "Manchester Terrier", "Maremma Sheepdog", "Mastiff", "Newfoundland", "Norfolk Terrier", "Norwich Terrier", "Nova Scotia Duck Tolling Retriever", "Old English Sheepdog", "Papillon", "Parson Jack Russell Terrier", "Pharaoh Hound", "Pointer", "Pomeranian", "Poodle Miniature", "Poodle Standard", "Poodle Toy", "Portuguese Water Dog", "Pug", "Pyrenean Mountain Dog", "Rhodesian Ridgeback", "Rottweiler", "Saluki", "Samoyed", "Schipperke", "Schnauzer Giant", "Schnauzer Miniature", "Schnauzer Standard", "Scottish Terrier", "Shar Pei", "Shetland Sheepdog", "Shih Tzu", "Siberian Husky", "Skye Terrier", "Sloughi", "Soft Coated Wheaten Terrier", "St Bernard", "Sussex Spaniel", "Swedish Vallhund", "Tenterfield Terrier", "Tibetan Mastiff", "Tibetan Spaniel", "Tibetan Terrier", "Weimaraner", "Welsh Corgi (Cardigan)", "Welsh Corgi (Pembroke)", "Welsh Springer Spaniel", "Welsh Terrier", "West Highland White Terrier", "Whippet", "Yorkshire Terrier"]
const catBreeds = ["Abyssinian", "Australian Mist", "Balinese", "Bengal", "Birman", "Bombay", "British Shorthair", "Burmese", "Burmilla", "Cornish Rex", "Devon Rex", "Egyptian Mau", "Exotic Shorthair", "Japanese Bobtail", "Korat", "La Perms", "Maine Coon", "Manx", "Norwegian Forest", "Ocicat", "Oriental Shorthair", "Persian Longhair", "Ragdoll", "Russian Blue", "Scottish Fold", "Siamese", "Siberian Forest", "Singapura", "Snowshoe", "Somali", "Sphynx", "Tiffanie", "Tonkinese", "Turkish Van"]
const maleNames = ["Bailey", "Max", "Charlie", "Buddy", "Rocky", "Jake", "Jack", "Toby", "Cody", "Buster", "Duke", "Cooper", "Riley", "Harley", "Bear", "Tucker", "Murphy", "Lucky", "Oliver", "Sam", "Oscar", "Teddy", "Winston", "Sammy"]
const femaleNames = ["Bella", "Lucy", "Molly", "Daisy", "Maggie", "Sophie", "Sadie", "Chloe", "Bailey", "Lola", "Zoe", "Abby", "Ginger", "Roxy", "Gracie", "Coco", "Sasha", "Lily", "Angel", "Princess", "Emma", "Annie", "Rosie", "Ruby"]
const relationshipGoals = ['Friend', 'Mate']

let filterGender = 'Any'
let filterSpecies = 'Any'
let filterBreed = 'Any'

let petProfiles = []


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

function createPetProfile(pet) {
    const tile = document.createElement('div')

    tile.classList.add('col-md-4', 'petProfileTile')
    tile.setAttribute('petid', pet._id);

    const thumbnail = document.createElement('div')
    thumbnail.classList.add('thumbnail')

    let image = document.createElement('img')
    //locate pet for overlay
    image.classList.add('images', 'border')
    image.setAttribute('alt', '...')

    if(pet.profilePic)
        image.src = pet.profilePic.src;
    thumbnail.appendChild(image);
    tile.appendChild(thumbnail)

    const caption = document.createElement('div')
    caption.className = 'caption'

    const name = document.createElement('h4')
    const nameTxt = document.createTextNode(pet.name)
    name.appendChild(nameTxt)
    caption.appendChild(name)

    const ageGenderBreed = document.createElement('span')
    const ageGenderBreedText = document.createTextNode(pet.age + ' | ' + pet.gender + ' | ' + pet.breed)
    ageGenderBreed.appendChild(ageGenderBreedText)
    caption.appendChild(ageGenderBreed)

    const biography = document.createElement('p')
    const biographyTxt = document.createTextNode(pet.biography)
    biography.appendChild(biographyTxt)
    caption.appendChild(biography)

    tile.append(caption)

    return tile
}

function putPetProfiles() {
    const row = $('div.container div.row')
    for (let i = 0; i < petProfiles.length; i++) {
        const petProfileTile = createPetProfile(petProfiles[i])
        row.append($(petProfileTile))
    }
}

//overlay

function displayOverlay(petId) {
    let petProfile = getPetProfile(petId);
    populateProfile(petProfile);
    populateGallery(petProfile);
}

function getPetProfile(id) {
    const profile = petProfiles.filter( (p) => (p._id === id))
    return profile[0];
}

function populateProfile(petProfile) {
    document.querySelector("#name").innerText = petProfile.name;
    document.querySelector("#age").innerText = petProfile.age;
    document.querySelector("#gender").innerText = petProfile.gender;
    document.querySelector("#species").innerText = petProfile.species;
    document.querySelector("#breed").innerText = petProfile.breed;
    document.querySelector("#relationship").innerText = petProfile.relationshipGoal;
    document.querySelector("#biography").innerText = petProfile.biography;
    if(petProfile.profilePic)
        document.querySelector("#profilePic").src = petProfile.profilePic.src;
}

function populateGallery(petProfile) {
    let gallery = document.querySelector("#gallery");
    gallery.innerHTML = "";
    let buttons = document.querySelector("#buttons");
    buttons.innerHTML = "";
    for (let i=0; i< petProfile.gallery.length; i++){
        let photo = document.createElement("div");
        let img = document.createElement("img");
        let li = document.createElement("li");
        photo.className = "carousel-item";
        if(i===0){
            photo.className = "carousel-item active";
            li.className = "active";
        }
        img.className = "d-block w-100";
        img.src = petProfile.gallery[i].src;
        li.setAttribute('data-target','#carouselIndicators');
        li.setAttribute('data-slide-to', i.toString());
        photo.appendChild(img);
        gallery.appendChild(photo);
        buttons.appendChild(li);
    }
}


$(document).ready(async function () {
    petProfiles = await getAllPets()
    putPetProfiles()
    $('.petProfileTile').click((e) => {
        console.log("clcking ovrelay")
        $('#profileModal').modal('toggle')
        displayOverlay($(e.target).closest('.petProfileTile').attr('petid'))
    })
});

