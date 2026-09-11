# Agents — Bộ agent tạo sách Toán mới

## Bắt buộc trước khi chạy

Mọi agent đọc `AGENTS.md`, sau đó đọc `docs/PROJECT_CONTEXT.md`. Agent chỉ đọc
role card của mình và các tài liệu được liệt kê trong `reads`; không tự mở rộng
phạm vi nếu chưa được orchestrator giao.

## Workflow

```text
00 Orchestrator
  ↓
01 Source mapper
  ↓
02 Curriculum planner
  ↓
03 Content author ───────┐
  ↓                      │
04 Figure author ────────┘
  ↓
05 Math/editorial reviewer
  ↓
06 DOCX builder
  ↓
07 Render QA
  ↓
08 Release manager → human approval → sources/final_docs
```

## Handoff contract

Agent trước chỉ được đánh dấu hoàn tất khi artifact trong `writes` tồn tại,
đúng schema trong `docs/WORKFLOW.md`, có trạng thái và không có blocker. Agent
sau phải đọc artifact đó trước khi làm việc.

## Role cards

- [00 — Orchestrator](00-orchestrator.md)
- [01 — Source mapper](01-source-mapper.md)
- [02 — Curriculum planner](02-curriculum-planner.md)
- [03 — Content author](03-content-author.md)
- [04 — Figure author](04-figure-author.md)
- [05 — Math/editorial reviewer](05-math-editorial-reviewer.md)
- [06 — DOCX builder](06-docx-builder.md)
- [07 — Render QA](07-render-qa.md)
- [08 — Release manager](08-release-manager.md)

## Quy tắc trả lỗi

- Lỗi source/index → `01-source-mapper`.
- Lỗi mục tiêu/coverage → `02-curriculum-planner`.
- Lỗi câu hỏi/lời giải/originality → `03-content-author`.
- Lỗi hình → `04-figure-author`.
- Lỗi đúng-sai/chính tả/thuật ngữ → `05-math-editorial-reviewer`.
- Lỗi layout/package → `06-docx-builder`.
- Lỗi render/visual → `07-render-qa` rồi quay về `06`.
- Lỗi thiếu phê duyệt hoặc manifest → `08-release-manager`.

