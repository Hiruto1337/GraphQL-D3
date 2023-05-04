import { useCallback, useEffect, useState } from "react";
import styles from "./Button.module.css";
import Movie from "./Movie";
import SubButton from "./SubButton";

export default function Person({ setQuery }: { setQuery: React.Dispatch<React.SetStateAction<string>> }) {
    const [toggled, setToggled] = useState(false);

    const [name, setName] = useState("");
    const [born, setBorn] = useState("");

    const [nameFilter, setNameFilter] = useState("");
    const [bornFilter, setBornFilter] = useState("");

    const [movieQuery, setMovieQuery] = useState("");

    const filter = useCallback(() => {
        return (nameFilter || bornFilter) ? `(${nameFilter} ${bornFilter})` : "";
    }, [nameFilter, bornFilter]);

    const query = `people${filter()} {id ${name} ${born} ${movieQuery}}`;

    useEffect(() => {
        setQuery(toggled ? query : "");
    }, [toggled, name, born, movieQuery, nameFilter, bornFilter])
    return (
        <div className={styles.component} style={toggled ? { backgroundColor: "#00000010" } : {}}>
            <button className={`${styles.button} ${toggled ? styles.selected : null}`} onClick={() => setToggled(prev => !prev)}>People</button>
            {toggled ?
                <div className={styles.list}>
                    <hr style={{ border: "1px solid #ffffffa0", borderRadius: 4, width: "95%" }} />
                    <SubButton text="Name" qKey="name" cmp="nameVal" setState={setName} setFilter={setNameFilter} type="string" mandatory={true} />
                    <SubButton text="Born" qKey="born" cmp="bornVal" setState={setBorn} setFilter={setBornFilter} type="number" />
                    <Movie setQuery={setMovieQuery} />
                </div>
                :
                null
            }
        </div>
    );
}