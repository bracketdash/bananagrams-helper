import decode from "./decode";

const processNode = (index, sofar, nodes, syms, wordlistSet) => {
  let node = nodes[index];
  if (node[0] === "!") {
    wordlistSet.add(sofar);
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
    const newSofar = sofar + part;
    const ref = matches[i + 1];
    if (ref === "," || ref === undefined) {
      wordlistSet.add(newSofar);
      i += 2;
      continue;
    }
    const nextIndex = syms.has(ref) ? syms.get(ref) : index + decode(ref) + 1 - syms.size;
    processNode(nextIndex, newSofar, nodes, syms, wordlistSet);
    i += 2;
  }
  return wordlistSet;
};

export default processNode;
