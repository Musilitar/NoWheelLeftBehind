const URL_CAR_BRANDINGS = "https://car-api.firebaseio.com/rest.json";
const DEFAULT_CAR = {
    branding: 0,
    color: 0,
    options: [0, 1],
    tires: 0,
    rims: 0
};
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
    "Summer",
    "Winter",
    "Off road"
];
const DEFAULT_RIMS = [
    "Sporty",
    "Edgy",
    "Practical",
    "Gangster"
];

const MODEL = {
    read: function (key) {
        if (this.history.hasOwnProperty(key)) {
            const history = this.history[key];
            if (history.length > 0) {
                return history[history.length - 1];
            }
        }
        else {
            return {};
        }
    },
    update: function (key, value) {
        if (this.history.hasOwnProperty(key)) {
            const history = this.history[key];
            history.push(value);
            return history[history.length - 1];
        }
        else {
            return {};
        }
    },
    history: {
        car: [DEFAULT_CAR],
        brandings: [],
        colors: [DEFAULT_COLORS],
        options: [DEFAULT_OPTIONS],
        tires: [DEFAULT_TIRES],
        rims: [DEFAULT_RIMS]
    }
};

const UPDATER = {
    send: function (key, value) {
        if (this.handlers.hasOwnProperty(key)) {
            const handler = this.handlers[key];
            if (typeof value === "undefined") {
                handler();
            }
            else {
                handler(value);
            }
        }
    },
    handlers: {
        newBrandings: function (brandings) {
            MODEL.update("brandings", brandings);
        }
    }
};

function app() {
    retrieveBrandings();
}

async function retrieveBrandings() {
    try {
        const response = await fetch(URL_CAR_BRANDINGS);
        const brandings = await response.json();
        UPDATER.send("newBrandings", brandings);
    }
    catch (error) {
        console.log(error);
    }
}

document.addEventListener("DOMContentLoaded", app);