# DESIGN.md — Hệ thống thiết kế sách Hùng Cường

Đây là quy chuẩn triển khai cho sách mới. Nó được rút ra từ
`docs/STYLE_GUIDE_HUNG_CUONG_DOCS.md` và `sources/books/BRAND_SOURCE.md`; khi
có khác biệt nhỏ giữa các tài liệu nguồn, token trong file này được ưu tiên.

## 1. Design DNA

Sách có phong cách giáo trình luyện thi Toán phổ thông: in ấn, dày nội dung,
trắng sạch, xanh dương nhất quán, phân cấp rõ và ít khoảng trắng thừa. Không
dùng giao diện card hiện đại, gradient, emoji, màu neon, nền xám dày hoặc
heading kiểu slide.

## 2. Page tokens

```yaml
page:
  paper: A4
  orientation: portrait
  width_twips: 11907
  height_twips: 16840
  margin_top_twips: 567
  margin_bottom_twips: 567
  margin_left_twips: 851
  margin_right_twips: 851
  header_distance_twips: 709
  footer_distance_twips: 521
  gutter_twips: 0
  grid_line_pitch_twips: 360
body:
  font: Times New Roman
  size_pt: 13
  color: "#000000"
  line_spacing: 1.15
  paragraph_after_pt: 0
```

## 3. Color tokens

| Token | Hex | Vai trò |
|---|---|---|
| `brand-primary` | `#4472C4` | tiêu đề, nhãn, section text |
| `brand-bright` | `#2E78D2` | tab, khung, callout |
| `brand-header` | `#266FC8` | header, footer, đường kẻ |
| `brand-light-1` | `#91BCE3` | back plate/shadow tab |
| `brand-light-2` | `#B1CBE9` | plate phụ |
| `brand-dark-1` | `#1F4E79` | nhấn đậm khi cần |
| `ink` | `#000000` | nội dung chính |
| `paper` | `#FFFFFF` | nền trang/chữ trên tab |
| `brand-gold` | theo logo | nhấn trên bìa, không dùng dày trong ruột |

Không đưa cam, vàng hoặc xanh lá vào ruột sách nếu không có lý do sư phạm hoặc
nhận diện được phê duyệt.

## 4. Typography và math

- Body, heading nhỏ, nhãn và lời giải: Times New Roman.
- Header/footer: Times New Roman 12 pt, bold, `#266FC8`.
- Badge `BÀI n:`: Arial khoảng 14 pt, bold, trắng.
- Công thức: Cambria Math, Word Equation/OMML; không render thành ảnh mặc định.
- Caption hình: italic, màu đen hoặc xanh tùy vai trò, dạng `Hình n`.
- Không dùng cỡ 18–24 pt trong ruột sách.

## 5. Header/footer

Header một dòng:

```text
<Tên bộ tài liệu / môn / tập>                 <Chương hiện tại>
```

Header dùng màu `#266FC8`, bold 12 pt và có đường kẻ xanh bên dưới.

Footer gồm:

```text
{PAGE} | LUYỆN THI HÙNG CƯỜNG                         SĐT: 0393 355 821
ĐỊA CHỈ: XÓM DÕNG, XÃ ĐÔNG ANH, TP HÀ NỘI
```

`{PAGE}` phải là field Word. Footer có đường kẻ xanh phía trên, nằm gọn trong
lề dưới và không bị cắt khi render.

## 6. Component tokens

### Lesson heading

```yaml
badge:
  geometry: roundRect
  text: "BÀI <n>:"
  font: Arial
  size_pt: 14
  bold: true
  color: "#FFFFFF"
  fill: "#4472C4"
  optional_backplate: "#91BCE3"
title:
  font: Times New Roman
  size_pt: 13-14
  bold: true
  color: "#4472C4"
```

### Major section tab

Dùng cho `A. LÝ THUYẾT`, `B. BÀI TẬP MẪU`, `C. BÀI TẬP TỰ LUYỆN`:

- roundRect xanh `#2E78D2`, chữ trắng bold khoảng 13 pt.
- Có đường kẻ ngang xanh kéo sang phải.
- Section tiếp nối trong trang quá dày có thể dùng text-only xanh bold.

### Inline labels

`Ví dụ n:`, `Bài n:`, `Câu n:`, `Kết luận:`, `Chú ý:` dùng TNR 13 pt, bold,
xanh `#4472C4`; nội dung sau nhãn trở về màu đen.

`Giải` đặt giữa dòng, TNR 13 pt, bold, xanh `#4472C4`.

### Callouts

- Example box: hình chữ nhật, nền trắng/không fill, viền `#2E78D2`, nét liền,
  khoảng 1.5 pt.
- Conclusion box: roundRect, không fill, viền xanh, nét `lgDashDot`, khoảng
  1.0–1.5 pt.
- Note box: roundRect viền xanh, tab `Chú ý` xanh chữ trắng chồng nhẹ trên
  cạnh trên, không tô nền toàn bộ.
- Nếu floating shape không ổn định, dùng table một ô có border làm fallback;
  ưu tiên layout ổn định, không để shape chồng chữ.

### Tables/lists

- Bảng: Table Grid, viền đen khoảng 0.5 pt, không tô zebra/gradient.
- Dùng chiều rộng cột và cell margin tường minh; không dựa vào autofit.
- Danh sách phải dùng numbering definition thật, không giả lập bằng ký tự bullet
  hoặc số thủ công.

## 7. Hình và bìa

- Hình toán ưu tiên nét đen/trắng, rõ khi in, có caption và alt text.
- Mỗi hình mới có `figure_id`, file riêng và manifest.
- Không lấy lại hình trong DOCX nguồn.
- Logo dùng từ `sources/books/logo_hung_cuong.png` theo brand source.
- Bìa mới giữ cấu trúc nhận diện: logo/wordmark, môn/lớp, dòng sách, tập,
  khẩu hiệu và minh họa Toán; nhưng phải tạo bố cục, typography phụ và minh họa
  mới, không dùng trực tiếp `bia_toan7_ref_02.png`. `bia_toan7_ref_01.png` được
  brand source nhắc tới nhưng đang thiếu trong workspace; nếu được bổ sung,
  nó cũng chỉ là reference, không phải asset để nhúng trực tiếp.
- Khẩu hiệu ưu tiên: `KIÊN TRÌ • TỰ GIÁC • TIẾN BỘ`.

## 8. Quy tắc layout

- Giữ mật độ nội dung cao nhưng có anchor thị giác rõ.
- Caption đi cùng hình; không để hình tràn chữ hoặc bị đẩy sang trang không có
  ngữ cảnh.
- Không dùng spacing paragraph lớn để thay cho hierarchy.
- Không shrink chữ âm thầm để ép trang; trước hết wrap, điều chỉnh kích thước
  hình/bảng, hoặc dùng pattern continuation đã quy định.
- Mọi ngoại lệ phải được ghi là named override trong QA report.
