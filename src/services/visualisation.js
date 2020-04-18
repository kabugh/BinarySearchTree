import * as d3 from "d3";

import Node from "./node";
import { myXOR } from "./helperFunctions";
// d3
export function run(tree) {
  let margin = { top: 100, bottom: 80 };
  let width = 1200;
  let height = 1000 - margin.top - margin.bottom;
  console.log("new load " + tree.root.data);
  let svg = d3
    .select(".svg-container")
    .append("svg")
    .attr("width", "100%")
    .attr("height", height + margin.top + margin.bottom)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width}  ${height}`)
    .classed("svg-content", true)
    .classed(tree.root.data, true)
    .append("g")
    .attr("transform", "translate(0," + margin.top + ")");

  let i = 0;
  let duration = 750;
  let root;

  // Declares a tree layout and assigns the size
  let treemap = d3.tree().size([width, height]);

  // Assigns parent, children, height, depth, and coordinates
  root = d3.hierarchy(tree.root, d => {
    d.children = [];
    if (d.left) {
      d.children.push(d.left);
      if (myXOR(d.left, d.right)) {
        d.children.push(new Node("null"));
      }
    }
    if (d.right) {
      if (myXOR(d.left, d.right)) {
        d.children.push(new Node("null"));
      }
      d.children.push(d.right);
    }
    return d.children;
  });

  root.x0 = width / 2;
  root.y0 = 0;

  update(root);

  // Collapse the node and all it's children
  // eslint-disable-next-line no-unused-vars
  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  function update(source) {
    // Assigns the x and y position for the nodes
    let treeData = treemap(root);

    // Compute the new tree layout.
    let nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    // Normalize for fixed-depth
    nodes.forEach(function(d) {
      d.y = d.depth * 100;
    });

    // **************** Nodes Section ****************

    // Update the nodes...
    let node = svg.selectAll("g.node").data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });

    // Enter any new nodes at the parent's previous position.
    let nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function() {
        return "translate(" + source.x0 + "," + source.y0 + ")";
      })
      .on("click", click);

    // Add Circle for the nodes
    nodeEnter
      .append("circle")
      .attr("class", d => {
        if (d.data.data === null) {
          return "node hidden";
        }
        return "node";
      })
      .attr("r", 1e-6)
      .style("fill", d => {
        return d._children ? "lightsteelblue" : "#fff";
      });

    // Add labels for the nodes
    nodeEnter
      .append("text")
      .attr("dy", ".35em")
      .attr("x", d => {
        return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", d => {
        return d.children || d._children ? "end" : "start";
      })
      .text(d => {
        return d.data.data;
      });

    // Update
    let nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the nodes
    nodeUpdate
      .transition()
      .duration(duration)
      .attr("transform", d => {
        return "translate(" + d.x + "," + d.y + ")";
      });

    // Update the node attributes and style
    nodeUpdate
      .select("circle.node")
      .attr("r", 10)
      .style("fill", d => {
        return d._children ? "lightsteelblue" : "#fff";
      })
      .attr("cursor", "pointer");

    // Remove any exiting nodes
    let nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr("transform", () => {
        return "translate(" + source.x + "," + source.y + ")";
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select("circle").attr("r", 1e-6);

    // On exit reduce the opacity of text lables
    nodeExit.select("text").style("fill-opacity", 1e-6);

    // **************** Links Section ****************

    // Update the links...
    let link = svg.selectAll("path.link").data(links, d => {
      return d.id;
    });

    // Enter any new links at the parent's previous position
    let linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", d => {
        if (isNaN(d.value)) {
          return "link hidden ";
        }
        return "link";
      })
      .attr("d", () => {
        let o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      });

    // Update
    let linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate
      .transition()
      .duration(duration)
      .attr("d", d => {
        return diagonal(d, d.parent);
      });

    // Remove any existing links
    // eslint-disable-next-line no-unused-vars
    let linkExit = link
      .exit()
      .transition()
      .duration(duration)
      .attr("d", () => {
        // eslint-disable-next-line no-unused-vars
        let o = { x: source.x, y: source.y };
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // Create a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
      let path = `M ${s.x} ${s.y}
            C ${(s.x + d.x) / 2} ${s.y},
              ${(s.x + d.x) / 2} ${d.y},
              ${d.x} ${d.y}`;

      return path;
    }

    // Toggle children on click
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }
  }
}
// function renderTree(tree) {
//   // bst.breadthFirst(bst.getRootNode());
//   // bst.inorder(bst.getRootNode());
//   console.log(bst);
// }
// renderTree(bst);

// bst.insert(25);
// bst.insert(15);
// bst.insert(10);
// bst.insert(4);
// bst.insert(12);
// bst.insert(22);
// bst.insert(18);
// bst.insert(24);
// bst.insert(50);
// bst.insert(35);
// bst.insert(31);
// bst.insert(44);
// bst.insert(70);
// bst.insert(66);
// bst.insert(90);

// tree.insert(15);
// tree.insert(25);
// tree.insert(10);
// tree.insert(7);
// tree.insert(22);
// tree.insert(17);
// tree.insert(13);
// tree.insert(5);
// tree.insert(9);
// tree.insert(27);

// bst.insert(1);
// bst.insert(3);
// bst.insert(6);
// bst.insert(4);
// bst.insert(7);
// bst.insert(8);
// bst.insert(10);
// bst.insert(14);
// bst.insert(13);

// bst.saveToFile(bst);
// bst = new BinarySearchTree();
// console.log(bst);
// bst = bst.readFromFile();
// console.log(bst);
