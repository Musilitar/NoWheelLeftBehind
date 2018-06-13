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
        newCarBranding: function (branding) {
            MODEL.insert("carBranding", branding);
            DRAWER.draw("carBranding");
        },
        newCarColor: function (color) {
            MODEL.insert("carColor", color);
            DRAWER.draw("carColor");
        },
        newCarTires: function (tire) {
            MODEL.insert("carTires", tire);
            DRAWER.draw("carTires");
        },
        newCarRims: function (rims) {
            MODEL.insert("carRims", rims);
            DRAWER.draw("carRims");
        },
        newBrandings: function (brandings) {
            MODEL.insert("brandings", brandings);
            DRAWER.draw("brandings");
        }
    }
};

const DRAWER = {
    draw: function (key) {
        if (this.drawers.hasOwnProperty(key)) {
            this.drawers[key]();
        }
    },
    drawers: {
        carBranding: function () {
            toggleClassByClassName("branding", "branding--selected", "carBranding");
        },
        carColor: function () {
            const coloredElements = toArray(document.getElementsByClassName("car-color"));
            const color = MODEL.read("carColor");
            coloredElements.map((element) => {
                element.style.backgroundColor = color;
            });
        },
        carTires: function () {
            const tires = toArray(document.getElementsByClassName("car-wheel-color"));
            const tireType = MODEL.read("carTires");
            tires.map((tire) => {
                tire.style.backgroundColor = tireType;
            });
        },
        carRims: function () {
            toggleClassByClassName("rim", "rim--selected", "carRims");
        },
        brandings: function () {
            const brandings = MODEL.read("brandings");
            const brandingsContainer = document.getElementById("brandings");
            const brandingsList = document.getElementById("radioListBrandings");
            brandings.map((branding) => {
                const id = "branding" + branding.make;
                const className = "branding--" + branding.make.toLowerCase();
                const image = createElementWithClassesAttributes("img", ["branding", className], {
                    src: branding.logoUrl
                });
                const listItem = createElementWithClasses("li", ["radio-list-item"]);
                const radio = createElementWithAttributes("input", {
                    id: id,
                    type: "radio",
                    name: "branding",
                    value: className
                });
                const label = createElementWithClassesAttributesContent("label", ["radio-label"], {
                    for: id
                }, branding.make);

                radio.addEventListener("click", (event) => {
                    UPDATER.update("newCarBranding", event.target.value);
                });

                listItem.appendChild(radio);
                listItem.appendChild(label);

                brandingsList.appendChild(listItem);

                brandingsContainer.appendChild(image);
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
    const radiosColor = toArray(document.querySelectorAll("input[name='color'"));
    radiosColor.map((radio) => {
        radio.addEventListener("click", (event) => {
            UPDATER.update("newCarColor", event.target.value);
        });
    });

    const radiosTires = toArray(document.querySelectorAll("input[name='tire'"));
    radiosTires.map((radio) => {
        radio.addEventListener("click", (event) => {
            UPDATER.update("newCarTires", event.target.value);
        });
    });

    const radiosRim = toArray(document.querySelectorAll("input[name='rim'"));
    radiosRim.map((radio) => {
        radio.addEventListener("click", (event) => {
            UPDATER.update("newCarRims", event.target.value);
        });
    });
}

// HELPERS
// HELPERS
// HELPERS
function toArray(collection) {
    return [].slice.call(collection);
}

function toggleClassByClassName(targetClass, toggleClass, modelKey) {
    const allElements = toArray(document.getElementsByClassName(targetClass));
    allElements.map((element) => {
        element.classList.remove(toggleClass);
    });
    const targetElements = toArray(document.getElementsByClassName(MODEL.read(modelKey)));
    targetElements.map((element) => {
        element.classList.add(toggleClass);
    });
}

function createElementWithClasses(tagName, classes) {
    const element = document.createElement(tagName);
    classes.map((className) => {
        element.classList.add(className);
    });
    return element;
}

function createElementWithAttributes(tagName, attributes) {
    const element = document.createElement(tagName);
    Object.keys(attributes).map((key) => {
        element.setAttribute(key, attributes[key]);
    });
    return element;
}

function createElementWithClassesAttributes(tagName, classes, attributes) {
    const element = document.createElement(tagName);
    classes.map((className) => {
        element.classList.add(className);
    });
    Object.keys(attributes).map((key) => {
        element.setAttribute(key, attributes[key]);
    });
    return element;
}

function createElementWithClassesAttributesContent(tagName, classes, attributes, content) {
    const element = document.createElement(tagName);
    classes.map((className) => {
        element.classList.add(className);
    });
    Object.keys(attributes).map((key) => {
        element.setAttribute(key, attributes[key]);
    });
    element.textContent = content;
    return element;
}


// START
// START
// START
document.addEventListener("DOMContentLoaded", app);