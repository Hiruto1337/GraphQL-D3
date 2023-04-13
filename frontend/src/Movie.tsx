import { useCallback, useEffect, useState } from "react";
import styles from "./Button.module.css";
import Person from "./Person";
import SubButton from "./SubButton";

export default function Movie({ setQuery, depth }: { setQuery: React.Dispatch<React.SetStateAction<string>>, depth: number }) {
    const [toggled, setToggled] = useState(false);

    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [rating, setRating] = useState("");
    const [revenue, setRevenue] = useState("");

    const [titleFilter, setTitleFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [ratingFilter, setRatingFilter] = useState("");
    const [revenueFilter, setRevenueFilter] = useState("");

    const [personQuery, setPersonQuery] = useState("");

    const filter = useCallback(() => {
        if (titleFilter || yearFilter || ratingFilter || revenueFilter) {
            return `(${titleFilter} ${yearFilter} ${ratingFilter} ${revenueFilter})`;
        }

        return "";
    }, [titleFilter, yearFilter, ratingFilter, revenueFilter]);

    const query = `movies${filter()} {id ${title} ${year} ${rating} ${revenue} ${personQuery}}`;

    useEffect(() => {
        setQuery(toggled ? query : "");
    }, [toggled, title, year, rating, revenue, personQuery, titleFilter, yearFilter, ratingFilter, revenueFilter])
    return (
        <div className={styles.component} style={toggled ? { backgroundColor: `rgb(${67 - 5 * depth},${56 - 5 * depth},${200 - 5 * depth})` } : {}}>
            <button className={`${styles.button} ${toggled ? styles.selected : null}`} onClick={() => setToggled(prev => !prev)}>Movies</button>
            {toggled ?
                <div className={styles.list}>
                    <hr style={{ border: "1px solid #ffffffa0", borderRadius: 4, width: "95%" }} />
                    <SubButton text="Title" qVal="title" setState={setTitle} setFilter={setTitleFilter} />
                    <SubButton text="Year" qVal="year" setState={setYear} setFilter={setYearFilter} />
                    <SubButton text="Revenue" qVal="revenue" setState={setRevenue} setFilter={setRevenueFilter} />
                    <Person setQuery={setPersonQuery} depth={depth + 1} />
                </div>
                :
                null
            }
        </div>
    );
}