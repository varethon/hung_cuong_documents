# STYLE REFERENCE — TÀI LIỆU LUYỆN THI HÙNG CƯỜNG

> **Mục đích:** làm tài liệu tham chiếu cho AI / Codex / GPT / người thiết kế khi tạo **file DOCX mới có cùng phong cách** với tài liệu nguồn `CHƯƠNG 1 ( 36 trang).docx`.
>
> **Nguyên tắc:** ưu tiên tái tạo **hệ thống thị giác + bố cục + phân cấp nội dung**, không chỉ sao chép các Word Style có sẵn. File nguồn dùng rất nhiều **direct formatting, text box, shape và line**, vì vậy nếu chỉ áp `Normal/Heading 1/Table Grid` sẽ **không** ra đúng giao diện.

---

## 1. Design DNA — nhận diện tổng thể

Phong cách của tài liệu là **giáo trình luyện thi Toán phổ thông**, sạch, dày nội dung, thiên về in ấn, với nhận diện xanh dương nhất quán.

Các đặc trưng quan trọng nhất:

- Nền trang **trắng**, không dùng nền màu toàn trang.
- Màu thương hiệu là **xanh dương**, dùng cho header/footer, tên mục, nhãn `BÀI`, `Ví dụ`, `Kết luận`, `Bài`, `Câu`, `Giải` và các đường kẻ/khung.
- Nội dung chính dùng **Times New Roman 13 pt**, màu đen.
- Header/footer dùng chữ xanh đậm, in đậm, cỡ khoảng **12 pt**.
- Các nhãn lớn sử dụng **rounded rectangle / tab màu xanh**, chữ trắng, thường có một lớp xanh nhạt phía sau tạo cảm giác đổ bóng/tab nổi.
- Các khối kiến thức quan trọng dùng **khung xanh mảnh**, đôi khi bo góc, đôi khi nét gạch-chấm.
- Bài tập được trình bày rất chặt, ít khoảng trắng, ưu tiên tận dụng diện tích trang.
- Toán học dùng **Cambria Math / OMML**; hình minh họa chủ yếu là hình tuyến tính đen-trắng, ít màu.
- Phần `Giải` thường **căn giữa, xanh, đậm** để tạo nhịp thị giác giữa đề bài và lời giải.
- Footer luôn mang thương hiệu trung tâm, số trang, địa chỉ và số điện thoại.

---

## 2. Page setup — thông số trang bắt buộc

| Thuộc tính | Giá trị chuẩn | OOXML gốc |
|---|---:|---:|
| Khổ giấy | **A4, dọc** | `11907 × 16840 twips`, paper code `9` |
| Kích thước | 21.0 × 29.7 cm | tương đương A4 |
| Lề trên | **1.0 cm** | `567 twips` |
| Lề dưới | **1.0 cm** | `567 twips` |
| Lề trái | **1.5 cm** | `851 twips` |
| Lề phải | **1.5 cm** | `851 twips` |
| Header distance | **1.25 cm** | `709 twips` |
| Footer distance | **~0.92 cm** | `521 twips` |
| Gutter | 0 | `0` |
| Hướng giấy | Portrait | 1 section |
| Doc grid line pitch | 18 pt | `360 twips` |

### Vùng nội dung hữu dụng

- Chiều rộng nội dung xấp xỉ **18 cm**.
- Các đường kẻ header/footer và thanh section gần như chạy hết vùng nội dung này.
- Không nên nới lề lên kiểu tài liệu hành chính 2–2.5 cm vì sẽ làm mất “mật độ” đặc trưng của file gốc.

---

## 3. Color system

### 3.1. Màu thực tế được sử dụng nhiều

| Token đề xuất | Hex | Vai trò |
|---|---|---|
| `brand-primary` | **#4472C4** | Heading, tên bài/câu, section text, theme Accent 1 |
| `brand-bright` | **#2E78D2** | Khung, nhãn `Ví dụ/Kết luận`, tab/shape nổi bật |
| `brand-header` | **#266FC8** | Header, footer, line đầu/cuối trang |
| `brand-light-1` | **#91BCE3** | Lớp tab/shadow xanh nhạt |
| `brand-light-2` | **#B1CBE9** | Shadow/shape phụ |
| `brand-dark-1` | **#1F4E79** | Accent đậm hiếm gặp |
| `brand-dark-2` | **#1F3864** | Accent đậm hiếm gặp |
| `ink` | **#000000** | Nội dung chính |
| `paper` | **#FFFFFF** | Nền trang / chữ trắng trên tab |

