import { useEffect, useState } from "react";
import styles from "./SubButton.module.css";

export default function SubButton({ text, qVal, setState, setFilter }: { text: String, qVal: string, setState: React.Dispatch<React.SetStateAction<string>>, setFilter: React.Dispatch<React.SetStateAction<string>> }) {
    const [toggled, setToggled] = useState(false);

    const [selected, setSelected] = useState("");
    const [input, setInput] = useState("");

    const [toggleFilter, setToggleFilter] = useState(false);

    useEffect(() => {
        setState(toggled ? qVal : "");
        setFilter(toggleFilter ? `${qVal}${selected}: "${input}"` : "");
    }, [toggled, input, toggleFilter, selected]);
    return (
        <div className={styles.component}>
            <div className={styles.button}>
                <button className={`${styles.subcategory} ${toggled ? styles.selected : null}`} onClick={() => { setToggled(prev => !prev); setToggleFilter(false); }}>{text}</button>
                {toggled ? <span onClick={() => setToggleFilter(prev => !prev)} className={styles.toggle}>⚙️</span> : null}
            </div>
            {toggleFilter ?
                <div className={styles.filter}>
                    <select className={styles.select} onChange={e => setSelected(e.target.value)}>
                        <option value="">Is equal to</option>
                    </select>
                    <input className={styles.input} onChange={e => setInput(e.target.value)} />
                </div>
                :
                null
            }
        </div>
    );
}