import "./Leaderboard.css"
import { Country } from "./countries.ts";
import { useState } from "react";


type LeaderboardProps = {
    tilesCount: number,
    data: {
        country: Country,
        tiles: number
    }[]
}

export default function Leaderboard(props: LeaderboardProps) {
    const [isOpen, setIsOpen] = useState(true)
    const toggleLeaderboard = () => {
        setIsOpen(!isOpen)
    }

    return <div className="leaderboard">
        <div className="leaderboard-header">
            <img alt="ClickPlanet logo"
                 src="/static/logo.svg"
                 width="56px"
                 height="56px"/>
            <h1>ClickPlanet</h1>
        </div>
        <div className="leaderboard-expand">
            <button className="button button-leaderboard" onClick={toggleLeaderboard}>{isOpen ? "Hide" : "Champions"}</button>
        </div>
        {isOpen &&
            <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th colSpan={3}>🌍</th>
                            <th className="leaderboard-table-number leaderboard-table-tiles">⚪️</th>
                            <th className="leaderboard-table-number">%</th>
                        </tr>
                    </thead>

                    <tbody>
                        {props.data.map((entry, index) => {
                            return <tr key={index} className="leaderboard-entry">
                                <td className="leaderboard-entry-index" >{index + 1}.</td>
                                <td colSpan={3}>
                                    {(() => {
                                        const max_length = 18;
                                        const sliced = entry.country.name.slice(0, max_length)
                                        return sliced.length === max_length ? sliced.trim() + "" : sliced
                                    })()}
                                </td>
                                <td className="leaderboard-table-number leaderboard-table-tiles">{entry.tiles}</td>
                                <td className="leaderboard-table-number">
                                    {(entry.tiles / props.tilesCount * 100).toFixed(2)}
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        }
    </div >
}