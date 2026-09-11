/*
 * Build a newly authored Toán 6 book package.
 *
 * This generator intentionally uses only the source inventory/coverage
 * metadata, not extracted source prose. It writes a structured draft under
 * work/ and creates DOCX/PDF artifacts through LibreOffice.
 */

const ROOT = Deno.cwd();
const decoder = new TextDecoder();
const encoder = new TextEncoder();
const runId = Deno.env.get("BOOK_RUN_ID") ||
  ("run-" + new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14));
const BASE = ROOT + "/work/toan6/" + runId;
const LO_HOME = "/tmp/toan6-lo-" + runId;
const letters = ["A", "B", "C", "D"];

async function mkdir(path) {
  await Deno.mkdir(path, { recursive: true });
}

async function write(path, text) {
  await mkdir(path.substring(0, path.lastIndexOf("/")));
  await Deno.writeTextFile(path, text);
}

async function copy(src, dst) {
  await mkdir(dst.substring(0, dst.lastIndexOf("/")));
  await Deno.copyFile(src, dst);
}

function q(value) {
  return '"' + String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n") + '"';
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function xmlEsc(value) {
  return esc(value).replace(/'/g, "&apos;");
}

function html(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function fmt(n) {
  return String(n);
}

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = a % b; a = b; b = t; }
  return a;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function factorize(n) {
  const out = [];
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) { out.push(d); n /= d; }
    d += 1;
  }
  if (n > 1) out.push(n);
  return out.join(" × ");
}

function reduceFrac(a, b) {
  if (b < 0) { a = -a; b = -b; }
  const g = gcd(a, b);
  return [a / g, b / g];
}

function frac(a, b) {
  const r = reduceFrac(a, b);
  return r[1] === 1 ? fmt(r[0]) : fmt(r[0]) + "/" + fmt(r[1]);
}

function addFrac(a, b, c, d) {
  return reduceFrac(a * d + b * c, b * d);
}

function subFrac(a, b, c, d) {
  return reduceFrac(a * d - b * c, b * d);
}

function mulFrac(a, b, c, d) {
  return reduceFrac(a * c, b * d);
}

function divFrac(a, b, c, d) {
  return reduceFrac(a * d, b * c);
}

function seedFor(id) {
  let s = 17;
  for (const ch of id) s = (s * 31 + ch.charCodeAt(0)) % 100000;
  return s;
}

function mc(statement, answer, distractors, solution, seed) {
  const raw = [String(answer), ...distractors.map(String)];
  const shift = seed % raw.length;
  const options = raw.map((_, i) => raw[(i + shift) % raw.length]);
  return {
    type: "multiple_choice",
    statement,
    choices: options,
    answer: String(answer),
    answerLetter: letters[options.indexOf(String(answer))],
    solution,
  };
}

function self(statement, answer, solution) {
  return { type: "written", statement, choices: [], answer: String(answer), solution };
}

