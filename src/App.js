import React from 'react';
import update from 'immutability-helper';
import Page from "./Page";
import data from './data/data';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pages: data['pages'],
            current_page: 0,
            health: 100,
            credits: 0
        }
    }

    onHealthChange = (delta) => {
        this.setState(update(this.state, {health: {$set: this.state.health - delta}}));

        // check if health <= 0
        if (this.state.health <= 0) {
            // death page
            this.onOptionSelect(32)
        } else {

        }
    };

    onCreditsChange = (delta) => {
        this.setState(update(this.state, {credits: {$set: this.state.credits + delta}}));
    };

    onOptionSelect = (index) => {
        if (index > 0) {
            this.setState(update(this.state, {current_page: {$set: index}}));
        }
    };

    render() {
        return (
            <Page
                data={this.state.pages[this.state.current_page]}
                onOptionSelect={this.onOptionSelect}
                onCreditsChange={this.onCreditsChange}
                onHealthChange={this.onHealthChange}
            />
        );
    }
}