### 3.2. Theme Office có sẵn trong file

Theme gốc còn định nghĩa `Accent2 #ED7D31`, `Accent3 #A5A5A5`, `Accent4 #FFC000`, `Accent5 #5B9BD5`, `Accent6 #70AD47`, nhưng **không phải màu chủ đạo của thiết kế**. Khi tạo file mới, không tự ý đưa cam/vàng/xanh lá vào trừ khi có yêu cầu nội dung riêng.

### 3.3. Quy tắc dùng màu

- Nội dung thường: đen.
- Từ khóa dẫn dắt (`Ví dụ`, `Kết luận`, `Chú ý`, `Bài`, `Câu`, `Dạng`, `Giải`): xanh.
- Tab lớn: nền xanh + chữ trắng.
- Hình toán / sơ đồ: ưu tiên đen-trắng; chỉ dùng xanh cho caption hoặc điểm nhấn.
- Không dùng gradient, màu neon, nền xám dày hoặc hiệu ứng 3D.

---

## 4. Typography

### 4.1. Font chính

**Body chuẩn:**

- `Times New Roman`
- **13 pt**
- Màu `#000000`
- Regular là mặc định; bold chỉ dùng cho nhãn, từ khóa, tiêu đề.

File gốc có `docDefaults`:

```text
Font ASCII/HAnsi: Times New Roman
Size: 26 half-points = 13 pt
Complex Script size mặc định: 22 half-points
Kerning threshold: 2 half-points
```

### 4.2. Cỡ chữ thực tế nổi bật

- **13 pt** — body chính, xuất hiện nhiều nhất.
- **12 pt** — header/footer, một số chi tiết phụ.
- **14 pt** — nhãn `BÀI n:` trong badge và một số heading nổi bật.

### 4.3. Font phụ

| Font | Dùng ở đâu |
|---|---|
| Arial | Badge `BÀI n:`, một số tab/nhãn lớn |
| Calibri / theme minor | Một số tab section |
| Cambria Math | Công thức OMML |
| Arial Unicode MS | Style `MTDisplayEquation` |
| Tahoma | Balloon/comment style, không phải phong cách nội dung chính |
| Mongolian Baiti | Xuất hiện rất ít, không dùng làm chuẩn |

### 4.4. Math typography

- Math font: **Cambria Math**.
- `m:defJc = centerGroup` cho display math.
- Fraction nhỏ: tắt (`smallFrac = 0`).
- Integral limit: `subSup`.
- N-ary limit: `undOvr`.
- File có mật độ công thức cao: khoảng **1,142 `oMath`** và **48 `oMathPara`**.
- Khi tạo DOCX mới, ưu tiên **OMML/Word Equation**, không render công thức thành ảnh trừ khi bắt buộc.

---

## 5. Paragraph rhythm — spacing và line height

### Giá trị phổ biến quan sát được

| Trường hợp | Line spacing OOXML | Diễn giải |
|---|---:|---|
| Body phổ biến | `276 auto` | xấp xỉ **1.15 line** |
| Khối thoáng / ví dụ | `360 auto` | xấp xỉ **1.5 line** |
| Table / compact | `240 auto` | xấp xỉ **single** |
| Rất thoáng, hiếm | `480 auto` | xấp xỉ **2.0 line** |

### Spacing paragraph

- Phần lớn paragraph dùng `after = 0`.
- Tài liệu **không** dựa vào khoảng cách paragraph lớn để chia section; thay vào đó dùng **line + tab + box**.
- `List Paragraph` định nghĩa `after = 200 twips`, nhưng nhiều đoạn có direct override.
- Một số đoạn dùng first-line indent `720 twips = 0.5 inch ≈ 1.27 cm`, nhưng không phải body rule chung.

### Khuyến nghị tái tạo

- Body: `line_spacing = 1.15`, `space_after = 0`.
- Khối ví dụ/giải cần “thở”: có thể dùng `1.15–1.5` tùy mật độ.
- Không dùng `space_after 8–12 pt` theo template Word hiện đại; sẽ làm tài liệu quá loãng.

