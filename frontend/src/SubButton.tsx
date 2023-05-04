import { useEffect, useState } from "react";
import styles from "./SubButton.module.css";

export default function SubButton({ text, qKey, cmp, setState, setFilter, type, mandatory }: { text: String, qKey: string, cmp: string, setState: React.Dispatch<React.SetStateAction<string>>, setFilter: React.Dispatch<React.SetStateAction<string>>, type: string, mandatory?: boolean }) {
    const [toggled, setToggled] = useState(mandatory ? true : false);

    const [selected, setSelected] = useState("0");
    const [input, setInput] = useState("");

    const [toggleFilter, setToggleFilter] = useState(false);

    useEffect(() => {
        setState(toggled ? qKey : "");
        setFilter(toggleFilter ? `${qKey}: ${type == "string" ? `"${input}"` : input}, ${cmp}: ${selected}` : "");
    }, [toggled, input, toggleFilter, selected]);
    return (
        <div className={styles.component}>
            <div className={styles.button}>
                <button className={`${styles.subcategory} ${toggled ? styles.selected : null}`} onClick={() => { if (!mandatory) { setToggled(prev => !prev); setToggleFilter(false); } }}>{text}</button>
                {toggled ? <span onClick={() => setToggleFilter(prev => !prev)} className={styles.toggle}>⚙️</span> : null}
            </div>
            {toggleFilter ?
                <div className={styles.filter}>
                    <select className={styles.select} value={selected} onChange={e => setSelected(e.target.value)}>
                        {type == "string" ?
                            <>
                                <option value="0">Is equal to</option>
                                <option value="1">Starts with</option>
                                <option value="2">Ends with</option>
                                <option value="3">Contains</option>
                            </>
                            :
                            <>
                                <option value="0">Is equal to</option>
                                <option value="1">Greater than</option>
                                <option value="2">Smaller than</option>
                            </>
                        }
                    </select>
                    <input placeholder="Limit data" className={styles.input} onChange={e => setInput(e.target.value)} value={input} />
                    {/* Make a "REQUIRE" section that only shows results if a match is found */}
                </div>
                :
                null
            }
        </div>
    );
}