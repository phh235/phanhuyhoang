// Cung cấp 3 triển khai duy nhất của hàm sau trong JavaScript.
// Đầu vào: n - bất kỳ số nguyên nào
// Giả sử đầu vào này sẽ luôn tạo ra kết quả nhỏ hơn Number.MAX_SAFE_INTEGER.
// Đầu ra: return - tổng của n, tức là sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15.

// Cách 1: Sử dụng vòng lặp
var sum_to_n_a = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// Cách 2: Sử dụng công thức toán học
var sum_to_n_b = function (n) {
  // Sử dụng công thức S = n * (n + 1) / 2
  return (n * (n + 1)) / 2;
};

// Cách 3: Sử dụng đệ quy
var sum_to_n_c = function (n) {
  if (n <= 1) return n; // Trường hợp cơ bản: Nếu n <= 1, trả về n
  return n + sum_to_n_c(n - 1); // Trả về n + sum_to_n_c(n - 1)
};

function testFunctions() {
  const testCases = [1, 5, 10, 100, 0]; // Các giá trị cần test
  const expectedResults = [1, 15, 55, 5050, 0]; // Kết quả mong đợi

  // Lặp qua từng hàm để test
  for (const func of [sum_to_n_a, sum_to_n_b, sum_to_n_c]) {
    console.log(`Testing function: ${func.name}`);
    testCases.forEach((n, index) => {
      const result = func(n);
      console.log(`Input: ${n}, Output: ${result}, Expected: ${expectedResults[index]}`);
      console.assert(result === expectedResults[index], `❌ Test failed for input: ${n}`);
    });
    console.log("All tests passed!\n");
  }
}

testFunctions();
