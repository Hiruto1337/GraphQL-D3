import express from "express";
import { graphql, buildSchema } from "graphql";
import people_data from "./database/people.json" assert {type: "json"};
import movie_data from "./database/movies.json" assert {type: "json"};
import { Person, Movie } from "./Classes.js";
import "graphql";
import cors from "cors";

// GraphQL
const schema = buildSchema(`
    type Query {
        people(name: String, movies: MovieData): [Person!]!
        movies(title: String, people: PeopleData): [Movie!]!
        shortestPath(source: ID!, target: ID!): String
    }

    type Person {
        id: ID!
        name: String!
        born: Int
        movies(title: String): [Movie!]!
    }

    type Movie {
        id: ID!
        title: String!
        released: Int
        people(name: String): [Person!]!
    }

    input MovieData {
        title: String
        released: Int
        people: PeopleData
    }

    input PeopleData {
        name: String
        born: Int
        movies: MovieData
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

        // Parse all paths into GraphQL objects
        let result: {people: {id: string, name: string, movies: (Movie[] | undefined), type: string}[], movies: {id: string, title: string, people: (Person[] | undefined), type: string}[]} = {
            people: [],
            movies: []
        };

        function createNode(path: string[]): {id: string, name: string, movies: (Movie[] | undefined), type: string} | {id: string, title: string, people: (Person[] | undefined), type: string} | undefined {
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
                case "Person": result.people.push(node as {id: string, name: string, movies: (Movie[] | undefined), type: string}); break;
                case "Movie": result.movies.push(node as {id: string, title: string, people: (Person[] | undefined), type: string}); break;
            }
        }

        console.log(result);

        return JSON.stringify(result);
    },
    people({ name, movies }: { name?: string, movies?: Movie }): Person[] {
        let list: Person[] = [];

        if (name) {
            for (const id in peopleData) {
                if (peopleData[id].name == name) {
                    list.push(new Person(id));
                }
            }
        } else {
            for (const id in peopleData) {
                list.push(new Person(id));
            }
        }

        if (movies) {
            list = list.filter(person => {
                for (const movieId of person.movieIds) {
                    if (moviesData[movieId].title == movies?.title) {
                        return true;
                    }
                }

                return false;
            });
        }

        return list;
    },
    movies({ title, people }: { title?: string, people?: Person }): Movie[] {
        let list: Movie[] = [];

        if (title) {
            for (const id in moviesData) {
                if (moviesData[id].title == title) {
                    list.push(new Movie(id));
                }
            }
        } else {
            for (const id in moviesData) {
                list.push(new Movie(id));
            }
        }

        if (people) {
            list = list.filter(movie => {
                for (const personId of movie.peopleIds) {
                    if (peopleData[personId].name == people?.name) {
                        return true;
                    }
                }

                return false;
            });
        }

        return list;
    },
};

// Express
const app = express();

app.use(express.json());
app.use(cors());

app.post("/graphQL", async (req, res) => {
    console.log(req.body.query);
    let result = await graphql({ schema, source: req.body.query, rootValue });
    // let result = await graphql({ schema, source: '{people(movies: {title: "The Matrix"}) {id name movies(title: "The Matrix Reloaded") {title}}}', rootValue });
    res.send(result);
});

app.listen(4000, () => {
    console.log("GraphQL server at localhost:4000!");
});