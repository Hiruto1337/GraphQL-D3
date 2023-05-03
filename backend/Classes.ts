import people_data from "./database/people.json" assert {type: "json"};
import movie_data from "./database/movies.json" assert {type: "json"};

export class Person {
    id: string;
    name: string;
    born?: number;
    movieIds: string[];
    type?: "Person";

    constructor(id: string) {
        let jsonData = (people_data as {[key: string]: Person})[id];

        this.id = jsonData.id;
        this.name = jsonData.name;
        this.born = jsonData.born;
        this.movieIds = jsonData.movieIds;
        this.type = "Person";
    }

    movies?({title}: {title?: string}): Movie[] {
        let list: Movie[] = [];

        const movies: { [key: string]: Movie } = movie_data;

        if (title) {
            for (const movieId of this.movieIds) {
                if (movies[movieId].title == title) {
                    list.push(new Movie(movieId));
                }
            }
        } else {
            for (const movieId of this.movieIds) {
                list.push(new Movie(movieId));
            }
        }

        return list;
    }
}

export class Movie {
    id: string;
    title: string;
    released: number;
    peopleIds: string[];
    type?: "Movie";

    constructor(id: string) {
        let jsonData = (movie_data as {[key: string]: Movie})[id];

        this.id = jsonData.id;
        this.title = jsonData.title;
        this.released = jsonData.released;
        this.peopleIds = jsonData.peopleIds;
        this.type = "Movie";
    }

    people?({name}: {name?: string}): Person[] {
        let list: Person[] = [];

        const people: { [key: string]: Person } = people_data;

        if (name) {
            for (const personId of this.peopleIds) {
                if (people[personId].name == name) {
                    list.push(new Person(personId));
                }
            }
        } else {
            for (const personId of this.peopleIds) {
                list.push(new Person(personId));
            }
        }

        return list;
    }
}