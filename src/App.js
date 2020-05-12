import React from 'react';
import update from 'immutability-helper';
import data from './data/data';
import Page from "./component/Page";
import Scoreboard from "./component/Scoreboard";
import Overlay from "./component/Overlay";
import AnimatedNumber from 'react-animated-number';
import shield_icon from './img/shield.png';
import credits_icon from './img/credits.png';
import death_icon from './img/death.png';
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        // if dead, cache the last page the player saw
        if (this.state.health <= 0 && this.deathState == null) {
            this.deathState = prevState;
        }

        // move to top of page after each selection
        window.scrollTo(0, 0);
    }

    onOptionSelect = (index) => {
        // death
        if (index === -1) {
            // on death, go back to previous choice
            this.setState(update(this.state,
                {
                    current_page: {$set: this.deathState.current_page},
                    health: {$set: this.deathState.health},
                    credits: {$set: this.deathState.credits}
                }
            ));
            this.deathState = null;
        }
        // scoreboard
        else if (index === -2) {
            this.setState(update(this.state,
                {
                    current_page: {$set: -2},
                }
            ));
        }
        // check if health <= 0
        else if (this.state.health <= 0) {
            // death page
            this.setState(update(this.state, {
                current_page: {$set: 32},
                deaths: {$set: this.state.deaths + 1},
                effect: {$set: null},
            }));
        } else {
            // start constructing next state as appropriate
            let nextState = {
                current_page: {$set: index}
            };

            let nextPageData = this.state.pages[index];
            let effects = nextPageData['effects'];
            if (effects != null) {
                // check for credit change
                if (effects['credits'] != null) {
                    nextState['credits'] = {$set: this.state.credits + effects['credits']};
                    nextState['effect'] = {$set: 'credits'};
                }

                // check for health change
                if (effects['damage'] != null) {
                    nextState["health"] = {$set: this.state.health - effects['damage']};
                    nextState['effect'] = {$set: 'damage'};
                }
            }

            // assign next state
            this.setState(update(this.state, nextState));
        }
    };

    render() {
        const icons = [shield_icon, credits_icon, death_icon];
        return (
            <>
                <Overlay current={this.state}/>
                <div className={'container-fluid stats'}>
                    {[this.state.health, this.state.credits, this.state.deaths].map((stat, i) =>
                        <React.Fragment key={i}>
                            <AnimatedNumber
                                style={{
                                    transition: '0.8s ease-out'
                                }}
                                stepPrecision={0}
                                duration={this.state.current_page > 0 ? 1000 : 1}
                                value={stat}
                            />
                            <img className={i === 1 ? 'credits-icon' : ''} height='30px'
                                 width='30px' src={icons[i]} alt={stat}/>
                            <br/>
                        </React.Fragment>
                    )}
                </div>
                {this.state.current_page >= 0 &&
                <Page
                    data={this.state.pages[this.state.current_page]}
                    onOptionSelect={this.onOptionSelect}
                />}
                {this.state.current_page === -2 &&
                <Scoreboard
                    health={this.state.health}
                    credits={this.state.credits}
                    deaths={this.state.deaths}
                />}
            </>
        );
    }
}