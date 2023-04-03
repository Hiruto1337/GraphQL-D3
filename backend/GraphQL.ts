import express from "express";
import { graphql, buildSchema } from "graphql";
import people_data from "./database/people.json" assert {type: "json"};
import movie_data from "./database/movies.json" assert {type: "json"};
import "graphql";
import cors from "cors";

// GraphQL
const schema = buildSchema(`
    type Query {
        people(name: String): [Person!]!
        movies(title: String): [Movie!]!
    }

    type Person {
        id: ID!
        name: String!
        born: Int
        movies: [Movie!]!
    }

    type Movie {
        id: ID!
        title: String!
        released: Int
        people: [Person!]!
    }
`);

interface Person {
    id: string;
    name: string;
    born?: number;
    movies: string[] | Movie[];
}

interface Movie {
    id: string;
    title: string;
    released?: number;
    people: string[] | Person[];
}

const rootValue = {
    people(args: { name?: string }, parent?: Movie) {
        let list: Person[] = [];
        const people: { [key: string]: Person } = people_data;

        if (args?.name) {
            for (const id in people) {
                if (people[id].name == args.name) {
                    list.push(people[id]);
                }
            }
        } else {
            for (const id in people) {
                list.push(people[id]);
            }
        }

        return list;
    },
    movies(args: { title?: string }, parent?: Person) {
        let list: Movie[] = [];
        const movies: { [key: string]: Movie } = movie_data;

        if (args.title) {
            for (const id in movies) {
                if (movies[id].title == args.title) {
                    list.push(movies[id]);
                }
            }
        } else {
            for (const id in movies) {
                list.push(movies[id]);
            }
        }

        return list;
    },
    Person: {
        id(parent: Person) {
            return parent.id;
        },
        name(parent: Person) {
            return parent.name;
        },
        born(parent: Person) {
            return parent.born;
        },
        movies(parent: Person, args: { title?: string }) {
            let list: Movie[] = [];
            const movies: { [key: string]: Movie } = movie_data;

            for (const id in parent.movies) {
                list.push(movies[id]);
            }

            return list;
        }
    },
    Movie: {
        id(parent: Movie) {
            return parent.id;
        },
        title(parent: Movie) {
            return parent.title;
        },
        released(parent: Movie) {
            return parent.released;
        },
        people(parent: Movie, args: { name?: string }) {
            let list: Person[] = [];
            const people: { [key: string]: Person } = people_data;

            for (const id in parent.people) {
                list.push(people[id]);
            }

            return list;
        }
    }
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