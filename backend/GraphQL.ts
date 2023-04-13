import express from "express";
import { graphql, buildSchema } from "graphql";
import people_data from "./database/people.json" assert {type: "json"};
import movie_data from "./database/movies.json" assert {type: "json"};
import { Person, Movie, PersonData, MovieData } from "./Classes.js";
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
        movies(title: String): [Movie!]!
    }

    type Movie {
        id: ID!
        title: String!
        released: Int
        people(name: String): [Person!]!
    }
`);

const rootValue = {
    people({ name }: {name?: string}): Person[] {
        let list: Person[] = [];
        const people: { [key: string]: PersonData } = people_data;

        if (name) {
            for (const id in people) {
                if (people[id].name == name) {
                    list.push(new Person(people[id]));
                }
            }
        } else {
            for (const id in people) {
                list.push(new Person(people[id]));
            }
        }

        return list;
    },
    movies({ title }: {title?: string}): Movie[] {
        let list: Movie[] = [];
        const movies: { [key: string]: MovieData } = movie_data;

        if (title) {
            for (const id in movies) {
                if (movies[id].title == title) {
                    list.push(new Movie(movies[id]));
                }
            }
        } else {
            for (const id in movies) {
                list.push(new Movie(movies[id]));
            }
        }

        return list;
    },
};

// Express
const app = express();

app.use(express.json());
app.use(cors());

app.post("/graphQL", async (req, res) => {
    let result = await graphql({ schema, source: req.body.query, rootValue });
    res.send(result);
});

app.listen(4000, () => {
    console.log("GraphQL server at localhost:4000!");
});