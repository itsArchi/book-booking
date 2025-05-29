function reverseAlphabetWithNumber(str) {
  let alphabet = str.replace(/\d/g, "");
  let number = str.replace(/\D/g, "");

  let reversedAlphabet = alphabet.split("").reverse().join("");

  return reversedAlphabet + number;
}

let result = reverseAlphabetWithNumber("KETARIW1");
console.log(result);
