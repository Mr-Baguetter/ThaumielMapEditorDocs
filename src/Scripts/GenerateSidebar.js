const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "../../docs");
const OUTPUT_FILE = path.join(__dirname, "../../sidebars.js");

// ----------------------------
// Walk markdown files
// ----------------------------
function walk(dir) {
  let results = [];

  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith(".md") || file.endsWith(".mdx")) {
      results.push(full);
    }
  }

  return results;
}

function getCleanLabel(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;

  const line = fmMatch[1].split("\n").find((l) => l.startsWith("title:"));
  if (!line) return null;

  return line.replace("title:", "").trim().replace(/<KindIcon[^/]*\/>\s*/g, "").replace(/^[\u{1F300}-\u{1FAFF}⚙️📄🔷🟠🟢🟣🔵]\s*/u, "").trim();
}
// ----------------------------
// Extract frontmatter value by key
// ----------------------------
function getFrontmatterValue(content, key) {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) {
    return null;
  }

  const line = fmMatch[1].split(/\r?\n/).find((l) => l.startsWith(`${key}:`));
  return line ? line.replace(`${key}:`, "").trim() : null;
}
// ----------------------------
// Extract namespace from file
// ----------------------------
function getNamespace(content) {
  const match = content.match(/([A-Za-z0-9_]+(\.[A-Za-z0-9_]+)+)/);
  return match ? match[1] : null;
}

// ----------------------------
// Insert into tree
// ----------------------------
function insert(tree, parts, docItem) {
  let node = tree;

  for (const part of parts) {
    let existing = node.find((n) => n.label === part);

    if (!existing) {
      existing = {
        type: "category",
        label: part,
        collapsed: true,
        items: [],
      };
      node.push(existing);
    }

    node = existing.items;
  }

  node.push(docItem);
}

// ----------------------------
// Collapse single-child chains (DocFX-like)
// ----------------------------
function collapseSingleChild(nodes) {
  for (const node of nodes) {
    if (node.type !== "category") continue;

    collapseSingleChild(node.items);

    if (
      node.items.length === 1 &&
      typeof node.items[0] === "object" &&
      node.items[0].type === "category"
    ) {
      const child = node.items[0];
      node.label = `${node.label}/${child.label}`;
      node.items = child.items;
    }
  }
}

// ----------------------------
// Remove empty categories
// ----------------------------
function removeEmpty(nodes) {
  return nodes
    .map((node) => {
      if (node.type === "category") {
        node.items = removeEmpty(node.items);
        return node.items.length > 0 ? node : null;
      }
      return node;
    })
    .filter(Boolean);
}

// ----------------------------
// Build sidebar tree
// ----------------------------
function buildSidebar() {
  const files = walk(DOCS_DIR);
  const tree = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");

    const namespace = getNamespace(content);
    if (!namespace) continue;

    const parts = namespace.split(".");

    const docId = path
      .relative(DOCS_DIR, file)
      .replace(/\\/g, "/")
      .replace(/\.mdx?$/, "");

    const kind = getFrontmatterValue(content, "kind");
    const label = getCleanLabel(content) ?? docId.split("/").pop();

    const docItem = kind
      ? {
        type: "doc",
        id: docId,
        label,
        customProps: { kind },
      }
      : docId;

    insert(tree, parts, docItem);
  }

  return tree;
}

// ----------------------------
// Generate sidebars.js
// ----------------------------
function generate() {
  let sidebar = buildSidebar();

  sidebar = removeEmpty(sidebar);
  collapseSingleChild(sidebar);

  const output = `module.exports = {
  docsSidebar: ${JSON.stringify(sidebar, null, 2)}
};`;

  fs.writeFileSync(OUTPUT_FILE, output);
  console.log("Sidebar generated");
}

generate();