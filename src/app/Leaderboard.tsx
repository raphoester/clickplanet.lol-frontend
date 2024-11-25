import "./Leaderboard.css"
import {Country} from "./countries.ts";
import {useState} from "react";


type LeaderboardProps = {
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
        {isOpen && <table>
            <tbody>
            {props.data.map((entry, index) => {
                return <tr key={index} className="leaderboard-entry">
                    <td>
                        <span>{index + 1}</span>
                        <span><img
                            className="leaderboard-entry-flag"
                            src={`static/countries/svg/${entry.country.code.toLowerCase()}.svg`}
                            alt={`flag of ${entry.country.name}`}
                            title={entry.country.name}
                        />
                        </span>
                        <span>{(() => {
                            const sliced = entry.country.name.slice(0, 12)
                            return sliced.length === 12 ? sliced + "..." : sliced
                        })()}</span>
                    </td>
                    <td className="leaderboard-tiles">{entry.tiles}</td>
                </tr>
            })}
            </tbody>
        </table>}

    </div>
}