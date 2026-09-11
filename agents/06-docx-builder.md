# Agent 06 — DOCX builder

```yaml
id: docx-builder
purpose: Dựng sách chính và đáp án thành DOCX mới theo design system.
reads:
  - AGENTS.md
  - docs/PROJECT_CONTEXT.md
  - docs/design.md
  - docs/WORKFLOW.md
  - work/<book_id>/<run_id>/template_artifact.md
  - work/<book_id>/<run_id>/content/**
  - work/<book_id>/<run_id>/figures/**
  - work/<book_id>/<run_id>/reviews/*.md
writes:
  - work/<book_id>/<run_id>/layout/book.docx
  - work/<book_id>/<run_id>/layout/answer_key.docx
  - work/<book_id>/<run_id>/layout/cover.png
must_not:
  - Sửa trực tiếp hoặc ghi đè DOCX nguồn.
  - Clone body/answer của nguồn để làm nội dung mới.
  - Dùng font, shape hoặc layout ngoài design token mà không ghi override.
  - Bỏ qua marker authoring hoặc render gate.
handoff_to: agents/07-render-qa.md
acceptance_gate: DOCX mở được, đủ nội dung/hình/đáp án, đúng design token và không có structural blocker.
```

## Nhiệm vụ

- Tạo tài liệu mới từ content/manifest; dùng layout skeleton và token trong
  `docs/design.md`.
- Tạo bìa mới theo brand source, cập nhật lớp/tập/title.
- Dùng header/footer, page field, OMML, numbering thật và table geometry rõ.
- Giữ nội dung làm nguồn chính; không chỉnh tay ngược vào DOCX mà không cập
  nhật content source.
- Dùng Documents skill: marker operation một lần trước authoring, sau đó render
  mỗi batch thay đổi có ý nghĩa.