---

## 6. Header — cấu trúc đầu trang

### Nội dung

- Trái: **`Chinh phục Toán 6 – Tập 1`**
- Phải: **`Chương 1: Tập hợp các số tự nhiên`**
- Cùng một dòng.
- Có **đường kẻ xanh** ngay bên dưới.

### Style

- Font: Times New Roman kế thừa mặc định.
- Size: **12 pt** (`24 half-points`).
- Bold.
- Color: **#266FC8**.
- Paragraph line: `276 auto`.
- Đường line nằm trên layer phía sau text (`behindDoc=1`).
- Line span xấp xỉ **17.99 cm** (`cx ≈ 6,480,175 EMU`).
- Line height cực mỏng; mục đích là đường phân cách, không phải banner.

### Quy tắc khi tạo file mới

```text
HEADER LEFT = <Tên bộ tài liệu / môn / tập>
HEADER RIGHT = <Chương hiện tại>
COLOR = #266FC8
FONT = Times New Roman 12pt Bold
BOTTOM RULE = #266FC8, khoảng 1.5pt
```

Không đặt logo lớn trong header nếu muốn giữ đúng DNA của file nguồn.

---

## 7. Footer — cấu trúc cuối trang

Footer là thành phần nhận diện rất quan trọng.

### Nội dung quan sát được

Dòng chính:

```text
<page> | LUYỆN THI HÙNG CƯỜNG                         SĐT: 0393 355 821
```

Dòng địa chỉ:

```text
ĐỊA CHỈ: XÓM DÕNG, XÃ ĐÔNG ANH, TP HÀ NỘI
```

### Style

- Font: Times New Roman.
- Size: **12 pt**.
- Bold.
- Color: **#266FC8**.
- Page number dùng field `PAGE`.
- Có một đường kẻ xanh phía trên footer, tương ứng với line ở header.
- Địa chỉ được đặt trong text box ngang, để giữ vị trí ổn định sát đáy trang.

### Quy tắc tái tạo

- Luôn dùng **field page number**, không hard-code số trang.
- Dùng 2 lớp footer: dòng thương hiệu + dòng địa chỉ.
- Giữ footer nằm gọn trong lề 1 cm; tránh cao quá 1.2–1.4 cm.

---

## 8. Hệ thống tiêu đề bài học

### 8.1. Mẫu canonical ưu tiên

Visual chuẩn xuất hiện ở nhiều bài:

```text
              [ BÀI 1: ]  TẬP HỢP
```

Trong đó:

- Badge `BÀI n:` là rounded rectangle/tab xanh.
- Chữ badge: **Arial ~14 pt, Bold, White**.
- Tên bài: **Times New Roman ~13–14 pt, Bold, #4472C4**.
- Toàn cụm nằm gần giữa trang, nhưng tên bài có thể kéo sang phải.
- Badge thường có một shape xanh nhạt lệch phía sau để tạo cảm giác nổi.

### 8.2. Kích thước badge quan sát được

Một badge phổ biến có extent khoảng:

```text
1011555 × 381000 EMU ≈ 2.81 × 1.06 cm
```

Một số bài sau dùng badge cao hơn:

```text
1019175 × 539750 EMU ≈ 2.83 × 1.50 cm
```

### 8.3. Variant có trong nguồn

`Bài 3. THỨ TỰ TRONG TẬP HỢP CÁC SỐ TỰ NHIÊN` được trình bày như **text xanh căn giữa**, không có badge rõ như các bài khác.

**Khi sinh file mới:** dùng mẫu badge + title làm mặc định; chỉ dùng variant text-only nếu cần mô phỏng đúng một trang legacy.

---

## 9. Section tabs — A/B/C và I/II

### 9.1. Major tab

Ví dụ:

```text
[A. LÝ THUYẾT] ─────────────────────────────────────────
[B. BÀI TẬP MẪU] ──────────────────────────────────────
[C. BÀI TẬP TỰ LUYỆN] ─────────────────────────────────
```

Đặc điểm:

- Tab nền xanh, bo góc.
- Chữ trắng, Bold, khoảng 13 pt.
- Tab đặt sát trái vùng nội dung.
- Từ cạnh dưới/tab kéo ra một **horizontal rule xanh** sang phải.
- Có thể có một lớp tab xanh nhạt phía sau lệch nhẹ.

