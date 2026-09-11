# QA_RELEASE_CHECKLIST — Checklist sách Toán Hùng Cường

Điền trạng thái `PASS`, `FAIL`, `N/A` và ghi evidence path cho từng nhóm. Một
item `FAIL` blocker phải được sửa trước khi release.

## 1. Nguồn và coverage

- [ ] Tất cả file nguồn liên quan đã được lập chỉ mục.
- [ ] Đường dẫn Unicode và thư mục `Toán 8 ` được xử lý đúng.
- [ ] Chương/bài/đáp án được ghép đúng.
- [ ] `curriculum_map.yaml` bao phủ đủ mục tiêu và dạng bài pilot.
- [ ] Nguồn trong `sources/root_documents` không bị thay đổi.

## 2. Nội dung và originality

- [ ] Lý thuyết được diễn đạt lại bằng câu chữ mới.
- [ ] Mọi bài tập có dữ kiện/ngữ cảnh/cấu trúc mới phù hợp.
- [ ] Không có paragraph nguồn bị copy nguyên văn.
- [ ] Không có bài chỉ thay số hoặc đổi tên biến.
- [ ] Trắc nghiệm có stem và phương án được biên soạn lại.
- [ ] Similarity/exact duplicate review đã hoàn tất.
- [ ] Cảnh báo similarity đã được xử lý hoặc escalated có lý do.
- [ ] Không dùng hình nguồn; logo thương hiệu là asset được phép duy nhất nếu
  không có phê duyệt khác.
- [ ] Người duyệt đã xác nhận originality ở mức editorial.

## 3. Toán học và biên tập

- [ ] Mỗi đề có đủ dữ kiện và điều kiện.
- [ ] Đáp án khớp với đề mới.
- [ ] Lời giải có bước hợp lệ và không mâu thuẫn.
- [ ] Công thức, ký hiệu, đơn vị và thuật ngữ đúng.
- [ ] Độ khó và coverage khớp curriculum map.
- [ ] Không còn placeholder, TODO hoặc text debug.
- [ ] Chính tả, dấu câu và cách viết tiếng Việt đã review.

## 4. Hình và asset

- [ ] Mọi `figure_id` đều resolve.
- [ ] Hình mới có file, format, alt text và mục đích sư phạm.
- [ ] Nét, nhãn, ký hiệu và caption đọc được khi in.
- [ ] Hình không chồng chữ, không tràn lề.
- [ ] Bìa có bố cục/minh họa mới.
- [ ] Logo và khẩu hiệu dùng đúng brand source.

## 5. DOCX cấu trúc

- [ ] Khổ A4 dọc và lề đúng `docs/design.md`.
- [ ] Body là Times New Roman 13 pt; math là Cambria Math/OMML.
- [ ] Header/footer đúng màu, text và vị trí.
- [ ] Page number là Word field, không hard-code.
- [ ] Heading, badge, section tab và inline label đúng hierarchy.
- [ ] Bảng có Table Grid, geometry tường minh, không clipping.
- [ ] List dùng numbering thật, không dùng bullet/number giả.
- [ ] Không có tracked changes, comments hoặc metadata không mong muốn.
- [ ] DOCX mở được bằng LibreOffice/Word-compatible reader.

## 6. PDF/render trực quan

- [ ] Đã chạy `render_docx.py` với output PNG.
- [ ] Đã kiểm tra mọi trang ở mức 100%.
- [ ] Không clipping, overlap, lỗi font hoặc glyph mất.
- [ ] Không có page break gây mất ngữ cảnh.
- [ ] Bảng, hình, caption và header/footer hiển thị đúng.
- [ ] Bìa, trang đầu chương, trang công thức, trang bảng/hình, trang chuyển
  section và trang cuối đều đạt.
- [ ] PDF không rỗng, đủ trang và mở được.

## 7. Release package

- [ ] Sách chính có DOCX và PDF.
- [ ] Đáp án có DOCX và PDF.
- [ ] `cover.png` là bìa mới và đúng metadata lớp/tập.
- [ ] `RELEASE_MANIFEST.yaml` có hash, QA status và approver.
- [ ] Không đưa render trung gian hoặc source content vào package.
- [ ] `publication_status: approved_for_release` chỉ xuất hiện sau khi người
  duyệt xác nhận.
- [ ] Tên file và thư mục đúng quy ước.

