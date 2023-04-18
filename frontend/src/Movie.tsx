import { useCallback, useEffect, useState } from "react";
import styles from "./Button.module.css";
import Person from "./Person";
import SubButton from "./SubButton";

export default function Movie({ setQuery }: { setQuery: React.Dispatch<React.SetStateAction<string>>}) {
    const [toggled, setToggled] = useState(false);

    const [title, setTitle] = useState("");
    const [released, setReleased] = useState("");

    const [releasedFilter, setReleasedFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");

    const [personQuery, setPersonQuery] = useState("");

    const filter = useCallback(() => {
        return (releasedFilter || yearFilter) ? `(${releasedFilter} ${yearFilter})` : "";
    }, [releasedFilter, yearFilter]);

    const query = `movies${filter()} {id ${title} ${released} ${personQuery}}`;

    useEffect(() => {
        setQuery(toggled ? query : "");
    }, [toggled, title, released, personQuery, releasedFilter, yearFilter])
    return (
        <div className={styles.component} style={toggled ? { backgroundColor: "#00000010" } : {}}>
            <button className={`${styles.button} ${toggled ? styles.selected : null}`} onClick={() => setToggled(prev => !prev)}>Movies</button>
            {toggled ?
                <div className={styles.list}>
                    <hr style={{ border: "1px solid #ffffffa0", borderRadius: 4, width: "95%" }} />
                    <SubButton text="Title" qVal="title" setState={setTitle} setFilter={setReleasedFilter} type="string" mandatory={true} />
                    <SubButton text="Released" qVal="released" setState={setReleased} setFilter={setYearFilter} type="number" />
                    <Person setQuery={setPersonQuery} />
                </div>
                :
                null
            }
        </div>
    );
}