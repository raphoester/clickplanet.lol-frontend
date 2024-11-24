import "./Leaderboard.css"
import {Country} from "./countries.ts";


type LeaderboardProps = {
    data: {
        country: Country,
        tiles: number
    }[]
}

export default function Leaderboard(props: LeaderboardProps) {
    return <div className="leaderboard">
        <h2 className="leaderboard-title">Leaderboard</h2>
        <table>
            <tbody>
            {props.data.map((entry, index) => {
                return <tr key={index} className="leaderboard-entry">
                    <td>{index + 1}</td>
                    <td>{(() => {
                        const sliced = entry.country.name.slice(0, 20)
                        return sliced.length === 20 ? sliced + "..." : sliced
                    })()}</td>
                    <td><img
                        className="leaderboard-entry-flag"
                        src={`static/countries/svg/${entry.country.code.toLowerCase()}.svg`}
                        alt={`flag of ${entry.country.name}`}
                        title={entry.country.name}
                    />
                    </td>
                    <td>{entry.tiles}</td>
                </tr>
            })}
            </tbody>
        </table>
    </div>
}