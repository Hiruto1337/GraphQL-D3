import people_data from "./database/people.json" assert {type: "json"};
import movie_data from "./database/movies.json" assert {type: "json"};
import { numberMatch, stringMatch } from "./functions.js";

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

    movies?({title, titleVal, released, releasedVal}: {title?: string, titleVal?: number, released?: number, releasedVal?: number}): Movie[] {
        let list: Movie[] = this.movieIds.map(id => new Movie(id));

        return list.filter(movie => (!title || stringMatch(movie.title, title, titleVal as number)) && (!released || numberMatch(movie.released, released, releasedVal as number)));
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

    people?({name, nameVal, born, bornVal}: {name?: string, nameVal?: number, born?: number, bornVal?: number}): Person[] {
        let list: Person[] = this.peopleIds.map(id => new Person(id));

        return list.filter(person => (!name || stringMatch(person.name, name, nameVal as number)) && (!born || numberMatch(person.born, born, bornVal as number)));
    }
}