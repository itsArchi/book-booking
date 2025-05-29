function countOccurrences(INPUT, QUERY) {
  let result = [];

  QUERY.forEach((queryWord) => {
    let count = INPUT.filter((inputWord) => inputWord === queryWord).length;
    result.push(count);
  });

  return result;
}

let INPUT = ["xc", "dz", "bbb", "dz"];
let QUERY = ["bbb", "ac", "dz"];
let output = countOccurrences(INPUT, QUERY);
console.log(output);
