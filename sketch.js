let data;  //serve per il csv
let logo;  //serve per png champions
let filtro;  //serve per scegliere il Paese

//Array contenente i Paesi che vengono richiamati nella legenda e nel filtro
let paesi = [
  "Spain", "Italy", "England",
  "Germany", "Netherlands",
  "Portugal", "France",
  "Scotland", "Romania",
  "Yugoslavia", "Sweden",
  "Belgium", "Greece"
];

//oggetto che servirà ad abbinare i colori alle nazioni
let coloreNazione = {
  "Italy": "#2e90e1",
  "England": "#E44A53",
  "Spain": "#facf0f",
  "Germany": "#9f86e5",
  "West Germany": "#9f86e5",
  "France": "#164ec6",
  "Netherlands": "#F08338",
  "Portugal": "#45A977",
  "Scotland": "#82bfdd",
  "Romania": "#fb94ba",
  "Yugoslavia": "#7d7d7d",
  "Belgium": "#ea73f3",
  "Sweden": "#68d3cf",
  "Greece": "#95a343"
};


async function setup() {
  createCanvas(windowWidth, windowHeight);

  data = await loadTable("assets/Champions_finali_capienza.csv", ",", "header");
  logo = await loadImage("assets/logo_champions.jpg");

  textAlign(CENTER, CENTER);

  //filtro a tendina per scegliere il Paese
  //codice filtro trovato nella sezione reference di p5.js
  filtro = createSelect();   //consente di scegliere un'opzione
  filtro.position(60, 595);
  filtro.size(165, 30);

  //prima opzione -> mostra finali di tutti i Paesi
  filtro.option("All countries");

  //aggiungo alla tendina tutti i Paesi contenuti nell'array con un ciclo anzicchè farlo Paese per Paese
  for (let i = 0; i < paesi.length; i++) {
    filtro.option(paesi[i]);
  }

  //estetica della tendina
  filtro.style("background-color", "#252936");
  filtro.style("color", "#c5cbda");
  filtro.style("border", "1px solid #7d899e");
  filtro.style("border-radius", "0px");
}


