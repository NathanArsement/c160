AFRAME.registerComponent('tour', {
    schema:{
        state:{type:"string",default:"places-list"},
        selectedPlace: { type: "string", default: "" }
    },
    init: function () {
        const {state} = this.el.getAttribute("tour")
        const { selectedPlace } = this.el.getAttribute("tour")
        if (state === "view") {
            this.showView(selectedPlace);
        } else{
            const skyEl = document.querySelector("#main-container")
            skyEl.setAttribute("material", {
                src: `./assets/background.jpg`,
                color: "white"
            })
        }
        this.placesContainer = this.el;
        this.createCards()


    },
    showView: function (selectedPlace){

        const skyEl = document.querySelector("#main-container")
        skyEl.setAttribute("material", {
            src: `./assets/360_images/place-${selectedPlace}.jpg`,
            color: "white"
        })
    },
    createCards: function () {
        const thumbNailsRef = [
            {
                id: "garden",
                title: "Garden",
                url: "./assets/thumbnails/garden.png",
            },
            {
                id: "home",
                title: "Home",
                url: "./assets/thumbnails/home.png",
            },

            {
                id: "main_gate",
                title: "Main Gate",
                url: "./assets/thumbnails/main_gate.png",
            },
        ];

        for (var item of thumbNailsRef) {
            var position;
            var rotation;
            var positionText;
            if (item.id === "garden") {
                position= {
                    x: -5,
                    y: -10,
                    z: -40
                }
                positionText = {
                    x: 0,
                    y: -10,
                    z: 0
                }
                rotation= {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }
            if (item.id === "home") {
                position = {
                    x: -200,
                    y: 65,
                    z: 12.5
                }
                positionText = {
                    x: 0,
                    y: -10,
                    z: 0
                }
                rotation =  {
                    x: 0,
                    y: 90,
                    z: 0
                }
            }
            if (item.id === "main_gate") {
                position = {
                    x: 50,
                    y: -10,
                    z: -10
                }
                positionText = {
                    x: 0,
                    y: -10,
                    z: 0
                }
                rotation =  {
                    x: 0,
                    y: -90,
                    z: 0
                }
            }
            // Border Element
            // Thumbnail Element
            const thumbnailEL = this.createThumbnail(position,rotation,item)
            // Title Text Element
            const titleEL = this.createTitle(positionText, item)
            thumbnailEL.appendChild(titleEL)
            this.placesContainer.appendChild(thumbnailEL);
        }
    },
    createThumbnail: function (pos,rot,item) {
        const entityEL = document.createElement("a-entity");
        entityEL.setAttribute("visible", true);
        entityEL.setAttribute("id", item.id);
        entityEL.setAttribute("geometry", { primitive: "circle", radius: 9 });
        entityEL.setAttribute("material", { src: item.url ,opacity:0.6});
        entityEL.setAttribute("position", pos);
        entityEL.setAttribute("scale", { x: 0.7, y: 0.7,z:0.7});
        entityEL.setAttribute("rotation", rot);
        entityEL.setAttribute("cursor-listener", {});
        return entityEL
    },
    createTitle: function (pos,item) {
        const entityEL = document.createElement("a-entity");
        entityEL.setAttribute("text", {
            font: "exo2bold",
            align: "center",
            width: 90,
            color: "#e91e63",
            value: item.title
        })
        const ELposition = pos
        entityEL.setAttribute("visible", true);
        entityEL.setAttribute("position", ELposition);

        // entityEL.setAttribute("rotation", rot);
        return entityEL
    },
});


AFRAME.registerComponent('cursor-listener', {
    schema:{
    selectedItemID:{default:"",type:"string"},
  },
  init:function(){
    this.handleMouseEnterEvent()
    this.handleMouseLeaveEvent()
    this.handleClickEvent()
  },
    handleMouseEnterEvent: function () {
        this.el.addEventListener("mouseenter", () => {
            const id = this.el.getAttribute("id")
            const placeID = ["garden", "home", "main_gate"]
            if (placeID.includes(id)) {
                const placeContainer = document.querySelector("#places-container")
                placeContainer.setAttribute("cursor-listener", {
                    selectedItemID: id,
                })
                this.el.setAttribute("material", { opacity: 1 })
            }
        })
    },
    handleMouseLeaveEvent: function () {
        this.el.addEventListener("mouseleave", () => {
            const { selectedItemID } = this.data
            if (selectedItemID) {
                const el = document.querySelector(`#${selectedItemID}`)
                const id = el.getAttribute("id")
                if (id === selectedItemID) {
                    el.setAttribute("material", { opacity: 0.6 })
                }
            }
        })
    },

    handleClickEvent: function () {
        this.el.addEventListener("click", evt => {
            const placeContainer = document.querySelector("#places-container")
            const { state } = placeContainer.getAttribute("tour")
            if (state === "places-list") {
                const id = this.el.getAttribute("id")
                const placeId = ["garden", "home", "main_gate"]
                if (placeId.includes(id)) {
                    placeContainer.setAttribute("tour", {
                        state: "view",
                    })
                }
            }
            else{
                placeContainer.setAttribute("visible",false)
            }
            if (state === "view") {
                this.handleViewState()
            }
            if (state === "change-view") {
                this.handleViewState()
            }
        })
    },
    handleViewState: function () {
        const el = this.el
        const id = el.getAttribute("id")
        const placeContainer = document.querySelector("#places-container")
        const { selectedItemID } = placeContainer.getAttribute("cursor-listener")
        const sideViewPlaceId = ["garden", "home", "main_gate"]
        if (sideViewPlaceId.includes(selectedItemID)) {
            placeContainer.setAttribute("tour", {
                state: "change-view"

            })
            const skyEl = document.querySelector("#main-container")
            skyEl.setAttribute("material", {
                src: `./assets/360_images/place-${selectedItemID}.jpg`,
                color: "#fff"
            })
        }
    },
});
