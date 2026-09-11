# WORKFLOW — Quy trình tạo và phát hành sách Toán mới

## 1. Nguyên tắc điều phối

Mỗi lần xử lý một bộ sách là một `run` độc lập:

```text
<book_id>/<run_id>/
```

`work/` là vùng làm việc trung gian. Nguồn chính vẫn chỉ đọc; output cuối chỉ
được ghi sau cổng release.

Luồng chuẩn:

```text
orchestrator
  → source mapper
  → curriculum planner
  → content author
  → figure author
  → math/editorial reviewer
  → DOCX builder
  → render QA
  → human release
```

Role card chi tiết nằm trong `agents/` và được index ở `agents/README.md`.

## 2. Trạng thái run

```text
initialized
→ source_mapped
→ curriculum_planned
→ content_authored
→ figures_ready
→ reviewed
→ docx_built
→ rendered
→ human_approved
→ approved_for_release
```

Nếu cổng nào thất bại, run chuyển về trạng thái `needs_revision`, ghi rõ lỗi,
agent sửa và trạng thái đích cần đạt lại. Không được nhảy cóc trạng thái.

## 3. Các bước và cổng bàn giao

### Bước 0 — Orchestrator

Đọc toàn bộ context bắt buộc, tạo `run_state.yaml`, xác định `book_id`, đường
dẫn nguồn, output và agent tiếp theo.

Gate: metadata đầy đủ, mọi path tồn tại hoặc được đánh dấu `pending`, không có
nguồn nào bị ghi đè.

### Bước 1 — Source mapper

Đọc danh sách 27 DOCX và tài liệu brand/style cần thiết. Lập:

- `source_map.yaml`
- `asset_manifest.yaml`
- `template_artifact.md` nếu cần distill cấu trúc DOCX tham khảo

Source map chỉ lưu locator, chapter/lesson, concept, skill, dạng bài và vai trò
tham khảo; không lưu nguyên văn dài từ nguồn.

Gate: tất cả file liên quan được lập chỉ mục; chương, bài, đáp án và asset được
ghép đúng; nguồn vẫn byte-for-byte không đổi.

### Bước 2 — Curriculum planner

Chuyển source map thành `curriculum_map.yaml`, gồm mục tiêu, khái niệm, kỹ năng,
độ khó, blueprint số lượng bài, phân bổ trắc nghiệm/tự luận và nhu cầu hình.

Gate: coverage map đủ để người khác tạo sách mà không phải đọc lại nguồn; mỗi
bài có mục tiêu và tiêu chí hoàn thành.

### Bước 3 — Content author

Viết lại nội dung trong `content/chapters/` và tạo
`content/problem_manifest.yaml`. Mỗi bài có ID ổn định, mục tiêu, đề, đáp án,
lời giải, độ khó và trạng thái originality. Đáp án phải sinh từ cùng một
problem record, không gõ lại tách rời.

Gate: đủ coverage, không placeholder, nội dung và đáp án có thể parse, chưa có
trạng thái `approved_for_release` nếu chưa review.

### Bước 4 — Figure author

Vẽ mới hình cần thiết, lưu vào `figures/` và lập `figure_manifest.yaml`. Mỗi
hình phải có mục đích sư phạm, mô tả hình học, file, alt text và trạng thái
kiểm duyệt.

Gate: mọi `figure_id` trong content đều resolve tới file mới; không dùng hình
nguồn; hình đủ rõ để in và không có text khó đọc.

### Bước 5 — Math/editorial reviewer

Kiểm tra độc lập nội dung, công thức, đề, đáp án, lời giải, chính tả, thuật ngữ,
coverage và originality. Ghi kết quả vào:

- `reviews/math_editorial_review.md`
- `reviews/originality_review.md`

Gate: không còn lỗi blocker; các cảnh báo similarity đã được xử lý hoặc được
người duyệt chấp thuận có ghi lý do.

### Bước 6 — DOCX builder

Tạo một tài liệu mới từ content/manifest và token trong `docs/design.md`. Không
copy body của DOCX nguồn. Có thể dùng reference DOCX để distill package/style,
nhưng nguồn phải giữ nguyên và nội dung mới phải đi qua skeleton mới.

Output:

```text
layout/book.docx
layout/answer_key.docx
layout/cover.png
```

