# AGENTS.md — Dự án sách Toán Hùng Cường

## Mục đích

Đây là context bắt buộc cho mọi agent làm việc trong repository này. Dự án tạo
bộ sách Toán mới có chương trình và mục tiêu giảng dạy tương đương tài liệu
tham khảo, nhưng nội dung, dữ liệu, hình và lời giải phải được biên soạn độc
lập.

## Thứ tự đọc context

Trước khi thực hiện bất kỳ bước nào, agent phải đọc theo thứ tự:

1. `AGENTS.md` — nguyên tắc chung và ranh giới an toàn.
2. `docs/PROJECT_CONTEXT.md` — sự thật về repository, nguồn và output.
3. Tài liệu liên quan trong `docs/WORKFLOW.md` — bước hiện tại và cổng bàn giao.
4. `docs/design.md` — hệ thống thiết kế sách.
5. `docs/ORIGINALITY_POLICY.md` — quy tắc nội dung độc lập.
6. Role card tương ứng trong `agents/`.

Agent điều phối có thể yêu cầu đọc thêm `docs/QA_RELEASE_CHECKLIST.md` trước
các bước review hoặc release.

## Nguồn dữ liệu và quyền chỉnh sửa

- `sources/root_documents/` là nguồn tham khảo chỉ đọc để lập bản đồ chương,
  bài, mục tiêu, kỹ năng và dạng bài.
- `sources/books/` là nguồn nhận diện thương hiệu và reference hình ảnh. Có thể
  dùng logo thương hiệu theo `BRAND_SOURCE.md`; bìa Toán 7 chỉ được dùng làm
  reference, không được sao chép làm nền bìa mới. Hiện workspace chỉ có
  `bia_toan7_ref_02.png`; nếu `bia_toan7_ref_01.png` được bổ sung sau, nó vẫn
  chỉ là reference phụ.
- `docs/STYLE_GUIDE_HUNG_CUONG_DOCS.md` là bằng chứng thiết kế gốc; các token
  đã chuẩn hóa trong `docs/design.md` là quy chuẩn triển khai.
- `sources/final_docs/` chỉ nhận artifact đã vượt qua toàn bộ cổng QA và được
  người duyệt xác nhận.
- Không sửa, đổi tên, di chuyển hoặc ghi đè file trong `sources/root_documents`
  và `sources/books`.

## Quy tắc biên soạn độc lập

Chỉ giữ mục tiêu giảng dạy, kiến thức, kỹ năng, dạng bài và mức độ phù hợp
chương trình. Phải tự viết lại câu chữ, ngữ cảnh, dữ kiện, thứ tự, phương án,
cách giải và hình. Không được tạo sách bằng cách sao chép văn bản, thay số,
đổi tên biến hoặc dùng lại hình/bố cục đặc trưng của nguồn. Chi tiết kiểm tra
nằm trong `docs/ORIGINALITY_POLICY.md`.

Quy trình này làm giảm rủi ro sao chép nhưng không phải chứng nhận pháp lý.
Không được gắn trạng thái phát hành nếu chưa có người duyệt nội dung và quyền
sử dụng.

## Quy tắc vận hành agent

- Mỗi agent chỉ ghi vào các path nằm trong `writes` của role card.
- Mọi bàn giao phải có artifact cụ thể, trạng thái và ghi chú lỗi còn tồn tại.
- Khi phát hiện lỗi, trả về agent gần nhất có thể sửa lỗi; không tự ý bỏ qua
  cổng QA.
- Không đưa nguyên văn tài liệu nguồn vào `content/`, `final_docs/` hoặc prompt
  cho agent sau.
- Không hard-code số trang; page number trong DOCX phải là field của Word.
- Công thức phải là Word Equation/OMML khi định dạng DOCX, không biến công thức
  thành ảnh nếu không có lý do kỹ thuật rõ ràng.
- Hình mới ưu tiên SVG/EMF/PNG nét cao, nền trắng hoặc trong suốt và có alt
  text trong manifest.

## Quy tắc authoring và render DOCX

Khi bắt đầu authoring DOCX, agent phải tuân theo Documents skill của môi
trường:

- Dùng runtime/dependency loader được chỉ định bởi skill, không tự dùng package
  global hoặc runtime hệ thống cho phần authoring.
- Chạy `mark_artifact_operation_started.mjs` đúng một lần ngay trước lệnh
  authoring đầu tiên.
- Sau mỗi batch thay đổi có ý nghĩa, chạy `render_docx.py`, tạo PNG và kiểm tra
  trực quan mọi trang ở mức 100%.
- Sửa và render lại cho tới khi không còn clipping, overlap, lỗi font, bảng vỡ,
  hình tràn hoặc page break bất hợp lý.
- Artifact render trung gian nằm trong `work/`, không đưa vào `final_docs`.

## Điểm vào

- Bối cảnh dự án: `docs/PROJECT_CONTEXT.md`
- Thiết kế: `docs/design.md`
- Quy trình: `docs/WORKFLOW.md`
- Chính sách originality: `docs/ORIGINALITY_POLICY.md`
- QA/release: `docs/QA_RELEASE_CHECKLIST.md`
- Điều phối agent: `agents/README.md`