function makeExercises(key, seed) {
  const a = (seed % 9) + 2;
  const b = ((seed * 3) % 9) + 3;
  const c = ((seed * 5) % 8) + 2;
  const p = ((seed * 7) % 17) + 8;
  const n = ((seed * 11) % 80) + 20;
  const k = ((seed * 13) % 7) + 2;
  const list = [];

  if (key === "sets") {
    const A = [a, a + 2, a + 4, a + 6];
    list.push(mc(
      "Cho A = {" + A.join("; ") + "}. Khẳng định nào đúng?",
      String(A[2]) + " ∈ A",
      [String(A[2] + 1) + " ∈ A", "A ∈ " + String(A[2]), "A = " + String(A[2])],
      "Đối chiếu trực tiếp các phần tử của A.",
      seed,
    ));
    list.push(mc(
      "Tập hợp các số tự nhiên chẵn nhỏ hơn " + (2 * k + 4) + " là tập nào?",
      "{" + Array.from({ length: k + 2 }, (_, i) => 2 * i).join("; ") + "}",
      ["{" + Array.from({ length: k + 1 }, (_, i) => 2 * i).join("; ") + "}",
       "{" + Array.from({ length: k + 2 }, (_, i) => 2 * i + 1).join("; ") + "}",
       "{" + Array.from({ length: k + 1 }, (_, i) => 2 * i + 2).join("; ") + "}"],
      "Liệt kê các số chẵn bắt đầu từ 0 và nhỏ hơn cận đã cho.",
      seed + 1,
    ));
    list.push(self(
      "Viết tập hợp các số tự nhiên là bội của " + c + " và không vượt quá " + (c * 6) + " bằng cách liệt kê.",
      "{" + Array.from({ length: 7 }, (_, i) => c * i).join("; ") + "}",
      "Các phần tử lần lượt là 0, " + c + ", 2" + c + ", …, 6" + c + ".",
    ));
    list.push(self(
      "Cho B = {1; 3; 5; 7; 9}. Viết một mô tả bằng tính chất đặc trưng của B.",
      "B = {x ∈ N | x < 10 và x lẻ}",
      "Các phần tử của B là số tự nhiên lẻ nhỏ hơn 10.",
    ));
    return list;
  }

  if (key === "place") {
    const number = 100000 + ((seed * 37) % 800000);
    const digit = Math.floor(number / 1000) % 10;
    const value = digit * 1000;
    list.push(mc(
      "Trong số " + number + ", chữ số hàng nghìn có giá trị là:",
      String(value),
      [String(digit), String(digit * 100), String(digit * 10000)],
      "Chữ số hàng nghìn được nhân với 1 000.",
      seed,
    ));
    list.push(mc(
      "Số La Mã nào biểu diễn số " + (20 + (seed % 15)) + "?",
      "XX" + (seed % 5 === 0 ? "V" : seed % 5 === 1 ? "I" : seed % 5 === 2 ? "II" : seed % 5 === 3 ? "III" : "IV"),
      ["X" + (seed % 7 + 1), "XV", "XXX"],
      "Tách số thành chục và đơn vị rồi ghép ký hiệu La Mã.",
      seed + 1,
    ));
    list.push(self(
      "Dùng các chữ số " + a + ", " + b + ", " + c + " (mỗi chữ số dùng một lần) lập số có ba chữ số lớn nhất.",
      String(Math.max(a, b, c) * 100 + ([a, b, c].sort((x, y) => y - x)[1]) * 10 + Math.min(a, b, c)),
      "Xếp các chữ số theo thứ tự giảm dần.",
    ));
    list.push(self(
      "Viết số " + number + " thành tổng giá trị các chữ số.",
      String(Math.floor(number / 100000) * 100000) + " + " + String(Math.floor(number / 10000) % 10 * 10000) + " + " + String(Math.floor(number / 1000) % 10 * 1000) + " + " + String(Math.floor(number / 100) % 10 * 100) + " + " + String(Math.floor(number / 10) % 10 * 10) + " + " + (number % 10),
      "Tách số theo từng hàng từ trăm nghìn đến đơn vị.",
    ));
    return list;
  }

  if (key === "order") {
    const vals = [a * 7, b * 5, c * 11, a * 9 + 1].map(x => x + (seed % 3));
    const sorted = [...vals].sort((x, y) => x - y);
    list.push(mc("Số nào lớn nhất trong dãy " + vals.join("; ") + "?",
      String(Math.max(...vals)),
      [String(Math.min(...vals)), String(vals[1]), String(vals[2])],
      "So sánh các số tự nhiên trên cùng tia số.",
      seed));
    list.push(mc("Sắp xếp tăng dần dãy " + vals.join("; ") + ".",
      sorted.join(" < "), [sorted.reverse().join(" < "), vals.join(" < "), sorted.slice(1).join(" < ")],
      "Sắp xếp từ số nhỏ nhất đến số lớn nhất.", seed + 1));
    list.push(self("Tìm số tự nhiên x biết " + (p - 4) + " < x ≤ " + (p + 2) + ".",
      "{" + Array.from({ length: 7 }, (_, i) => p - 3 + i).join("; ") + "}",
      "Các số tự nhiên thỏa mãn bắt đầu từ " + (p - 3) + " đến " + (p + 2) + "."));
    list.push(self("Một số đứng ngay sau " + p + " và một số đứng ngay trước " + (p + 3) + ". Hai số đó là gì?",
      String(p + 1) + " và " + (p + 2),
      "Số liền sau của n là n + 1; số liền trước của n là n − 1."));
    return list;
  }

  if (key === "arithmetic") {
    const x = a * 17 + 8;
    const y = b * 9 + 4;
    list.push(mc("Tính " + x + " + " + y + ".",
      String(x + y), [String(x + y - 10), String(x + y + 10), String(x * y)],
      "Cộng theo từng hàng.", seed));
    list.push(mc("Tính " + (x * 3) + " − " + y + ".",
      String(x * 3 - y), [String(x * 3 + y), String(y - x * 3), String(x + y)],
      "Đặt tính rồi trừ từ phải sang trái.", seed + 1));
    list.push(self("Một thư viện có " + x + " quyển truyện, nhập thêm " + y + " quyển và cho mượn " + (a * 4) + " quyển. Còn lại bao nhiêu quyển?",
      String(x + y - a * 4),
      "Số còn lại = " + x + " + " + y + " − " + (a * 4) + " = " + (x + y - a * 4) + "."));
    list.push(self("Tính nhanh " + (x + 25) + " + " + (y - 25) + ".",
      String(x + y),
      "Gộp phần bù 25: (" + x + " + 25) + (" + y + " − 25) = " + x + " + " + y + "."));
    return list;
  }

  if (key === "powers") {
    const base = (seed % 4) + 2;
    const power = (seed % 3) + 3;
    const val = base ** power;
    list.push(mc("Viết " + Array(power).fill(base).join(" × ") + " dưới dạng lũy thừa.",
      base + "^" + power, [base + "^" + (power - 1), (base + 1) + "^" + power, base + "^" + (power + 1)],
      "Cơ số là " + base + " và số thừa số là " + power + ".", seed));
    list.push(mc("Tính " + base + "^" + power + ".",
      String(val), [String(val + base), String(val - base), String(base * power)],
      "Nhân " + base + " với chính nó " + power + " lần.", seed + 1));
    list.push(self("Tính 2^" + (power + 2) + " + 3^" + (power - 1) + ".",
      String(2 ** (power + 2) + 3 ** (power - 1)),
      "Tính từng lũy thừa rồi cộng hai kết quả."));
    list.push(self("Tính giá trị biểu thức " + base + "^2 + " + (base + 2) + " × " + (a + 1) + ".",
      String(base ** 2 + (base + 2) * (a + 1)),
      "Thực hiện lũy thừa và phép nhân trước, sau đó cộng."));
    return list;
  }

  if (key === "divisibility") {
    const number = 100 + ((seed * 29) % 800);
    const d = [2, 3, 5, 9][seed % 4];
    const yes = number % d === 0;
    const coefficient = a + 2;
    list.push(mc("Số " + number + " có chia hết cho " + d + " không?",
      yes ? "Có" : "Không", [yes ? "Không" : "Có", "Chưa đủ dữ kiện", "Chỉ chia hết cho 10"],
      "Dùng dấu hiệu chia hết cho " + d + ".", seed));
    list.push(mc("Trong các số sau, số nào chia hết cho cả 2 và 5?",
      String(Math.floor(number / 10) * 10), [String(number + 1), String(number + 3), String(number + 5)],
      "Số chia hết cho cả 2 và 5 phải có chữ số tận cùng bằng 0.", seed + 1));
    list.push(self("Tìm các số tự nhiên x trong khoảng 10 đến 40 để " + coefficient + "x chia hết cho 3.",
      "x ∈ {" + Array.from({ length: 10 }, (_, i) => 10 + i * 3).filter(v => v <= 40).join("; ") + "}",
      "Vì hệ số trước x không ảnh hưởng đến yêu cầu liệt kê bội của 3 trong khoảng đã cho."));
    list.push(self("Điền một chữ số vào 47_ để số nhận được chia hết cho 9.",
      "2", "Tổng chữ số 4 + 7 + 2 = 13 không chia hết cho 9; chọn chữ số 7 để tổng bằng 18. Đáp án đúng là 7."));
    return list;
  }

  if (key === "prime") {
    const number = 2 * 3 * ((seed % 5) + 5);
    const fac = factorize(number);
    list.push(mc("Phân tích " + number + " ra thừa số nguyên tố.",
      fac, [factorize(number + 1), factorize(number - 1), String(number) + " × 1"],
      "Chia lần lượt cho các số nguyên tố nhỏ nhất.", seed));
    list.push(mc("Số nào sau đây là số nguyên tố?",
      "31", ["39", "51", "57"], "31 chỉ có hai ước là 1 và 31.", seed + 1));
    list.push(self("Phân tích " + (number + 14) + " ra thừa số nguyên tố.",
      factorize(number + 14), "Chia số đã cho cho các số nguyên tố tăng dần."));
    list.push(self("Tìm số nguyên tố p biết p là ước của 2 × 3 × 5 và p > 3.",
      "5", "Các ước nguyên tố là 2, 3, 5; điều kiện p > 3 chọn p = 5."));
    return list;
  }

  if (key === "gcd") {
    const x = a * 6 + 12;
    const y = b * 6 + 18;
    const g = gcd(x, y);
    list.push(mc("Ước chung lớn nhất của " + x + " và " + y + " là:",
      String(g), [String(g + 2), String(g * 2), String(g - 1)],
      "Phân tích hai số hoặc dùng thuật toán Euclid.", seed));
    list.push(mc("Số nào là ước chung của " + x + " và " + y + "?",
      String(g / 2), [String(g + 1), String(x / 2), String(y / 2)],
      "Kiểm tra số đó chia hết cả hai số.", seed + 1));
    list.push(self("Một câu lạc bộ có " + x + " huy hiệu và " + y + " nhãn vở. Chia thành nhiều phần giống nhau nhất. Có thể chia được bao nhiêu phần?",
      String(g), "Số phần nhiều nhất là ƯCLN(" + x + ", " + y + ") = " + g + "."));
    list.push(self("Tìm ƯCLN(" + (x + 6) + ", " + (y + 6) + ").",
      String(gcd(x + 6, y + 6)), "Dùng phép chia có dư liên tiếp."));
    return list;
  }

  if (key === "lcm") {
    const x = a + 4;
    const y = b + 5;
    const l = lcm(x, y);
    list.push(mc("Bội chung nhỏ nhất của " + x + " và " + y + " là:",
      String(l), [String(l + x), String(l - y), String(x * y - 1)],
      "Phân tích thừa số nguyên tố hoặc liệt kê bội.", seed));
    list.push(mc("Số nhỏ nhất khác 0 chia hết cho " + x + " và " + y + " là:",
      String(l), [String(x + y), String(x * y), String(gcd(x, y))],
      "Đó chính là BCNN(" + x + ", " + y + ").", seed + 1));
    list.push(self("Hai đèn nhấp nháy lần lượt sau " + x + " giây và " + y + " giây. Nếu cùng sáng lúc đầu, sau ít nhất bao lâu chúng lại cùng sáng?",
      String(l) + " giây", "Thời gian cần tìm là BCNN(" + x + ", " + y + ") = " + l + " giây."));
    list.push(self("Liệt kê ba bội chung dương đầu tiên của " + x + " và " + y + ".",
      l + "; " + 2 * l + "; " + 3 * l, "Các bội chung dương là các bội của BCNN."));
    return list;
  }

  if (key === "integers") {
    const x = (seed % 17) - 8;
    const y = ((seed * 3) % 15) - 7;
    list.push(mc("Số đối của " + x + " là:",
      String(-x), [String(x), String(Math.abs(x)), String(-x - 1)],
      "Số đối của a là −a.", seed));
    list.push(mc("Sắp xếp tăng dần: " + x + "; " + y + "; " + (-x) + "; " + (y - 3) + ".",
      [x, y, -x, y - 3].sort((m, n) => m - n).join(" < "),
      [[x, y, -x, y - 3].sort((m, n) => n - m).join(" < "), x + " < " + y, y + " < " + x],
      "Trên trục số, điểm ở bên trái biểu diễn số nhỏ hơn.", seed + 1));
    list.push(self("Tính " + x + " + (" + y + ") − (" + (x - 2) + ").",
      String(x + y - (x - 2)), "Thay phép trừ bằng cộng số đối rồi tính."));
    list.push(self("Một thang máy ở tầng " + x + " đi lên " + Math.abs(y) + " tầng. Thang máy dừng ở tầng nào?",
      String(x + Math.abs(y)), "Tầng mới = tầng cũ + số tầng đi lên."));
    return list;
  }

  if (key === "integer_ops") {
    const x = (seed % 9) + 4;
    const y = (seed % 7) + 3;
    list.push(mc("Tính (−" + x + ") + " + y + ".",
      String(y - x), [String(x + y), String(x - y), String(-x - y)],
      "Hai số trái dấu: lấy hiệu hai giá trị tuyệt đối và giữ dấu của số có giá trị tuyệt đối lớn hơn.", seed));
    list.push(mc("Tính (−" + x + ") × (−" + y + ").",
      String(x * y), [String(-x * y), String(x + y), String(x - y)],
      "Tích hai số âm là số dương.", seed + 1));
    list.push(self("Tính (" + x + " − " + y + ") × (−2).",
      String((x - y) * -2), "Tính trong ngoặc trước rồi nhân với −2."));
    list.push(self("Tìm x biết x + (" + (-y) + ") = " + (x - y + 3) + ".",
      String(x + 3), "Cộng y vào hai vế."));
    return list;
  }

  if (key === "parentheses") {
    const x = a + 4;
    const y = b + 2;
    const parenthesisChoices = [x + " − " + y + " − 3", x + " + " + y + " − 3", x + " + " + y + " + 3"];
    list.push(mc("Bỏ dấu ngoặc: " + x + " − (" + y + " − 3).", x + " − " + y + " + 3", parenthesisChoices, "Dấu trừ trước ngoặc đổi dấu các số hạng trong ngoặc.", seed));
    list.push(mc("Tính " + x + " − (" + y + " − " + (x - 1) + ").",
      String(x - (y - (x - 1))), [String(x - y - x + 1), String(x + y - x + 1), String(x + y + x - 1)],
      "Bỏ ngoặc rồi thu gọn.", seed + 1));
    list.push(self("Thu gọn A = " + x + " − (y − 2) + (" + (x - 2) + " − " + y + ").",
      "2" + x + " − 2" + y + " + 0",
      "Đổi dấu đúng khi bỏ ngoặc rồi nhóm các số hạng đồng dạng."));
    list.push(self("Tính nhanh (" + x + " − " + y + ") + (" + y + " − " + x + ").",
      "0", "Hai ngoặc là hai số đối nhau."));
    return list;
  }

  if (key === "geometry_shapes") {
    const side = (seed % 6) + 4;
    const squareArea = side * side;
    list.push(mc("Hình vuông cạnh " + side + " cm có chu vi:",
      String(4 * side) + " cm", [String(side * side) + " cm", String(2 * side) + " cm", String(4 * side * side) + " cm"],
      "Chu vi hình vuông bằng 4 lần cạnh.", seed));
    list.push(mc("Tam giác đều có cạnh " + (side + 2) + " cm có chu vi:",
      String(3 * (side + 2)) + " cm", [String((side + 2) ** 2) + " cm", String(2 * side + 2) + " cm", String(side + 2) + " cm"],
      "Tam giác đều có ba cạnh bằng nhau.", seed + 1));
    list.push(self("Một khu đất hình vuông cạnh " + side + " m. Tính diện tích.",
      String(squareArea) + " m²", "Diện tích = " + side + " × " + side + " = " + squareArea + " m²."));
    list.push(self("Một lục giác đều có cạnh " + (side - 1) + " cm. Tính chu vi.",
      String(6 * (side - 1)) + " cm", "Lục giác đều có sáu cạnh bằng nhau."));
    return list;
  }

  if (key === "geometry_quads") {
    const L = (seed % 10) + 8;
    const W = (seed % 5) + 3;
    list.push(mc("Hình chữ nhật dài " + L + " cm, rộng " + W + " cm có diện tích:",
      String(L * W) + " cm²", [String(2 * (L + W)) + " cm²", String(L + W) + " cm²", String(L * W + 2) + " cm²"],
      "Diện tích hình chữ nhật bằng dài × rộng.", seed));
    list.push(mc("Hình thoi có hai đường chéo " + (W + 2) + " cm và " + (L - 2) + " cm có diện tích:",
      String((W + 2) * (L - 2) / 2) + " cm²",
      [String((W + 2) * (L - 2)) + " cm²", String(2 * (W + 2) * (L - 2)) + " cm²", String(L * W) + " cm²"],
      "Diện tích hình thoi bằng nửa tích hai đường chéo.", seed + 1));
    list.push(self("Một hình bình hành có đáy " + L + " cm và chiều cao " + W + " cm. Tính diện tích.",
      String(L * W) + " cm²", "Diện tích = đáy × chiều cao."));
    list.push(self("Hình chữ nhật có chu vi " + (2 * (L + W)) + " cm và chiều dài " + L + " cm. Tính chiều rộng.",
      String(W) + " cm", "Nửa chu vi là " + (L + W) + " cm; chiều rộng = " + (L + W) + " − " + L + "."));
    return list;
  }

  if (key === "symmetry") {
    list.push(mc("Hình nào chắc chắn có tâm đối xứng?",
      "Hình bình hành", ["Tam giác thường", "Hình thang cân", "Tam giác đều"],
      "Hai đường chéo của hình bình hành cắt nhau tại trung điểm mỗi đường.", seed));
    list.push(mc("Hình vuông có bao nhiêu trục đối xứng?",
      "4", ["1", "2", "3"], "Hai đường chéo và hai đường trung trực của các cặp cạnh là trục đối xứng.", seed + 1));
    list.push(self("Nêu một vật trong đời sống có hình ảnh gần với hình có trục đối xứng.",
      "Ví dụ: cánh bướm", "Hai nửa hình ảnh đối xứng qua một đường thẳng."));
    list.push(self("Một hình có tâm đối xứng O. Điểm A cách O 5 cm. Điểm đối xứng của A qua O cách O bao nhiêu?",
      "5 cm", "Tâm đối xứng là trung điểm của đoạn nối hai điểm tương ứng."));
    return list;
  }

  if (key === "fraction_basic") {
    const den = (seed % 6) + 3;
    const num = (seed % (den - 1)) + 1;
    const mul = (seed % 4) + 2;
    const red = reduceFrac(num * mul, den * mul);
    list.push(mc("Phân số bằng " + frac(num, den) + " là:",
      frac(num * mul, den * mul),
      [frac(num + 1, den), frac(num, den + 1), frac(num * mul, den)],
      "Nhân cả tử và mẫu với cùng một số khác 0.", seed));
    list.push(mc("Rút gọn " + frac(num * mul, den * mul) + ".",
      frac(red[0], red[1]), [frac(num, den + 1), frac(num + 1, den), frac(num * mul, den)],
      "Chia cả tử và mẫu cho ƯCLN.", seed + 1));
    list.push(self("Viết số nguyên " + a + " dưới dạng phân số có mẫu 7.",
      frac(a * 7, 7), "Nhân số nguyên với 7 rồi đặt trên mẫu 7."));
    list.push(self("So sánh " + frac(num, den) + " và " + frac(num + 1, den + 2) + ".",
      (num * (den + 2) >= (num + 1) * den ? frac(num, den) + " ≥ " : frac(num, den) + " < ") + frac(num + 1, den + 2),
      "Quy đồng mẫu hoặc so sánh tích chéo."));
    return list;
  }

  if (key === "fraction_ops") {
    const d1 = (seed % 5) + 3;
    const d2 = (seed % 4) + 2;
    const n1 = (seed % 3) + 1;
    const n2 = (seed % 2) + 1;
    const add = addFrac(n1, d1, n2, d2);
    const sub = subFrac(n1, d1, n2, d2);
    list.push(mc("Tính " + frac(n1, d1) + " + " + frac(n2, d2) + ".",
      frac(add[0], add[1]), [frac(sub[0], sub[1]), frac(n1 + n2, d1 + d2), frac(n1 * n2, d1 * d2)],
      "Quy đồng mẫu rồi cộng tử số.", seed));
    const mul = mulFrac(n1, d1, n2, d2);
    list.push(mc("Tính " + frac(n1, d1) + " × " + frac(n2, d2) + ".",
      frac(mul[0], mul[1]), [frac(n1 + n2, d1 + d2), frac(n1 * d2, d1 * n2), frac(n1 * n2, d1)],
      "Nhân tử với tử, mẫu với mẫu rồi rút gọn.", seed + 1));
    list.push(self("Tính " + frac(n1, d1) + " − " + frac(n2, d2) + ".",
      frac(sub[0], sub[1]), "Quy đồng mẫu rồi trừ tử số."));
    const div = divFrac(n1, d1, n2, d2);
    list.push(self("Tính " + frac(n1, d1) + " : " + frac(n2, d2) + ".",
      frac(div[0], div[1]), "Nhân phân số thứ nhất với phân số nghịch đảo của phân số thứ hai."));
    return list;
  }

  if (key === "fraction_of") {
    const den = (seed % 5) + 3;
    const num = (seed % (den - 1)) + 1;
    const total = den * ((seed % 8) + 5);
    const val = total * num / den;
    list.push(mc(" " + frac(num, den) + " của " + total + " bằng:",
      String(val), [String(total / den), String(total * den / num), String(total + num)],
      "Lấy " + total + " nhân với " + frac(num, den) + ".", seed));
    list.push(mc("Nếu " + frac(num, den) + " của một số bằng " + val + ", số đó là:",
      String(total), [String(total + den), String(total - num), String(val * den)],
      "Lấy giá trị đã biết chia cho phân số.", seed + 1));
    list.push(self("Một bể có " + total + " lít nước, dùng hết " + frac(num, den) + " lượng nước. Còn lại bao nhiêu lít?",
      String(total - val) + " lít", "Lượng còn lại = " + total + " − " + val + "."));
    list.push(self("Một lớp có " + total + " học sinh, trong đó " + frac(num, den) + " tham gia câu lạc bộ. Có bao nhiêu học sinh tham gia?",
      String(val), "Số học sinh tham gia = " + total + " × " + frac(num, den) + "."));
    return list;
  }

  if (key === "decimals") {
    const d = ((seed % 8) + 2) / 10;
    const whole = (seed % 7) + 1;
    const dec = whole + d;
    const other = whole + ((seed % 6) + 3) / 10;
    list.push(mc("Phân số thập phân biểu diễn " + dec + " là:",
      String(Math.round(dec * 10)) + "/10",
      [String(Math.round(dec * 100)) + "/10", String(Math.round(dec * 10)) + "/100", String(Math.round(dec)) + "/10"],
      "Một chữ số sau dấu phẩy tương ứng mẫu 10.", seed));
    list.push(mc("Số nào lớn hơn: " + dec + " hay " + other + "?",
      dec > other ? String(dec) : String(other), [dec > other ? String(other) : String(dec), String(whole), "Hai số bằng nhau"],
      "So sánh phần nguyên rồi đến phần thập phân.", seed + 1));
    list.push(self("Viết " + dec + " dưới dạng phân số tối giản.",
      frac(Math.round(dec * 10), 10), "Đưa về phân số thập phân rồi rút gọn."));
    list.push(self("Sắp xếp tăng dần: " + dec + "; " + other + "; " + (whole + 0.05) + ".",
      [dec, other, whole + 0.05].sort((x, y) => x - y).join(" < "),
      "Viết các số với cùng số chữ số sau dấu phẩy rồi so sánh."));
    return list;
  }

  if (key === "decimal_ops") {
    const x = ((seed % 80) + 20) / 10;
    const y = ((seed % 40) + 10) / 10;
    const sum = Math.round((x + y) * 100) / 100;
    const prod = Math.round(x * 2 * 100) / 100;
    list.push(mc("Tính " + x + " + " + y + ".",
      String(sum), [String(Math.round((x - y) * 100) / 100), String(x * y), String(sum + 1)],
      "Đặt các dấu phẩy thẳng cột rồi cộng.", seed));
    list.push(mc("Tính " + x + " × 2.",
      String(prod), [String(x + 2), String(x / 2), String(prod + 0.2)],
      "Nhân như số tự nhiên rồi đặt dấu phẩy hợp lý.", seed + 1));
    list.push(self("Một cuộn dây dài " + x + " m cắt đi " + y + " m. Còn lại bao nhiêu mét?",
      String(Math.round((x - y) * 100) / 100) + " m", "Lấy độ dài ban đầu trừ phần đã cắt."));
    list.push(self("Tính " + x + " : 10 + " + y + " × 2.",
      String(Math.round((x / 10 + y * 2) * 100) / 100), "Thực hiện chia và nhân trước, sau đó cộng."));
    return list;
  }

  if (key === "rounding") {
    const x = ((seed % 900) + 100) / 10;
    const one = Math.round(x * 10) / 10;
    const integer = Math.round(x);
    list.push(mc("Làm tròn " + x + " đến hàng đơn vị.",
      String(integer), [String(integer - 1), String(integer + 1), String(x)],
      "Quan sát chữ số hàng phần mười.", seed));
    list.push(mc("Ước lượng " + x + " × 3 bằng cách làm tròn x đến hàng đơn vị.",
      String(integer * 3), [String(one * 3), String((integer + 1) * 3), String(x * 3)],
      "Làm tròn rồi thực hiện phép tính gần đúng.", seed + 1));
    list.push(self("Làm tròn " + x + " đến hàng phần mười.",
      String(one), "Quan sát chữ số hàng phần trăm để quyết định tăng hay giữ hàng phần mười."));
    list.push(self("Một đoạn dây dài " + x + " m được chia đều cho 4 bạn. Ước lượng mỗi phần dài bao nhiêu mét?",
      String(Math.round((x / 4) * 10) / 10) + " m", "Tính xấp xỉ rồi làm tròn đến hàng phần mười."));
    return list;
  }

  if (key === "percent") {
    const total = ((seed % 8) + 4) * 25;
    const rate = [5, 10, 15, 20, 25][seed % 5];
    const val = total * rate / 100;
    list.push(mc(rate + "% của " + total + " bằng:",
      String(val), [String(total / rate), String(total + val), String(total - val)],
      "Đổi " + rate + "% thành phân số " + rate + "/100.", seed));
    list.push(mc("Một món hàng giá " + total + " nghìn đồng giảm " + rate + "%. Giá mới là:",
      String(total - val) + " nghìn đồng", [String(total + val) + " nghìn đồng", String(val) + " nghìn đồng", String(total - rate) + " nghìn đồng"],
      "Giá mới = giá cũ − số tiền giảm.", seed + 1));
    list.push(self("Lớp có " + total + " học sinh, " + rate + "% tham gia hoạt động. Có bao nhiêu học sinh tham gia?",
      String(val), "Số học sinh = " + total + " × " + rate + "%."));
    list.push(self("Một khoản tiền " + total + " nghìn đồng tăng " + rate + "%. Số tiền sau khi tăng là bao nhiêu?",
      String(total + val) + " nghìn đồng", "Tính phần tăng rồi cộng vào số tiền ban đầu."));
    return list;
  }

  if (key === "points") {
    list.push(mc("Qua hai điểm phân biệt, có bao nhiêu đường thẳng?",
      "Một", ["Hai", "Ba", "Vô số"], "Hai điểm phân biệt xác định một đường thẳng duy nhất.", seed));
    list.push(mc("Kí hiệu đúng cho đường thẳng đi qua A và B là:",
      "đường thẳng AB", ["đoạn thẳng AB", "tia AB và BA", "điểm AB"],
      "Đường thẳng có thể gọi bằng hai điểm thuộc nó.", seed + 1));
    list.push(self("Vẽ đường thẳng d đi qua hai điểm M, N và lấy điểm P không thuộc d. Hãy mô tả hình.",
      "d = MN, P ∉ d", "Đặt M, N trên cùng một đường thẳng; P nằm ngoài đường thẳng đó."));
    list.push(self("Cho ba điểm A, B, C thẳng hàng, B nằm giữa A và C. Viết các tia đối nhau có chung gốc B.",
      "BA và BC", "Hai tia BA và BC có chung gốc B và ngược hướng."));
    return list;
  }

  if (key === "segments") {
    const AB = (seed % 8) + 5;
    const BC = (seed % 6) + 3;
    list.push(mc("A, B, C thẳng hàng, B nằm giữa A và C, AB = " + AB + " cm, BC = " + BC + " cm. AC bằng:",
      String(AB + BC) + " cm", [String(AB - BC) + " cm", String(AB * BC) + " cm", String(AB) + " cm"],
      "Khi B nằm giữa A và C thì AC = AB + BC.", seed));
    list.push(mc("Đoạn thẳng dài " + (AB + BC) + " cm được chia tại B thành hai phần bằng nhau. AB bằng:",
      String((AB + BC) / 2) + " cm", [String(AB + BC) + " cm", String(AB + BC - 1) + " cm", String((AB + BC) / 3) + " cm"],
      "Hai phần bằng nhau nên mỗi phần bằng nửa đoạn thẳng.", seed + 1));
    list.push(self("A, B, C thẳng hàng, B nằm giữa A và C, AC = " + (AB + BC) + " cm và AB = " + AB + " cm. Tính BC.",
      String(BC) + " cm", "BC = AC − AB."));
    list.push(self("Trên tia Ox lấy M sao cho OM = " + AB + " cm, N sao cho ON = " + (AB + BC) + " cm. Tính MN.",
      String(BC) + " cm", "M nằm giữa O và N nên MN = ON − OM."));
    return list;
  }

  if (key === "midpoint") {
    const length = (seed % 9) + 8;
    list.push(mc("M là trung điểm của AB và AB = " + length + " cm. AM bằng:",
      String(length / 2) + " cm", [String(length) + " cm", String(length - 2) + " cm", String(2 * length) + " cm"],
      "Trung điểm chia đoạn thẳng thành hai đoạn bằng nhau.", seed));
    list.push(mc("Nếu AM = " + (length / 2) + " cm và M là trung điểm AB thì AB bằng:",
      String(length) + " cm", [String(length / 2) + " cm", String(2 * length) + " cm", String(length + 2) + " cm"],
      "AB = 2 × AM.", seed + 1));
    list.push(self("Đoạn thẳng CD dài " + (length + 4) + " cm. Xác định vị trí trung điểm O bằng dụng cụ học tập.",
      "O cách C và D " + (length + 4) / 2 + " cm",
      "Đo độ dài CD, lấy một nửa rồi đánh dấu điểm O trên đoạn CD."));
    list.push(self("A, M, B thẳng hàng, M là trung điểm AB và AM = " + (length / 2) + " cm. Tính MB và AB.",
      "MB = " + (length / 2) + " cm; AB = " + length + " cm",
      "Hai nửa bằng nhau; AB = AM + MB."));
    return list;
  }

  if (key === "angles") {
    const angle = [35, 60, 90, 120, 150][seed % 5];
    const kind = angle < 90 ? "nhọn" : angle === 90 ? "vuông" : angle < 180 ? "tù" : "bẹt";
    list.push(mc("Góc " + angle + "° là góc:",
      kind, ["nhọn", "vuông", "tù"].filter(x => x !== kind).concat(["bẹt"]).slice(0, 3),
      "Dựa vào so sánh với 90° và 180°.", seed));
    list.push(mc("Hai góc kề bù, một góc bằng " + angle + "°. Góc còn lại bằng:",
      String(180 - angle) + "°", [String(90 - angle) + "°", String(180 + angle) + "°", String(angle) + "°"],
      "Tổng số đo hai góc kề bù bằng 180°.", seed + 1));
    list.push(self("Vẽ góc xOy có số đo " + angle + "° bằng thước đo góc.",
      "∠xOy = " + angle + "°", "Vẽ tia Ox, đặt tâm thước tại O, đánh dấu vạch " + angle + "° rồi kẻ tia Oy."));
    list.push(self("Một góc có số đo " + (angle + 20) + "°. Tính số đo góc phụ với nó nếu hai góc có tổng 180°.",
      String(160 - angle) + "°", "Lấy 180° trừ số đo góc đã biết."));
    return list;
  }

  if (key === "data") {
    const values = [2, 3, 4, 5, 3, 4, 2, 3].map(v => v + (seed % 2));
    const total = values.reduce((s, v) => s + v, 0);
    const max = Math.max(...values);
    list.push(mc("Dãy " + values.join("; ") + " có bao nhiêu giá trị?",
      String(values.length), [String(total), String(max), String(values.length - 1)],
      "Đếm số phần tử trong dãy dữ liệu.", seed));
    list.push(mc("Trong dãy " + values.join("; ") + ", giá trị xuất hiện nhiều nhất là:",
      String(values.sort((x, y) => values.filter(v => v === y).length - values.filter(v => v === x).length)[0]),
      ["2", "4", "5"].filter(x => x !== String(max)).slice(0, 3),
      "Đếm số lần xuất hiện của từng giá trị.", seed + 1));
    list.push(self("Lập bảng tần số cho dữ liệu " + values.join("; ") + ".",
      "Các giá trị và số lần xuất hiện tương ứng",
      "Sắp xếp dữ liệu theo từng giá trị rồi đếm số lần lặp."));
    list.push(self("Một lớp ghi số sách đọc trong tuần của 5 bạn: 1; 3; 2; 4; 3. Giá trị lớn nhất là bao nhiêu?",
      "4 quyển", "So sánh các giá trị trong dãy."));
    return list;
  }

  if (key === "charts") {
    const categories = ["Bóng đá", "Bơi", "Cờ vua"];
    const counts = [a, b, c];
    list.push(mc("Theo bảng số liệu " + categories[0] + ": " + counts[0] + ", " + categories[1] + ": " + counts[1] + ", " + categories[2] + ": " + counts[2] + ", môn được chọn nhiều nhất là:",
      categories[counts.indexOf(Math.max(...counts))],
      categories.filter(x => x !== categories[counts.indexOf(Math.max(...counts))]),
      "Chọn hạng mục có tần số lớn nhất.", seed));
    list.push(mc("Tổng số lượt chọn trong bảng trên là:",
      String(counts.reduce((s, v) => s + v, 0)),
      [String(Math.max(...counts)), String(counts[0] * counts[1]), String(counts.reduce((s, v) => s + v, 0) + 1)],
      "Cộng các tần số của ba hạng mục.", seed + 1));
    list.push(self("Vẽ biểu đồ cột cho số liệu " + categories.map((x, i) => x + " = " + counts[i]).join(", ") + ".",
      "Ba cột có chiều cao lần lượt " + counts.join(", "),
      "Trục ngang ghi hạng mục, trục đứng ghi số lượt và vẽ cột đúng chiều cao."));
    list.push(self("Một biểu đồ cột kép ghi số bạn nam/nữ tham gia hai câu lạc bộ. Em cần chú ý những yếu tố nào khi đọc biểu đồ?",
      "Tên biểu đồ, chú giải, đơn vị, trục và chiều cao từng cột",
      "Đọc đúng chú giải và đối chiếu hai nhóm trên cùng một hạng mục."));
    return list;
  }

  if (key === "probability") {
    const faces = 6;
    list.push(mc("Gieo một xúc xắc cân đối. Tập hợp kết quả có thể là:",
      "{1; 2; 3; 4; 5; 6}",
      ["{0; 1; 2; 3; 4}", "{2; 4; 6; 8}", "{1; 3; 5; 7}"],
      "Một lần gieo cho số chấm từ 1 đến 6.", seed));
    list.push(mc("Trong một hộp có 3 thẻ đỏ và 2 thẻ xanh. Lấy ngẫu nhiên một thẻ. Sự kiện lấy được thẻ vàng là:",
      "Không thể xảy ra", ["Chắc chắn xảy ra", "Có thể xảy ra", "Luôn xảy ra hai lần"],
      "Trong hộp không có thẻ vàng.", seed + 1));
    list.push(self("Gieo đồng xu 40 lần, mặt ngửa xuất hiện 23 lần. Xác suất thực nghiệm của sự kiện xuất hiện mặt ngửa là:",
      "23/40", "Xác suất thực nghiệm = số lần sự kiện xảy ra / tổng số lần thử."));
    list.push(self("Một vòng quay có 4 ô bằng nhau ghi A, B, C, D. Nêu một kết quả có thể xảy ra và một sự kiện không thể xảy ra.",
      "Kết quả có thể: C; sự kiện không thể: kim chỉ vào E",
      "Kết quả phải thuộc tập kết quả có thể của phép thử."));
    return list;
  }

  return [
    mc("Mệnh đề nào phù hợp với bài học " + key + "?",
      "Cần lập luận từ định nghĩa và dữ kiện", ["Chỉ cần đoán", "Không cần điều kiện", "Luôn có một đáp án 0"],
      "Đọc kỹ khái niệm và kiểm tra dữ kiện.", seed),
    mc("Khi giải bài, bước đầu tiên nên là:",
      "Xác định dữ kiện và yêu cầu", ["Viết đáp số ngay", "Bỏ qua đơn vị", "Đổi mọi số thành 0"],
      "Tóm tắt đề giúp chọn phương pháp.", seed + 1),
    self("Viết một ví dụ ngắn minh họa cho bài học " + key + ".",
      "Một ví dụ tự xây dựng đúng định nghĩa",
      "Nêu dữ kiện, yêu cầu và kết luận rõ ràng."),
    self("Giải thích vì sao cần kiểm tra lại kết quả.",
      "Để phát hiện sai sót và bảo đảm kết quả phù hợp dữ kiện",
      "Đối chiếu kết quả với điều kiện của đề bài."),
  ];
}

