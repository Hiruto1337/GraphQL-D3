import { Person, Movie, Node, Link } from "./App";
export function getGraphData(data: { people?: Person[], movies?: Movie[] }, nodes: Node[], links: Link[], nodeSet: Set<string>): (Person | Movie)[] {
    let directChildren: (Person | Movie)[] = [];
    if (data.people) {
        for (let person of data.people) {
            if (!nodeSet.has(person.id)) {
                nodes.push({ id: person.id, icon: "👨🏻" });
                nodeSet.add(person.id);
            }

            directChildren.push(person);

            if (person.movies) {
                const children = getGraphData(person, nodes, links, nodeSet);

                for (let child of children) {
                    links.push({ source: person.id, target: child.id });
                }
            }
        }
    }

    if (data.movies) {
        for (let movie of data.movies) {
            if (!nodeSet.has(movie.id)) {
                nodes.push({ id: movie.id, icon: "🎬" });
                nodeSet.add(movie.id);
            }

            directChildren.push(movie);

            if (movie.people) {
                const children = getGraphData(movie, nodes, links, nodeSet);

                for (let child of children) {
                    links.push({ source: movie.id, target: child.id });
                }
            }
        }
    }

    return directChildren;
}