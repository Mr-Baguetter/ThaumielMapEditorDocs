const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "../../docs");
const KIND_ICON_IMPORT = `import { KindIcon } from "@site/src/components/KindIcon";`;

function walk(dir, files = []) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);

    if (fs.statSync(full).isDirectory()) {
      walk(full, files);
    } else if (full.endsWith(".md") || full.endsWith(".mdx")) {
      files.push(full);
    }
  }
  return files;
}

function transform(content) {
  if (content.includes("<KindIcon") && !/[📄🔷🟠🟢🟣🔵⚙️]/.test(content)) {
    return content;
  }

  const iconMap = {
    "📄": "class",
    "🔷": "class",
    "🟠": "struct",
    "🟢": "interface",
    "🟣": "enum",
    "🔵": "record",
    "⚙️": "delegate",
  };

  const iconRegex = new RegExp(
    `(${Object.keys(iconMap).join("|")})\\s+(.+)`,
    "g"
  );

  content = content.replace(iconRegex, (_m, icon, name) => {
    const kind = iconMap[icon];
    return kind
      ? `<KindIcon kind="${kind}" /> ${name}`
      : `${icon} ${name}`;
  });

  content = ensureKindIconImport(content);

  return content;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function ensureKindIconImport(content) {
  if (content.includes(KIND_ICON_IMPORT))
    return content;

  const lines = content.split("\n");
  let insertIndex = 0;

  if (lines[0]?.trim() === "---") {
    insertIndex = 1;
    while (insertIndex < lines.length && lines[insertIndex].trim() !== "---") {
      insertIndex++;
    }
    insertIndex++;
  }

  while (lines[insertIndex]?.startsWith("import ")) {
    insertIndex++;
  }

  lines.splice(insertIndex, 0, KIND_ICON_IMPORT, "");

  return lines.join("\n");
}

for (const file of walk(DOCS_DIR)) {
  const original = fs.readFileSync(file, "utf8");
  const updated = transform(original);

  if (original !== updated) {
    fs.writeFileSync(file, updated);
    console.log("Updated:", file);
  }
}