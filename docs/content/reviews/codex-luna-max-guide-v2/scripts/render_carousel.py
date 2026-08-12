from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "generated"
OUT_DIR = ROOT / "output" / "carousel-v5"
FONT_PATH = Path(r"C:\Windows\Fonts\NotoSansKR-VF.ttf")

W, H = 1080, 1350
SAFE_X = 76

INK = (247, 244, 250)
MUTED = (196, 188, 206)
DIM = (158, 149, 169)
PURPLE = (145, 86, 255)
LAVENDER = (211, 181, 255)
PANEL = (18, 16, 23, 244)
PANEL_STROKE = (101, 88, 120, 255)


def fnt(size: int, weight: str = "Regular") -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(FONT_PATH), size=size)
    try:
        font.set_variation_by_name(weight)
    except OSError:
        pass
    return font


F = {
    "eyebrow": fnt(22, "Bold"),
    "footer": fnt(22, "Medium"),
    "footer_num": fnt(21, "Bold"),
    "title": fnt(62, "Black"),
    "cover": fnt(65, "Black"),
    "subtitle": fnt(29, "Bold"),
    "body": fnt(28, "Medium"),
    "body_bold": fnt(31, "Bold"),
    "panel_title": fnt(31, "Bold"),
    "panel_body": fnt(29, "Medium"),
    "panel_small": fnt(28, "Medium"),
    "number": fnt(25, "Bold"),
    "code": fnt(31, "Medium"),
    "code_bold": fnt(31, "Bold"),
    "keyword": fnt(62, "Black"),
}


def centered_text(
    draw: ImageDraw.ImageDraw,
    center: tuple[float, float],
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int] | tuple[int, int, int, int],
) -> None:
    bbox = draw.textbbox((0, 0), text, font=font)
    x = center[0] - (bbox[0] + bbox[2]) / 2
    y = center[1] - (bbox[1] + bbox[3]) / 2
    draw.text((x, y), text, font=font, fill=fill)


def text_block(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int] | tuple[int, int, int, int],
    spacing: int = 8,
    align: str = "left",
) -> None:
    x1, y1, x2, y2 = box
    bbox = draw.multiline_textbbox((0, 0), text, font=font, spacing=spacing, align=align)
    bw = bbox[2] - bbox[0]
    bh = bbox[3] - bbox[1]
    if align == "center":
        x = x1 + (x2 - x1 - bw) / 2 - bbox[0]
    elif align == "right":
        x = x2 - bw - bbox[0]
    else:
        x = x1 - bbox[0]
    y = y1 + (y2 - y1 - bh) / 2 - bbox[1]
    draw.multiline_text((x, y), text, font=font, fill=fill, spacing=spacing, align=align)


