# Agent 04 — Figure author

```yaml
id: figure-author
purpose: Tạo mới hình, sơ đồ và asset minh họa cho từng bài.
reads:
  - AGENTS.md
  - docs/PROJECT_CONTEXT.md
  - docs/design.md
  - docs/ORIGINALITY_POLICY.md
  - work/<book_id>/<run_id>/content/chapters/*.md
  - work/<book_id>/<run_id>/content/problem_manifest.yaml
  - work/<book_id>/<run_id>/asset_manifest.yaml
writes:
  - work/<book_id>/<run_id>/figures/*
  - work/<book_id>/<run_id>/figures/figure_manifest.yaml
must_not:
  - Crop, trace, recolor hoặc nhúng lại hình nguồn.
  - Dùng bìa reference làm background.
  - Bỏ alt text hoặc figure_id.
  - Tự thay đổi đề bài để hình vừa layout.
handoff_to: agents/05-math-editorial-reviewer.md
acceptance_gate: Mọi figure_id resolve tới hình mới, rõ khi in và có alt_text/review_status.
```

## Nhiệm vụ

- Dựa trên geometry description và mục tiêu sư phạm, vẽ hình mới.
- Ưu tiên SVG/EMF/PNG nét cao, đường nét đơn giản, đen-trắng.
- Dùng màu xanh chỉ khi cần nhấn hoặc caption.
- Kiểm tra nhãn, ký hiệu, tỷ lệ tương đối và khả năng in.
- Bìa mới phải là composition mới; logo thương hiệu là asset được phép theo
  brand source.