### 9.2. Sub-tab

Ví dụ:

```text
[I. Trắc nghiệm]
[II. Tự luận]
```

- Nền xanh, chữ trắng.
- Kích thước nhỏ hơn A/B/C.
- Các extent quan sát được khoảng **4.4–4.5 cm × ~1.0 cm**.

### 9.3. Variant text-only

Trong nhiều trang, `B. BÀI TẬP MẪU`, `C. BÀI TẬP TỰ LUYỆN`, `I. Trắc nghiệm`, `II. Tự luận` xuất hiện dưới dạng **text xanh đậm** không có tab.

Khi AI tạo mới:

- **Section mở đầu trang / chuyển khối lớn:** dùng tab + line.
- **Section tiếp nối giữa trang đang dày nội dung:** có thể dùng text-only để tiết kiệm chiều cao.

---

## 10. Heading cấp nhỏ trong nội dung

### `1) ...`, `2) ...`

- Times New Roman 13 pt.
- Bold.
- Xanh `#4472C4` hoặc xanh gần tương đương.
- Căn trái.
- Không thêm background.

Ví dụ phong cách:

```text
1) Tập hợp và phần tử của tập hợp
2) Mô tả một tập hợp.
```

### `Dạng 1. ...`

Hai variant:

- **Centered blue bold text** — rất phổ biến trong phần tự luận.
- **Blue tab** — dùng khi cần nhấn mạnh chuyển dạng bài.

Canonical đề xuất: `Times New Roman 13 pt Bold #4472C4`, căn giữa.

---

## 11. Inline semantic labels

### `Ví dụ n:`

- Cùng dòng với nội dung.
- **Bold + xanh** (`#4472C4` hoặc `#2E78D2`).
- Body theo sau trở về màu đen.
- Nếu có từ `Hình`, từ `Hình` thường italic.

Mẫu:

```text
Ví dụ 1: Trên Hình ...
```

### `Bài n:` / `Câu n:`

- `Bài n:` hoặc `Câu n:`: **Bold + #4472C4**.
- Nội dung câu hỏi: black regular.
- Đây là pattern xuyên suốt tài liệu.

### `Giải`

- Căn giữa.
- **Bold + #4472C4**.
- 13 pt.
- Không đặt trong hộp.
- Tách đề và lời giải bằng nhịp spacing nhỏ, không cần line.

### `Kết luận:` / `Chú ý:`

- Nhãn xanh và bold.
- Có thể nằm trong/đính vào callout box.

---

## 12. Callout components

### 12.1. Example box — khung ví dụ

Dùng cho các ví dụ ngắn cần khóa thành một block.

**Visual:**

```text
┌───────────────────────────────────────────────────────┐
│ Ví dụ 6: ...                                          │
│ ...                                                   │
└───────────────────────────────────────────────────────┘
```

Thông số:

- Border xanh `#2E78D2`.
- Width line phổ biến: **1.5 pt** (`19050 EMU`).
- Fill: none / white.
- Corner: thường square rectangle.
- Padding vừa phải, khoảng 0.1–0.2 cm.
- Label `Ví dụ`: blue bold; nội dung black.

### 12.2. Conclusion box — khung nét gạch-chấm

**Visual:** rounded rectangle, no fill, border xanh kiểu `lgDashDot`.

Thông số kỹ thuật quan sát được:

```text
Geometry: roundRect
Fill: none
Line: #2E78D2
Dash: lgDashDot
```

Dùng cho nội dung định nghĩa/kết luận cần nhớ.

### 12.3. Note box — `Chú ý`

- Outer box: rounded rectangle, border xanh.
- Một tab nhỏ `Chú ý` chồng lên cạnh trên.
- Tab: nền xanh `#2E78D2`, chữ trắng/bold.
- Nội dung bên trong thường là list gạch đầu dòng.
- Không tô nền cả box.

### 12.4. Light-shadow tab

Một số tab dùng 2 lớp:

```text
back plate: #91BCE3 hoặc #B1CBE9
front plate: #4472C4 / #2E78D2
```

Lớp sau lệch nhẹ sang phải/dưới, tạo cảm giác tab nổi nhưng **không dùng shadow effect của Office**. File gốc thực tế không có `outerShdw`; hiệu ứng đến từ shape phụ.

