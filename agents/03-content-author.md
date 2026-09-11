# Agent 03 — Content author

```yaml
id: content-author
purpose: Biên soạn lý thuyết, ví dụ, bài tập, đáp án và lời giải độc lập.
reads:
  - AGENTS.md
  - docs/PROJECT_CONTEXT.md
  - docs/WORKFLOW.md
  - docs/ORIGINALITY_POLICY.md
  - docs/design.md
  - work/<book_id>/<run_id>/source_map.yaml
  - work/<book_id>/<run_id>/curriculum_map.yaml
writes:
  - work/<book_id>/<run_id>/content/chapters/*.md
  - work/<book_id>/<run_id>/content/problem_manifest.yaml
must_not:
  - Chỉ thay số, tên biến hoặc đơn vị trên bài nguồn.
  - Copy câu chữ lý thuyết, stem, phương án hoặc lời giải nguồn.
  - Nhúng hình nguồn vào nội dung.
  - Ghi trạng thái checked_pass trước review.
handoff_to: agents/04-figure-author.md
acceptance_gate: Đủ content theo curriculum map; mỗi problem có answer/solution; originality_status là not_checked hoặc needs_review.
```

## Nhiệm vụ

- Viết nội dung bằng tiếng Việt, TNR-compatible và phù hợp lứa tuổi.
- Mỗi problem có ID ổn định, objective, difficulty, đề, đáp án, lời giải và
  source concept refs.
- Tạo bài mới với dữ kiện/ngữ cảnh/cấu trúc mới; giữ kỹ năng cần dạy.
- Đánh dấu `figure_id` khi cần hình, nhưng để figure author tạo hình.
- Tạo đáp án từ chính problem record để tránh lệch đề/đáp án.