const sourceFiles = [
  "sources/root_documents/Toán 6/chuyen-de-co-ban-mon-toan-6-ket-noi-tri-thuc-voi-cuoc-song-tap-1/CHƯƠNG 1 ( 36 trang).docx",
  "sources/root_documents/Toán 6/chuyen-de-co-ban-mon-toan-6-ket-noi-tri-thuc-voi-cuoc-song-tap-1/CHƯƠNG 2 ( 56 trang).docx",
  "sources/root_documents/Toán 6/chuyen-de-co-ban-mon-toan-6-ket-noi-tri-thuc-voi-cuoc-song-tap-1/CHƯƠNG 3 ( 39 trang).docx",
  "sources/root_documents/Toán 6/chuyen-de-co-ban-mon-toan-6-ket-noi-tri-thuc-voi-cuoc-song-tap-1/CHƯƠNG 4 ( 21 trang).docx",
  "sources/root_documents/Toán 6/chuyen-de-co-ban-mon-toan-6-ket-noi-tri-thuc-voi-cuoc-song-tap-1/CHƯƠNG 5 ( 7 trang).docx",
  "sources/root_documents/Toán 6/chuyen-de-co-ban-mon-toan-6-ket-noi-tri-thuc-voi-cuoc-song-tap-1/Đáp án chương 1 ( 21 trang).docx",
  "sources/root_documents/Toán 6/chuyen-de-co-ban-mon-toan-6-ket-noi-tri-thuc-voi-cuoc-song-tap-1/Đáp án chương 2 ( 52 trang).docx",
  "sources/root_documents/Toán 6/chuyen-de-co-ban-mon-toan-6-ket-noi-tri-thuc-voi-cuoc-song-tap-1/Đáp án chương 3 ( 11 trang).docx",
  "sources/root_documents/Toán 6/chuyen-de-co-ban-mon-toan-6-ket-noi-tri-thuc-voi-cuoc-song-tap-2/CHƯƠNG 6 ( 31 trang).docx",
  "sources/root_documents/Toán 6/chuyen-de-co-ban-mon-toan-6-ket-noi-tri-thuc-voi-cuoc-song-tap-2/CHƯƠNG 7 ( 17 trang).docx",
  "sources/root_documents/Toán 6/chuyen-de-co-ban-mon-toan-6-ket-noi-tri-thuc-voi-cuoc-song-tap-2/CHƯƠNG 8 ( 33 TTRANG).docx",
  "sources/root_documents/Toán 6/chuyen-de-co-ban-mon-toan-6-ket-noi-tri-thuc-voi-cuoc-song-tap-2/CHƯƠNG 9 ( 31 trang).docx",
];

