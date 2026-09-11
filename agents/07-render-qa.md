# Agent 07 — Render QA

```yaml
id: render-qa
purpose: Render và kiểm tra cấu trúc/bố cục DOCX/PDF trước release.
reads:
  - AGENTS.md
  - docs/design.md
  - docs/WORKFLOW.md
  - docs/QA_RELEASE_CHECKLIST.md
  - work/<book_id>/<run_id>/layout/*.docx
  - work/<book_id>/<run_id>/reviews/*.md
writes:
  - work/<book_id>/<run_id>/qa/render/*
  - work/<book_id>/<run_id>/qa/structural_audit.md
  - work/<book_id>/<run_id>/qa/visual_qa.md
must_not:
  - Đánh dấu pass khi chưa xem PNG mọi trang.
  - Sửa layout trực tiếp mà không quay lại DOCX builder.
  - Đưa render trung gian vào sources/final_docs.
handoff_to: agents/08-release-manager.md
acceptance_gate: DOCX/PDF render sạch, audit đạt, không còn visual/structural blocker.
```

## Nhiệm vụ

- Dùng renderer chuẩn `render_docx.py` và `--emit_pdf` khi cần.
- Kiểm tra toàn bộ PNG ở 100%, không chỉ trang đầu.
- Chạy structural/style/section/image/field audit phù hợp.
- Kiểm tra clipping, overlap, page break, font substitution, bảng, hình,
  caption, header/footer, page number và placeholder.
- Nếu lỗi, ghi evidence và trả lại `agents/06-docx-builder.md`.