def fit_art(path: Path, size: tuple[int, int], brightness: float = 1.0) -> Image.Image:
    art = Image.open(path).convert("RGB")
    art = ImageOps.fit(art, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    art = ImageEnhance.Contrast(art).enhance(1.06)
    art = ImageEnhance.Brightness(art).enhance(brightness)
    return art.filter(ImageFilter.UnsharpMask(radius=1.0, percent=115, threshold=4)).convert("RGBA")


def fade_mask(size: tuple[int, int], edge: int = 86, opacity: int = 230) -> Image.Image:
    w, h = size
    mask = Image.new("L", (w, h), 0)
    px = mask.load()
    for y in range(h):
        for x in range(w):
            d = min(x, y, w - 1 - x, h - 1 - y)
            px[x, y] = int(opacity * max(0, min(1, d / edge)))
    return mask.filter(ImageFilter.GaussianBlur(18))


def paste_art(
    canvas: Image.Image,
    path: Path,
    box: tuple[int, int, int, int],
    opacity: int = 225,
    brightness: float = 1.0,
) -> None:
    x1, y1, x2, y2 = box
    art = fit_art(path, (x2 - x1, y2 - y1), brightness=brightness)
    art.putalpha(fade_mask(art.size, opacity=opacity))
    canvas.alpha_composite(art, (x1, y1))


def base() -> Image.Image:
    img = Image.new("RGBA", (W, H), (7, 7, 10, 255))
    draw = ImageDraw.Draw(img, "RGBA")
    for y in range(H):
        t = y / (H - 1)
        draw.line((0, y, W, y), fill=(8 + int(3 * t), 7, 12 + int(5 * t), 255))
    return img


def rounded_panel(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    radius: int = 26,
    fill: tuple[int, int, int, int] = PANEL,
    outline: tuple[int, int, int, int] = PANEL_STROKE,
    width: int = 2,
) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def eyebrow(draw: ImageDraw.ImageDraw, text: str) -> None:
    bbox = draw.textbbox((0, 0), text, font=F["eyebrow"])
    width = bbox[2] - bbox[0] + 34
    height = 50
    draw.rounded_rectangle((SAFE_X, 54, SAFE_X + width, 54 + height), radius=25,
                           fill=(28, 22, 38, 242), outline=(120, 86, 154, 255), width=2)
    centered_text(draw, (SAFE_X + width / 2, 79), text, F["eyebrow"], LAVENDER)


def footer(draw: ImageDraw.ImageDraw, page: int) -> None:
    draw.text((SAFE_X, 1283), "@yohanstudio_ai", font=F["footer"], fill=MUTED)
    label = f"{page:02d} / 08"
    bbox = draw.textbbox((0, 0), label, font=F["footer_num"])
    draw.text((W - SAFE_X - (bbox[2] - bbox[0]), 1283), label, font=F["footer_num"], fill=MUTED)


def title(draw: ImageDraw.ImageDraw, text: str, y: int = 140) -> None:
    draw.multiline_text((SAFE_X, y), text, font=F["title"], fill=INK, spacing=9)


def number_circle(draw: ImageDraw.ImageDraw, center: tuple[int, int], number: str, size: int = 56) -> None:
    r = size // 2
    draw.ellipse((center[0] - r, center[1] - r, center[0] + r, center[1] + r),
                 fill=PURPLE, outline=(207, 178, 255, 255), width=2)
    centered_text(draw, center, number, F["number"], INK)


def card_01() -> Image.Image:
    img = fit_art(ASSET_DIR / "master-orbit.png", (W, H), brightness=0.92)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay, "RGBA")
    od.rectangle((0, 0, W, H), fill=(5, 5, 8, 82))
    for y in range(820):
        alpha = int(225 * (1 - y / 820))
        od.line((0, y, W, y), fill=(5, 5, 8, alpha))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img, "RGBA")
    eyebrow(draw, "CODEX · ORCHESTRATION GUIDE")
    draw.multiline_text((SAFE_X, 160), "Codex에서 Luna에\nMAX 추론을\n적용하는 방법",
                        font=F["cover"], fill=INK, spacing=10)
    draw.text((SAFE_X, 420), "Sol이 지휘하고 Luna가 구현합니다.", font=F["subtitle"], fill=INK)
    footer(draw, 1)
    return img


def card_02() -> Image.Image:
    img = base()
    paste_art(img, ASSET_DIR / "master-orbit.png", (500, 515, 1030, 1200), opacity=235, brightness=1.03)
    draw = ImageDraw.Draw(img, "RGBA")
    eyebrow(draw, "01 · ROLE MAP")
    title(draw, "Luna는 모델,\nMax는 추론\n강도입니다")

    panels = [
        ((76, 455, 487, 650), "SOL", "설계 · 분해 · 검증"),
        ((513, 455, 924, 650), "LUNA", "MAX 추론으로 구현"),
    ]
    for box, label, desc in panels:
        rounded_panel(draw, box, radius=24)
        x1, y1, x2, y2 = box
        text_block(draw, (x1 + 28, y1 + 22, x2 - 28, y1 + 91), label, F["panel_title"], LAVENDER)
        text_block(draw, (x1 + 28, y1 + 88, x2 - 28, y2 - 22), desc, F["panel_body"], INK)

    draw.multiline_text((SAFE_X, 760), "Sol이 지휘하고\nLuna가 구현합니다.",
                        font=F["body_bold"], fill=INK, spacing=5)
    draw.text((SAFE_X, 865), "Max는 Luna에 적용하는 추론 강도입니다.",
              font=F["panel_small"], fill=MUTED)
    footer(draw, 2)
    return img


def card_03() -> Image.Image:
    img = base()
    paste_art(img, ASSET_DIR / "task-lanes.png", (520, 330, 1050, 1110), opacity=230, brightness=1.02)
    draw = ImageDraw.Draw(img, "RGBA")
    eyebrow(draw, "02 · WORKFLOW")
    title(draw, "작업은 이렇게\n진행됩니다")

    items = [
        ((76, 430, 360, 625), "1", "SOL", "설계 · 작업 분해"),
        ((398, 430, 682, 625), "2", "LUNA", "MAX 추론 구현"),
        ((720, 430, 1004, 625), "3", "SOL", "검토 · 수정"),
    ]
    for box, number, label, desc in items:
        rounded_panel(draw, box, radius=24)
        x1, y1, x2, y2 = box
        number_circle(draw, (x1 + 48, y1 + 48), number, size=44)
        draw.text((x1 + 26, y1 + 86), label, font=F["panel_title"], fill=INK)
        text_block(draw, (x1 + 26, y1 + 126, x2 - 22, y2 - 20), desc,
                   F["panel_small"], MUTED, spacing=5)

    for x in (378, 700):
        draw.line((x - 9, 528, x + 9, 528), fill=(224, 199, 249, 255), width=3)
        draw.polygon(((x + 9, 528), (x + 1, 521), (x + 1, 535)), fill=(224, 199, 249, 255))

    draw.multiline_text((SAFE_X, 1085), "설계 → 구현 → 검토가\n하나의 흐름으로 이어집니다.",
                        font=F["body"], fill=INK, spacing=5)
    footer(draw, 3)
    return img


