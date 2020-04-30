import React from 'react';
import update from 'immutability-helper';
import data from './data/data';
import Page from "./component/Page";
import Scoreboard from "./component/Scoreboard";
import './App.css';
import shield from './img/shield.png';
import credits from './img/credits.png';
import death from './img/death.png';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pages: data['pages'],
            current_page: 0,
            health: 100,
            credits: 0,
            deaths: 0
        }
    }

    onHealthChange = (delta) => {
        this.setState(update(this.state, {health: {$set: this.state.health - delta}}));
        // check if health <= 0
        if (this.state.health <= 0) {
            // death page
            this.setState(update(this.state, {deaths: {$set: this.state.deaths + 1}}));
            this.onOptionSelect(32);
        }
    };

    calculateScore = () => {
        let score = 0;

        // calculate credit score
        let credits = this.state.credits;
        let creditScores = {50000: 4000, 40000: 2000, 45000: 3000, 35000: 1000};
        let cutoffs = Object.keys(creditScores);
        for (let i = 0; i < cutoffs.length; i++) {
            if (credits >= cutoffs[i]) {
                score += creditScores[cutoffs[i]];
                break;
            }
        }

        // calculate death score
        let deaths = this.state.deaths;
        let deathScores = [2000, -2000, -4000, -8000];
        for (let i = deathScores.length - 1; i >= 0; i--) {
            if (deaths >= i) {
                score += deathScores[i];
                break;
            }
        }

        // calculate health score
        let health = this.state.health;
        let healthScores = {1: 2000, 26: 4000, 51: 8000, 76: 10000};
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
        cutoffs = Object.keys(titles).reverse();
        for (let i = 0; i < cutoffs.length; i++) {
            if (score >= cutoffs[i]) {
                title = titles[cutoffs[i]];
                break;
            }
        }

        return {'score': score, 'title': title};
    };

    onCreditsChange = (delta) => {
        this.setState(update(this.state, {credits: {$set: this.state.credits + delta}}));
    };

    onOptionSelect = (index) => {
        this.setState(update(this.state, {current_page: {$set: index}}));
        if (index === -1) {
            // death

        }
    };

    render() {
        return (
            <>
                <div className={'container-fluid stats'}>
                    <p>{this.state.health} <img height='30px' width='30px' src={shield}
                                                alt={'shield'}/></p>
                    <p>{this.state.credits} <img className={'credits-icon'} height='30px'
                                                 width='22px' src={credits} alt={'credits'}/></p>
                    <p>{this.state.deaths} <img height='30px' width='30px' src={death}
                                                alt={'death'}/></p>
                </div>
                {this.state.current_page >= 0 &&
                <Page
                    data={this.state.pages[this.state.current_page]}
                    onOptionSelect={this.onOptionSelect}
                    onCreditsChange={this.onCreditsChange}
                    onHealthChange={this.onHealthChange}
                />}
                {this.state.current_page === -2 &&
                <Scoreboard data={this.calculateScore()}/>
                }
            </>
        );
    }
}