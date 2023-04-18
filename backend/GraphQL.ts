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
    people({ name, movies }: { name?: string, movies?: Movie }): Person[] {
        let list: Person[] = [];

        if (name) {
            for (const id in peopleData) {
                if (peopleData[id].name == name) {
                    list.push(new Person(peopleData[id]));
                }
            }
        } else {
            for (const id in peopleData) {
                list.push(new Person(peopleData[id]));
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
                    list.push(new Movie(moviesData[id]));
                }
            }
        } else {
            for (const id in moviesData) {
                list.push(new Movie(moviesData[id]));
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
    let result = await graphql({ schema, source: req.body.query, rootValue });
    // let result = await graphql({ schema, source: '{people(movies: {title: "The Matrix"}) {id name movies(title: "The Matrix Reloaded") {title}}}', rootValue });
    res.send(result);
});

app.listen(4000, () => {
    console.log("GraphQL server at localhost:4000!");
});