gsap.registerPlugin(SplitText);

/////////  ELEMENTE ERSTELLEN  //////////
// splitting the text into characters and words, and adding classes to each of them
let split = SplitText.create(".variabel",{
    type: "chars",
    charsClass: "char++",
});

//Putting Chars into an Array
const chars = gsap.utils.toArray(".char");

//Definition der Wortgruppen in variabeln
const varia = chars.slice(0,5);  
const bel = chars.slice(5,8)
const bella = chars.slice(5,10);      
const la = chars.slice(8,10);
//const variabella = chars.slice(0,10);

//Seperate Elemente für Varia und Bella erstellen, sodass sie anschliessen Vertauscht werden können
//Container ansprechen in welchem sich Variabella befindet
const word = document.getElementById("word");
//zwei neue Elemente generieren(noch leer)
const variaWrapper = document.createElement("div");
const bellaWrapper = document.createElement("div");
//const variaBellaWrapper = document.createElement("div");

//Elemente einem tag zuordnen
variaWrapper.classList.add("variaFlip");
bellaWrapper.classList.add("variaFlip");
//variaBellaWrapper.classList.add("textScrumble");
//Leere elemente mit Chars füllen
varia.forEach(el => variaWrapper.appendChild(el));
bella.forEach(el => bellaWrapper.appendChild(el));
//variabella.forEach(el => variaBellaWrapper.appendChild(el));
//Elemente in den Container word als Child einfügen
word.appendChild(variaWrapper);
word.appendChild(bellaWrapper);
//word.appendChild(variaBellaWrapper);