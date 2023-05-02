var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import express from "express";
import { graphql, buildSchema } from "graphql";
import people_data from "./database/people.json" assert { type: "json" };
import movie_data from "./database/movies.json" assert { type: "json" };
import { Person, Movie } from "./Classes.js";
import "graphql";
import cors from "cors";
// GraphQL
var schema = buildSchema("\n    type Query {\n        people(name: String, movies: MovieData): [Person!]!\n        movies(title: String, people: PeopleData): [Movie!]!\n        shortestPath(source: ID!, target: ID!): String\n    }\n\n    type Person {\n        id: ID!\n        name: String!\n        born: Int\n        movies(title: String): [Movie!]!\n    }\n\n    type Movie {\n        id: ID!\n        title: String!\n        released: Int\n        people(name: String): [Person!]!\n    }\n\n    input MovieData {\n        title: String\n        released: Int\n        people: PeopleData\n    }\n\n    input PeopleData {\n        name: String\n        born: Int\n        movies: MovieData\n    }\n");
var peopleData = people_data;
var moviesData = movie_data;
var rootValue = {
    shortestPath: function (_a) {
        var source = _a.source, target = _a.target;
        var queue = [[source]];
        var match = false;
        var paths = [];
        while (queue.length != 0) {
            var path = queue.shift();
            var lastId = path[path.length - 1];
            if (lastId == target) {
                match = true;
                paths.push(path);
            }
            else if (!match) {
                var node = peopleData[lastId] ? new Person(lastId) : new Movie(lastId);
                switch (node.type) {
                    case "Person":
                        for (var _i = 0, _b = node.movieIds; _i < _b.length; _i++) {
                            var movieId = _b[_i];
                            queue.push(__spreadArray(__spreadArray([], path, true), [movieId], false));
                        }
                        break;
                    case "Movie":
                        for (var _c = 0, _d = node.peopleIds; _c < _d.length; _c++) {
                            var personId = _d[_c];
                            queue.push(__spreadArray(__spreadArray([], path, true), [personId], false));
                        }
                        break;
                }
            }
        }
        // Parse all paths into GraphQL objects
        var result = {
            people: [],
            movies: []
        };
        function createNode(path) {
            var id = path.shift();
            if (!id)
                return undefined;
            var node = peopleData[id] ? new Person(id) : new Movie(id);
            switch (node.type) {
                case "Person":
                    var personObj = {
                        id: node.id,
                        name: node.name,
                        movies: undefined,
                        type: "Person"
                    };
                    var movie = createNode(path);
                    if (movie)
                        personObj.movies = [movie];
                    return personObj;
                case "Movie":
                    var movieObj = {
                        id: node.id,
                        title: node.title,
                        people: undefined,
                        type: "Movie"
                    };
                    var person = createNode(path);
                    if (person)
                        movieObj.people = [person];
                    return movieObj;
            }
        }
        for (var _e = 0, paths_1 = paths; _e < paths_1.length; _e++) {
            var path = paths_1[_e];
            var node = createNode(path);
            switch (node === null || node === void 0 ? void 0 : node.type) {
                case "Person":
                    result.people.push(node);
                    break;
                case "Movie":
                    result.movies.push(node);
                    break;
            }
        }
        console.log(result);
        return JSON.stringify(result);
    },
    people: function (_a) {
        var name = _a.name, movies = _a.movies;
        var list = [];
        if (name) {
            for (var id in peopleData) {
                if (peopleData[id].name == name) {
                    list.push(new Person(id));
                }
            }
        }
        else {
            for (var id in peopleData) {
                list.push(new Person(id));
            }
        }
        if (movies) {
            list = list.filter(function (person) {
                for (var _i = 0, _a = person.movieIds; _i < _a.length; _i++) {
                    var movieId = _a[_i];
                    if (moviesData[movieId].title == (movies === null || movies === void 0 ? void 0 : movies.title)) {
                        return true;
                    }
                }
                return false;
            });
        }
        return list;
    },
    movies: function (_a) {
        var title = _a.title, people = _a.people;
        var list = [];
        if (title) {
            for (var id in moviesData) {
                if (moviesData[id].title == title) {
                    list.push(new Movie(id));
                }
            }
        }
        else {
            for (var id in moviesData) {
                list.push(new Movie(id));
            }
        }
        if (people) {
            list = list.filter(function (movie) {
                for (var _i = 0, _a = movie.peopleIds; _i < _a.length; _i++) {
                    var personId = _a[_i];
                    if (peopleData[personId].name == (people === null || people === void 0 ? void 0 : people.name)) {
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
var app = express();
app.use(express.json());
app.use(cors());
app.post("/graphQL", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body.query);
                return [4 /*yield*/, graphql({ schema: schema, source: req.body.query, rootValue: rootValue })];
            case 1:
                result = _a.sent();
                // let result = await graphql({ schema, source: '{people(movies: {title: "The Matrix"}) {id name movies(title: "The Matrix Reloaded") {title}}}', rootValue });
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
app.listen(4000, function () {
    console.log("GraphQL server at localhost:4000!");
});
