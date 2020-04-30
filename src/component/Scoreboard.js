import React from "react";
import './Scoreboard.css';

export default function Scoreboard(props) {
    return (
        <>
            <div className={'container'}>
                <h2>Scoreboard</h2>
                <p className={'score'}>{props.data.score}</p>
                <p className={'rank'}>Congratulations!<br/>Your rank is <span>{props.data.title}</span></p>
            </div>
        </>
    );
}
