import React from 'react';
import { getInputLines } from '../utils';
import { input } from './input'; // sampleInput|input';

const startNode = 'start';
const endNode = 'end';

class Cave {
  constructor(name, connection) {
    this.name = name;
    this.connections = [connection].filter(c => !!c);
    this.isBig = name === name.toUpperCase();
  }

  connectTo(otherCave) {
    this.connections.push(otherCave);
  }
}

class Path {
  constructor(existingPath) {
    this.visited = [...(existingPath?.visited || [])];
    this.smallCaves = [...(existingPath?.smallCaves || [])];
    this.complete = existingPath?.complete || false;
    this.alreadyRevisited = existingPath?.alreadyRevisited || false;
  }

  advance(cave, canRevisitSmallCave) {
    if (this.visited.length > 0 && cave.name === startNode) return false;

    if (!cave.isBig) {
      if (canRevisitSmallCave) {
        const occs = this.smallCaves.reduce(
          (sum, caveName) => sum + (caveName === cave.name ? 1 : 0),
          0
        );
        const cutoff = this.alreadyRevisited ? 0 : 1;
        if (occs > cutoff) return false;
        if (occs > 0) this.alreadyRevisited = true;
      } else if (this.smallCaves.includes(cave.name)) {
        return false;
      }
    }

    this.visited.push(cave);
    if (!cave.isBig) this.smallCaves.push(cave.name);
    if (cave.name === endNode) this.complete = true;

    return true;
  }

  toString() {
    return this.visited.map(cave => cave.name).join(',');
  }
}

const useInput = () =>
  React.useMemo(
    () =>
      getInputLines(input).reduce((obj, line) => {
        const [node1, node2] = line.split('-');
        if (!obj[node1]) obj[node1] = new Cave(node1, node2);
        else obj[node1].connectTo(node2);

        if (!obj[node2]) obj[node2] = new Cave(node2, node1);
        else obj[node2].connectTo(node1);

        return obj;
      }, {}),
    []
  );

const visitCave = (caves, caveName, canRevisit, path, paths) => {
  if (!path) path = new Path();
  if (!paths) paths = [];

  const cave = caves[caveName];

  if (path.advance(cave, canRevisit)) {
    if (path.complete) paths.push(path);
    else
      for (let connection of cave.connections)
        visitCave(caves, connection, canRevisit, new Path(path), paths);
  }

  return paths;
};

const usePathDiscovery = (caves, canRevisitSmallCave) => {
  const [paths, setPaths] = React.useState([]);

  React.useEffect(() => {
    if (caves) setPaths(visitCave(caves, startNode, canRevisitSmallCave));
  }, [caves, canRevisitSmallCave]);

  return paths;
};

export { useInput, usePathDiscovery };