---

## 13. Shape system — thông số kỹ thuật

Các shape thường gặp:

| Geometry | Số lượng tương đối | Vai trò |
|---|---:|---|
| `rect` | cao | Text box, example box, vùng nhãn |
| `roundRect` | cao | Tab, callout, note/conclusion |
| `line` | trung bình | Rule dưới header/section/footer |
| `round2SameRect` | thấp hơn | Plate/tab trang trí |

### Line weights quan sát được

- `6350 EMU` ≈ **0.5 pt**
- `19050 EMU` ≈ **1.5 pt**
- `28575 EMU` ≈ **2.25 pt**

### Dash style

- `solid`
- `lgDashDot` — đặc trưng cho khung `Kết luận`.

### Anchor behavior

- Shape chủ yếu anchor theo `margin` hoặc `column`, vertical theo `paragraph`.
- `allowOverlap = 1` được dùng nhiều.
- Khi tái tạo bằng `python-docx`, nếu không hỗ trợ floating shape đầy đủ, có thể dùng **table 1-cell + border + shading** làm fallback; tuy nhiên để giống 100%, nên dùng OOXML DrawingML/VML hoặc Word-native shapes.

---

## 14. Tables

File nguồn có khoảng **190 bảng**, gần như tất cả dùng `Table Grid`.

### Canonical table style

- Style: `Table Grid`.
- Border: black/auto.
- Border width: `w:sz=4` = **0.5 pt**.
- Cell fill: none.
- Paragraph inside table: line spacing single (`240 auto`), before/after 0.
- Không dùng table theme nhiều màu.
- Header row thường chỉ dùng **bold / căn giữa**, không tô nền xanh đậm.

### Khi dùng bảng

- Bảng hàng-lớp số, cấu tạo số, dữ liệu toán: grid mảnh, rõ.
- Không thêm zebra striping.
- Không dùng rounded tables.
- Đặt bảng vừa đúng nội dung; không ép full-width nếu dữ liệu ngắn.

---

## 15. Lists và numbering

File chứa nhiều numbering instance do tài liệu được soạn/chỉnh qua nhiều lần: khoảng **240 abstract numbering + 240 num instance**. Tuy nhiên pattern thực chất gọn hơn.

### Các pattern cấp 1 chính

```text
1) 2) 3) ...
a) b) c) ...
A. B. C. D. ...
 bullet
- bullet
```

### Indent phổ biến

- List level 0: `left = 720`, `hanging = 360` twips.
- Một số dash bullet: `left = 1080`, `hanging = 360`.

### Trắc nghiệm

- Question: `Câu n:` xanh bold + đề đen.
- Đáp án: `A.`, `B.`, `C.`, `D.` in bold; bố trí theo 2 hoặc 4 cột tùy độ dài.
- File gốc thường dùng table/grid ẩn hoặc spacing thủ công để giữ alignment.

---

## 16. Figures, diagrams, images

### Phong cách hình

- Hình chủ yếu đen-trắng, nét mảnh.
- Caption dạng `Hình 1`, `Hình 2` thường **italic**, căn dưới hình.
- Số/hình học đặt sát câu hỏi tương ứng, không tách sang trang ảnh riêng.
- Hình có thể float bên phải đoạn văn để tiết kiệm chiều cao.

### Media kỹ thuật trong DOCX

Package nguồn chứa rất nhiều media vector/legacy:

```text
~951 media parts
- ~928 WMF
- 11 EMF
- 11 PNG
- 1 JPG
```

Điều này cho thấy tài liệu gốc ưu tiên hình vector/Word object. File mới nên ưu tiên SVG/EMF/PNG nét cao; tránh JPEG cho sơ đồ toán vì dễ mờ.

---

## 17. Content density và page composition

Tài liệu có mật độ cao nhưng không “bí” nhờ hierarchy xanh rõ ràng.

### Pattern bố cục trang điển hình

```text
HEADER + top rule

[Lesson badge + lesson title]        (chỉ ở đầu bài)
[Major section tab] + rule

subheading
Ví dụ ...
Kết luận / Chú ý box
...

B. BÀI TẬP MẪU
Bài 1: ...
                    Giải
...

C. BÀI TẬP TỰ LUYỆN
[I. Trắc nghiệm]
Câu 1: ...
A. ...   B. ...   C. ...   D. ...
[II. Tự luận]
Dạng 1. ...
Bài 1: ...

footer rule
page | brand                                      phone
address
```

