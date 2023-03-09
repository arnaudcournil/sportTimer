var noSleep = new NoSleep();
noSleep.disable();
var container = document.getElementById("result");
var trainings = {
  "Gainage": {
    "meta": {
      "img" : "assets/images/gainage.jpg",
      "max" : 120,
      "type" : "time"
    },
    "Facile": {
      "1" : 50,//pourcentage
      "2" : 50,
      "3" : 37.5,
      "4" : 25,
      "5" : 25,
      "rest" : 50//pourcentage
    },
    "Moyen": {
      "1" : 75,
      "2" : 50,
      "3" : 50,
      "4" : 37.5,
      "5" : 25,
      "rest" : 75
    },
    "Difficile": {
      "1" : 100,
      "2" : 75,
      "3" : 50,
      "4" : 50,
      "5" : 25,
      "rest" : 100
    }
  },
  "Tractions": {
    "meta": {
      "img" : "assets/images/traction.png",
      "max" : 5,
      "type" : "reps"
    },
    "Facile": {
      "1" : 60,
      "2" : 40,
      "3" : 40,
      "4" : 40,
      "5" : 20,//pourcentage
      "rest" : 30//secondes
    },
    "Moyen": {
      "1" : 60,
      "2" : 60,
      "3" : 40,
      "4" : 40,
      "5" : 40,
      "rest" : 60
    },
    "Difficile": {
      "1" : 60,
      "2" : 60,
      "3" : 60,
      "4" : 40,
      "5" : 40,
      "rest" : 90
    }
  },
}

for(train in trainings)
{
  localStorage.setItem(train, localStorage.getItem(train) || trainings[train].meta.max);
  trainings[train].meta.max = localStorage.getItem(train);
}

for(train in trainings)
{
  var elmt = "<li onclick = \"getTrain('" + train + "')\">";
  elmt += "<h2>" + train + "</h2>";
  elmt += "<div class='card-content'>";
  elmt += "<img src='" + trainings[train].meta.img + "'>";
  elmt += "<div class='infos'>";
  for(level in trainings[train])
  {
    if(level != "meta")
    {
      elmt += "<p>• " + level + "</p>";
    }
  }
  elmt += "</div>";
  elmt += "</div>";
  elmt += "</li>";
  container.innerHTML += elmt;
}
function getTrain(train)
{
  var elmt = "";
  for(level in trainings[train])
  {
    if(level != "meta")
    {
      elmt += "<li onclick = \"rest = false; launchTrain('" + train + "', '" + level + "')\">";
      elmt += "<h2>" + level + "</h2>";
      elmt += "<p>"
      for(serie in trainings[train][level])
      {
        if(serie != "rest")
        {
          elmt += trainings[train].meta.type == "time" ? convertTime(Math.round(trainings[train][level][serie] * trainings[train].meta.max / 100)) + " - " : Math.round(trainings[train][level][serie] * trainings[train].meta.max / 100) + " - ";
        }
      }
      elmt = elmt.slice(0, -3);
      elmt += "</p>"
      elmt += "<p>Repos : " + (trainings[train].meta.type == "time" ? convertTime(Math.round(trainings[train][level].rest * trainings[train].meta.max / 100)) : convertTime(trainings[train][level].rest)) + "</p>";
      elmt += "</li>";
    }
  }
  // max menu
  elmt += "<li onclick = \"modifyMax('" + train + "')\">";
  elmt += "<h2>Max</h2>";
  elmt += "<p>Actuel : " + (trainings[train].meta.type == "time" ? convertTime(trainings[train].meta.max) : trainings[train].meta.max) + "</p>";
  elmt += "</li>";

  elmt += "<div class='buttons'>";
  elmt += "<button onclick = \"location.reload()\">Retour</button>";
  elmt += "</div>";
  container.innerHTML = elmt;
}

var timeTrain = 0;
var rest = false;

var trainNext = "";
var levelNext = "";
var serieNext = "";
var pause = false;

