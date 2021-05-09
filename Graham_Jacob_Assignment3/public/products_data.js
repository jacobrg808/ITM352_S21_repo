// Products Data
// Descriptions adapted from https://bulbapedia.bulbagarden.net/wiki/ and https://www.pokemon.com/us/pokemon-tcg/product-gallery/

{
var cards = [
        {
            "brand" : "Arceus LV.X",
            "image" : "./images/arceus.jpg",
            "price" : 4.95,
            "desc" : "Arceus LV. X is a Colorless-type Level-Up Pokémon LV.X card. It was first released as part of the Arceus expansion.",
        },
        {   
            "brand" : "Torterra LV.X",
            "image" : "./images/torterra.jpg",
            "price" : 4.95,
            "desc" : "Torterra LV. X is a Grass-type Level-Up Pokémon LV.X card. It was first released as part of the Diamond & Pearl expansion.",
        },
        {   
            "brand" : "Dedenne GX",
            "image" : "./images/dedenne.jpg",
            "price" : 4.95,
            "desc" : "Dedenne GX is a Lightning-type Basic Pokémon-GX card. It was first released as part of the Unbroken Bonds expansion.",
        }
    ];
var coll_boxes = [
        {
            "brand" : "Shining Fates Crobat Premium Collection",
            "image" : "./images/crobat_coll.jpg",
            "price" : 39.95,
            "desc" : "Comes with 7 booster packs, 1x Dragapult V, 1x Dragapult VMAX, a promotional jumbo coin, and one promotional jumbo card.",
        },
        {
            "brand" : "Shining Fates Dragapult Premium Collection",
            "image" : "./images/dragapult_coll.jpg",
            "price" : 39.95,
            "desc" : "Comes with 7 booster packs, 1x Dragapult V, 1x Dragapult VMAX, a promotional jumbo coin, and one promotional jumbo card.",
        },
        {
            "brand" : "Eternatus Premium Collection",
            "image" : "./images/eternatus_coll.jpg",
            "price" : 39.95,
            "desc" : "Comes with 7 booster packs, 1x Eternatus V, 1x Eternatus VMAX, a promotional jumbo coin, and one promotional jumbo card.",
        }
    ];
var etbs = [    
        {
            "brand" : "Champion's Path Elite Trainer Box",
            "image" : "./images/charizard_etb.jpg",
            "price" : 49.95,
            "desc" : "Comes with 10 booster packs, 1x Charizard V, 65 card sleeves, 45 Pokémon TCG Energy cards, and a box that you can store pokemon cards in.",
        },
        {
            "brand" : "Shining Fates Elite Trainer Box",
            "image" : "./images/charizard_etb.jpg",
            "price" : 49.95,
            "desc" : "Comes with 10 booster packs, 1x Eevee V, 65 card sleeves, 45 Pokémon TCG Energy cards, and a box that you can store pokemon cards in.",
        },
        {
            "brand" : "Hidden Fates Elite Trainer Box",
            "image" : "./images/charizard_etb.jpg",
            "price" : 49.95,
            "desc" : "Comes with 10 booster packs, 1x Legendary Bird Trio (Articuno, Zapdos, Moltres) V, 65 card sleeves, 45 Pokémon TCG Energy cards, and a box that you can store pokemon cards in.",
        }
    ];
}

// Setup product types
var products_setup = [
    {
    "type" : "cards"
    },
    {
    "type" : "coll_boxes"
    },
    {
    "type" : "etbs"
    }
]

// Setup products object
var products = {
    "cards" : cards,
    "coll_boxes" : coll_boxes,
    "etbs" : etbs
}

// export products module
if (typeof module != 'undefined') {module.exports.products = products;}