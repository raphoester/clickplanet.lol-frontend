import "./Leaderboard.css"
import {Country} from "./countries.ts";


type LeaderboardProps = {
    data: {
        country: Country,
        tiles: number
    }[]
}

export default function Leaderboard(props: LeaderboardProps) {
    if (props.data.length == 0) {
        props.data.push(
            {country: {name: "Bulgaria", code: "bg"}, tiles: 1000},
            {country: {name: "France", code: "fr"}, tiles: 500},
            {country: {name: "British Indian Ocean Territory", code: "io"}, tiles: 300},
        )
    }
    return <div className="leaderboard">
        <h2 className="leaderboard-title">Leaderboard</h2>
        <table>
            <tbody>
            {props.data.map((entry, index) => {
                return <tr key={index} className="leaderboard-entry">
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