Trước authoring đầu tiên, tuân thủ Documents skill và chạy marker operation
đúng một lần. Dùng Word fields cho page number, OMML cho math, numbering thật
cho list và geometry tường minh cho table.

Gate: DOCX mở được, cấu trúc đầy đủ, không thiếu content/figure/answer link,
không chỉnh sửa tài liệu nguồn.

### Bước 7 — Render QA

Render mỗi DOCX bằng `render_docx.py`, tùy chọn `--emit_pdf`, tạo PNG trong
`qa/render/`. Chạy các audit cấu trúc phù hợp và ghi:

- `qa/structural_audit.md`
- `qa/visual_qa.md`

Kiểm tra mọi trang ở 100%, tối thiểu gồm bìa, trang mở đầu chương, trang có
bảng, công thức, hình, section break và trang cuối. Nếu có lỗi, quay lại
DOCX builder, sửa, render lại toàn bộ.

Gate: không clipping, overlap, lỗi font, bảng/hình vỡ hoặc page break không chấp
nhận; DOCX/PDF đều mở được và đủ trang.

### Bước 8 — Human release

Release manager đọc manifest, QA reports và yêu cầu người duyệt xác nhận nội
dung/toán học/biên tập/quyền sử dụng. Chỉ sau khi có xác nhận mới tạo package
trong `sources/final_docs/<book_id>/` và chuyển trạng thái
`approved_for_release`.

## 4. Hợp đồng artifact

### `source_map.yaml`

Mỗi record phải có: `source_file`, `grade`, `volume`, `chapter`, `lesson`,
`content_types`, `concepts`, `skills`, `answer_pair`, `reference_role`.

`reference_role` chỉ nhận `coverage`, `pedagogy`, `difficulty`, `visual_style`
hoặc `brand`; không nhận `copy_source`.

### `curriculum_map.yaml`

Mỗi lesson phải có: `lesson_id`, `chapter_id`, `objectives`, `concepts`,
`skills`, `difficulty_range`, `exercise_blueprint`, `figure_requirements` và
`coverage_status`.

### `problem_manifest.yaml`

Mỗi bài phải có: `problem_id`, `lesson_id`, `type`, `objective`, `difficulty`,
`content_path`, `answer`, `solution_path`, `figure_id`, `source_concept_refs`,
`originality_status`, `math_review_status`, `editorial_status`.

`source_concept_refs` chỉ trỏ tới concept/skill trong source map; không trỏ tới
đoạn văn nguồn để tái sử dụng.

### `figure_manifest.yaml`

Mỗi hình phải có: `figure_id`, `purpose`, `geometry_description`, `file_path`,
`format`, `alt_text`, `source_reference`, `is_new_artwork`, `review_status`.

### `release_manifest.yaml`

Phải có: `book_id`, `title`, `version`, `language`, `input_inventory`,
`output_files`, `sha256`, `qa_status`, `human_approver`, `approval_timestamp`,
`publication_status` và `known_deviations`.

## 5. Output release chuẩn

```text
sources/final_docs/toan6-tap1/
├── Toan6_CacChuyenDeCoBan_Tap1.docx
├── Toan6_CacChuyenDeCoBan_Tap1.pdf
├── Toan6_CacChuyenDeCoBan_Tap1_DapAn.docx
├── Toan6_CacChuyenDeCoBan_Tap1_DapAn.pdf
├── cover.png
└── RELEASE_MANIFEST.yaml
```

Không đưa PNG render trung gian, source map, nội dung làm việc hoặc review nội
bộ vào package xuất bản.

## 6. Quy tắc retry và versioning

- Mỗi lần sửa sau review tạo `run_id` mới hoặc revision rõ ràng; không ghi đè
  lịch sử QA đã có.
- Nếu chỉ lỗi layout, giữ nguyên content/problem IDs và chạy lại từ DOCX builder.
- Nếu lỗi đáp án/công thức, quay lại content author và bắt buộc chạy lại math
  review trước khi dựng DOCX.
- Nếu lỗi similarity, quay lại content author/figure author, không chỉ sửa tên
  biến hoặc số liệu.
- Mọi thay đổi thiết kế làm tăng/giảm page geometry phải cập nhật design token
  và rerun toàn bộ render QA.

