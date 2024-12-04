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

    return <div className="leaderboard clean-scrollbar">
        <div className="leaderboard-header" onClick={toggleLeaderboard}>
            <h2 className="leaderboard-title">Leaderboard</h2>
            <p className="leaderboard-caption">(click to {isOpen ? "collapse" : "expand"})</p>
        </div>
        {isOpen &&
            <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th colSpan={3} >Country</th>
                            <th>%</th>
                            <th>Tiles</th>
                        </tr>
                    </thead>

                    <tbody>
                        {props.data.map((entry, index) => {
                            return <tr key={index} className="leaderboard-entry">
                                <td className="leaderboard-entry-index" >{index + 1}.</td>
                                <td className="leaderboard-entry-flag-container"><img
                                    className="leaderboard-entry-flag"
                                    src={`static/countries/svg/${entry.country.code.toLowerCase()}.svg`}
                                    alt={`flag of ${entry.country.name}`}
                                    title={entry.country.name}
                                />
                                </td>
                                <td className="leaderboard-entry-countryname">
                                    {(() => {
                                        const max_length = 17;
                                        const sliced = entry.country.name.slice(0, max_length)
                                        return sliced.length === max_length ? sliced.trim() + "..." : sliced
                                    })()}
                                </td>
                                <td className="leaderboard-entry-percentage">
                                    {(entry.tiles / props.tilesCount * 100).toFixed(2)}%
                                </td>
                                <td className="leaderboard-tiles">{entry.tiles}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        }
    </div >
}