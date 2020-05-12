import React from "react";
import './Scoreboard.css';
import confetti from 'canvas-confetti';

export default class Scoreboard extends React.Component {

    playConfetti = () => {
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const duration = 5 * 1000; // ms
        const animationEnd = Date.now() + duration;
        const defaults = {startVelocity: 30, spread: 360, ticks: 60, zIndex: 0};

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 200 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: {x: randomInRange(0.1, 0.3), y: Math.random() - 0.2}
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: {x: randomInRange(0.7, 0.9), y: Math.random() - 0.2}
            }));
        }, 250);
    };

    calculateScore = () => {
        let score = 0;

        // calculate credit score
        let credits = this.props.credits;
        let creditScores = {50000: 4000, 45000: 3000, 40000: 2000, 35000: 1000};
        // sort keys in descending order
        let cutoffs = Object.keys(creditScores).reverse();
        for (let i = 0; i < cutoffs.length; i++) {
            if (credits >= cutoffs[i]) {
                score += creditScores[cutoffs[i]];
                break;
            }
        }

        // calculate death score
        let deaths = this.props.deaths;
        let deathScores = [2000, -2000, -4000, -8000];
        for (let i = deathScores.length - 1; i >= 0; i--) {
            if (deaths >= i) {
                score += deathScores[i];
                break;
            }
        }

        // calculate health score
        let health = this.props.health;
        let healthScores = {1: 2000, 26: 4000, 51: 8000, 76: 10000};
        // sort keys in descending order
        cutoffs = Object.keys(healthScores).reverse();
        for (let i = 0; i < cutoffs.length; i++) {
            let healthCheck = cutoffs[i];
            if (health >= healthCheck) {
                score += healthScores[healthCheck];
                break;
            }
        }

        return score;
    };

    start = (score) => {
        // console.log(score);

        // end with confetti
        this.playConfetti();
    };

    render() {
        let titles = {
            16000: 'Outlawed Cosmonaut',
            11000: 'Marauding Rocketeer',
            6000: 'Burgling Pilot',
            1000: 'Pick Pocketing Star Gazer'
        };

        let score = this.calculateScore();
        this.start(score);

        let keys = Object.keys(titles).reverse().map((n) => parseInt(n));
        let target = keys.find((cutoff) => score >= cutoff);
        return (
            <>
                <div className={'container'}>
                    <h2>Congratulations!</h2>
                    {/*<table className={'table'}>
                    </table>*/}
                    <table className={'table score-table'}>
                        <thead>
                        <tr>
                            <th scope="col">Rank</th>
                            <th scope="col">Score Requirement</th>
                        </tr>
                        </thead>
                        <tbody>
                        {keys.map((cutoff) =>
                            <tr key={cutoff}>
                                {target === cutoff &&
                                <th className={'title-active'}
                                    scope={'row'}>{score >= cutoff ? titles[cutoff] : "???"}</th>}
                                {target !== cutoff &&
                                <td className={target > cutoff ? 'title-inactive' : ''}>
                                    {score >= cutoff ? titles[cutoff] : "???"}
                                </td>
                                }
                                <td>{cutoff}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    {target !== 16000 ?
                        <div className={'helper'}>Play again for a higher score!</div> :
                        <div className={'helper'}>Good job! You reached the highest possible
                            score!</div>
                    }
                </div>
            </>
        );
    }
}
