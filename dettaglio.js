
let data; //serve per il csv
let finale; //indica la finale selezionata

//colori delle nazioni, uguali a quelli dell'overview
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

    //recupero la finale cliccata nell'overview
    let parametri = getURLParams(); //funzione che legge i parametri presenti nell'URL
    finale = parametri.finale; //salva il valore della proprietà finale
}

function draw() {
    background("black");

    //leggo dati contenuti in una riga del dataset
    let stagione = data.getString(finale, "Season");
    let vincitore = data.getString(finale, "Winners");
    let sconfitto = data.getString(finale, "Runners-up");

    let paeseVincitore = data.getString(finale, "WinnerCountry");
    let paeseSconfitto = data.getString(finale, "RunnerCountry");

    let golVincitore = data.getNum(finale, "WinnerGoals");
    let golSconfitto = data.getNum(finale, "RunnerGoals");

    let nota = data.getString(finale, "Notes");

    let stadio = data.getString(finale, "Venue");

    let spettatori = data.getNum(finale, "Attendance");
    let capienza = data.getNum(finale, "StadiumCapacity");


    //scritta per tornare all'overview poi da rendere cliccabile
    noStroke();
    fill("#aab3c8");
    textAlign(LEFT, TOP);
    textSize(14);
    text("← BACK TO OVERVIEW", 60, 20);

    //titolo
    fill(255);
    textSize(29);
    text("CHAMPIONS LEAGUE", 60, 65);

    //stagione della finale
    fill("#aab3c8");
    textSize(16);
    text("The final of " + stagione, 60, 105); //la variabile stagione salva l'anno

    //campo da calcio
    let campoX = 455;
    let campoY = 340;
    let campoW = 590;
    let campoH = 320;

    //legenda
    fill(255);
    textAlign(LEFT, TOP);
    textSize(17);
    text("LEGEND", 60, 258);

    let legenda =
        "1 pitch = 1 final\nPitch's left half = winner country\nPitch's right half = loser country\n1 dot = 1 goal";
    textSize(13);
    fill("#c5cbda");
    text(legenda, 60, 310);

    //come è terminata la partita 
    noStroke();
    fill(255);
    textSize(14);
    text("MATCH OUTCOME", 60, 435);

    fill("#c5cbda");
    textSize(12);
    text("90 MIN = Match ended in regular time", 60, 470);
    text("EXTRA TIME = Match was won during extra time", 60, 488);
    text("PENALTIES = Match was won on a penalty shoot-out", 60, 506);
    text("REPLAY = Match was won after a replay", 60, 524);

    //testo legenda grafico degli spettatori
    fill(255);
    textSize(14);
    text("ATTENDANCE", 60, 595);

    fill("#c5cbda");
    textSize(12);
    text("White arc = spectators", 60, 630);
    text("Grey arc = stadium capacity", 60, 648);


    //squadra vincitrice
    textAlign(LEFT, TOP);
    fill("#aab3c8");
    textSize(15);
    text("WINNER", campoX, 260);

    fill(255);
    textSize(22);
    text(vincitore, campoX, 290, campoW / 2, 45);

    //squadra sconfitta
    textAlign(RIGHT, TOP);
    fill("#aab3c8");
    textSize(15);
    text("RUNNER-UP", campoX + campoW, 260);

    fill(255);
    textSize(22);
    text(sconfitto, campoX + campoW / 2, 290, campoW / 2, 45);


    noStroke();

    //metà campo squadra vincitrice
    fill(coloreNazione[paeseVincitore]);
    rect(campoX, campoY, campoW / 2, campoH);
    //metà campo della squadra sconfitta
    fill(coloreNazione[paeseSconfitto]);
    rect(campoX + campoW / 2, campoY, campoW / 2, campoH);

    //linee bianche
    noFill();
    stroke(255);
    strokeWeight(2);

    rect(campoX, campoY, campoW, campoH);
    line(campoX + campoW / 2, campoY, campoX + campoW / 2, campoY + campoH);
    //cerchio centrale
    circle(campoX + campoW / 2, campoY + campoH / 2, 90);
    //area sinistra
    rect(campoX, campoY + 90, 90, 140);
    //area destra
    rect(campoX + campoW - 90, campoY + 90, 90, 140);

    //goal
    noStroke();
    fill(255);

    //pallino goal vincitore
    for (let i = 0; i < golVincitore; i++) {
        let x = campoX + campoW / 4;
        let y = campoY + (i + 1) * campoH / (golVincitore + 1);
        circle(x, y, 20);
    }
    //goal sconfitto
    for (let i = 0; i < golSconfitto; i++) {
        let x = campoX + campoW * 3 / 4;
        let y = campoY + (i + 1) * campoH / (golSconfitto + 1);
        circle(x, y, 20);
    }


    //ultima colonna dataset che indica come è finita la partita
    let conclusione = "90 MIN";

    if (nota == "Match was won during extra time") {
        conclusione = "EXTRA TIME";
    } else if (nota == "Match was won on a penalty shoot-out") {
        conclusione = "PENALTIES";
    } else if (nota == "Match was won after a replay") {
        conclusione = "REPLAY";
    }

    //rettangolo e scritta nota
    noStroke();
    fill("#464B56");
    rect(campoX, 680, 165, 36);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(14);
    text(conclusione, campoX + 82.5, 698); //rivedi


    //stadio
    let infoX = width - 500;  //mi serve per posizionare lo stadio

    textAlign(LEFT, TOP);
    fill("#aab3c8");
    textSize(15);
    text("STADIUM", infoX, 260);

    fill(255);
    textSize(24);
    text(stadio, infoX, 290, 350, 100);  //gli altri due parametri servono a definire
    //la larghezza e l'altezza disponibile per il testo così nomi di stadi lunghi vanno a capo


    //scritta affluenza
    fill("#aab3c8");
    textSize(15);
    text("ATTENDANCE", infoX, 430);
    //dimensioni del grafico semicircolare
    let centroX = width - 310;
    let centroY = campoY + campoH - 20;
    let diametro = 300;
    //semicerchio grigio per indicare la capienza dello stadio
    noFill();
    stroke("#464B56");
    strokeWeight(28);
    arc(centroX, centroY, diametro, diametro, PI, TWO_PI);  //arc visto in p5.js consente di disegnare una parte di circonferenza, bisogna indicare angolo iniziale e finale
    //semicerchio bianco per gli spettatori presenti
    let rapporto = spettatori / capienza; //mi serve una percentuale quindi faccio questo rapporto
    //il rapporto non può mai essere maggiore di 1 quindi aggiungo un controllo
    if (rapporto > 1) {
        rapporto = 1;
    }
    stroke(255);
    arc(centroX, centroY, diametro, diametro, PI, PI + PI * rapporto); //bisogna sommare PI perchè l'arco parte da 180 e deve arrivare a 360

    //numero di spettatori
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text(spettatori, centroX, centroY - 60);
    fill("#aab3c8");
    textSize(16);
    text("spectators", centroX, centroY - 20);

    //valori degli estremi del semicerchio
    textSize(15);
    text("0", centroX - diametro / 2, centroY + 35);
    text(capienza, centroX + diametro / 2, centroY + 35);
}

//rendo cliccabile la scritta per tornare all'overview
function mousePressed() {
    if (mouseX >= 60 && mouseX <= 240 && mouseY >= 15 && mouseY <= 50) {
        window.location.href = "index.html";
    }
}
