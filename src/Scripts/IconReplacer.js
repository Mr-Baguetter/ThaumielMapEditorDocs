const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "../../docs");

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
    `(${Object.keys(iconMap).map(k => escapeRegExp(k)).join("|")})\\s+(.+)`, "g"
  );

  return content.replace(iconRegex, (_match, icon, name) => {
    const kind = iconMap[icon];
    return kind ? `<KindIcon kind="${kind}" /> ${name}` : `${icon} ${name}`;
  });
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

for (const file of walk(DOCS_DIR)) {
  const original = fs.readFileSync(file, "utf8");
  const updated = transform(original);

  if (original !== updated) {
    fs.writeFileSync(file, updated);
    console.log("Updated:", file);
  }
}