def code_panel(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    number: str,
    lines: tuple[str, str],
) -> None:
    rounded_panel(draw, box, radius=26, width=3)
    x1, y1, x2, y2 = box
    number_circle(draw, (x1 + 60, (y1 + y2) // 2), number, size=60)
    text_block(draw, (x1 + 110, y1 + 28, x2 - 28, y2 - 24), "\n".join(lines),
               F["code"], INK, spacing=10)


def card_04() -> Image.Image:
    img = base()
    draw = ImageDraw.Draw(img, "RGBA")
    eyebrow(draw, "03 · INSTALL")
    title(draw, "플러그인 등록은\n두 줄입니다")

    code_panel(draw, (76, 410, 1004, 610), "1", (
        "codex plugin marketplace add",
        "DannyMac180/sol-advisor --ref main",
    ))
    code_panel(draw, (76, 640, 1004, 840), "2", (
        "codex plugin add",
        "sol-advisor@sol-advisor",
    ))

    note = (76, 890, 1004, 1115)
    rounded_panel(draw, note, radius=26, width=3)
    draw.rounded_rectangle((76, 890, 83, 1115), radius=4, fill=PURPLE)
    draw.text((112, 925), "Luna 작업 경로만 사용하신다면", font=F["panel_body"], fill=LAVENDER)
    draw.multiline_text((112, 980), "install-agents.sh를 별도로\n실행하지 않아도 됩니다.",
                        font=F["body_bold"], fill=INK, spacing=5)
    footer(draw, 4)
    return img


def card_05() -> Image.Image:
    img = base()
    paste_art(img, ASSET_DIR / "task-lanes.png", (410, 460, 1030, 1170), opacity=220, brightness=1.0)
    draw = ImageDraw.Draw(img, "RGBA")
    eyebrow(draw, "04 · LUNA 작업 경로")
    title(draw, "Luna 작업 경로는\n자동으로 활성화되지\n않습니다")

    code = (76, 480, 840, 700)
    rounded_panel(draw, code, radius=26, width=3)
    draw.rounded_rectangle((76, 480, 83, 700), radius=4, fill=PURPLE)
    draw.text((112, 520), "COPY & PASTE", font=F["eyebrow"], fill=LAVENDER)
    draw.multiline_text((112, 574), "Use the Luna task lane\nfor this feature.",
                        font=F["code_bold"], fill=INK, spacing=4)

    draw.multiline_text((SAFE_X, 770), "이 문장은 Luna 작업 경로 사용에 대한\n명시적 승인입니다.",
                        font=F["body"], fill=INK, spacing=5)

    capsule = (76, 922, 726, 1026)
    rounded_panel(draw, capsule, radius=52, fill=(16, 14, 22, 245), width=2)
    number_circle(draw, (125, 974), "!", size=42)
    text_block(draw, (162, 934, 700, 1014), "요청할 때마다 다시 입력해야 합니다.",
               F["panel_body"], INK)
    footer(draw, 5)
    return img


def card_06() -> Image.Image:
    img = base()
    paste_art(img, ASSET_DIR / "max-rings.png", (250, 410, 1025, 1200), opacity=220, brightness=0.98)
    draw = ImageDraw.Draw(img, "RGBA")
    eyebrow(draw, "05 · MAX REASONING")
    title(draw, "Luna 모델과\nMax 추론은\n함께 지정합니다")

    app = (76, 465, 1004, 650)
    rounded_panel(draw, app, radius=25, width=3)
    draw.text((108, 500), "첫 실행", font=F["panel_title"], fill=INK)
    draw.text((108, 558), "설정 인터뷰를 먼저 완료합니다.",
              font=F["panel_body"], fill=MUTED)

    cli = (76, 685, 1004, 915)
    rounded_panel(draw, cli, radius=25, width=3)
    draw.text((108, 720), "LUNA TASK", font=F["panel_title"], fill=INK)
    draw.text((108, 775), "gpt-5.6-luna  +  max",
              font=F["code"], fill=INK)
    draw.text((108, 829), "앱 작업 생성 시 함께 지정",
              font=F["code"], fill=LAVENDER)

    draw.multiline_text((SAFE_X, 1050), "주의: CLI의 -e는 Max 옵션이 아니라\nexec 명령의 별칭입니다.",
                        font=F["body"], fill=INK, spacing=5)
    footer(draw, 6)
    return img


def check_panel(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    number: str,
    heading: str,
    detail: str,
) -> None:
    rounded_panel(draw, box, radius=27, width=3)
    x1, y1, x2, y2 = box
    number_circle(draw, (x1 + 58, (y1 + y2) // 2), number, size=50)
    # 제목과 설명을 하나의 시각 블록으로 계산해 패널 중앙에 맞춘다.
    hb = draw.textbbox((0, 0), heading, font=F["panel_title"])
    db = draw.textbbox((0, 0), detail, font=F["panel_small"])
    total_h = (hb[3] - hb[1]) + 22 + (db[3] - db[1])
    top = y1 + ((y2 - y1) - total_h) / 2
    draw.text((x1 + 112, top - hb[1]), heading, font=F["panel_title"], fill=INK)
    draw.text((x1 + 112, top + (hb[3] - hb[1]) + 22 - db[1]), detail,
              font=F["panel_small"], fill=MUTED)


def card_07() -> Image.Image:
    img = base()
    draw = ImageDraw.Draw(img, "RGBA")
    eyebrow(draw, "06 · CHECK")
    title(draw, "사용 전에\n확인할 3가지")

    check_panel(draw, (76, 405, 1004, 605), "1",
                "Sol Advisor는 커뮤니티 플러그인",
                "OpenAI 공식 기능이 아니며 Bun이 필요합니다.")
    check_panel(draw, (76, 640, 1004, 840), "2",
                "Codex 앱 작업 도구가 필요합니다",
                "Native V2가 아닌 별도 앱 작업 방식입니다.")
    check_panel(draw, (76, 875, 1004, 1075), "3",
                "Luna 또는 Max가 없으면 중단합니다",
                "다른 모델·추론 강도로 자동 대체하지 않습니다.")
    footer(draw, 7)
    return img


def card_08() -> Image.Image:
    img = base()
    paste_art(img, ASSET_DIR / "master-orbit.png", (460, 470, 1040, 1210), opacity=230, brightness=1.02)
    draw = ImageDraw.Draw(img, "RGBA")
    eyebrow(draw, "SAVE · COMMENT · RECEIVE")
    title(draw, "설치 명령어와\n복붙 프롬프트가\n필요하신가요?")
    draw.text((SAFE_X, 420), "댓글에 아래 키워드를 남겨 주세요.",
              font=F["body"], fill=INK)

    keyword = (76, 505, 640, 715)
    rounded_panel(draw, keyword, radius=28, width=3)
    draw.text((112, 540), "COMMENT KEYWORD", font=F["eyebrow"], fill=LAVENDER)
    text_block(draw, (112, 580, 430, 695), "루나", F["keyword"], INK)
    centered_text(draw, (560, 628), "→", F["keyword"], LAVENDER)

    draw.multiline_text((SAFE_X, 790), "설치 가이드를\nDM으로 보내드립니다.",
                        font=F["body_bold"], fill=INK, spacing=5)
    footer(draw, 8)
    return img


def save_outputs(cards: list[Image.Image]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    names = [
        "01-cover.png", "02-roles.png", "03-workflow.png", "04-install.png",
        "05-luna-route.png", "06-max.png", "07-cautions.png", "08-cta.png",
    ]
    for card, name in zip(cards, names):
        card.convert("RGB").save(OUT_DIR / name, "PNG", optimize=True)

    # 4열 전체 흐름 검토용
    thumb_w, thumb_h = 270, 338
    sheet = Image.new("RGB", (thumb_w * 4, thumb_h * 2), (6, 6, 8))
    for i, card in enumerate(cards):
        thumb = card.convert("RGB").resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        sheet.paste(thumb, ((i % 4) * thumb_w, (i // 4) * thumb_h))
    sheet.save(OUT_DIR / "preview-contact-sheet.png", "PNG", optimize=True)

    # 인스타 편집 화면에 가까운 50% 축소 검토용
    mobile_w, mobile_h = 540, 675
    mobile = Image.new("RGB", (mobile_w * 2, mobile_h * 4), (6, 6, 8))
    for i, card in enumerate(cards):
        thumb = card.convert("RGB").resize((mobile_w, mobile_h), Image.Resampling.LANCZOS)
        mobile.paste(thumb, ((i % 2) * mobile_w, (i // 2) * mobile_h))
    mobile.save(OUT_DIR / "preview-instagram-scale.png", "PNG", optimize=True)


def main() -> None:
    cards = [card_01(), card_02(), card_03(), card_04(), card_05(), card_06(), card_07(), card_08()]
    save_outputs(cards)
    print(f"rendered={len(cards)}")
    print(f"output={OUT_DIR}")


if __name__ == "__main__":
    main()
