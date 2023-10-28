const testWords = document.querySelector(".test-words");
const testInput = document.querySelector(".test-input");
const startBtn = document.querySelector(".start");
const resetBtn = document.querySelector(".reset");
const mainContent = document.querySelector(".main-content");
const timer = document.querySelector(".timer");
const results = document.querySelector('.results');

// EventListeners
document.addEventListener("DOMContentLoaded", resetTestWords);
testInput.addEventListener("input", startTest);
resetBtn.addEventListener("click", resetTestWords);

let currWordIndex = 0;
let totalWords = 0;

function getWords() {
  return fetch("http://api.quotable.io/random")
    .then((res) => res.json())
    .then((data) => data.content);
}

async function generateWords() {
  console.log("called generateWords");
  let words = await getWords();
  words = words.split(" ");
  console.log(words);
  words.forEach((word, index) => {
    wordSpan = document.createElement("span");
    wordSpan.innerText = word + ' ';
    testWords.appendChild(wordSpan);
  });

}

function resetTestWords() {
  testWords.innerText = "";
  testInput.value = "";
  currWordIndex = 0;
  countDown = 60;
  generateWords();
}

// function called at beginning of test
function startTest() {
  console.log("called startTest");
  // remove eventlistener on input so only called once
  testInput.removeEventListener("input", startTest);
  startCountDown();

  words = testWords.getElementsByTagName("span");
  console.log(words);
  // everytime a new char is typed check if a word has been written
  document.addEventListener("keyup", checkWord);

}

let countDown;
function startCountDown() {
  countDown = 60;
  setInterval(checkFinished, 1000);
}

function checkFinished() {
  if (countDown > 0) {
    countDown--;
    timer.innerText = countDown;
  } else {
    showResults();
  }
}


function checkWord(e) {
  console.log("Called checkword");
  words[currWordIndex].classList.add('curr-word');

  if (e.code == "Space") {
    testInputWords = testInput.value.split(" ").filter((word) => word != "");
    console.log("TEST INPUT WORDS");
    console.log(testInputWords);
    // console.log(currWordIndex);
    // console.log(words[currWordIndex]);
    words[currWordIndex].classList.remove('curr-word');
    if (currWordIndex < words.length - 1) {
      currWordIndex++;
      words[currWordIndex].classList.add('curr-word');
    } else {
      console.log("END OF QUOTE");
      let quoteCorrectWords=0;
      console.log(words);
      for (i = 0; i < words.length; i++) {
        if (words[i].classList.contains("correct")) {
          quoteCorrectWords++;
        }
      }
      console.log("quote correct words = " + quoteCorrectWords);
      totalWords = totalWords + quoteCorrectWords;
      console.log(`totalWords = ${totalWords}`);
      resetTestWords();
      return;
    }

    for (i = 0; i < words.length; i++) {
      // console.log("word " + words[i].innerText);
      // console.log("input " + testInputWords[i]);

      if (testInputWords[i] == null) {
        words[i].classList.remove("correct");
        words[i].classList.remove("incorrect");
      } else if (words[i].innerText.trim() === testInputWords[i]) {
        console.log("CORRECT");
        words[i].classList.remove("incorrect");
        words[i].classList.add("correct");
      } else {
        console.log("CORRECT");
        words[i].classList.remove("correct");
        words[i].classList.add("incorrect");
      }
    }
  }
}


function showResults() {
  results.style.display = 'in-line';
  results.innerText = `Score: ${totalWords} words per minute`;

}