from __future__ import annotations

import json
import re
from pathlib import Path


def load_installed(root: Path) -> set[str]:
    pkg_path = root / "package.json"
    pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
    return set(pkg.get("dependencies", {}).keys()) | set(pkg.get("devDependencies", {}).keys())


def iter_source_files(base: Path) -> list[Path]:
    exts = {".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"}
    out: list[Path] = []
    if not base.exists():
        return out
    for p in base.rglob("*"):
        if p.is_file() and p.suffix in exts:
            out.append(p)
    return out


def extract_specifiers(text: str) -> list[str]:
    # Covers:
    # - import ... from "x"
    # - export ... from "x"
    # - require("x")
    # - import("x")
    patterns = [
        re.compile(r"""\b(?:import|export)\s+(?:type\s+)?[^;]*?\bfrom\s+['"]([^'"]+)['"]"""),
        re.compile(r"""\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)"""),
        re.compile(r"""\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)"""),
    ]
    specs: list[str] = []
    for rx in patterns:
        specs.extend(m.group(1) for m in rx.finditer(text))
    return specs


def spec_to_package_name(spec: str) -> str | None:
    spec = spec.strip()
    if not spec or spec.startswith(".") or spec.startswith("/"):
        return None

    # Path aliases like "@/..." are not packages.
    if spec.startswith("@/"):
        return None

    # Treat framework subpaths as the framework package.
    if spec == "next" or spec.startswith("next/"):
        return "next"
    if spec in ("react", "react-dom"):
        return spec
    if spec.startswith("react/"):
        return "react"

    # Scoped packages keep scope/name.
    if spec.startswith("@"):
        parts = spec.split("/")
        return "/".join(parts[:2]) if len(parts) >= 2 else spec

    # Unscoped: take first segment.
    return spec.split("/")[0]


def main() -> None:
    root = Path(__file__).resolve().parent
    installed = load_installed(root)

    scan_dirs = [
        root / "app",
        root / "components",
        root / "lib",
        root / "tmp v0",  # folder name includes space in this repo
        root / "tmp-v0",  # just in case
    ]

    used_pkgs: set[str] = set()
    for d in scan_dirs:
        for p in iter_source_files(d):
            try:
                text = p.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                text = p.read_text(encoding="utf-8", errors="ignore")
            for spec in extract_specifiers(text):
                pkg = spec_to_package_name(spec)
                if pkg:
                    used_pkgs.add(pkg)

    missing = sorted(pkg for pkg in used_pkgs if pkg not in installed)

    # Print missing packages (one per line) for easy consumption.
    for m in missing:
        print(m)


if __name__ == "__main__":
    main()

