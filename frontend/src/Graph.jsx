import * as d3 from "d3";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Graph.module.css";

export default function Graph({ nodes, links, selected, setSelected, setPreview }) {
    const canvasRef = useRef(null);
    const [offsetX, setOffsetX] = useState(-500);
    const [offsetY, setOffsetY] = useState(-500);
    const [zoom, setZoom] = useState(1000);
    const [drag, setDrag] = useState(false);

    const updateSelected = useCallback((prev, node) => {
        if (!prev[0] && !prev[1]) {
            // Scenario 1: Both are empty -> Insert as first
            return [node, undefined];
        } else if ((prev[0] && !prev[1]) || (!prev[0] && prev[1])) {
            // Scenario 2: One is selected, other is empty -> Insert at missing
            if (prev[0]) {
                return prev[0][0] == node[0] ? prev : [prev[0], node];
            } else {
                return prev[1][0] == node[0] ? prev : [node, prev[1]];
            }
        } else {
            if (prev[0][0] == node[0] || prev[1][0] == node[0]) {
                // Scenario 3: Two are selected, one of which is the one clicked -> Switch
                return [prev[1], prev[0]];
            } else {
                // Scenario 4: Two are selected, none of which is the one clicked -> Replace second
                return [prev[0], node];
            }
        }
    });

    useEffect(() => {
        const svg = d3.select("svg");

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink().id(d => d.id).links(links).strength(0.3))
            .force("charge", d3.forceManyBody().strength(-2000))
            // .force("center", d3.forceCenter(400, 400))
            .on("tick", () => {
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);

                pair
                    .attr("x", d => d.x - 25)
                    .attr("y", d => d.y - 25);
            });

        const link = svg.selectAll("line").data(links).join("line")
            .style("stroke", "#4a4a4a4a");

        const pair = svg.selectAll("svg").data(nodes).join("svg").attr("width", 50).attr("height", 50).attr("viewBox", "-26 -26 52 52").style("cursor", "pointer").style("user-select", "none").call(drag(simulation));

        let node = pair.append("circle")
            .attr("r", 25)
            .style("stroke", "#4a4a4a")
            .style("fill", "#4a4a4a4a")
            .on("mouseover", d => {
                setPreview(d.target.__data__);
            })
            .on("dblclick", d => {
                let data = d.target.__data__;
                setSelected(prev => updateSelected(prev, [data.id, data.icon == "👨🏻" ? data.name : data.title, data.icon]));
            });

        let text = pair.append("text")
            .attr("pointer-events", "none")
            .attr("fill", "#fff")
            .style("font-size", 30)
            .attr("x", -15)
            .attr("y", 10)
            .text(d => d.icon);

        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

        return () => {
            if (canvasRef.current != null) canvasRef.current.innerHTML = "";
        }
    }, [nodes, links])
    return (
        <svg className={styles.graph} ref={canvasRef} viewBox={`${offsetX} ${offsetY} ${zoom} ${zoom}`}
            onMouseDown={(e) => setDrag([[offsetX, offsetY], [e.clientX, e.clientY]])}
            onMouseMove={(e) => {
                if (drag) {
                    setOffsetX(() => drag[0][0] + (drag[1][0] - e.clientX) * zoom / 1000);
                    setOffsetY(() => drag[0][1] + (drag[1][1] - e.clientY) * zoom / 1000);
                }
            }}
            onMouseUp={() => setDrag(false)}
            onWheel={(e) => {
                setZoom(prev => prev + e.deltaY);
                setOffsetX(prev => prev - e.deltaY * zoom / 15000);
                setOffsetY(prev => prev - e.deltaY * zoom / 15000);
            }}
        />
    );
}