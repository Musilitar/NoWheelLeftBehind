// DATA
// DATA
// DATA
const URL_CAR_BRANDINGS = "https://car-api.firebaseio.com/rest.json";
const DEFAULT_CAR_BRANDING = {
    make: "Audi",
    logoUrl: "https://seeklogo.com/images/A/Audi-logo-70A7072C07-seeklogo.com.png"
};
const DEFAULT_CAR_COLOR = "#2B59C3";
const DEFAULT_CAR_OPTIONS = ["Radio"];
const DEFAULT_CAR_TIRES = "Goodyear";
const DEFAULT_CAR_RIMS = "rim-design--plain";
const DEFAULT_COLORS = [
    "#FFFFFF",
    "#000000",
];
const DEFAULT_OPTIONS = [
    "Radio",
    "Air conditioning",
    "Heatad seats"
];
const DEFAULT_TIRES = [
    "Goodyear",
    "Badyear",
    "Averageyear"
];
const DEFAULT_RIMS = [
    "rim-design--plain",
    "rim-design--biblical",
    "rim-design--spiral"
];

// CORE LOGIC
// CORE LOGIC
// CORE LOGIC
const MODEL = {
    read: function (key) {
        if (this.history.hasOwnProperty(key)) {
            const history = this.history[key];
            if (history.length > 0) {
                return history[history.length - 1];
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    insert: function (key, value) {
        if (this.history.hasOwnProperty(key)) {
            const history = this.history[key];
            history.push(value);
            return true;
        } else {
            return false;
        }
    },
    history: {
        carBranding: [DEFAULT_CAR_BRANDING],
        carColor: [DEFAULT_CAR_COLOR],
        carOptions: [DEFAULT_CAR_OPTIONS],
        carTires: [DEFAULT_CAR_TIRES],
        carRims: [DEFAULT_CAR_RIMS],
        brandings: [],
        colors: [DEFAULT_COLORS],
        options: [DEFAULT_OPTIONS],
        tires: [DEFAULT_TIRES],
        rims: [DEFAULT_RIMS]
    }
};

const UPDATER = {
    update: function (key, value) {
        if (this.updaters.hasOwnProperty(key)) {
            const updater = this.updaters[key];
            if (typeof value === "undefined") {
                updater();
            } else {
                updater(value);
            }
        }
    },
    updaters: {
        newRims: function (rims) {
            MODEL.insert("carRims", rims);
            DRAWER.draw("carRims");
        },
        newBrandings: function (brandings) {
            MODEL.insert("brandings", brandings);
        }
    }
};

const DRAWER = {
    draw: function (key) {
        if (this.drawers.hasOwnProperty(key)) {
            const drawer = this.drawers[key];
            drawer();
        }
    },
    drawers: {
        carRims: function () {
            const rimDesigns = toArray(document.getElementsByClassName("rim-design"));
            rimDesigns.map((rimDesign) => {
                rimDesign.classList.remove("rim-design--active");
            });
            const newRimDesigns = toArray(document.getElementsByClassName(MODEL.read("carRims")));
            newRimDesigns.map((newRimDesign) => {
                newRimDesign.classList.add("rim-design--active");
            });
        }
    }
};

// HTTP CALLS
// HTTP CALLS
// HTTP CALLS
async function retrieveBrandings() {
    try {
        const response = await fetch(URL_CAR_BRANDINGS);
        const brandings = await response.json();
        UPDATER.update("newBrandings", brandings);
    } catch (error) {
        console.log(error);
    }
}

// SETUP
// SETUP
// SETUP
function app() {
    attachEventListeners();
    retrieveBrandings();
}

function attachEventListeners() {
    const radiosRimDesign = toArray(document.querySelectorAll("input[name='rimDesign'"));
    radiosRimDesign.map((radio) => {
        radio.addEventListener("click", (event) => {
            UPDATER.update("newRims", event.target.value);
        });
    });
}

// HELPERS
// HELPERS
// HELPERS
function toArray(collection) {
    return [].slice.call(collection);
}


// START
// START
// START
document.addEventListener("DOMContentLoaded", app);