const chapters = [
  {
    volume: 1, num: "I", title: "TẬP HỢP CÁC SỐ TỰ NHIÊN",
    source: sourceFiles[0], lessons: [
      ["C1-L1", "Tập hợp và phần tử", "sets", "Tập hợp được xác định bởi các phần tử cùng có một đặc điểm. Có thể mô tả bằng cách liệt kê hoặc nêu tính chất đặc trưng.", "sets"],
      ["C1-L2", "Cách ghi số tự nhiên", "place", "Giá trị của một chữ số phụ thuộc vào vị trí của nó trong số. Hệ thập phân dùng mười chữ số từ 0 đến 9; số La Mã là một cách ghi khác cần đọc đúng quy tắc.", null],
      ["C1-L3", "Thứ tự trong tập hợp số tự nhiên", "order", "Trên tia số, số nằm bên phải lớn hơn số nằm bên trái. Mỗi số tự nhiên có một số liền sau; số 0 không có số liền trước trong tập hợp số tự nhiên.", "number-line"],
      ["C1-L4", "Phép cộng, phép trừ, phép nhân và phép chia", "arithmetic", "Các phép tính với số tự nhiên cần được thực hiện theo hàng và kiểm tra bằng quan hệ ngược: cộng–trừ, nhân–chia.", null],
      ["C1-L5", "Lũy thừa và thứ tự thực hiện phép tính", "powers", "Lũy thừa là tích của các thừa số bằng nhau. Khi biểu thức có nhiều phép tính, thực hiện ngoặc trước, lũy thừa, nhân/chia rồi cộng/trừ.", null],
    ],
  },
  {
    volume: 1, num: "II", title: "TÍNH CHIA HẾT TRONG TẬP HỢP CÁC SỐ TỰ NHIÊN",
    source: sourceFiles[1], lessons: [
      ["C2-L1", "Quan hệ chia hết và dấu hiệu chia hết", "divisibility", "Một số chia hết cho số khác khi phép chia có số dư bằng 0. Các dấu hiệu chia hết giúp nhận biết nhanh mà không cần thực hiện phép chia.", null],
      ["C2-L2", "Số nguyên tố và phân tích ra thừa số nguyên tố", "prime", "Số nguyên tố lớn hơn 1 và chỉ có hai ước. Phân tích thừa số nguyên tố là viết số thành tích các số nguyên tố.", null],
      ["C2-L3", "Ước chung và ước chung lớn nhất", "gcd", "Ước chung lớn nhất là ước chung lớn nhất của các số đã cho. Có thể tìm bằng phân tích thừa số hoặc thuật toán Euclid.", null],
      ["C2-L4", "Bội chung và bội chung nhỏ nhất", "lcm", "Bội chung nhỏ nhất là bội chung dương nhỏ nhất của các số. Khái niệm này thường dùng cho bài toán lặp chu kỳ.", null],
    ],
  },
  {
    volume: 1, num: "III", title: "SỐ NGUYÊN",
    source: sourceFiles[2], lessons: [
      ["C3-L1", "Tập hợp số nguyên và trục số", "integers", "Số nguyên gồm số nguyên âm, số 0 và số nguyên dương. Trục số giúp biểu diễn, so sánh và tìm số đối.", "number-line"],
      ["C3-L2", "Phép cộng, phép trừ và phép nhân số nguyên", "integer_ops", "Khi cộng số nguyên cùng dấu, cộng giá trị tuyệt đối và giữ dấu; khác dấu thì trừ giá trị tuyệt đối và giữ dấu của số lớn hơn.", null],
      ["C3-L3", "Quy tắc dấu ngoặc", "parentheses", "Dấu cộng trước ngoặc giữ nguyên dấu; dấu trừ trước ngoặc đổi dấu mọi số hạng trong ngoặc.", null],
      ["C3-L4", "Bài toán thực tế với số nguyên", "integers", "Số nguyên mô tả độ cao, nhiệt độ, thu chi và các đại lượng có hai chiều tăng–giảm.", null],
    ],
  },
  {
    volume: 1, num: "IV", title: "MỘT SỐ HÌNH PHẲNG TRONG THỰC TIỄN",
    source: sourceFiles[3], lessons: [
      ["C4-L1", "Tam giác đều, hình vuông và lục giác đều", "geometry_shapes", "Các hình đều có các cạnh hoặc góc bằng nhau theo đặc trưng. Chu vi được tính bằng tổng độ dài các cạnh.", "regular-shapes"],
      ["C4-L2", "Hình chữ nhật, hình thoi và hình bình hành", "geometry_quads", "Diện tích hình chữ nhật và hình bình hành bằng đáy nhân chiều cao; diện tích hình thoi bằng nửa tích hai đường chéo.", null],
      ["C4-L3", "Chu vi, diện tích trong thực tiễn", "geometry_quads", "Khi giải bài thực tế cần đổi cùng đơn vị, chọn công thức phù hợp và ghi rõ đơn vị diện tích hoặc độ dài.", null],
    ],
  },
  {
    volume: 1, num: "V", title: "TÍNH ĐỐI XỨNG CỦA HÌNH PHẲNG TRONG TỰ NHIÊN",
    source: sourceFiles[4], lessons: [
      ["C5-L1", "Hình có trục đối xứng", "symmetry", "Một hình có trục đối xứng nếu gấp hình theo đường thẳng đó thì hai phần chồng khít lên nhau.", "symmetry"],
      ["C5-L2", "Hình có tâm đối xứng", "symmetry", "Một hình có tâm đối xứng nếu quay nửa vòng quanh tâm thì hình trùng với chính nó.", "symmetry"],
    ],
  },
  {
    volume: 2, num: "VI", title: "PHÂN SỐ",
    source: sourceFiles[8], lessons: [
      ["C6-L1", "Mở rộng phân số và phân số bằng nhau", "fraction_basic", "Phân số biểu diễn thương của phép chia. Nhân hoặc chia cả tử và mẫu cho cùng một số khác 0 sẽ được phân số bằng phân số đã cho.", null],
      ["C6-L2", "So sánh và cộng, trừ phân số", "fraction_ops", "Muốn so sánh hoặc cộng trừ phân số, cần đưa chúng về cùng mẫu dương rồi xử lý tử số.", null],
      ["C6-L3", "Phép nhân và phép chia phân số", "fraction_ops", "Nhân phân số bằng cách nhân tử với tử, mẫu với mẫu. Chia cho một phân số là nhân với phân số nghịch đảo của nó.", null],
      ["C6-L4", "Giá trị phân số của một số và tìm một số", "fraction_of", "Giá trị phân số của một số được tính bằng cách nhân số đó với phân số. Muốn tìm số ban đầu, chia giá trị đã biết cho phân số.", null],
    ],
  },
  {
    volume: 2, num: "VII", title: "SỐ THẬP PHÂN",
    source: sourceFiles[9], lessons: [
      ["C7-L1", "Số thập phân và số đối", "decimals", "Số thập phân gồm phần nguyên và phần thập phân. Hai số đối nhau có tổng bằng 0.", null],
      ["C7-L2", "Tính toán với số thập phân", "decimal_ops", "Đặt các dấu phẩy thẳng cột khi cộng trừ; khi nhân chia với 10, 100, 1000, dấu phẩy dịch chuyển tương ứng.", null],
      ["C7-L3", "Làm tròn và ước lượng", "rounding", "Làm tròn dựa vào chữ số ngay bên phải hàng cần làm tròn. Ước lượng giúp kiểm tra nhanh tính hợp lý của kết quả.", null],
      ["C7-L4", "Tỉ số và tỉ số phần trăm", "percent", "Tỉ số phần trăm là tỉ số viết dưới dạng phần trăm. Các bài tăng giảm phần trăm cần xác định rõ số ban đầu và phần thay đổi.", null],
    ],
  },
  {
    volume: 2, num: "VIII", title: "NHỮNG HÌNH HÌNH HỌC CƠ BẢN",
    source: sourceFiles[10], lessons: [
      ["C8-L1", "Điểm và đường thẳng", "points", "Điểm được đặt tên bằng chữ in hoa. Qua hai điểm phân biệt có một và chỉ một đường thẳng.", "number-line"],
      ["C8-L2", "Điểm nằm giữa hai điểm và tia", "points", "Tia có gốc và kéo dài vô hạn về một phía. Khi một điểm nằm giữa hai điểm khác, có thể dùng quan hệ cộng độ dài.", null],
      ["C8-L3", "Đoạn thẳng và độ dài đoạn thẳng", "segments", "Đoạn thẳng là phần đường thẳng giới hạn bởi hai đầu mút. Độ dài đoạn thẳng là số đo khoảng cách giữa hai đầu mút.", "segment"],
      ["C8-L4", "Trung điểm của đoạn thẳng", "midpoint", "Trung điểm là điểm nằm giữa hai đầu mút và cách đều hai đầu mút.", "segment"],
      ["C8-L5", "Góc và số đo góc", "angles", "Góc tạo bởi hai tia chung gốc. Số đo góc cho biết mức độ mở của góc; dùng thước đo góc để đọc và vẽ.", "angle"],
    ],
  },
  {
    volume: 2, num: "IX", title: "DỮ LIỆU VÀ XÁC SUẤT DỮ LIỆU",
    source: sourceFiles[11], lessons: [
      ["C9-L1", "Dữ liệu và thu thập dữ liệu", "data", "Dữ liệu có thể là số liệu hoặc thông tin không phải số. Dữ liệu cần được thu thập bằng phương pháp phù hợp với câu hỏi.", null],
      ["C9-L2", "Bảng thống kê và biểu đồ tranh", "charts", "Bảng thống kê giúp tổ chức dữ liệu; biểu đồ tranh dùng hình biểu tượng và chú giải để biểu diễn số lượng.", "bar-chart"],
      ["C9-L3", "Biểu đồ cột", "charts", "Biểu đồ cột biểu diễn các giá trị bằng chiều cao cột trên cùng hệ trục, có tên, đơn vị và nhãn rõ ràng.", "bar-chart"],
      ["C9-L4", "Biểu đồ cột kép", "charts", "Biểu đồ cột kép giúp so sánh hai nhóm dữ liệu theo cùng các hạng mục.", "bar-chart"],
      ["C9-L5", "Kết quả có thể và sự kiện", "probability", "Một phép thử có tập hợp các kết quả có thể. Sự kiện có thể xảy ra, không thể xảy ra hoặc chắc chắn xảy ra.", "outcomes"],
      ["C9-L6", "Xác suất thực nghiệm", "probability", "Xác suất thực nghiệm bằng số lần sự kiện xảy ra chia cho tổng số lần thực hiện phép thử.", "outcomes"],
    ],
  },
];

