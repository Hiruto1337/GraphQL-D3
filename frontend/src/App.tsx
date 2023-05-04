import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './App.module.css';
import Graph from './Graph';
import Movie from './Movie';
import Person from './Person';
import { MovieNode, PersonNode, getGraphData } from './functions';
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

export interface Link {
    source: string;
    target: string;
}

interface Data {
    people?: Person[];
    movies?: Movie[];
    shortestPath?: string;
}

export default function App() {
    async function getQuery(queryString: string) {
        try {
            const response = await axios("http://localhost:4000/graphQL", {
                method: "POST",
                data: {
                    query: queryString
                }
            });
            
            let data: Data = response.data.data;

            if (data.shortestPath) data = JSON.parse(data.shortestPath) as Data;

            if (data) {
                setPeople(data.people);
                setMovies(data.movies);
    
                let newNodes: (PersonNode | MovieNode)[] = [];
                let newLinks: Link[] = [];
                let nodeSet = new Set<string>();
                let linkSet = new Set<string>();
    
                getGraphData(data, newNodes, newLinks, nodeSet, linkSet);
    
                setNodes(newNodes);
                setLinks(newLinks);
            } else {
                console.log("Couldn't get data!");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const [nodes, setNodes] = useState<(PersonNode | MovieNode)[]>([
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

    const [preview, setPreview] = useState<undefined | {icon: string, name?: string, title?: string}>();
    const [selected, setSelected] = useState<(undefined | string[])[]>([undefined, undefined]);

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
                        <Person setQuery={setPersonQuery} />
                        <Movie setQuery={setMovieQuery} />
                        <button className={styles.button} onClick={() => getQuery(query)}>Search</button>
                    </>
                }
                <div className={styles.shortPath}>
                    <h3 className={styles.title}>Shortest path</h3>
                    <div className={styles.pathSelector}>
                        <div className={styles.path}>
                            <span className={styles.icon}>{selected[0] ? selected[0][2] : "📍"}</span>
                            <span className={styles.node}>{selected[0] ? selected[0][1] : "Select node"}</span>
                        </div>
                        <span className={`${styles.icon} ${styles.hoverPointer}`} onClick={() => setSelected(prev => [prev[1], prev[0]])}>↔️</span>
                        <div className={styles.path}>
                            <span className={styles.icon}>{selected[1] ? selected[1][2] : "📍"}</span>
                            <span className={styles.node}>{selected[1] ? selected[1][1] : "Select node"}</span>
                        </div>
                    </div>
                    <div>
                        <button className={styles.button} onClick={() => {
                            if (selected[0] && selected[1]) {
                                getQuery(`{shortestPath(source: "${selected[0][0]}", target: "${selected[1][0]}")}`)
                            } else console.log("Select two nodes!");
                        }}>Get path</button>
                    </div>
                </div>
            </div>
            <Graph nodes={nodes} links={links} selected={selected} setSelected={setSelected} setPreview={setPreview} />
        </div>
    );
}

// To do:
// - Data display on hovering
// - Double-click on node and display neighbors