function draw() {
  background("rgba(0, 0, 0, 0.6)");

  let centerX = width / 2 + 150;
  let centerY = height / 2 - 60;

  let radius = 85;
  let angle = 0;

  let campoW = 42;
  let campoH = 26;

  //leggo il Paese selezionato nella tendina e lo salvo in una variabile
  let paeseScelto = filtro.value();

  //conta le finali vinte dal Paese scelto
  let vittorie = 0;

  //titolo champions league
  noStroke();
  fill("rgb(255, 255, 253)");
  textAlign(LEFT, TOP);
  textSize(29);
  text("CHAMPIONS LEAGUE", 60, 45);

  //sottotitolo
  fill("#aab3c8");
  textSize(13);
  text("The finals from 1955 to 2023", 60, 85);


  //legenda
  fill(255);
  textSize(17);
  text("LEGEND", 60, 155);

  const legenda =
    "1 pitch = 1 final\nPitch's left half = winner country\nPitch's right half = loser country";

  textSize(13);
  fill("#c5cbda");
  text(legenda, 60, 195);

  //legenda dei Paesi
  fill(255);
  textSize(14);
  text("COUNTRIES", 60, 300);

  //Pallini colorati con i nomi dei Paesi abbinati
  for (let i = 0; i < paesi.length; i++) {

    let x;
    let y;

    //mi serve un if else per disporre i Paesi lungo due colonne
    if (i < 7) {
      x = 62;
      y = 340 + i * 25; //aumenta di 25px a ogni iterazione
    } else {
      x = 193;
      y = 340 + (i - 7) * 25; //la posizione verticale riparte dall'inizio
    }

    noStroke();
    fill(coloreNazione[paesi[i]]); //uso l'array per il Paese e poi l'oggetto per restituire il colore
    circle(x, y, 10);

    fill("#c5cbda");
    textAlign(LEFT, CENTER);
    textSize(12);
    text(paesi[i], x + 13, y);
  }

  //titolo del filtro
  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  textSize(14);
  text("FILTER BY WINNER COUNTRY", 60, 565);


  //ciclo for che permette di esplorare riga per riga il dataset
  for (let i = 0; i < data.getRowCount(); i++) {

    //leggo nel CSV le nazioni delle due squadre
    let paeseVincitore = data.getString(i, "WinnerCountry");
    let paeseSconfitto = data.getString(i, "RunnerCountry");

    //creo variabile per capire se la finale deve rimanere colorata
    let evidenziato = false;

    //se sono selezionati tutti i Paesi poi dovranno rimanere tutti colorati
    if (paeseScelto == "All countries") {
      evidenziato = true;
    }
    //se il Paese selezionato ha vinto la finale si colora solo quel campo
    if (paeseScelto == paeseVincitore) {
      evidenziato = true;
    }
    //devo considerare insieme Germania e Germania Ovest
    if (paeseScelto == "Germany" && paeseVincitore == "West Germany") {
      evidenziato = true;
    }

    //conto le vittorie del Paese selezionato
    if (paeseScelto != "All countries" && evidenziato == true) {
      vittorie++;
    }


    //calcolo la posizione sulla spirale
    //non uso un incremento dell'angolo costante, ma lo faccio variare in base al raggio
    radius += 4.5;
    angle += 48 / radius;

    let x = centerX + radius * cos(angle);
    let y = centerY + radius * sin(angle);


    //metà campo sx: Paese vincitore
    noStroke();

    //se si è selezionato un Paese del fitro evidenziato==true e quella metà campo si colora
    //altrimenti si colora di grigio
    if (evidenziato == true) {
      fill(coloreNazione[paeseVincitore]);
    } else {
      fill("#555a64");
    }

    rect(x - campoW/2, y - campoH/2, campoW/2, campoH);

    //metà campo dx: Paese sconfitto. Vale il principio precedente
    if (evidenziato == true) {
      fill(coloreNazione[paeseSconfitto]);
    } else {
      fill("#555a64");
    }

    rect(x, y - campoH/2, campoW/2, campoH);

    //linee bianche e cerchio centrale per far capire che è un campo
    noFill();
    stroke(255);
    strokeWeight(1);

    rect(x - campoW/2, y - campoH/2, campoW, campoH);
    line(x, y - campoH/2, x, y + campoH/2);
    circle(x, y, 7);

    //aree di rigore
    rect(x - campoW/2, y - 7, 8, 14);
    rect(x + campoW/2 - 8, y - 7, 8, 14);


    //primo anno nella spirale
    if (i == 0) {
      fill("rgb(249, 250, 249)");
      noStroke();
      textSize(13);
      text("1955", x, y + campoH/2 - 50);
    }

    //ultimo anno alla fine della spirale
    if (i == data.getRowCount() - 1) {
      fill("rgb(249, 250, 249)");
      noStroke();
      textSize(13);
      text("2023", x, y + campoH/2 - 50);
    }
  }

  //mostro il numero delle finali vinte
  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  textSize(14);

  if (paeseScelto == "All countries") {
    text(data.getRowCount() + " finals", 60, 650);  //restituisce 68 finals 
  } else {  //se si è scelto un Paese comparirà così Paese: numero vicories
    text(paeseScelto + ": " + vittorie + " victories", 60, 650);
  }

  //testo che invita ad aprire la pagina di dettaglio
  fill("#aab3c8");
  textSize(13);
  text("Click on a pitch to explore the final.", 60, 700);


  //il logo lo posiziono al centro del canvas
  //imageMode si basa sullo stesso principio di rectMode
  imageMode(CENTER);
  image(logo, centerX, centerY - 10, 110, 95);
}


//funzione che viene eseguita quando si clicca con il mouse
function mousePressed() {

  //riscrivo le variabili perchè non sono globali ma locali
  let centerX = width / 2 + 150;
  let centerY = height / 2 - 60;

  let radius = 85;
  let angle = 0;

  let campoW = 42;
  let campoH = 26;

  //ciclo che serve per controllare quale campo viene cliccato
  for (let i = 0; i < data.getRowCount(); i++) {

    //calcolo la posizione del campo come prima
    radius += 4.5;
    angle += 48 / radius;

    let x = centerX + radius * cos(angle);
    let y = centerY + radius * sin(angle);

    //devo controllare se il mouse clicca dentro il campo
    if (
      mouseX >= x - campoW/2 &&
      mouseX <= x + campoW/2 &&
      mouseY >= y - campoH/2 &&
      mouseY <= y + campoH/2
    ) {
      //apro la pagina di dettaglio della finale cliccata
      window.location.href = "dettaglio.html?finale=" + i;
      return;
    }
  }
}