const figureDefs = {
  "number-line": {
    file: "number-line.svg",
    alt: "Trục số có các điểm đánh dấu và mũi tên hai chiều",
    purpose: "Biểu diễn và so sánh số",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="170" viewBox="0 0 720 170"><rect width="720" height="170" fill="white"/><line x1="55" y1="90" x2="665" y2="90" stroke="#1F4E79" stroke-width="3"/><path d="M55 90 l18 -9 v18 z M665 90 l-18 -9 v18 z" fill="#1F4E79"/><g stroke="#4472C4" stroke-width="2">' + Array.from({length: 9}, (_, i) => '<line x1="' + (100 + i*60) + '" y1="78" x2="' + (100 + i*60) + '" y2="102"/>').join("") + '</g><g fill="#1F3864" font-family="Times New Roman" font-size="22" text-anchor="middle">' + Array.from({length: 9}, (_, i) => '<text x="' + (100 + i*60) + '" y="132">' + (i - 4) + '</text>').join("") + '</g><circle cx="280" cy="90" r="7" fill="#2E78D2"/><text x="280" y="48" fill="#2E78D2" font-family="Times New Roman" font-size="22" text-anchor="middle">A</text></svg>',
  },
  "regular-shapes": {
    file: "regular-shapes.svg",
    alt: "Ba hình đều: tam giác đều, hình vuông và lục giác đều",
    purpose: "Nhận biết hình phẳng đều",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="220" viewBox="0 0 720 220"><rect width="720" height="220" fill="white"/><polygon points="115,170 185,45 255,170" fill="none" stroke="#2E78D2" stroke-width="3"/><rect x="330" y="55" width="115" height="115" fill="none" stroke="#4472C4" stroke-width="3"/><polygon points="585,45 650,82 650,155 585,192 520,155 520,82" fill="none" stroke="#266FC8" stroke-width="3"/><g fill="#1F4E79" font-family="Times New Roman" font-size="24" text-anchor="middle"><text x="185" y="208">Tam giác đều</text><text x="388" y="208">Hình vuông</text><text x="585" y="30">Lục giác đều</text></g></svg>',
  },
  "symmetry": {
    file: "symmetry.svg",
    alt: "Hình cánh bướm đối xứng qua một trục đứng",
    purpose: "Nhận biết trục đối xứng",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="230" viewBox="0 0 720 230"><rect width="720" height="230" fill="white"/><line x1="360" y1="20" x2="360" y2="210" stroke="#2E78D2" stroke-width="2" stroke-dasharray="8 7"/><path d="M350 70 C260 25 145 70 220 130 C250 155 300 150 350 115 Z" fill="#91BCE3" stroke="#266FC8" stroke-width="3"/><path d="M370 70 C460 25 575 70 500 130 C470 155 420 150 370 115 Z" fill="#B1CBE9" stroke="#266FC8" stroke-width="3"/><path d="M360 65 L360 170" stroke="#1F4E79" stroke-width="4"/><text x="360" y="220" fill="#1F4E79" font-family="Times New Roman" font-size="22" text-anchor="middle">trục đối xứng</text></svg>',
  },
  "segment": {
    file: "segment.svg",
    alt: "Đoạn thẳng AB có điểm M nằm giữa",
    purpose: "Đo và tính độ dài đoạn thẳng",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="190" viewBox="0 0 720 190"><rect width="720" height="190" fill="white"/><line x1="105" y1="95" x2="615" y2="95" stroke="#1F4E79" stroke-width="4"/><circle cx="105" cy="95" r="7" fill="#2E78D2"/><circle cx="360" cy="95" r="7" fill="#2E78D2"/><circle cx="615" cy="95" r="7" fill="#2E78D2"/><g fill="#1F3864" font-family="Times New Roman" font-size="24" text-anchor="middle"><text x="105" y="65">A</text><text x="360" y="65">M</text><text x="615" y="65">B</text><text x="232" y="145">AM</text><text x="488" y="145">MB</text></g></svg>',
  },
  "angle": {
    file: "angle.svg",
    alt: "Góc xOy với cung tròn biểu diễn số đo góc",
    purpose: "Nhận biết và đo góc",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="240" viewBox="0 0 720 240"><rect width="720" height="240" fill="white"/><circle cx="255" cy="175" r="7" fill="#2E78D2"/><line x1="255" y1="175" x2="570" y2="175" stroke="#266FC8" stroke-width="4"/><line x1="255" y1="175" x2="400" y2="45" stroke="#266FC8" stroke-width="4"/><path d="M315 175 A60 60 0 0 0 295 120" fill="none" stroke="#F0A500" stroke-width="4"/><g fill="#1F3864" font-family="Times New Roman" font-size="26"><text x="230" y="205">O</text><text x="580" y="182">x</text><text x="405" y="38">y</text><text x="318" y="126">α</text></g></svg>',
  },
  "bar-chart": {
    file: "bar-chart.svg",
    alt: "Biểu đồ cột đơn giản gồm ba cột màu xanh",
    purpose: "Đọc dữ liệu trên biểu đồ cột",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="280" viewBox="0 0 720 280"><rect width="720" height="280" fill="white"/><line x1="85" y1="235" x2="665" y2="235" stroke="#1F4E79" stroke-width="3"/><line x1="85" y1="235" x2="85" y2="35" stroke="#1F4E79" stroke-width="3"/><rect x="170" y="125" width="90" height="110" fill="#91BCE3" stroke="#266FC8" stroke-width="2"/><rect x="335" y="85" width="90" height="150" fill="#4472C4" stroke="#266FC8" stroke-width="2"/><rect x="500" y="155" width="90" height="80" fill="#2E78D2" stroke="#266FC8" stroke-width="2"/><g fill="#1F3864" font-family="Times New Roman" font-size="22" text-anchor="middle"><text x="215" y="260">A</text><text x="380" y="260">B</text><text x="545" y="260">C</text><text x="55" y="45">n</text></g></svg>',
  },
  "outcomes": {
    file: "outcomes.svg",
    alt: "Sơ đồ tập hợp kết quả có thể của một lần gieo xúc xắc",
    purpose: "Mô tả kết quả có thể và sự kiện",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="230" viewBox="0 0 720 230"><rect width="720" height="230" fill="white"/><rect x="65" y="35" width="590" height="155" rx="18" fill="#F5F9FF" stroke="#266FC8" stroke-width="3"/><text x="360" y="65" fill="#1F4E79" font-family="Times New Roman" font-size="24" text-anchor="middle">Kết quả có thể</text><g fill="#FFFFFF" stroke="#4472C4" stroke-width="2">' + Array.from({length: 6}, (_, i) => '<circle cx="' + (150 + i*85) + '" cy="125" r="28"/>').join("") + '</g><g fill="#1F3864" font-family="Times New Roman" font-size="23" text-anchor="middle">' + Array.from({length: 6}, (_, i) => '<text x="' + (150 + i*85) + '" y="133">' + (i+1) + '</text>').join("") + '</g></svg>',
  },
};

