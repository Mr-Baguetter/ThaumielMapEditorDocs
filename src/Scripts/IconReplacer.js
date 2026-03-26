const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "../../docs");

const KindMeta = {
  class: "blue",
  interface: "green",
  struct: "orange",
  enum: "purple",
  record: "cyan",
  delegate: "gray",
};

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
  if (content.includes("<KindIcon")) return content;
  const iconMap = {
    "📄": "class",
    "🔷": "class",
    "🟠": "struct",
    "🟢": "interface",
    "🟣": "enum",
    "🔵": "record",
    "⚙️": "delegate",
  };

  content = content.replace(
    /^([\p{Emoji_Presentation}\uFE0F])\s+(.+)$/gu,
    (_match, icon, name) => {
      const kind = iconMap[icon];
      return kind
        ? `<KindIcon kind="${kind}" /> ${name}`
        : `${icon} ${name}`;
    }
  );

  return content;
}

for (const file of walk(DOCS_DIR)) {
  const original = fs.readFileSync(file, "utf8");
  const updated = transform(original);

  if (original !== updated) {
    fs.writeFileSync(file, updated);
    console.log("Updated:", file);
  }
}