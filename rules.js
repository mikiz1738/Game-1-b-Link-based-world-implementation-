let prevKey = "no key";
class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation, 0); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key, numInteract) {
        if(numInteract != 1){
            numInteract = 0;
        }
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        
        if(locationData.Choices) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
        }
        if(locationData.Interactions) { 
            for(let interaction of locationData.Interactions) { 
                if(numInteract == 0){
                    if(interaction.KeyMechanism){
                        prevKey = interaction.KeyMechanism;
                    }
                    if(!(interaction.Hidden)){
                        this.engine.addInteraction(interaction.Text, interaction, key, numInteract, prevKey); 
                        numInteract = 1; 
                    }else{
                        if(interaction.Lock == prevKey){
                            this.engine.addInteraction(interaction.Hidden, interaction, key, numInteract, prevKey); 
                            numInteract = 1; 
                        }
                    }
                }else{
                    numInteract = 0; 
                }
            }
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }

    handleInteraction(interaction, prevLocation, numInteract, keyMechanism) {
        if(interaction) {
            if(keyMechanism = interaction.Lock){
                this.engine.show("&gt; "+ interaction.Target);
                this.engine.gotoScene(Location, interaction.Target, numInteract);            
            }
            else{
                this.engine.show("&gt; "+ interaction.Interaction);
                this.engine.gotoScene(Location, prevLocation, numInteract);
            }
        } 
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');