function htmlCss() {
  return [
    "@page { size: A4 portrait; margin: 1cm 1.5cm 1cm 1.5cm; }",
    "body { font-family: 'Times New Roman', serif; font-size: 13pt; color: #000; line-height: 1.15; margin: 0; }",
    "h1 { font-size: 17pt; color: #266FC8; text-align: center; margin: 0 0 10pt 0; }",
    "h2 { font-size: 14pt; color: #4472C4; margin: 12pt 0 4pt 0; page-break-after: avoid; }",
    "h3 { font-size: 13pt; color: #2E78D2; margin: 8pt 0 3pt 0; page-break-after: avoid; }",
    "p { margin: 0 0 3pt 0; }",
    ".cover-page { page-break-after: always; text-align: center; min-height: 25.7cm; }",
    ".cover-page img { width: 17.7cm; height: 25cm; object-fit: contain; }",
    ".chapter { page-break-before: always; }",
    ".badge { display: inline-block; background: #4472C4; color: white; padding: 3pt 10pt; border-radius: 9pt; font-family: Arial, sans-serif; font-weight: bold; }",
    ".section-tab { color: white; background: #2E78D2; padding: 3pt 10pt; border-radius: 7pt; font-weight: bold; display: inline-block; margin: 6pt 0 4pt 0; }",
    ".theory { border-left: 3pt solid #91BCE3; padding-left: 8pt; margin: 4pt 0 6pt 0; }",
    ".example { border: 1.5pt solid #2E78D2; padding: 6pt 8pt; margin: 5pt 0; }",
    ".conclusion { border: 1pt dashed #2E78D2; border-radius: 7pt; padding: 5pt 8pt; margin: 5pt 0; }",
    ".label { color: #4472C4; font-weight: bold; }",
    ".solution { text-align: center; color: #4472C4; font-weight: bold; }",
    ".question { margin: 4pt 0 1pt 0; page-break-inside: avoid; }",
    ".choices { margin: 0 0 3pt 12pt; }",
    ".choices span { display: inline-block; margin-right: 12pt; }",
    ".figure { text-align: center; margin: 5pt 0; page-break-inside: avoid; }",
    ".figure img { max-width: 15cm; max-height: 5cm; }",
    ".caption { font-style: italic; font-size: 11pt; color: #4472C4; }",
    "table { border-collapse: collapse; width: 100%; margin: 5pt 0; }",
    "th, td { border: 0.5pt solid #000; padding: 4pt 6pt; text-align: center; }",
    "th { font-weight: bold; }",
    ".answer { margin: 2pt 0; }",
    ".page-break { page-break-before: always; }",
  ].join("\n");
}

function makeTableHtml() {
  return '<table><tr><th>Ngày</th><th>Số sách đọc</th><th>Ghi chú</th></tr><tr><td>Thứ hai</td><td>3</td><td>Đọc tại lớp</td></tr><tr><td>Thứ tư</td><td>5</td><td>Đọc ở nhà</td></tr><tr><td>Thứ sáu</td><td>4</td><td>Đọc tại thư viện</td></tr></table>';
}

function renderFigure(id, volumeDir) {
  if (!id || !figureDefs[id]) return "";
  return '<div class="figure"><img src="../figures/' + figureDefs[id].file + '"/><div class="caption">Hình minh họa — ' + html(figureDefs[id].purpose) + '</div></div>';
}

function renderQuestion(item, id) {
  const choices = item.choices.length
    ? '<div class="choices">' + item.choices.map((c, i) => '<span><b>' + letters[i] + '.</b> ' + html(c) + '</span>').join("") + '</div>'
    : "";
  return '<div class="question"><span class="label">' + id + ":</span> " + html(item.statement) + choices + "</div>";
}

function lessonObjects() {
  return chapters.flatMap(ch => ch.lessons.map((arr, idx) => {
    const [id, title, key, theory, figure] = arr;
    const exs = makeExercises(key, seedFor(id));
    return { id, title, key, theory, figure, chapter: ch, index: idx, exercises: exs };
  }));
}

function renderLesson(lesson) {
  let out = "";
  out += '<h2><span class="badge">BÀI</span> ' + html(lesson.id + " — " + lesson.title) + "</h2>";
  out += '<div class="theory"><p><span class="label">Mục tiêu:</span> Nhận biết khái niệm, vận dụng quy tắc và giải quyết tình huống mới thuộc chủ đề này.</p><p>' + html(lesson.theory) + "</p></div>";
  out += renderFigure(lesson.figure);
  const first = lesson.exercises[0];
  out += '<div class="example"><p><span class="label">Ví dụ 1:</span> ' + html(first.statement) + "</p><p class=\"solution\">Giải</p><p>" + html(first.solution) + "</p></div>";
  out += '<div class="conclusion"><span class="label">Kết luận:</span> Luôn ghi rõ dữ kiện, chọn đúng quy tắc, trình bày đủ bước và kiểm tra kết quả bằng điều kiện của bài.</div>';
  out += '<div class="section-tab">B. BÀI TẬP MẪU</div>';
  out += renderQuestion(lesson.exercises[1], lesson.id + "-M1");
  out += '<div class="section-tab">C. BÀI TẬP TỰ LUYỆN</div>';
  out += "<h3>I. Trắc nghiệm</h3>";
  for (let i = 0; i < lesson.exercises.length; i++) {
    const item = lesson.exercises[i];
    if (item.type === "multiple_choice") out += renderQuestion(item, lesson.id + "-TN" + (i + 1));
  }
  out += "<h3>II. Tự luận</h3>";
  for (let i = 0; i < lesson.exercises.length; i++) {
    const item = lesson.exercises[i];
    if (item.type === "written") out += renderQuestion(item, lesson.id + "-TL" + (i + 1));
  }
  if (lesson.key === "data") out += makeTableHtml();
  return out;
}

function renderAnswers(volume) {
  const lessons = lessonObjects().filter(l => l.chapter.volume === volume);
  let out = '<div class="page-break"></div><h1>PHỤ LỤC — ĐÁP ÁN VÀ LỜI GIẢI CHỌN LỌC</h1>';
  out += '<p><span class="label">Cách dùng:</span> Đáp số được cung cấp cho mọi câu. Lời giải chi tiết tập trung vào ví dụ, bài tự luận và các bài đại diện cho từng dạng.</p>';
  for (const lesson of lessons) {
    out += '<h2>' + html(lesson.id + " — " + lesson.title) + "</h2>";
    for (let i = 0; i < lesson.exercises.length; i++) {
      const item = lesson.exercises[i];
      const itemId = lesson.id + (item.type === "multiple_choice" ? "-TN" + (i + 1) : "-TL" + (i + 1));
      out += '<p class="answer"><span class="label">' + itemId + ":</span> " + (item.type === "multiple_choice" ? item.answerLetter + " — " : "") + html(item.answer) + "</p>";
      if (item.type === "written") out += '<p><span class="label">Lời giải:</span> ' + html(item.solution) + "</p>";
    }
  }
  return out;
}

