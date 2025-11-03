// Function to calculate the sum of numbers from 1 to n
function calculateSum(n) {
    var sum = 0;
    for (var i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}
// Test the function
var result = calculateSum(10);
console.log("Sum of numbers from 1 to 10:", result);
// Another example with an array
function printArray(arr) {
    for (var i = 0; i < arr.length; i++) {
        console.log("Element ".concat(i, ": ").concat(arr[i]));
    }
}
var fruits = ["apple", "banana", "orange"];
printArray(fruits);
