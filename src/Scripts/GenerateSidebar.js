const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join("/docs");
const OUTPUT_FILE = path.join("/sidebars.js");

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

// ----------------------------
// Extract namespace from file
// (ThaumielMapEditor.API.X)
// ----------------------------
function getNamespace(content) {
  const match = content.match(
    /([A-Za-z0-9_]+(\.[A-Za-z0-9_]+)+)/
  );
  return match ? match[1] : null;
}

// ----------------------------
// Insert into tree
// ----------------------------
function insert(tree, parts, docId) {
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

  node.push(docId);
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

    insert(tree, parts, docId);
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
  console.log("Sidebar generated (DocFX-style + collapsed namespaces)");
}

generate();