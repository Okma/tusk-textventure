import React from 'react';
import update from 'immutability-helper';
import Page from "./Page";
import data from './data/data';
import './App.css';

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
        let cutoffs = creditScores.keys();
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
                score += deathScores[cutoffs[i]];
                break;
            }
        }

        // calculate health score
        let health = this.state.health;
        let healthScores = {76: 10000, 51: 8000, 26: 4000, 1: 2000};
        cutoffs = healthScores.keys();
        for (let i = 0; i < cutoffs.length; i++) {
            if (health >= cutoffs[i]) {
                score += healthScores[cutoffs[i]];
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
        cutoffs = titles.keys();
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
        if (index > 0) {
            this.setState(update(this.state, {current_page: {$set: index}}));
        } else if (index === -2) {
            // win screen
            let score = this.calculateScore();

        } else if (index === -1) {
            // death

        }
    };

    render() {
        return (
            <>
                <div className={'container-fluid score'}>
                    <p>Shield: {this.state.health}</p>
                    <p>Credits: {this.state.credits}</p>
                    <p>Deaths: {this.state.deaths}</p>
                </div>
                <Page
                    data={this.state.pages[this.state.current_page]}
                    onOptionSelect={this.onOptionSelect}
                    onCreditsChange={this.onCreditsChange}
                    onHealthChange={this.onHealthChange}
                />
            </>
        );
    }
}