### Quy tắc chống “trôi style”

- Không đổi font body sang Arial/Calibri.
- Không thêm heading size 18–24 pt kiểu slide.
- Không tăng lề để “thoáng”.
- Không dùng card nền xám, icon hiện đại, gradient, emoji.
- Không thêm màu ngoài palette xanh/trắng/đen nếu không có lý do.
- Không biến section thành bảng màu; tài liệu gốc rất tối giản về màu.

---

## 18. Canonical component spec cho AI

### Component: `document_header`

```yaml
font: Times New Roman
size_pt: 12
bold: true
color: "#266FC8"
left_text: "<Tên bộ tài liệu>"
right_text: "<Chương hiện tại>"
bottom_rule:
  color: "#266FC8"
  width_pt: 1.5
```

### Component: `lesson_heading`

```yaml
alignment: center-ish
badge:
  text: "BÀI <n>:"
  font: Arial
  size_pt: 14
  bold: true
  color: "#FFFFFF"
  fill: "#4472C4"
  geometry: roundRect
  optional_backplate: "#91BCE3"
title:
  font: Times New Roman
  size_pt: 13-14
  bold: true
  color: "#4472C4"
```

### Component: `major_section_tab`

```yaml
examples: ["A. LÝ THUYẾT", "B. BÀI TẬP MẪU", "C. BÀI TẬP TỰ LUYỆN"]
font_size_pt: 13
bold: true
text_color: "#FFFFFF"
fill: "#2E78D2"
geometry: roundRect
horizontal_rule: true
rule_color: "#4472C4"
```

### Component: `semantic_inline_label`

```yaml
examples: ["Ví dụ 1:", "Bài 1:", "Câu 1:", "Kết luận:", "Chú ý:"]
font: Times New Roman
size_pt: 13
bold: true
color: "#4472C4"
body_after_label:
  bold: false
  color: "#000000"
```

### Component: `solution_label`

```yaml
text: "Giải"
alignment: center
font: Times New Roman
size_pt: 13
bold: true
color: "#4472C4"
```

### Component: `conclusion_box`

```yaml
geometry: roundRect
fill: none
border_color: "#2E78D2"
border_style: lgDashDot
border_width_pt: 1.0-1.5
inner_text: Times New Roman 13pt
```

### Component: `example_box`

```yaml
geometry: rect
fill: none
border_color: "#2E78D2"
border_width_pt: 1.5
padding_cm: 0.1-0.2
```

### Component: `document_footer`

```yaml
font: Times New Roman
size_pt: 12
bold: true
color: "#266FC8"
top_rule:
  color: "#266FC8"
  width_pt: 1.5
line_1: "{PAGE} | LUYỆN THI HÙNG CƯỜNG                         SĐT: 0393 355 821"
line_2: "ĐỊA CHỈ: XÓM DÕNG, XÃ ĐÔNG ANH, TP HÀ NỘI"
```

---

## 19. Prompt contract — đoạn ref có thể đưa thẳng cho AI

```text
Hãy tạo tài liệu DOCX theo STYLE REFERENCE “Luyện thi Hùng Cường”:

1. Page A4 portrait; margins top/bottom 1.0 cm, left/right 1.5 cm.
2. Main font Times New Roman 13 pt; body black; line spacing 1.15; paragraph after 0.
3. Primary palette: #4472C4, #2E78D2, #266FC8, white, black. Light plate: #91BCE3/#B1CBE9.
4. Header: Times New Roman 12 pt bold #266FC8; left = document series, right = current chapter; blue rule below.
5. Footer: blue rule; PAGE field + “LUYỆN THI HÙNG CƯỜNG” + phone; second line = address; 12 pt bold #266FC8.
6. Lesson start: rounded blue badge “BÀI n:” in Arial 14 pt bold white + blue lesson title 13–14 pt bold.
7. Major sections A/B/C use rounded blue tab with white text + horizontal blue rule. For dense continuation pages, blue bold text-only variant is allowed.
8. “Ví dụ n:”, “Bài n:”, “Câu n:”, “Kết luận:”, “Chú ý:” are bold blue inline labels; following content is black.
9. “Giải” is centered, bold, blue.
10. Important conclusions/notes use no-fill blue borders; conclusion uses rounded lgDashDot border; example blocks use 1.5 pt solid blue rectangle.
11. Tables use plain Table Grid 0.5 pt black borders, no colored fill.
12. Math uses Word Equation / Cambria Math. Figures are mostly black-white, thin-line, captions italic “Hình n”.
13. Keep content dense and print-oriented. Do NOT use modern card UI, gradients, large whitespace, large headings, extra colors, emoji, or decorative icons.
14. Reuse exactly the same visual hierarchy on all pages; only use observed text-only variants when page density requires it.
```