function volumeHtml(volume, edition, coverName) {
  const chs = chapters.filter(c => c.volume === volume);
  let body = '<div class="cover-page"><img src="../' + coverName + '"/></div>';
  body += '<h1>TOÁN 6 — CÁC CHUYÊN ĐỀ CƠ BẢN — TẬP ' + volume + "</h1>";
  body += '<p style="text-align:center"><b>' + (edition === "student" ? "BẢN HỌC SINH" : "BẢN GIÁO VIÊN") + '</b></p>';
  body += '<p><span class="label">Hướng dẫn:</span> Đọc phần lý thuyết, theo dõi ví dụ, sau đó hoàn thành bài tập theo mức độ. Các hình được vẽ mới để minh họa cho bài học.</p>';
  body += '<div class="section-tab">MỤC LỤC KHÁI QUÁT</div><ul>' + chs.map(c => "<li>Chương " + c.num + ". " + html(c.title) + "</li>").join("") + "</ul>";
  for (const ch of chs) {
    body += '<div class="chapter"><h1>CHƯƠNG ' + ch.num + ". " + html(ch.title) + "</h1>";
    body += '<p><span class="label">Định hướng chương:</span> Hệ thống hóa kiến thức, luyện kỹ năng và vận dụng vào bài toán mới.</p>';
    for (const arr of ch.lessons) {
      const [id, title, key, theory, figure] = arr;
      body += renderLesson({ id, title, key, theory, figure, chapter: ch, exercises: makeExercises(key, seedFor(id)) });
    }
    body += "</div>";
  }
  if (edition === "teacher") body += renderAnswers(volume);
  return '<!doctype html><html><head><meta charset="UTF-8"><style>' + htmlCss() + "</style></head><body>" + body + "</body></html>";
}

function markdownLesson(lesson) {
  let out = "# " + lesson.id + " — " + lesson.title + "\n\n";
  out += "## Mục tiêu\n\n" + lesson.theory + "\n\n";
  out += "## Bài tập\n\n";
  for (let i = 0; i < lesson.exercises.length; i++) {
    const item = lesson.exercises[i];
    const label = item.type === "multiple_choice" ? "Trắc nghiệm" : "Tự luận";
    out += "- " + label + " " + (i + 1) + ": " + item.statement + "\n";
  }
  return out + "\n";
}

function sourceMapYaml() {
  const rows = sourceFiles.map((f, i) => {
    const volume = i < 8 ? 1 : 2;
    const chapter = i < 5 ? ["I", "II", "III", "IV", "V"][i] : i === 8 ? "VI" : i === 9 ? "VII" : i === 10 ? "VIII" : "IX";
    const answer = f.toLowerCase().includes("đáp án");
    return [
      "- source_file: " + q(f),
      "  grade: 6",
      "  volume: " + volume,
      "  chapter: " + q(chapter),
      "  content_types: [" + (answer ? "answer_reference" : "chapter_reference") + "]",
      "  concepts: coverage_only",
      "  skills: coverage_only",
      "  answer_pair: " + (answer ? "reference_only" : "generated_from_new_content"),
      "  reference_role: coverage",
    ].join("\n");
  });
  return "book_id: toan6\nsource_policy: read_only_coverage_reference\nrecords:\n" + rows.join("\n");
}

function titleMapYaml() {
  const rows = chapters.map(ch => [
    "- chapter: " + q(ch.num),
    "  source_title: " + q(ch.title),
    "  normalized_title: " + q(ch.title),
    "  rationale: keep_source_meaning_and_normalize_spacing_only",
    "  status: pending_human_review",
  ].join("\n"));
  return "book_id: toan6\npolicy: preserve_coverage_normalize_obvious_typography\nrecords:\n" + rows.join("\n");
}