function launchTrain(train, level, serie = "1")
{
  noSleep.enable();
  pause = false;
  trainNext = train;
  levelNext = level;
  if(serie in trainings[train][level])
  {
    if(rest)
    {
      rest = false;
      timeTrain = trainings[train].meta.type == "time" ? trainings[train][level].rest * trainings[train].meta.max / 100 : trainings[train][level].rest;
      var elmt = "<li>";
      elmt += "<h2>" + train + " " + level + "</h2>";
      elmt += "<p>Repos</p>";
      elmt += "<p>Temps total : " + (trainings[train].meta.type == "time" ? convertTime(Math.round(trainings[train][level].rest * trainings[train].meta.max / 100)) : convertTime(trainings[train][level].rest)) + "</p>";
      elmt += "<div class='timer'>";
      elmt += "<h2><p id='time'>00:00</p></h2>";
      elmt += "</div>";
      elmt += "<div class='buttons'>";
      elmt += "<button id = \"pauseButton\" onclick = \"pauseFunct()\">Pause</button> ";
      elmt += "<button onclick = \"timeTrain = 1\">Skip</button>";
      elmt += "</div>";
      elmt += "</li>";
      container.innerHTML = elmt;
      serieNext = serie;
      updateTime();
    }
    else
    {
      rest = true;
      if(trainings[train].meta.type == "time")
      {
        timeTrain = trainings[train][level][serie] * trainings[train].meta.max / 100;
        var elmt = "<li>";
        elmt += "<h2>" + train + " " + level + "</h2>";
        elmt += "<p>Série : " + serie + "</p>";
        elmt += "<p>Temps total : " + convertTime(Math.round(trainings[train][level][serie] * trainings[train].meta.max / 100)) + "</p>";
        elmt += "<div class='timer'>";
        elmt += "<h2><p id='time'>00:00</p></h2>";
        elmt += "</div>";
        elmt += "<div class='buttons'>";
        elmt += "<button id = \"pauseButton\" onclick = \"pauseFunct()\">Pause</button> ";
        elmt += "<button onclick = \"timeTrain = 1\">Skip</button>";
        elmt += "</div>";
        elmt += "</li>";
        container.innerHTML = elmt;
        serieNext = String(parseInt(serie) + 1)
        updateTime();
      }
      else
      {
        repsTrain = trainings[train][level][serie] * trainings[train].meta.max / 100;
        var elmt = "<li>";
        elmt += "<h2>" + train + " " + level + "</h2>";
        elmt += "<p>Série : " + serie + "</p>";
        elmt += "<p> </p>";
        elmt += "<div class='reps'>";
        elmt += "<h2><p id='reps'>" + Math.round(trainings[train][level][serie] * trainings[train].meta.max / 100) + "</p></h2>";
        elmt += "</div>";
        elmt += "<div class='buttons'>";
        elmt += "<button onclick = \"launchTrain(trainNext, levelNext, serieNext)\">Next</button>";
        elmt += "</div>";
        elmt += "</li>";
        container.innerHTML = elmt;
        serieNext = String(parseInt(serie) + 1);
      }
    }
  }
  else
  {
    var elmt = "<li>";
    elmt += "<h2>" + train + " " + level + "</h2>";
    elmt == "<p>Terminé !</p>";
    elmt += "<div class='buttons'>";
    elmt += "<button onclick = \"location.reload()\">Retour à l'acceuil</button>";
    elmt += "</div>";
    elmt += "</li>";
    container.innerHTML = elmt;
  }
}

function updateTime()
{
  if(timeTrain == 0)
  {
    launchTrain(trainNext, levelNext, serieNext);
  }
  else
  {
    if(!pause || timeTrain == 1)
    {
      document.getElementById("time").innerHTML = convertTime(timeTrain);
      timeTrain--;
    }
    setTimeout(updateTime, 1000);
  }
}

function modifyMax(train)
{
  var elmt = "<li>";
  elmt += "<h2>Max " + train + "</h2>";
  elmt += "<p>Actuel : " + trainings[train].meta.max + (trainings[train].meta.type == "time" ? " secondes" : " reps") + "</p>";
  elmt += "<p> </p>";
  elmt += "<div class='forms'>";
  elmt += "<form action=\"javascript:;\" onsubmit=\"modifyMaxSubmit(this,'" + train + "')\">";
  elmt += "<input type='number' id='max' placeholder='Nouveau max'>";
  elmt += "<input type='submit' value='Modifier'>";
  elmt += "</form>";
  elmt += "</div>";
  elmt += "</li>";
  container.innerHTML = elmt;
}

function modifyMaxSubmit(theForm, train)
{
  if(!isNaN(parseInt(theForm.max.value)))
  {
    trainings[train].meta.max = theForm.max.value;
    localStorage.setItem(train, theForm.max.value);
  }
  getTrain(train);
}


function convertTime(time)
{
  var minutes = Math.floor(time / 60);
  var seconds = time % 60;
  if(minutes < 10)
  {
    minutes = "0" + minutes;
  }
  if(seconds < 10)
  {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
}

function pauseFunct()
{
  if(pause)
  {
    pause = false;
    document.getElementById("pauseButton").innerHTML = "Pause";
  }
  else
  {
    pause = true;
    document.getElementById("pauseButton").innerHTML = "Reprendre";
  }
}