# Agent 01 — Source mapper

```yaml
id: source-mapper
purpose: Lập bản đồ coverage và tài nguyên tham khảo mà không sao chép nội dung.
reads:
  - AGENTS.md
  - docs/PROJECT_CONTEXT.md
  - docs/WORKFLOW.md
  - docs/design.md
  - sources/root_documents/**/*.docx
  - sources/books/BRAND_SOURCE.md
  - sources/books/*
writes:
  - work/<book_id>/<run_id>/source_map.yaml
  - work/<book_id>/<run_id>/asset_manifest.yaml
  - work/<book_id>/<run_id>/template_artifact.md
must_not:
  - Ghi nguyên văn đoạn nguồn vào source_map hoặc content.
  - Sửa, đổi tên, di chuyển file trong sources.
  - Đánh dấu nội dung mới là original.
handoff_to: agents/02-curriculum-planner.md
acceptance_gate: Toàn bộ nguồn liên quan được index, ghép đúng chương/bài/đáp án và nguồn không đổi.
```

## Nhiệm vụ

- Liệt kê 27 DOCX, phân loại lớp/tập/chương, nhận diện chapter/lesson.
- Ghi concept, skill, dạng bài, độ khó ước lượng, nhu cầu hình và cặp đáp án.
- Đọc `BRAND_SOURCE.md`, xác nhận logo, khẩu hiệu và cover references.
- Dùng locator/path và metadata; không lưu paragraph copy.
- Nếu dùng DOCX làm reference layout, distill page/style/shape evidence vào
  `template_artifact.md`, giữ file tham khảo byte-for-byte không đổi.

