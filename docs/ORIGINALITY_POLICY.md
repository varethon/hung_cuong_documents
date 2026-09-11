# ORIGINALITY_POLICY — Chính sách biên soạn độc lập

## 1. Mục tiêu

Giảm rủi ro sao chép khi dùng tài liệu nguồn để xây dựng sách mới. Chính sách
này không thay thế tư vấn pháp lý hoặc phê duyệt quyền sử dụng.

## 2. Được giữ và phải thay đổi

### Có thể giữ ở cấp ý tưởng

- Mục tiêu và chuẩn kiến thức Toán.
- Khái niệm, định lý, công thức và kỹ năng phổ thông cần dạy.
- Dạng bài và mức độ nhận thức.
- Trình tự sư phạm ở cấp chương/bài khi cần bảo đảm coverage.

### Bắt buộc biên soạn lại

- Câu chữ lý thuyết và giải thích.
- Câu dẫn, ngữ cảnh, nhân vật, vật thể và dữ kiện.
- Số liệu, biến, đơn vị và điều kiện ràng buộc.
- Thứ tự câu hỏi, cách chia ý và cấu trúc phương án.
- Cách diễn giải đáp án và lời giải.
- Hình, sơ đồ, nhãn hình và bố cục hình.
- Ví dụ đặc trưng, chuỗi bài và cách tổ chức trang có tính nhận diện cao.

“Thay số” đơn thuần là không đạt yêu cầu.

## 3. Quy tắc cho từng loại nội dung

### Lý thuyết

Viết lại bằng câu chữ mới, ví dụ mới và cách giải thích mới. Có thể giữ công
thức/định nghĩa toán học cần thiết, nhưng không copy đoạn văn hoặc thứ tự diễn
giải đặc trưng.

### Bài tập

Mỗi bài mới phải có mục tiêu riêng, dữ kiện mới và câu chữ mới. Với bài có cấu
trúc tương tự vì bản chất kỹ năng, phải thay đổi ít nhất hai yếu tố lớn trong
ngữ cảnh/cấu trúc/chiến lược giải; không chỉ thay số.

### Trắc nghiệm

Viết lại stem, thay đổi dữ kiện và phương án nhiễu. Không giữ nguyên vị trí đáp
án đúng hoặc mẫu nhiễu đặc trưng nếu không cần thiết.

### Hình

Vẽ lại từ mô tả hình học và mục tiêu sư phạm. Không crop, trace, recolor hoặc
nhúng lại hình trong DOCX nguồn. Logo thương hiệu là ngoại lệ được phép theo
`sources/books/BRAND_SOURCE.md`.

### Lời giải

Tính toán độc lập từ đề mới. Trình bày lại các bước và lời giải thích; không
copy cách diễn đạt lời giải nguồn.

## 4. Kiểm tra tự động và thủ công

Mỗi run phải thực hiện:

1. Chuẩn hóa văn bản để kiểm tra exact duplicate và n-gram overlap.
2. So sánh câu hỏi mới với nguồn theo stem, độ dài, cụm từ hiếm và thứ tự ý.
3. So sánh dữ liệu, tên riêng, ngữ cảnh và phương án trắc nghiệm.
4. Kiểm tra hash/metadata hình để bảo đảm không dùng lại hình nguồn.
5. Kiểm tra các bài có cấu trúc tương tự bằng reviewer, không dựa duy nhất vào
   điểm similarity.
6. Ghi từng cảnh báo, quyết định xử lý và người chịu trách nhiệm vào
   `reviews/originality_review.md`.

Các công thức, ký hiệu và cụm từ toán học phổ thông có thể tạo cảnh báo giả.
Reviewer phải phân biệt phần bắt buộc vì tính chính xác Toán với phần văn bản
có thể biên soạn độc lập.

## 5. Trạng thái originality

Mỗi problem/figure dùng một trong các trạng thái:

```text
not_checked → checked_pass
not_checked → needs_rewrite → checked_pass
not_checked → escalated_for_human_review
```

Không dùng `checked_pass` nếu còn đoạn copy nguyên văn, hình nguồn hoặc cấu
trúc đặc trưng chưa được giải thích.

## 6. Cổng phát hành

Release manager chỉ được chuyển sang `approved_for_release` khi:

- originality review không còn blocker;
- math/editorial review đạt;
- hình và asset có quyền sử dụng rõ;
- người duyệt xác nhận bản mới là nội dung biên soạn độc lập ở mức dự án yêu cầu.

