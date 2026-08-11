"""Generate lightweight, mobile-oriented WebP derivatives for editorial photos.

Source images remain untouched. Transparent PNG/SVG branding assets are outside
this task by design. Run from the project root with the bundled Python runtime.
"""

from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1] / "public" / "images"
QUALITY = 82
METHOD = Image.Resampling.LANCZOS

NON_PHOTO_WEBPS = {
    "botic-hero-symbol-dark.webp",
    "botic-hero-symbol-light.webp",
    "botic-logo-original.webp",
    "michelin-star-reference.webp",
}


def output_size(path: Path, image: Image.Image) -> tuple[int, int] | None:
    """Use a vertical editorial crop on phones, except for native portraits."""
    width, height = image.size
    ratio = width / height

    # Existing narrow portraits already have the intended framing: reduce only
    # their width, avoiding an invented crop of people or plates.
    if ratio <= 0.82:
        return (min(900, width), round(min(900, width) / ratio))

    # Wide desktop banners need a real mobile crop instead of a very thin
    # resized strip. Their source is still wide enough for this gentle crop.
    if ratio >= 2.4:
        return (900, 750)

    return (900, 1200)


def mobile_path(source: Path) -> Path:
    return source.with_name(f"{source.stem}-mobile.webp")


def make_mobile(source: Path) -> tuple[Path, tuple[int, int]]:
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        target = output_size(source, image)
        if image.size == target:
            result = image.copy()
        elif image.size[0] / image.size[1] <= 0.82:
            result = image.resize(target, METHOD)
        else:
            result = ImageOps.fit(image, target, method=METHOD, centering=(0.5, 0.5))

        destination = mobile_path(source)
        result.save(destination, "WEBP", quality=QUALITY, method=6)
        return destination, target


def convert_plat_cenital() -> tuple[Path, Path]:
    source = ROOT / "plat-cenital-botic.jpg"
    desktop = ROOT / "plat-cenital-botic.webp"
    mobile = ROOT / "plat-cenital-botic-mobile.webp"
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        image.save(desktop, "WEBP", quality=84, method=6)
        ImageOps.fit(image, (900, 1350), method=METHOD, centering=(0.5, 0.5)).save(
            mobile, "WEBP", quality=QUALITY, method=6
        )
    return desktop, mobile


def should_convert(path: Path) -> bool:
    if path.suffix.lower() != ".webp" or path.stem.endswith("-mobile"):
        return False
    if path.name in NON_PHOTO_WEBPS:
        return False
    return not path.name.startswith("michelin-") and not path.name.startswith("botic-")


def main() -> None:
    converted = []
    for path in sorted(ROOT.rglob("*.webp")):
        if should_convert(path):
            destination, size = make_mobile(path)
            converted.append((destination.relative_to(ROOT.parent).as_posix(), size))

    desktop, mobile = convert_plat_cenital()
    converted.extend([
        (desktop.relative_to(ROOT.parent).as_posix(), Image.open(desktop).size),
        (mobile.relative_to(ROOT.parent).as_posix(), Image.open(mobile).size),
    ])

    for path, size in converted:
        print(f"{path}: {size[0]}x{size[1]}")


if __name__ == "__main__":
    main()
