const URL_CAR_BRANDINGS="https://car-api.firebaseio.com/rest.json",DEFAULT_CAR_LICENSE_PLATE="0MGWTFBBQ",DEFAULT_CAR_BRANDING={make:"Audi",logoUrl:"https://seeklogo.com/images/A/Audi-logo-70A7072C07-seeklogo.com.png"},DEFAULT_CAR_COLOR="#628395",DEFAULT_CAR_OPTIONS=["Radio"],DEFAULT_CAR_TIRES="#D3C1C3",DEFAULT_CAR_RIMS="rim--biblical",DEFAULT_VIEW="view--side",MODEL={read:function(e){if(this.history.hasOwnProperty(e)){const t=this.history[e];return t.length>0?t[t.length-1]:null}return null},insert:function(e,t){if(this.history.hasOwnProperty(e)){return this.history[e].push(t),!0}return!1},history:{errorMessage:[],errorOccured:[],view:["view--side"],brandings:[],carLicensePlate:["0MGWTFBBQ"],carBranding:[DEFAULT_CAR_BRANDING],carColor:["#628395"],carOptions:[DEFAULT_CAR_OPTIONS],carTires:["#D3C1C3"],carRims:["rim--biblical"]}},UPDATER={update:function(e,t){if(this.updaters.hasOwnProperty(e)){const n=this.updaters[e];void 0===t?n():n(t)}},updaters:{newErrorMessage:function(e){MODEL.insert("errorMessage",e),DRAWER.draw("errorMessage")},newErrorOccured:function(e){MODEL.insert("errorOccured",e),DRAWER.draw("errorOccured")},newView:function(e){MODEL.insert("view",e),DRAWER.draw("view")},newBrandings:function(e){MODEL.insert("brandings",e),DRAWER.draw("brandings"),0===e.length&&DRAWER.draw("brandingsEmpty")},newCarLicensePlate:function(e){MODEL.insert("carLicensePlate",e.toUpperCase()),DRAWER.draw("carLicensePlate")},newCarBranding:function(e){MODEL.insert("carBranding",e),DRAWER.draw("carBranding")},newCarColor:function(e){MODEL.insert("carColor",e),DRAWER.draw("carColor")},newCarTires:function(e){MODEL.insert("carTires",e),DRAWER.draw("carTires")},newCarRims:function(e){MODEL.insert("carRims",e),DRAWER.draw("carRims")}}},DRAWER={draw:function(e){this.drawers.hasOwnProperty(e)&&this.drawers[e]()},drawers:{errorMessage:function(){const e=document.getElementById("errorMessage"),t=MODEL.read("errorMessage");null!==e&&null!==t&&(e.textContent=t)},errorOccured:function(){const e=document.getElementById("errorBar"),t=MODEL.read("errorOccured");null!==e&&null!==t&&(e.classList.remove("error--occured"),e.classList.add(t))},view:function(){toggleClassByClassName("view","view--selected","view")},brandings:function(){const e=MODEL.read("brandings"),t=document.getElementById("brandings"),n=document.getElementById("radioListBrandings");null!==e&&null!==t&&null!==n&&e.map(e=>{const r="branding"+e.make,a="branding--"+e.make.toLowerCase(),s=createElementWithClassesAttributes("img",["branding",a],{src:e.logoUrl}),i=createElementWithClasses("li",["radio-list-item"]),c=createElementWithAttributes("input",{id:r,type:"radio",name:"branding",value:a}),o=createElementWithClassesAttributesContent("label",["radio-label"],{for:r},e.make);c.addEventListener("click",e=>{UPDATER.update("newCarBranding",e.target.value)}),i.appendChild(c),i.appendChild(o),n.appendChild(i),t.appendChild(s)})},brandingsEmpty:function(){const e=document.getElementById("customizeBranding");null!==e&&e.classList.add("customize--disabled")},carLicensePlate:function(){const e=document.getElementById("licensePlateOutput"),t=MODEL.read("carLicensePlate");null!==e&&null!==t&&(e.textContent=t)},carBranding:function(){toggleClassByClassName("branding","branding--selected","carBranding")},carColor:function(){const e=document.getElementsByClassName("car-color"),t=MODEL.read("carColor");if(null!==e&&null!==t){toArray(e).map(e=>{e.style.backgroundColor=t})}},carTires:function(){const e=document.getElementsByClassName("car-wheel-color"),t=MODEL.read("carTires");if(null!==e&&null!==t){toArray(e).map(e=>{e.style.backgroundColor=t})}},carRims:function(){toggleClassByClassName("rim","rim--selected","carRims")}}};async function retrieveBrandings(){try{const e=await fetch(URL_CAR_BRANDINGS),t=await e.json();UPDATER.update("newBrandings",t)}catch(e){UPDATER.update("newBrandings",[]),UPDATER.update("newErrorMessage","Unable to retrieve branding data, customizing branding will be unavailable."),UPDATER.update("newErrorOccured","error--occured")}}function app(){drawDefaults(),attachEventListeners(),retrieveBrandings()}function drawDefaults(){Object.keys(DRAWER.drawers).filter(e=>"brandings"!==e&&"brandingsEmpty"!==e).map(e=>{DRAWER.drawers[e]()})}function attachEventListeners(){const e=document.getElementById("errorClose");null!==e&&e.addEventListener("click",e=>{UPDATER.update("newErrorOccured","error--seen")});const t=document.getElementById("cameraSelectorBack");null!==t&&t.addEventListener("click",e=>{UPDATER.update("newView","view--back")});const n=document.getElementById("cameraSelectorSide");null!==n&&n.addEventListener("click",e=>{UPDATER.update("newView","view--side")});const r=document.getElementById("cameraSelectorFront");null!==r&&r.addEventListener("click",e=>{UPDATER.update("newView","view--front")});const a=document.getElementById("licensePlateInput");null!==a&&a.addEventListener("input",e=>{UPDATER.update("newCarLicensePlate",e.target.value)});const s=toArray(document.querySelectorAll("input[name='color'"));null!==s&&s.map(e=>{e.addEventListener("click",e=>{UPDATER.update("newCarColor",e.target.value)})});const i=toArray(document.querySelectorAll("input[name='tire'"));null!==i&&i.map(e=>{e.addEventListener("click",e=>{UPDATER.update("newCarTires",e.target.value)})});const c=toArray(document.querySelectorAll("input[name='rim'"));null!==c&&c.map(e=>{e.addEventListener("click",e=>{UPDATER.update("newCarRims",e.target.value)})})}function toArray(e){try{return[].slice.call(e)}catch(e){return[]}}function toggleClassByClassName(e,t,n){toArray(document.getElementsByClassName(e)).map(e=>{e.classList.remove(t)}),toArray(document.getElementsByClassName(MODEL.read(n))).map(e=>{e.classList.add(t)})}function createElementWithClasses(e,t){const n=document.createElement(e);return t.map(e=>{n.classList.add(e)}),n}function createElementWithAttributes(e,t){const n=document.createElement(e);return Object.keys(t).map(e=>{n.setAttribute(e,t[e])}),n}function createElementWithClassesAttributes(e,t,n){const r=document.createElement(e);return t.map(e=>{r.classList.add(e)}),Object.keys(n).map(e=>{r.setAttribute(e,n[e])}),r}function createElementWithClassesAttributesContent(e,t,n,r){const a=document.createElement(e);return t.map(e=>{a.classList.add(e)}),Object.keys(n).map(e=>{a.setAttribute(e,n[e])}),a.textContent=r,a}document.addEventListener("DOMContentLoaded",app);