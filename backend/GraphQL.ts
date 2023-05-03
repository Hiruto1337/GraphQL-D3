import express from "express";
import { graphql, buildSchema } from "graphql";
import people_data from "./database/people.json" assert {type: "json"};
import movie_data from "./database/movies.json" assert {type: "json"};
import { Person, Movie } from "./Classes.js";
import "graphql";
import cors from "cors";
import { numberMatch, stringMatch } from "./functions.js";

// GraphQL
const schema = buildSchema(`
    type Query {
        people(name: String, nameVal: Int, born: Int, bornVal: Int): [Person!]!
        movies(title: String, titleVal: Int, released: Int, releasedVal: Int): [Movie!]!
        shortestPath(source: ID!, target: ID!): String
    }

    type Person {
        id: ID!
        name: String!
        born: Int
        movies(title: String, titleVal: Int, released: Int, releasedVal: Int): [Movie!]!
    }

    type Movie {
        id: ID!
        title: String!
        released: Int
        people(name: String, nameVal: Int, born: Int, bornVal: Int): [Person!]!
    }
`);

const peopleData: { [key: string]: Person } = people_data;
const moviesData: { [key: string]: Movie } = movie_data;

const rootValue = {
    shortestPath({ source, target }: { source: string, target: string }): string {
        let queue: string[][] = [[source]];

        let match = false;

        let paths: string[][] = [];

        while (queue.length != 0) {
            let path = queue.shift() as string[];

            if (path.length > 10) return "{}";

            let lastId = path[path.length - 1];

            if (lastId == target) {
                match = true;
                paths.push(path);
            } else if (!match) {
                let node = peopleData[lastId] ? new Person(lastId) : new Movie(lastId);
                switch (node.type) {
                    case "Person":
                        for (const movieId of node.movieIds) {
                            queue.push([...path, movieId]);
                        }
                        break;
                    case "Movie":
                        for (const personId of node.peopleIds) {
                            queue.push([...path, personId]);
                        }
                        break;
                }
            }
        }

        let result: { people: { id: string, name: string, movies: (Movie[] | undefined), type: string }[], movies: { id: string, title: string, people: (Person[] | undefined), type: string }[] } = {
            people: [],
            movies: []
        };

        function createNode(path: string[]): { id: string, name: string, movies: (Movie[] | undefined), type: string } | { id: string, title: string, people: (Person[] | undefined), type: string } | undefined {
            let id = path.shift();

            if (!id) return undefined;

            let node = peopleData[id] ? new Person(id) : new Movie(id);

            switch (node.type) {
                case "Person":
                    let personObj = {
                        id: node.id,
                        name: node.name,
                        movies: undefined as Movie[] | undefined,
                        type: "Person"
                    };

                    let movie = createNode(path);

                    if (movie) personObj.movies = [movie as Movie];

                    return personObj;
                case "Movie":
                    let movieObj = {
                        id: node.id,
                        title: node.title,
                        people: undefined as Person[] | undefined,
                        type: "Movie"
                    }

                    let person = createNode(path);

                    if (person) movieObj.people = [person as Person];

                    return movieObj;
            }
        }

        for (const path of paths) {
            let node = createNode(path);

            switch (node?.type) {
                case "Person": result.people.push(node as { id: string, name: string, movies: (Movie[] | undefined), type: string }); break;
                case "Movie": result.movies.push(node as { id: string, title: string, people: (Person[] | undefined), type: string }); break;
            }
        }

        return JSON.stringify(result);
    },
    people({ name, nameVal, born, bornVal }: { name?: string, nameVal?: number, born?: number, bornVal?: number }): Person[] {
        let list: Person[] = Object.keys(peopleData).map(id => new Person(id));

        return list.filter(person => (!name || stringMatch(person.name, name, nameVal as number)) && ( !born || numberMatch(person.born, born, bornVal as number)));
    },
    movies({ title, titleVal, released, releasedVal}: { title?: string, titleVal?: number, released?: number, releasedVal: number}): Movie[] {
        let list: Movie[] = Object.keys(moviesData).map(id => new Movie(id));

        return list.filter(movie => (!title || stringMatch(movie.title, title, titleVal as number)) && (!released || numberMatch(movie.released, released, releasedVal as number)));
    },
};

// Express
const app = express();

app.use(express.json());
app.use(cors());

app.post("/graphQL", async (req, res) => {
    console.log(req.body.query);
    let result = await graphql({ schema, source: req.body.query, rootValue });
    res.send(result);
});

app.listen(4000, () => {
    console.log("GraphQL server at localhost:4000!");
});