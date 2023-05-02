import people_data from "./database/people.json" assert { type: "json" };
import movie_data from "./database/movies.json" assert { type: "json" };
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
        var title = _a.title, movie = _a.movie;
        if (movie)
            return [movie];
        var list = [];
        var movies = movie_data;
        if (title) {
            for (var _i = 0, _b = this.movieIds; _i < _b.length; _i++) {
                var movieId = _b[_i];
                if (movies[movieId].title == title) {
                    list.push(new Movie(movieId));
                }
            }
        }
        else {
            for (var _c = 0, _d = this.movieIds; _c < _d.length; _c++) {
                var movieId = _d[_c];
                list.push(new Movie(movieId));
            }
        }
        return list;
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
        var name = _a.name;
        var list = [];
        var people = people_data;
        if (name) {
            for (var _i = 0, _b = this.peopleIds; _i < _b.length; _i++) {
                var personId = _b[_i];
                if (people[personId].name == name) {
                    list.push(new Person(personId));
                }
            }
        }
        else {
            for (var _c = 0, _d = this.peopleIds; _c < _d.length; _c++) {
                var personId = _d[_c];
                list.push(new Person(personId));
            }
        }
        return list;
    };
    return Movie;
}());
export { Movie };