---

## 20. Technical inventory — Word styles trong file nguồn

> Lưu ý: phần lớn phong cách nhìn thấy **không nằm trong named style** mà nằm ở direct formatting + shape. Danh sách dưới đây là inventory kỹ thuật để AI/code generator hiểu package gốc.

| Type | Style ID | Name | Based on | Next | Font / Theme | Size | Color | Bold | Spacing |
|---|---|---|---|---|---|---:|---|---|---|
| paragraph | `Normal` | Normal | — | — | doc default | 13 pt default | black default | — | doc default |
| paragraph | `Heading1` | heading 1 | Normal | Normal | Calibri Light / TNR EA/CS | 16 pt | #2E74B5 | no | before 240 |
| paragraph | `Heading2` | heading 2 | Normal | Normal | Calibri Light / TNR EA/CS | 13 pt CS | #5B9BD5 | yes | before 40 |
| character | `DefaultParagraphFont` | Default Paragraph Font | — | — | inherited | — | — | — | — |
| table | `TableNormal` | Normal Table | — | — | inherited | — | — | — | — |
| numbering | `NoList` | No List | — | — | — | — | — | — | — |
| paragraph | `Heading11` | Heading 11 | Normal | Normal | Calibri Light / TNR | 16 pt | #2E74B5 | no | before 240; line 259 |
| paragraph | `Heading21` | Heading 21 | Normal | Normal | Calibri Light / TNR | 13 pt CS | #5B9BD5 | yes | before 200; line 276 |
| numbering | `NoList1` | No List1 | — | NoList | — | — | — | — | — |
| paragraph | `NoSpacing` | No Spacing | — | — | inherited | 12 pt | — | — | 0/0; line 240 |
| paragraph | `Header` | header | Normal | — | inherited | 14 pt style default | — | — | 0/0; line 240 |
| character | `HeaderChar` | Header Char | DefaultParagraphFont | — | inherited | 14 pt | — | — | — |
| paragraph | `Footer` | footer | Normal | — | inherited | 14 pt style default | — | — | 0/0; line 240 |
| character | `FooterChar` | Footer Char | DefaultParagraphFont | — | inherited | 14 pt | — | — | — |
| paragraph | `BalloonText` | Balloon Text | Normal | — | Tahoma | 8 pt | — | — | 0/0; line 240 |
| character | `BalloonTextChar` | Balloon Text Char | DefaultParagraphFont | — | Tahoma | 8 pt | — | — | — |
| paragraph | `ListParagraph` | List Paragraph | Normal | — | inherited | 14 pt style-level | — | — | after 200; line 276 |
| character | `Hyperlink1` | Hyperlink1 | DefaultParagraphFont | — | inherited | — | #0563C1 | — | — |
| character | `ListParagraphChar` | List Paragraph Char | DefaultParagraphFont | — | inherited | 14 pt | — | — | — |
| table | `TableGrid1` | Table Grid1 | TableNormal | TableGrid | Calibri | 11 pt | — | — | 0/0; line 240 |
| character | `Heading1Char` | Heading 1 Char | DefaultParagraphFont | — | Calibri Light / TNR | 16 pt | #2E74B5 | — | — |
| paragraph | `NormalWeb` | Normal (Web) | Normal | — | Times New Roman | 12 pt | — | — | before/after 100 |
| character | `PlaceholderText` | Placeholder Text | DefaultParagraphFont | — | inherited | — | #808080 | — | — |
| character | `Heading2Char` | Heading 2 Char | DefaultParagraphFont | — | Calibri Light / TNR | 13 pt | #5B9BD5 | yes | — |
| paragraph | `MTDisplayEquation` | MTDisplayEquation | Normal | Normal | Arial Unicode MS | 13 pt CS | — | — | 0/0; line 240 |
| character | `MTDisplayEquationChar` | MTDisplayEquation Char | DefaultParagraphFont | — | Arial Unicode MS | 13 pt CS | — | — | — |
| character | `text` | text | DefaultParagraphFont | — | inherited | — | — | — | — |
| character | `card-send-timesendtime` | card-send-time__sendtime | DefaultParagraphFont | — | inherited | — | — | — | — |
| character | `Hyperlink` | Hyperlink | DefaultParagraphFont | — | inherited | — | #0563C1 | — | — |
| table | `TableGrid` | Table Grid | TableNormal | — | inherited | — | — | — | 0/0; line 240 |
| character | `Heading1Char1` | Heading 1 Char1 | DefaultParagraphFont | — | theme majorHAnsi | 16 pt | #2F5496 | — | — |
| character | `Heading2Char1` | Heading 2 Char1 | DefaultParagraphFont | — | theme majorHAnsi | 13 pt CS | #2F5496 | — | — |

