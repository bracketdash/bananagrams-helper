export default (index, parentBranch, nodes, syms) => {
  let node = nodes[index];
  const branch = new Map();
  const branches = new Map();
  branch.set(BRANCHES, branches);
  if (parentBranch) {
    branch.set(PARENT_BRANCH, parentBranch);
  }
  if (node[0] === "!") {
    branch.set(FINISHES_WORD, true);
    node = node.slice(1);
  }
  const matches = node.split(/([A-Z0-9,]+)/g);
  let i = 0;
  while (i < matches.length) {
    const part = matches[i];
    if (!part) {
      i += 2;
      continue;
    }
    const ref = matches[i + 1];
    if (ref === "," || ref === undefined) {
      branches.set(part, new Map([[FINISHES_WORD, true]]));
      i += 2;
      continue;
    }
    const nextIndex = syms.has(ref) ? syms.get(ref) : index + decode(ref) + 1 - syms.size;
    branches.set(part, processNode(nextIndex, branch, nodes, syms));
    i += 2;
  }
  return branch;
};
