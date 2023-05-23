import { useState } from "react";
import { Person } from "./App";
import styles from "./Data.module.css";
import DataMovie from "./DataMovie";

export default function DataPerson({ person }: { person: Person }) {
    const [expand, setExpand] = useState(false);
    return (
        <div className={`${styles.component} ${expand ? styles.selected : null}`}>
            <div className={styles.display} onClick={() => setExpand(prev => !prev)}>
                <span className={styles.icon}>👨🏻</span> <span className={styles.row}>{person.name ? person.name : person.id}</span>
            </div>
            {expand ?
                <>
                    <hr className={styles.divider} />
                    {person.born ? <span>Born: {person.born}</span> : null}
                    <div className={styles.expand}>
                        {person.movies ? person.movies.map(movie => <DataMovie movie={movie}/>) : null}
                    </div>
                </> : null
            }
        </div>
    );
}