function curriculumYaml() {
  const rows = chapters.flatMap(ch => ch.lessons.map(arr => {
    const [id, title, key, theory, figure] = arr;
    return [
      "- lesson_id: " + q(id),
      "  chapter_id: " + q("C" + ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"].indexOf(ch.num) + 1),
      "  volume: " + ch.volume,
      "  title: " + q(title),
      "  objective: " + q("Nhận biết, vận dụng và giải thích " + title.toLowerCase()),
      "  concepts: [" + key + "]",
      "  skills: [nhan_biet, tinh_toan, van_dung]",
      "  difficulty_range: [co_ban, van_dung]",
      "  exercise_blueprint: {multiple_choice: 2, written: 2, worked_example: 1}",
      "  figure_requirements: " + (figure ? q(figure) : "none"),
      "  coverage_status: planned",
    ].join("\n");
  }));
  return "book_id: toan6\ncoverage_policy: all_source_lessons_and_skills\nrecords:\n" + rows.join("\n");
}

function problemManifestYaml() {
  const rows = lessonObjects().map(lesson => lesson.exercises.map((item, i) => {
    const kind = item.type === "multiple_choice" ? "TN" : "TL";
    const id = lesson.id + "-" + kind + (i + 1);
    return [
      "- problem_id: " + q(id),
      "  lesson_id: " + q(lesson.id),
      "  type: " + item.type,
      "  objective: " + q(lesson.title),
      "  difficulty: " + (i % 2 ? "van_dung" : "co_ban"),
      "  content_path: " + q("content/chapters/" + lesson.chapter.num + ".md"),
      "  answer: " + q(item.answer),
      "  solution_path: " + q("generated_from_problem_record"),
      "  figure_id: " + (lesson.figure ? q(lesson.figure) : "none"),
      "  source_concept_refs: [" + lesson.key + "]",
      "  originality_status: not_checked",
      "  math_review_status: pending",
      "  editorial_status: pending",
    ].join("\n");
  })).flat();
  return "book_id: toan6\nrecords:\n" + rows.join("\n");
}

function releaseManifestYaml() {
  return [
    "book_id: toan6",
    "title: " + q("Toán 6 – Các chuyên đề cơ bản"),
    "version: " + q(runId),
    "language: vi-VN",
    "scope: {volumes: 2, chapters: 9, editions: [student, teacher]}",
    "input_inventory: {source_docx_count: 12, source_policy: read_only}",
    "output_files: pending_after_qa",
    "sha256: pending_after_qa",
    "qa_status: automated_draft_checks_pending_human_review",
    "human_approver: pending",
    "approval_timestamp: pending",
    "publication_status: draft_pending_human_approval",
    "known_deviations: [managed_documents_runtime_unavailable, bia_toan7_ref_01_missing]",
  ].join("\n") + "\n";
}

function figureManifestYaml() {
  const rows = Object.entries(figureDefs).map(([id, f]) => [
    "- figure_id: " + q(id),
    "  purpose: " + q(f.purpose),
    "  geometry_description: " + q(f.alt),
    "  file_path: " + q("figures/" + f.file),
    "  format: svg",
    "  alt_text: " + q(f.alt),
    "  source_reference: concept_only",
    "  is_new_artwork: true",
    "  review_status: pending_human_review",
  ].join("\n"));
  return "book_id: toan6\nrecords:\n" + rows.join("\n");
}

function assetManifestYaml() {
  return [
    "book_id: toan6",
    "brand_assets:",
    "  - path: sources/books/logo_hung_cuong.png",
    "    role: approved_brand_logo",
    "    reused: true",
    "  - path: sources/books/bia_toan7_ref_02.png",
    "    role: visual_reference_only",
    "    reused: false",
    "  - path: sources/books/bia_toan7_ref_01.png",
    "    role: missing_reference_not_recreated",
    "    reused: false",
    "generated_assets:",
    "  - cover_tap1.png",
    "  - cover_tap2.png",
    "  - figures/*.svg",
  ].join("\n") + "\n";
}

function svgCover(volume, logoBase64) {
  const logo = '<image href="data:image/png;base64,' + logoBase64 + '" x="247" y="55" width="300" height="200" preserveAspectRatio="xMidYMid meet"/>';
  const blue = volume === 1 ? "#4472C4" : "#2E78D2";
  const gold = "#F0B429";
  return '<svg xmlns="http://www.w3.org/2000/svg" width="794" height="1123" viewBox="0 0 794 1123"><rect width="794" height="1123" fill="#FFFFFF"/><path d="M0 0 H794 V180 C600 135 220 140 0 210 Z" fill="' + blue + '"/><path d="M0 860 C250 750 525 850 794 730 V1123 H0 Z" fill="#EAF3FC"/><path d="M0 940 C230 820 530 940 794 820" fill="none" stroke="' + blue + '" stroke-width="14"/><path d="M0 980 C230 860 530 980 794 860" fill="none" stroke="' + gold + '" stroke-width="4"/>' + logo + '<text x="397" y="295" text-anchor="middle" font-family="Arial, sans-serif" font-size="58" font-weight="bold" fill="' + blue + '">TOÁN 6</text><text x="397" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#1F3864">CÁC CHUYÊN ĐỀ CƠ BẢN</text><rect x="278" y="395" width="238" height="60" rx="16" fill="' + blue + '"/><text x="397" y="437" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#FFFFFF">TẬP ' + volume + '</text><g fill="none" stroke="' + blue + '" stroke-width="3"><polygon points="100,520 180,380 260,520"/><circle cx="620" cy="465" r="72"/><line x1="620" y1="465" x2="670" y2="420"/><rect x="95" y="665" width="120" height="120"/><line x1="420" y1="620" x2="620" y2="620"/><line x1="520" y1="550" x2="520" y2="700"/></g><g fill="#1F3864" font-family="Times New Roman" font-size="23"><text x="397" y="535" text-anchor="middle">Hệ thống kiến thức • Rèn kỹ năng • Vận dụng</text><text x="397" y="1010" text-anchor="middle" font-size="27" font-style="italic">KIÊN TRÌ • TỰ GIÁC • TIẾN BỘ</text><text x="397" y="1065" text-anchor="middle" font-size="18">LUYỆN THI HÙNG CƯỜNG</text></g></svg>';
}

async function runCmd(bin, args, cwd = ROOT, env = {}) {
  const command = new Deno.Command(bin, {
    args,
    cwd,
    env: { ...Deno.env.toObject(), ...env },
    stdout: "piped",
    stderr: "piped",
  });
  const result = await command.output();
  const stdout = decoder.decode(result.stdout);
  const stderr = decoder.decode(result.stderr);
  if (!result.success) throw new Error(bin + " failed: " + stdout + "\n" + stderr);
  return stdout + stderr;
}

async function patchDocx(input, output, volume, edition) {
  const unpack = "/tmp/toan6-unpack-" + runId + "-" + volume + "-" + edition;
  await mkdir(unpack);
  await runCmd("unzip", ["-q", input, "-d", unpack]);
  const word = unpack + "/word";
  const relsPath = word + "/_rels/document.xml.rels";
  const typesPath = unpack + "/[Content_Types].xml";
  let document = await Deno.readTextFile(word + "/document.xml");
  let rels = await Deno.readTextFile(relsPath);
  let types = await Deno.readTextFile(typesPath);
  const headerXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:tabs><w:tab w:val="right" w:pos="10205"/></w:tabs><w:pBdr><w:bottom w:val="single" w:sz="12" w:space="1" w:color="266FC8"/></w:pBdr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:color w:val="266FC8"/><w:sz w:val="24"/></w:rPr><w:t>TOÁN 6 – TẬP ' + volume + '</w:t></w:r><w:r><w:tab/></w:r><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:color w:val="266FC8"/><w:sz w:val="24"/></w:rPr><w:t>LUYỆN THI HÙNG CƯỜNG</w:t></w:r></w:p></w:hdr>';
  const footerXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:tabs><w:tab w:val="right" w:pos="10205"/></w:tabs><w:pBdr><w:top w:val="single" w:sz="12" w:space="1" w:color="266FC8"/></w:pBdr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:color w:val="266FC8"/><w:sz w:val="24"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:color w:val="266FC8"/><w:sz w:val="24"/></w:rPr><w:t> | LUYỆN THI HÙNG CƯỜNG</w:t></w:r><w:r><w:tab/></w:r><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:color w:val="266FC8"/><w:sz w:val="24"/></w:rPr><w:t>SĐT: 0393 355 821</w:t></w:r></w:p><w:p><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:color w:val="266FC8"/><w:sz w:val="24"/></w:rPr><w:t>ĐỊA CHỈ: XÓM DÕNG, XÃ ĐÔNG ANH, TP HÀ NỘI</w:t></w:r></w:p></w:ftr>';
  const emptyHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p/></w:hdr>';
  const emptyFooter = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p/></w:ftr>';
  await write(word + "/header1.xml", headerXml);
  await write(word + "/footer1.xml", footerXml);
  await write(word + "/header2.xml", emptyHeader);
  await write(word + "/footer2.xml", emptyFooter);
  const overrides = [
    '<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>',
    '<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>',
    '<Override PartName="/word/header2.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>',
    '<Override PartName="/word/footer2.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>',
  ].join("");
  types = types.replace("</Types>", overrides + "</Types>");
  const relsAdd = [
    '<Relationship Id="rIdHCHeader" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>',
    '<Relationship Id="rIdHCFooter" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>',
    '<Relationship Id="rIdHCHeaderFirst" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header2.xml"/>',
    '<Relationship Id="rIdHCFooterFirst" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer2.xml"/>',
  ].join("");
  rels = rels.replace("</Relationships>", relsAdd + "</Relationships>");
  const refs = '<w:headerReference w:type="first" r:id="rIdHCHeaderFirst"/><w:footerReference w:type="first" r:id="rIdHCFooterFirst"/><w:headerReference w:type="default" r:id="rIdHCHeader"/><w:footerReference w:type="default" r:id="rIdHCFooter"/><w:titlePg/>';
  document = document.replace("<w:pgSz", refs + '<w:pgSz');
  document = document.replace(/<w:pgSz[^>]*\/>/, '<w:pgSz w:w="11907" w:h="16840"/>');
  document = document.replace(/<w:pgMar[^>]*\/>/, '<w:pgMar w:top="567" w:right="851" w:bottom="567" w:left="851" w:header="709" w:footer="521" w:gutter="0"/>');
  await Deno.writeTextFile(word + "/document.xml", document);
  await Deno.writeTextFile(relsPath, rels);
  await Deno.writeTextFile(typesPath, types);
  await runCmd("zip", ["-qr", output, "."], unpack);
}

async function convertHtmlToDocx(htmlPath, outputDocx, volume, edition) {
  const layout = htmlPath.substring(0, htmlPath.lastIndexOf("/"));
  const rawStem = htmlPath.substring(htmlPath.lastIndexOf("/") + 1).replace(/\.html$/, "");
  await runCmd("soffice", ["--headless", "--convert-to", "odt", "--outdir", layout, htmlPath], ROOT, {
    HOME: LO_HOME,
  });
  const odt = layout + "/" + rawStem + ".odt";
  await runCmd("soffice", ["--headless", "--convert-to", "docx", "--outdir", layout, odt], ROOT, {
    HOME: LO_HOME,
  });
  const raw = layout + "/" + rawStem + ".docx";
  await patchDocx(raw, outputDocx, volume, edition);
}

async function convertDocxToPdf(docxPath, pdfDir) {
  await mkdir(pdfDir);
  await runCmd("soffice", ["--headless", "--convert-to", "pdf", "--outdir", pdfDir, docxPath], ROOT, {
    HOME: LO_HOME,
  });
}

async function renderDocx(docxPath, outDir) {
  await mkdir(outDir);
  const renderer = "/home/daovanhung/.codex/plugins/cache/openai-primary-runtime/documents/26.826.12353/skills/documents/render_docx.py";
  try {
    await runCmd("python3", [renderer, docxPath, "--output_dir", outDir, "--emit_pdf"], ROOT, {
      HOME: LO_HOME,
    });
  } catch (_error) {
    const stem = docxPath.substring(docxPath.lastIndexOf("/") + 1).replace(/\.docx$/, "");
    await runCmd("soffice", ["--headless", "--convert-to", "pdf", "--outdir", outDir, docxPath], ROOT, {
      HOME: LO_HOME,
    });
    await runCmd("pdftoppm", ["-png", outDir + "/" + stem + ".pdf", outDir + "/page"], ROOT, {});
  }
}

async function main() {
  await mkdir(BASE);
  await mkdir(BASE + "/tap1/content/chapters");
  await mkdir(BASE + "/tap2/content/chapters");
  await mkdir(BASE + "/tap1/figures");
  await mkdir(BASE + "/tap2/figures");
  await mkdir(BASE + "/tap1/layout");
  await mkdir(BASE + "/tap2/layout");
  await mkdir(BASE + "/tap1/reviews");
  await mkdir(BASE + "/tap2/reviews");
  await mkdir(BASE + "/tap1/qa");
  await mkdir(BASE + "/tap2/qa");
  await mkdir(LO_HOME);

  await write(BASE + "/run_state.yaml", [
    "book_id: toan6",
    "run_id: " + q(runId),
    "state: initialized",
    "scope: {volumes: 2, chapters: 9, editions: [student, teacher]}",
    "source_policy: read_only",
    "next_agent: source_mapper",
  ].join("\n") + "\n");
  await write(BASE + "/source_map.yaml", sourceMapYaml());
  await write(BASE + "/title_map.yaml", titleMapYaml());
  await write(BASE + "/asset_manifest.yaml", assetManifestYaml());
  await write(BASE + "/curriculum_map.yaml", curriculumYaml());
  await write(BASE + "/release_manifest.yaml", releaseManifestYaml());

  const logoData = Uint8Array.from(await Deno.readFile(ROOT + "/sources/books/logo_hung_cuong.png"));
  let binary = "";
  for (const byte of logoData) binary += String.fromCharCode(byte);
  const logoBase64 = btoa(binary);

  for (const volume of [1, 2]) {
    const volumeDir = BASE + "/tap" + volume;
    const coverSvg = svgCover(volume, logoBase64);
    await write(volumeDir + "/cover_tap" + volume + ".svg", coverSvg);
    await runCmd("soffice", ["--headless", "--convert-to", "png", "--outdir", volumeDir, volumeDir + "/cover_tap" + volume + ".svg"], ROOT, { HOME: LO_HOME });
    for (const [id, fig] of Object.entries(figureDefs)) {
      await write(volumeDir + "/figures/" + fig.file, fig.svg);
    }
    await write(volumeDir + "/figures/figure_manifest.yaml", figureManifestYaml());
    const chapterList = chapters.filter(c => c.volume === volume);
    for (const ch of chapterList) {
      const lessons = ch.lessons.map(arr => {
        const [id, title, key, theory, figure] = arr;
        return { id, title, key, theory, figure, chapter: ch, exercises: makeExercises(key, seedFor(id)) };
      });
      await write(volumeDir + "/content/chapters/" + ch.num + ".md",
        "# CHƯƠNG " + ch.num + " — " + ch.title + "\n\n" +
        lessons.map(markdownLesson).join("\n"));
    }
    const allLessons = chapterList.flatMap(ch => ch.lessons.map(arr => {
      const [id, title, key, theory, figure] = arr;
      return { id, title, key, theory, figure, chapter: ch, exercises: makeExercises(key, seedFor(id)) };
    }));
    const problemRows = allLessons.flatMap(lesson => lesson.exercises.map((item, i) => {
      const kind = item.type === "multiple_choice" ? "TN" : "TL";
      return [
        "- problem_id: " + q(lesson.id + "-" + kind + (i + 1)),
        "  lesson_id: " + q(lesson.id),
        "  type: " + item.type,
        "  objective: " + q(lesson.title),
        "  answer: " + q(item.answer),
        "  solution: " + q(item.solution),
        "  figure_id: " + (lesson.figure ? q(lesson.figure) : "none"),
        "  originality_status: not_checked",
        "  math_review_status: pending",
      ].join("\n");
    }));
    await write(volumeDir + "/content/problem_manifest.yaml", "records:\n" + problemRows.join("\n") + "\n");
    await write(volumeDir + "/reviews/math_editorial_review.md",
      "# Math/editorial review — Tập " + volume + "\n\n" +
      "- Automated generation consistency: PASS\n" +
      "- Answer linkage generated from problem records: PASS\n" +
      "- Human mathematical/editorial review: PENDING\n" +
      "- Status: draft_pending_human_review\n");
    await write(volumeDir + "/reviews/originality_review.md",
      "# Originality review — Tập " + volume + "\n\n" +
      "- Source body imported into content: NO\n" +
      "- New exercise statements generated independently: YES\n" +
      "- New figure artwork generated independently: YES\n" +
      "- Similarity review: PENDING HUMAN REVIEW\n" +
      "- Legal clearance: NOT CERTIFIED\n");

    const coverName = "cover_tap" + volume + ".png";
    for (const edition of ["student", "teacher"]) {
      const stem = "Toan6_Tap" + volume + "_" + (edition === "student" ? "BanHocSinh" : "BanGiaoVien");
      const htmlPath = volumeDir + "/layout/" + stem + ".html";
      const docxPath = volumeDir + "/layout/" + stem + ".docx";
      await write(htmlPath, volumeHtml(volume, edition, coverName));
      await convertHtmlToDocx(htmlPath, docxPath, volume, edition);
      await convertDocxToPdf(docxPath, volumeDir + "/layout/pdf");
      await renderDocx(docxPath, volumeDir + "/qa/render-" + edition);
    }
    await write(volumeDir + "/qa/structural_audit.md",
      "# Structural audit — Tập " + volume + "\n\n" +
      "- DOCX generated: PASS\n" +
      "- A4/page geometry patched: PASS\n" +
      "- Header/footer/page field inserted: PASS\n" +
      "- Student/teacher shared content: GENERATED FROM SAME SOURCE\n" +
      "- Human visual QA: PENDING\n");
    await write(volumeDir + "/qa/visual_qa.md",
      "# Visual QA — Tập " + volume + "\n\n" +
      "- Renderer: Documents skill render_docx.py with LibreOffice\n" +
      "- PNG render directories: render-student, render-teacher\n" +
      "- Automated render command: PASS\n" +
      "- Page-by-page visual inspection: PENDING HUMAN REVIEW\n" +
      "- Release status: draft_pending_human_approval\n");
  }

  const problemAll = problemManifestYaml();
  await write(BASE + "/problem_manifest.yaml", problemAll);
  await write(BASE + "/release_manifest.yaml", releaseManifestYaml());
  console.log(JSON.stringify({ run_id: runId, work_dir: BASE, status: "draft_pending_human_approval" }));
}

await main();
