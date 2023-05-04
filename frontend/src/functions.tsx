import { Person, Movie, Link } from "./App";
export interface PersonNode extends Person {
    icon: string;
}

export interface MovieNode extends Movie {
    icon: string;
}
export function getGraphData(data: { people?: Person[], movies?: Movie[] }, nodes: (PersonNode | MovieNode)[], links: Link[], nodeSet: Set<string>, linkSet: Set<string>): (Person | Movie)[] {
    let directChildren: (Person | Movie)[] = [];
    if (data.people) {
        for (let person of data.people) {
            if (!nodeSet.has(person.id)) {
                nodes.push({ icon: "👨🏻", ...person  });
                nodeSet.add(person.id);
            }

            directChildren.push(person);

            if (person.movies) {
                const children = getGraphData(person, nodes, links, nodeSet, linkSet);

                for (let child of children) {
                    const key = getKey(person.id, child.id);

                    if (!linkSet.has(key)) {
                        linkSet.add(key);
                        links.push({ source: person.id, target: child.id });
                    }
                }
            }
        }
    }

    if (data.movies) {
        for (let movie of data.movies) {
            if (!nodeSet.has(movie.id)) {
                nodes.push({ icon: "🎬", ...movie  });
                nodeSet.add(movie.id);
            }

            directChildren.push(movie);

            if (movie.people) {
                const children = getGraphData(movie, nodes, links, nodeSet, linkSet);

                for (let child of children) {
                    const key = getKey(movie.id, child.id);
                    if (!linkSet.has(key)) {
                        linkSet.add(key);
                        links.push({ source: movie.id, target: child.id });
                    }
                }
            }
        }
    }

    return directChildren;
}

function getKey(key1: string, key2: string): string {
    let arr = [key1, key2];
    arr.sort();

    return arr[0] + arr[1];
}