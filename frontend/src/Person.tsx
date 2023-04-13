import { useCallback, useEffect, useState } from "react";
import styles from "./Button.module.css";
import Movie from "./Movie";
import SubButton from "./SubButton";

export default function Person({ setQuery, depth }: { setQuery: React.Dispatch<React.SetStateAction<string>>, depth: number }) {
    const [toggled, setToggled] = useState(false);

    const [name, setName] = useState("");
    const [born, setBorn] = useState("");
    const [died, setDied] = useState("");
    const [country, setCountry] = useState("");

    const [nameFilter, setNameFilter] = useState("");
    const [bornFilter, setBornFilter] = useState("");
    const [diedFilter, setDiedFilter] = useState("");
    const [countryFilter, setCountryFilter] = useState("");

    const [movieQuery, setMovieQuery] = useState("");

    const filter = useCallback(() => {
        if (nameFilter || bornFilter || diedFilter || countryFilter) {
            return `(${nameFilter} ${bornFilter} ${diedFilter} ${countryFilter})`;
        }

        return "";
    }, [nameFilter, bornFilter, diedFilter, countryFilter]);

    const query = `people${filter()} {id ${name} ${born} ${died} ${country} ${movieQuery}}`;

    useEffect(() => {
        setQuery(toggled ? query : "");
    }, [toggled, name, born, died, country, movieQuery, nameFilter, bornFilter, diedFilter, countryFilter])
    return (
        <div className={styles.component} style={toggled ? { backgroundColor: `rgb(${67 - 5 * depth},${56 - 5 * depth},${200 - 5 * depth})` } : {}}>
            <button className={`${styles.button} ${toggled ? styles.selected : null}`} onClick={() => setToggled(prev => !prev)}>People</button>
            {toggled ?
                <div className={styles.list}>
                    <hr style={{ border: "1px solid #ffffffa0", borderRadius: 4, width: "95%" }} />
                    <SubButton text="Name" qVal="name" setState={setName} setFilter={setNameFilter} />
                    <SubButton text="Born" qVal="born" setState={setBorn} setFilter={setBornFilter} />
                    <Movie setQuery={setMovieQuery} depth={depth + 1} />
                </div>
                :
                null
            }
        </div>
    );
}