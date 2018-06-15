// DATA
// DATA
// DATA
const URL_CAR_BRANDINGS = "https://car-api.firebaseio.com/rest.json";
const DEFAULT_VIEW = "view--side";
const DEFAULT_CAR_LICENSE_PLATE = "0MGWTFBBQ";
const DEFAULT_CAR_BRANDING = {
    make: "Audi",
    logoUrl: "https://seeklogo.com/images/A/Audi-logo-70A7072C07-seeklogo.com.png"
};
const DEFAULT_CAR_COLOR = "#628395";
const DEFAULT_CAR_OPTIONS = ["optionAirConditioning"];
const DEFAULT_CAR_TIRES = "#D3C1C3";
const DEFAULT_CAR_RIMS = "rim--biblical";

// CORE LOGIC
// CORE LOGIC
// CORE LOGIC
const MODEL = {
    read: function(key) {
        if (this.history.hasOwnProperty(key)) {
            const history = this.history[key];
            if (history.length > 0) {
                return history[history.length - 1];
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    insert: function(key, value) {
        if (this.history.hasOwnProperty(key)) {
            const history = this.history[key];
            history.push(value);
            return true;
        } else {
            return false;
        }
    },
    history: {
        errorMessage: [],
        errorOccured: [],
        view: [DEFAULT_VIEW],
        brandings: [],
        carLicensePlate: [DEFAULT_CAR_LICENSE_PLATE],
        carBranding: [DEFAULT_CAR_BRANDING],
        carColor: [DEFAULT_CAR_COLOR],
        carOptions: [DEFAULT_CAR_OPTIONS],
        carTires: [DEFAULT_CAR_TIRES],
        carRims: [DEFAULT_CAR_RIMS]
    }
};

const UPDATER = {
    update: function(key, value) {
        if (this.updaters.hasOwnProperty(key)) {
            const updater = this.updaters[key];
            if (typeof value === "undefined") {
                updater();
            } else {
                updater(value);
            }
            return true;
        } else {
            return false;
        }
    },
    updaters: {
        newErrorMessage: function(message) {
            MODEL.insert("errorMessage", message);
            DRAWER.draw("errorMessage");
        },
        newErrorOccured: function(occured) {
            MODEL.insert("errorOccured", occured);
            DRAWER.draw("errorOccured");
        },
        newView: function(view) {
            MODEL.insert("view", view);
            DRAWER.draw("view");
        },
        newBrandings: function(brandings) {
            MODEL.insert("brandings", brandings);
            DRAWER.draw("brandings");
            if (brandings.length === 0) {
                DRAWER.draw("brandingsEmpty");
            }
        },
        newCarLicensePlate: function(licensePlate) {
            const licensePlateAdjusted = licensePlate.slice(0, 9).toUpperCase();
            MODEL.insert("carLicensePlate", licensePlateAdjusted);
            DRAWER.draw("carLicensePlate");
        },
        newCarBranding: function(branding) {
            MODEL.insert("carBranding", branding);
            DRAWER.draw("carBranding");
        },
        newCarColor: function(color) {
            MODEL.insert("carColor", color);
            DRAWER.draw("carColor");
        },
        newCarOptions: function(option) {
            const currentOptions = MODEL.read("carOptions");
            if (currentOptions.includes(option)) {
                const newOptions = currentOptions.filter(currentOption => {
                    return currentOption !== option;
                });
                MODEL.insert("carOptions", newOptions);
            } else {
                const newOptions = currentOptions.concat([option]);
                MODEL.insert("carOptions", newOptions);
            }
            DRAWER.draw("carOptions");
        },
        newCarTires: function(tire) {
            MODEL.insert("carTires", tire);
            DRAWER.draw("carTires");
        },
        newCarRims: function(rims) {
            MODEL.insert("carRims", rims);
            DRAWER.draw("carRims");
        }
    }
};

const DRAWER = {
    draw: function(key) {
        if (this.drawers.hasOwnProperty(key)) {
            this.drawers[key]();
        }
    },
    drawers: {
        errorMessage: function() {
            const errorMessageElement = document.getElementById("errorMessage");
            const errorMessage = MODEL.read("errorMessage");
            if (errorMessageElement !== null && errorMessage !== null) {
                errorMessageElement.textContent = errorMessage;
            }
        },
        errorOccured: function() {
            const errorBar = document.getElementById("errorBar");
            const errorOccured = MODEL.read("errorOccured");
            if (errorBar !== null && errorOccured !== null) {
                errorBar.classList.remove("error--occured");
                errorBar.classList.add(errorOccured);
            }
        },
        view: function() {
            toggleClassByClassName("view", "view--selected", "view");
        },
        brandings: function() {
            const brandings = MODEL.read("brandings");
            const brandingsContainer = document.getElementById("brandings");
            const brandingsList = document.getElementById("radioListBrandings");
            if (brandings !== null && brandingsContainer !== null && brandingsList !== null) {
                brandings.map(branding => {
                    const id = "branding" + branding.make;
                    const className = "branding--" + branding.make.toLowerCase();
                    const image = createElementWithClassesAttributes("img", ["branding", className], {
                        src: branding.logoUrl,
                        alt: branding.make
                    });
                    const listItem = createElementWithClasses("li", ["radio-list-item"]);
                    const radio = createElementWithAttributes("input", {
                        id: id,
                        type: "radio",
                        name: "branding",
                        value: className
                    });
                    const label = createElementWithClassesAttributesContent(
                        "label",
                        ["radio-label"],
                        {
                            for: id
                        },
                        branding.make
                    );

                    radio.addEventListener("click", event => {
                        UPDATER.update("newCarBranding", event.target.value);
                    });

                    listItem.appendChild(radio);
                    listItem.appendChild(label);

                    brandingsList.appendChild(listItem);

                    brandingsContainer.appendChild(image);
                });
            }
        },
        brandingsEmpty: function() {
            const customizeBranding = document.getElementById("customizeBranding");
            if (customizeBranding !== null) {
                customizeBranding.classList.add("customize--disabled");
            }
        },
        carLicensePlate: function() {
            const licensePlateOutput = document.getElementById("licensePlateOutput");
            const licensePlate = MODEL.read("carLicensePlate");
            if (licensePlateOutput !== null && licensePlate !== null) {
                licensePlateOutput.textContent = licensePlate;
            }
        },
        carBranding: function() {
            toggleClassByClassName("branding", "branding--selected", "carBranding");
        },
        carColor: function() {
            const coloredCollection = document.getElementsByClassName("car-color");
            const color = MODEL.read("carColor");
            if (coloredCollection !== null && color !== null) {
                const coloredElements = toArray(coloredCollection);
                coloredElements.map(element => {
                    element.style.backgroundColor = color;
                });
            }
        },
        carOptions: function() {
            const optionCollection = document.getElementsByClassName("option");
            const options = MODEL.read("carOptions");
            if (optionCollection !== null && options !== null) {
                const optionElements = toArray(optionCollection);
                optionElements.map(optionElement => {
                    optionElement.classList.remove("option--selected");
                });
                options.map(option => {
                    const optionToSelect = document.getElementById(option);
                    if (optionToSelect !== null) {
                        optionToSelect.classList.add("option--selected");
                    }
                });
            }
        },
        carTires: function() {
            const tireCollection = document.getElementsByClassName("car-wheel-color");
            const tireType = MODEL.read("carTires");
            if (tireCollection !== null && tireType !== null) {
                const tires = toArray(tireCollection);
                tires.map(tire => {
                    tire.style.backgroundColor = tireType;
                });
            }
        },
        carRims: function() {
            toggleClassByClassName("rim", "rim--selected", "carRims");
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
        UPDATER.update("newBrandings", []);
        UPDATER.update(
            "newErrorMessage",
            "Unable to retrieve branding data, customizing branding will be unavailable."
        );
        UPDATER.update("newErrorOccured", "error--occured");
    }
}

// SETUP
// SETUP
// SETUP
function app() {
    drawDefaults();
    attachEventListeners();
    retrieveBrandings();
}

function drawDefaults() {
    Object.keys(DRAWER.drawers)
        .filter(drawer => {
            return drawer !== "brandings" && drawer !== "brandingsEmpty";
        })
        .map(drawer => {
            DRAWER.drawers[drawer]();
        });
}

function attachEventListeners() {
    const errorClose = document.getElementById("errorClose");
    if (errorClose !== null) {
        errorClose.addEventListener("click", event => {
            UPDATER.update("newErrorOccured", "error--seen");
        });
    }

    const cameraSelectorBack = document.getElementById("cameraSelectorBack");
    if (cameraSelectorBack !== null) {
        cameraSelectorBack.addEventListener("click", event => {
            UPDATER.update("newView", "view--back");
        });
    }

    const cameraSelectorSide = document.getElementById("cameraSelectorSide");
    if (cameraSelectorSide !== null) {
        cameraSelectorSide.addEventListener("click", event => {
            UPDATER.update("newView", "view--side");
        });
    }

    const cameraSelectorFront = document.getElementById("cameraSelectorFront");
    if (cameraSelectorFront !== null) {
        cameraSelectorFront.addEventListener("click", event => {
            UPDATER.update("newView", "view--front");
        });
    }

    const textLicensePlate = document.getElementById("licensePlateInput");
    if (textLicensePlate !== null) {
        textLicensePlate.addEventListener("input", event => {
            UPDATER.update("newCarLicensePlate", event.target.value);
        });
    }

    const radiosColor = toArray(document.querySelectorAll("input[name='color']"));
    if (radiosColor !== null) {
        radiosColor.map(radio => {
            radio.addEventListener("click", event => {
                UPDATER.update("newCarColor", event.target.value);
            });
        });
    }

    const checkboxesOptionsCollection = document.querySelectorAll("input[name='option']");
    if (checkboxesOptionsCollection !== null) {
        const checkboxesOptions = toArray(checkboxesOptionsCollection);
        checkboxesOptions.map(checkbox => {
            checkbox.addEventListener("click", event => {
                UPDATER.update("newCarOptions", event.target.value);
            });
        });
    }

    const radiosTires = toArray(document.querySelectorAll("input[name='tire']"));
    if (radiosTires !== null) {
        radiosTires.map(radio => {
            radio.addEventListener("click", event => {
                UPDATER.update("newCarTires", event.target.value);
            });
        });
    }

    const radiosRim = toArray(document.querySelectorAll("input[name='rim']"));
    if (radiosRim !== null) {
        radiosRim.map(radio => {
            radio.addEventListener("click", event => {
                UPDATER.update("newCarRims", event.target.value);
            });
        });
    }
}

// HELPERS
// HELPERS
// HELPERS
function toArray(collection) {
    try {
        return [].slice.call(collection);
    } catch (error) {
        return [];
    }
}

function toggleClassByClassName(targetClass, toggleClass, modelKey) {
    const allElements = toArray(document.getElementsByClassName(targetClass));
    allElements.map(element => {
        element.classList.remove(toggleClass);
    });
    const targetElements = toArray(document.getElementsByClassName(MODEL.read(modelKey)));
    targetElements.map(element => {
        element.classList.add(toggleClass);
    });
}

function createElementWithClasses(tagName, classes) {
    const element = document.createElement(tagName);
    classes.map(className => {
        element.classList.add(className);
    });
    return element;
}

function createElementWithAttributes(tagName, attributes) {
    const element = document.createElement(tagName);
    Object.keys(attributes).map(key => {
        element.setAttribute(key, attributes[key]);
    });
    return element;
}

function createElementWithClassesAttributes(tagName, classes, attributes) {
    const element = document.createElement(tagName);
    classes.map(className => {
        element.classList.add(className);
    });
    Object.keys(attributes).map(key => {
        element.setAttribute(key, attributes[key]);
    });
    return element;
}

function createElementWithClassesAttributesContent(tagName, classes, attributes, content) {
    const element = document.createElement(tagName);
    classes.map(className => {
        element.classList.add(className);
    });
    Object.keys(attributes).map(key => {
        element.setAttribute(key, attributes[key]);
    });
    element.textContent = content;
    return element;
}

// START
// START
// START
document.addEventListener("DOMContentLoaded", app);
