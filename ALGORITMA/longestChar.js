function longest(sentence) {
  let words = sentence.split(" ");
  let longestWord = words[0];

  for (let i = 1; i < words.length; i++) {
    if (words[i].length > longestWord.length) {
      longestWord = words[i];
    }
  }

  console.log(`${longestWord}: ${longestWord.length} character`);
}

let sentence = "ingin menjadi progammer handal namun enggan ngoding";
longest(sentence);
