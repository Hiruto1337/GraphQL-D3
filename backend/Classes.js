import people_data from "./database/people.json" assert { type: "json" };
import movie_data from "./database/movies.json" assert { type: "json" };
import { numberMatch, stringMatch } from "./functions.js";
var Person = /** @class */ (function () {
    function Person(id) {
        var jsonData = people_data[id];
        this.id = jsonData.id;
        this.name = jsonData.name;
        this.born = jsonData.born;
        this.movieIds = jsonData.movieIds;
        this.type = "Person";
    }
    Person.prototype.movies = function (_a) {
        var title = _a.title, titleVal = _a.titleVal, released = _a.released, releasedVal = _a.releasedVal;
        var list = this.movieIds.map(function (id) { return new Movie(id); });
        return list.filter(function (movie) { return (!title || stringMatch(movie.title, title, titleVal)) && (!released || numberMatch(movie.released, released, releasedVal)); });
    };
    return Person;
}());
export { Person };
var Movie = /** @class */ (function () {
    function Movie(id) {
        var jsonData = movie_data[id];
        this.id = jsonData.id;
        this.title = jsonData.title;
        this.released = jsonData.released;
        this.peopleIds = jsonData.peopleIds;
        this.type = "Movie";
    }
    Movie.prototype.people = function (_a) {
        var name = _a.name, nameVal = _a.nameVal, born = _a.born, bornVal = _a.bornVal;
        var list = this.peopleIds.map(function (id) { return new Person(id); });
        return list.filter(function (person) { return (!name || stringMatch(person.name, name, nameVal)) && (!born || numberMatch(person.born, born, bornVal)); });
    };
    return Movie;
}());
export { Movie };
