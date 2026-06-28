#!/usr/bin/env python3
"""Seed nội dung pilot Mini-Wiki (phase 1 scaffold). Ghi YAML vào content/labs/mini-wiki."""
import os
import yaml

ROOT = os.path.join(os.path.dirname(__file__), "..", "content", "labs", "mini-wiki")


def dump(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        yaml.safe_dump(data, f, allow_unicode=True, sort_keys=False, width=100)


def prose(text):
    return {"type": "prose", "content": text}


def command(text):
    return {"type": "command", "content": text}


def callout(variant, text):
    return {"type": "callout", "variant": variant, "content": text}


def code(lang, filename, text):
    return {"type": "code", "lang": lang, "filename": filename, "content": text}


def diagram(text):
    return {"type": "diagram", "content": text}


def brief(blocks_extra=None):
    return blocks_extra or []


# ---- lab.yaml ----
dump(os.path.join(ROOT, "lab.yaml"), {
    "id": "mini-wiki",
    "title": "Xây dựng Mini-Wiki",
    "category": "dev",
    "complexity": "trung-cap",
    "est_hours": 10,
    "description": "CRUD Bài viết + Tag + Markdown + Search + Deploy theo quy trình PTPM — copy theo là chạy.",
    "repo_solution": "https://github.com/KouTaru99/mini-wiki",
    "tags": ["nodejs", "react", "postgresql", "docker", "typescript"],
})

# ---- stages ----
STAGES = [
    ("01-requirements", "requirements", 1, "Ý tưởng & Yêu cầu", "Làm rõ mình xây cái gì, cho ai, gồm những gì."),
    ("02-design", "design", 2, "Thiết kế & ADR", "Chốt cấu trúc dữ liệu, hợp đồng API và các quyết định kỹ thuật."),
    ("03-backend", "backend", 3, "Backend + Cơ sở dữ liệu", "Dựng REST API + schema database chạy được."),
    ("04-frontend", "frontend", 4, "Frontend", "Giao diện React đọc/ghi qua API."),
    ("05-testing", "testing", 5, "Kiểm thử", "Viết test + review trước khi giao."),
    ("06-deploy", "deploy", 6, "Đóng gói & Deploy", "Đóng gói Docker và đưa lên cloud."),
]
for folder, sid, order, title, desc in STAGES:
    dump(os.path.join(ROOT, "stages", folder, "stage.yaml"),
         {"id": sid, "order": order, "title": title, "description": desc})


def step(folder, n, sid, title, order, est, goal, deliverable, outcome, blocks, commit=None):
    data = {
        "id": sid,
        "title": title,
        "order": order,
        "est_minutes": est,
    }
    if commit:
        data["commit_ref"] = commit
    data.update({
        "goal": goal,
        "deliverable": deliverable,
        "outcome_preview": outcome,
        "blocks": blocks,
    })
    dump(os.path.join(ROOT, "stages", folder, f"{n:02d}.yaml"), data)


# ===== Chặng 1 — Yêu cầu =====
step("01-requirements", 1, "req-01", "Viết yêu cầu sản phẩm", 1, 20,
     "Viết file requirements.md mô tả Mini-Wiki làm được gì.",
     "docs/requirements.md liệt kê tính năng + user story.",
     "Bạn sẽ có 1 file mô tả rõ phạm vi để không lạc hướng khi code.",
     [prose("Mini-Wiki là nơi lưu các bài viết ngắn, mỗi bài gắn vài tag để lọc và tìm. "
            "Trước khi code, ta viết ra cho rõ: ai dùng, làm được gì, không làm gì.")])

step("01-requirements", 2, "req-02", "Phác sơ đồ thực thể (ERD)", 2, 20,
     "Vẽ sơ đồ quan hệ giữa Bài viết và Tag.",
     "docs/erd.md có sơ đồ Mermaid 3 bảng.",
     "Bạn sẽ thấy rõ Bài viết và Tag nối nhau kiểu nhiều-nhiều.",
     [prose("Một bài có nhiều tag, một tag thuộc nhiều bài — quan hệ nhiều-nhiều, cần bảng nối."),
      diagram("erDiagram\n  ARTICLES ||--o{ ARTICLE_TAGS : has\n  TAGS ||--o{ ARTICLE_TAGS : has")])

step("01-requirements", 3, "req-03", "Phác hợp đồng API", 3, 15,
     "Liệt kê các endpoint API sẽ cần.",
     "docs/api.md liệt kê method + path.",
     "Bạn sẽ có danh sách API để bám theo khi viết backend.",
     [prose("Liệt kê trước các endpoint: CRUD bài viết, CRUD tag, tìm kiếm. "
            "Có danh sách này thì viết code không bị thiếu.")])

# ===== Chặng 2 — Thiết kế =====
step("02-design", 1, "des-01", "Viết ADR chọn techstack", 1, 20,
     "Ghi lại quyết định chọn công nghệ và lý do.",
     "docs/adr/ADR-001.md theo mẫu Context → Options → Decision.",
     "Bạn sẽ tập thói quen ghi lại 'vì sao chọn', đúng cách kỹ sư thật.",
     [prose("ADR (Architecture Decision Record) ghi lại một quyết định kỹ thuật + lý do, "
            "để sau này nhìn lại biết vì sao đã chọn vậy.")])

step("02-design", 2, "des-02", "Chốt hợp đồng API chi tiết", 2, 25,
     "Định nghĩa request/response cho từng endpoint.",
     "docs/api.md đầy đủ schema + mã lỗi.",
     "Bạn sẽ biết chính xác mỗi API nhận gì, trả gì trước khi code.",
     [prose("Hợp đồng API rõ ràng giúp frontend và backend làm song song mà không chờ nhau.")])

# ===== Chặng 3 — Backend (be-02 là bài CHI TIẾT showcase) =====
step("03-backend", 1, "be-01", "Khởi tạo project Express + TypeScript", 1, 30,
     "Dựng bộ khung server Express bằng TypeScript.",
     "api/ chạy được, mở http://localhost:3000 trả về 'OK'.",
     "Bạn sẽ thấy server in ra 'listening on 3000' khi chạy.",
     [prose("Khởi tạo project Node + TypeScript và cài Express."),
      command("npm init -y && npm install express && npm install -D typescript @types/express tsx"),
      callout("tip", "Nếu thiếu lệnh node, cài Node 20 LTS từ nodejs.org trước.")],
     commit="a1b2c3d")

step("03-backend", 2, "be-02", "Thiết kế & tạo schema cơ sở dữ liệu", 2, 45,
     "Tạo 3 bảng cơ sở dữ liệu để lưu Bài viết, Tag và quan hệ giữa chúng. Copy đúng các lệnh bên dưới là xong — chưa cần tự nghĩ cấu trúc.",
     "3 bảng articles, tags, article_tags đã có trong CSDL.",
     "Gõ \\dt trong CSDL hiện ra đúng 3 bảng vừa tạo.",
     [
        prose("Mini-Wiki cần lưu bài viết và các tag gắn vào bài. Một bài có nhiều tag, một tag thuộc "
              "nhiều bài — đây là quan hệ nhiều-nhiều, cần một bảng nối."),
        callout("info", "Bảng nối giống một quyển sổ ghi 'bài nào — tag nào', mỗi dòng là một cặp."),
        diagram("erDiagram\n  ARTICLES ||--o{ ARTICLE_TAGS : \"\"\n  TAGS ||--o{ ARTICLE_TAGS : \"\""),
        code("sql", "db/schema.sql",
             "CREATE TABLE articles (\n"
             "  id          SERIAL       PRIMARY KEY,\n"
             "  title       VARCHAR(255) NOT NULL,\n"
             "  slug        VARCHAR(255) NOT NULL UNIQUE,\n"
             "  content     TEXT         NOT NULL,\n"
             "  created_at  TIMESTAMPTZ  DEFAULT now()\n"
             ");"),
        prose("Khởi động PostgreSQL bằng Docker để có nơi chạy các lệnh trên:"),
        command("docker compose up -d db"),
        prose("Kết quả mong đợi: terminal in `Container db Started` — CSDL đã chạy, sẵn sàng nhận lệnh tạo bảng."),
        callout("warning", "Đừng nhét tag vào một cột text của bài viết (vd 'java,web') — sẽ không lọc/đếm "
                "theo tag được. Luôn tách bảng nối article_tags."),
     ],
     commit="d4e5f6a")

step("03-backend", 3, "be-03", "Viết CRUD API cho Bài viết", 3, 45,
     "Viết 5 endpoint CRUD cho Bài viết.",
     "api/src/routes/articles.ts chạy được, test bằng curl.",
     "Bạn sẽ gọi được POST /api/articles và thấy bài vừa tạo trả về JSON.",
     [prose("Express Router gom các endpoint liên quan vào một file cho gọn."),
      command("curl -X POST localhost:3000/api/articles -H 'Content-Type: application/json' -d '{\"title\":\"Test\"}'")],
     commit="b7c8d9e")

step("03-backend", 4, "be-04", "Tag & quan hệ nhiều-nhiều", 4, 35,
     "Thêm CRUD cho Tag và gắn tag vào bài.",
     "Gắn/bỏ tag cho một bài hoạt động đúng.",
     "Bạn sẽ thấy một bài viết kèm danh sách tag khi gọi API.",
     [prose("Dùng bảng nối article_tags để gắn tag — thêm/xoá cặp (article_id, tag_id).")],
     commit="c1d2e3f")

step("03-backend", 5, "be-05", "Tìm kiếm full-text (PostgreSQL FTS)", 5, 30,
     "Thêm endpoint tìm kiếm bài theo từ khoá.",
     "GET /api/search?q=... trả về bài khớp.",
     "Bạn sẽ gõ từ khoá và thấy danh sách bài chứa từ đó.",
     [prose("PostgreSQL có sẵn full-text search — không cần cài thêm công cụ ngoài.")],
     commit="e4f5a6b")

# ===== Chặng 4 — Frontend =====
step("04-frontend", 1, "fe-01", "Khởi tạo React + Vite", 1, 25,
     "Dựng bộ khung frontend React bằng Vite.",
     "web/ chạy, mở http://localhost:5173 thấy trang trắng có tiêu đề.",
     "Bạn sẽ thấy trang React chạy với hot-reload.",
     [prose("Vite cho trải nghiệm dev nhanh, hot-reload gần như tức thì."),
      command("npm create vite@latest web -- --template react-ts")])

step("04-frontend", 2, "fe-02", "Trang danh sách bài viết", 2, 35,
     "Gọi API và hiển thị danh sách bài.",
     "Trang chủ web hiện danh sách bài từ backend.",
     "Bạn sẽ thấy các bài viết vừa tạo hiện lên giao diện.",
     [prose("Dùng fetch gọi GET /api/articles rồi render ra danh sách.")])

# ===== Chặng 5 — Kiểm thử =====
step("05-testing", 1, "test-01", "Viết test cho API", 1, 40,
     "Viết integration test cho các endpoint.",
     "npm test xanh toàn bộ.",
     "Bạn sẽ thấy báo cáo test pass cho các API.",
     [prose("Dùng Vitest + Supertest gọi thẳng API và kiểm tra phản hồi.")])

# ===== Chặng 6 — Deploy =====
step("06-deploy", 1, "dep-01", "Đóng gói Docker", 1, 30,
     "Viết Dockerfile + docker-compose cho toàn bộ app.",
     "docker compose up chạy cả api + web + db.",
     "Bạn sẽ thấy cả 3 service lên cùng lúc bằng một lệnh.",
     [prose("docker-compose gom api, web, db vào một lệnh khởi động duy nhất."),
      command("docker compose up -d")])

print("seed done ->", os.path.relpath(ROOT))
