# PROJECT_CONTEXT — Sách Toán mới Hùng Cường

## 1. Mục tiêu

Tạo các bộ sách Toán tiếng Việt có nội dung giảng dạy tổng quan tương đương
tài liệu nguồn, nhưng là tác phẩm biên soạn mới: lý thuyết được diễn đạt lại,
bài tập có dữ kiện/ngữ cảnh/cấu trúc mới, hình được vẽ lại và lời giải được
kiểm chứng độc lập.

Mục tiêu trước mắt là hoàn thiện pilot **Toán 6 – Các chuyên đề cơ bản – Tập
1**, sau đó dùng workflow đã kiểm chứng để mở rộng cho các tập Toán 6 và Toán
8 còn lại.

## 2. Cấu trúc repository hiện tại

```text
.
├── AGENTS.md
├── docs/
│   ├── PROJECT_CONTEXT.md
│   ├── STYLE_GUIDE_HUNG_CUONG_DOCS.md
│   ├── WORKFLOW.md
│   ├── ORIGINALITY_POLICY.md
│   ├── QA_RELEASE_CHECKLIST.md
│   └── design.md
├── agents/
├── sources/
│   ├── books/
│   ├── final_docs/
│   └── root_documents/
└── work/                         # tạo khi bắt đầu book run
    └── <book_id>/<run_id>/
```

## 3. Nguồn tham khảo

### Tài liệu gốc

`sources/root_documents/` hiện có 27 file DOCX:

- Toán 6, Tập 1: 8 file, gồm chương và một phần đáp án.
- Toán 6, Tập 2: 4 file chương.
- Toán 8, Tập 1: 5 file chương.
- Toán 8, Tập 2: 10 file, gồm chương và đáp án.

Tên file và đường dẫn có Unicode; thư mục Toán 8 hiện có một dấu cách ở cuối
tên `Toán 8 `. Agent phải xử lý chính xác đường dẫn thực tế, không tự ý chuẩn
hóa bằng cách đổi tên thư mục.

Các file nguồn được dùng để xác định coverage, trình tự kiến thức, dạng bài,
mức độ và nhu cầu hình. Chúng không phải kho văn bản để sao chép.

### Tài nguyên thương hiệu

`sources/books/` hiện gồm:

- `BRAND_SOURCE.md`: quy tắc logo, khẩu hiệu, bìa và màu thương hiệu.
- `logo_hung_cuong.png`: logo được phép dùng trong bìa/sách theo brand source.
- `bia_toan7_ref_02.png`: reference thị giác hiện có, không được dùng trực tiếp
  làm bìa mới.
- `bia_toan7_ref_01.png`: được `BRAND_SOURCE.md` nhắc tới nhưng hiện không có
  trong workspace; không tự tạo/tải lại asset này. Nếu file được bổ sung, chỉ
  dùng làm reference phụ.

Khẩu hiệu chính:

```text
KIÊN TRÌ • TỰ GIÁC • TIẾN BỘ
```

## 4. Quy chuẩn ưu tiên

Khi các nguồn có khác biệt, áp dụng thứ tự:

1. Chỉ dẫn trực tiếp của người dùng.
2. `AGENTS.md` và `docs/PROJECT_CONTEXT.md`.
3. `docs/design.md` và `docs/ORIGINALITY_POLICY.md`.
4. `sources/books/BRAND_SOURCE.md` cho nhận diện thương hiệu.
5. `docs/STYLE_GUIDE_HUNG_CUONG_DOCS.md` làm bằng chứng và tham chiếu.
6. `sources/root_documents/` chỉ để suy ra coverage và mục tiêu sư phạm.

## 5. Metadata mặc định của pilot

```yaml
book_id: toan6-tap1
title: "Toán 6 – Các chuyên đề cơ bản"
volume: "Tập 1"
language: vi-VN
grade: 6
publication_status: draft
```

## 6. Thư mục làm việc và output

Mỗi lần chạy tạo một `run_id` riêng trong `work/<book_id>/<run_id>/`. Đây là
nơi lưu source map, nội dung Markdown, hình, review, render và báo cáo QA.

Artifact phát hành chỉ được ghi vào:

```text
sources/final_docs/<book_id>/
```

Gói pilot chuẩn gồm sách chính và đáp án ở cả DOCX/PDF, bìa PNG và manifest
phát hành. Tên file được định nghĩa trong `docs/WORKFLOW.md`.

## 7. Phạm vi và ngoài phạm vi

Trong phạm vi:

- Lập bản đồ nội dung từ toàn bộ nguồn liên quan.
- Biên soạn sách mới cho pilot Toán 6 Tập 1.
- Dựng bìa mới theo nhận diện Hùng Cường.
- Vẽ lại hình cần thiết.
- Tạo đáp án/lời giải riêng.
- Kiểm tra originality, toán học, editorial, bố cục và render.

Ngoài phạm vi mặc định:

- Sửa trực tiếp tài liệu nguồn.
- Khẳng định pháp lý rằng nội dung chắc chắn không vi phạm bản quyền.
- Đóng gói thành plugin hoặc skill executable.
- Phát hành khi chưa có người duyệt.
