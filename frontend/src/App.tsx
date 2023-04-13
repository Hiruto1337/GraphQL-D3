import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './App.module.css';
import Graph from './Graph';
import Movie from './Movie';
import Person from './Person';
import { getGraphData } from './functions';
import DataPerson from './DataPerson';
import DataMovie from './DataMovie';

export interface Person {
    id: string;
    name?: string;
    movies?: Movie[];
}

export interface Movie {
    id: string;
    title?: string;
    year?: Number;
    people?: Person[];
}

export interface Node {
    id: string;
    icon: string;
}

export interface Link {
    source: string;
    target: string;
}

interface Data {
    people?: Person[];
    movies?: Movie[];
}

export default function App() {
    async function getQuery() {
        try {
            const response = await axios("http://localhost:4000/graphQL", {
                method: "POST",
                data: {
                    query
                }
            });
            const data: Data = response.data.data;

            setPeople(data.people);
            setMovies(data.movies);

            let newNodes: Node[] = [];
            let newLinks: Link[] = [];
            let nodeSet = new Set<string>();

            getGraphData(data, newNodes, newLinks, nodeSet);

            setNodes(newNodes);
            setLinks(newLinks);
        } catch (err) {
            console.log(err);
        }
    }

    const [nodes, setNodes] = useState<Node[]>([
        { id: "1", icon: "👨🏻" },
        { id: "2", icon: "🏠" },
        { id: "3", icon: "🚨" },
        { id: "4", icon: "🏦" }
    ]);

    const [links, setLinks] = useState<Link[]>([
        { source: "1", target: "2" },
        { source: "3", target: "1" },
        { source: "3", target: "2" },
        { source: "4", target: "1" },
        { source: "4", target: "2" },
    ]);

    const [personQuery, setPersonQuery] = useState("");
    const [movieQuery, setMovieQuery] = useState("");
    const [query, setQuery] = useState("");

    const [people, setPeople] = useState<undefined | Person[]>();
    const [movies, setMovies] = useState<undefined | Movie[]>();
    const [showData, setShowData] = useState(false);

    useEffect(() => {
        setQuery(`{${personQuery} ${movieQuery}}`);
    }, [personQuery, movieQuery]);

    return (
        <div className={styles.component}>
            <div className={styles.sidebar}>
                <div className={styles.switch}>
                    <button onClick={() => setShowData(false)} className={`${styles.switchButton} ${showData ? null : styles.selected}`}>🔍</button>
                    <button onClick={() => setShowData(true)} className={`${styles.switchButton} ${showData ? styles.selected : null}`}>📊</button>
                </div>
                {showData ?
                    <>
                        {people ?
                            people.map(person => <DataPerson person={person} />)
                            :
                            null
                        }

                        {movies ?
                            movies.map(movie => <DataMovie movie={movie} />)
                            :
                            null
                        }
                    </>
                    :
                    <>
                        <Person setQuery={setPersonQuery} depth={0} />
                        <Movie setQuery={setMovieQuery} depth={0} />
                        <button className={styles.button} onClick={() => getQuery()}>Search</button>
                    </>
                }
            </div>
            <Graph nodes={nodes} links={links} />
        </div>
    );
}

// To do:
// - Shortest path between nodes
// - Filtering
// - Data display on hovering
// - Double-click on node and display neighbors
