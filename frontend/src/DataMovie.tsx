import { useState } from "react";
import { Movie } from "./App";
import styles from "./Data.module.css";
import DataPerson from "./DataPerson";

export default function DataMovie({ movie }: { movie: Movie }) {
    const [expand, setExpand] = useState(false);
    return (
        <div className={`${styles.component} ${expand ? styles.selected : null}`}>
            <div className={styles.display} onClick={() => setExpand(prev => !prev)}>
                <span className={styles.icon}>🎬</span> <span className={styles.row}>{movie.title ? movie.title : movie.id}</span>
            </div>
            
            {expand ?
                <>
                    <hr className={styles.divider} />
                    {movie.released ? <span>Released: {movie.released}</span> : null}
                    <div className={styles.expand}>
                        {movie.people ? movie.people.map(person => <DataPerson person={person}/>) : null}
                    </div>
                </> : null
            }
        </div>
    );
}