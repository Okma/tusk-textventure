import React from "react";
import './Scoreboard.css';

export default class Scoreboard extends React.Component {

    calculateScore = () => {
        let score = 0;

        // calculate credit score
        let credits = this.props.credits;
        let creditScores = {50000: 4000, 40000: 2000, 45000: 3000, 35000: 1000};
        let cutoffs = Object.keys(creditScores);
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
        // by default sorts keys in ascending order
        cutoffs = Object.keys(healthScores).reverse();
        for (let i = 0; i < cutoffs.length; i++) {
            let healthCheck = cutoffs[i];
            if (health >= healthCheck) {
                score += healthScores[healthCheck];
                break;
            }
        }

        let title;
        let titles = {
            16000: 'Outlawed Cosmonaut',
            11000: 'Maurading Rocketeer',
            6000: 'Burgling Pilot',
            1: 'Pick Pocketing Star Gazer'
        };
        // by default sorts keys in ascending order
        cutoffs = Object.keys(titles).reverse();
        for (let i = 0; i < cutoffs.length; i++) {
            if (score >= cutoffs[i]) {
                title = titles[cutoffs[i]];
                break;
            }
        }

        return {'score': score, 'title': title};
    };

    render() {
        let score = this.calculateScore();
        return (
            <>
                <div className={'container'}>
                    <h2>Congratulations!</h2>
                    {/*<table>
                        <tr><td>Outlawed Cosmonaut</td><td>16000</td></tr>
                        <tr><td>Maurading Rocketeer</td><td>11000</td></tr>
                        <tr><td>Burgling Pilot</td><td>6000</td></tr>
                        <tr><td>Pick Pocketing Star Gazer</td><td>1000</td></tr>
                    </table>*/}
                    <p className={'score'}>{score.score}</p>
                    <p className={'rank'}><br/>Your rank
                        is <span>{score.title}!</span></p>
                </div>
            </>
        );
    }
}