### Named-style usage thực tế

- Body top-level chủ yếu là `Normal` và `List Paragraph`.
- Toàn bộ **190 tables** dùng `Table Grid`.
- Header/footer lại có nhiều **direct run overrides**, nên giá trị render thực tế là **12 pt bold #266FC8**, dù named style `Header/Footer` có size 14 pt ở cấp style.
- Không có character style được áp rộng rãi cho các nhãn xanh; hầu hết là direct formatting.

---

## 21. Document defaults và theme fonts

### `docDefaults`

```yaml
run_defaults:
  ascii: "Times New Roman"
  hAnsi: "Times New Roman"
  eastAsiaTheme: "minorHAnsi"
  csTheme: "minorBidi"
  size_pt: 13
  size_cs_pt: 11
  language: "en-US"
paragraph_defaults:
  before_twips: 60
  after_twips: 60
  line_twips: 240
  line_rule: exact
```

### Theme font scheme

```yaml
major_latin: "Calibri Light"
minor_latin: "Calibri"
```

Trong visual thực tế, **Times New Roman vẫn là font chính**, không lấy Calibri làm body.

---

## 22. QA checklist khi AI tạo file mới

Trước khi xuất DOCX, kiểm tra lần lượt: khổ A4 và lề; header/footer đúng màu và vị trí; body Times New Roman 13 pt; tất cả nhãn xanh đúng hierarchy; lesson badge/section tab có shape hợp lý; `Giải` được căn giữa; bảng không bị tô màu; công thức không vỡ; hình không lấn chữ; không có paragraph spacing quá lớn; không có section bị đổi style giữa các trang; footer không bị cắt; page number là field; không xuất hiện màu lạ ngoài palette; render PDF/PNG để kiểm tra clipping và overlap.

---

## 23. Canonical priority — khi các style trong nguồn mâu thuẫn

Tài liệu nguồn có một số biến thể do được biên tập thủ công. Khi tạo tài liệu mới, áp thứ tự ưu tiên sau:

1. **Giữ nhận diện chung:** TNR + xanh + trắng + đen + mật độ cao.
2. **Dùng lesson badge + title** cho đầu mỗi bài.
3. **Dùng major tab + horizontal line** cho A/B/C khi còn không gian; dùng blue text-only cho trang tiếp nối.
4. **Dùng blue inline labels** cho Ví dụ/Bài/Câu/Kết luận/Chú ý.
5. **Dùng centered blue `Giải`**.
6. **Dùng blue callout border**, không tô nền block.
7. **Giữ table tối giản**.
8. Nếu không thể tạo floating shapes chuẩn, ưu tiên layout ổn định hơn là cố mô phỏng shape gây overlap.

---

## 24. Tóm tắt một dòng

**A4 lề hẹp + Times New Roman 13 pt + xanh `#4472C4/#2E78D2/#266FC8` + tab bo góc chữ trắng + đường kẻ xanh + khung no-fill + `Giải` xanh căn giữa + bảng grid mảnh + footer thương hiệu cố định = style cốt lõi của tài liệu Luyện thi Hùng Cường.**
