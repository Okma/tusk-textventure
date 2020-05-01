import React from 'react';
import update from 'immutability-helper';
import data from './data/data';
import Page from "./component/Page";
import Scoreboard from "./component/Scoreboard";
import Overlay from "./component/Overlay";
import AnimatedNumber from 'react-animated-number';
import shield from './img/shield.png';
import credits from './img/credits.png';
import death from './img/death.png';
import './App.css';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pages: data['pages'],
            current_page: 30,
            health: 100,
            credits: 0,
            deaths: 0
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.prevState = prevState;
    }

    onOptionSelect = (index) => {
        // death
        if (index === -1) {
            // TODO: currently goes back to start, but change to go back to prev choice
            this.setState(update(this.state,
                {
                    current_page: {$set: 2},
                    health: {$set: 100},
                    credits: {$set: 0}
                }
            ));
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
            }));
        } else {
            let nextPageData = this.state.pages[index];
            let effects = nextPageData['effects'];
            let newCredits = this.state.credits;
            let newHealth = this.state.health;
            if (effects != null) {
                // check for credit change
                if (effects['credits'] != null) {
                    newCredits += effects['credits'];
                }

                // check for health change
                if (effects['damage'] != null) {
                    newHealth -= effects['damage'];
                }
            }

            this.setState(update(this.state,
                {
                    current_page: {$set: index},
                    health: {$set: newHealth},
                    credits: {$set: newCredits}
                }
            ));
        }
    };

    render() {
        return (
            <>
                {this.prevState && <Overlay prev={this.prevState} current={this.state}/>}
                <div className={'container-fluid stats'}>
                    <AnimatedNumber
                        style={{
                            transition: '0.8s ease-out'
                        }}
                        stepPrecision={0}
                        duration={this.prevState ? 1000 : 1}
                        value={this.state.health}
                    />
                    <img height='30px' width='30px' src={shield} alt={'shield'}/>
                    <br/>
                    <AnimatedNumber
                        style={{
                            transition: '0.8s ease-out'
                        }}
                        stepPrecision={0}
                        duration={this.prevState ? 1000 : 1}
                        value={this.state.credits}
                    />
                    <img className={'credits-icon'} height='30px' width='22px' src={credits}
                         alt={'credits'}/>
                    <br/>
                    <AnimatedNumber
                        style={{
                            transition: '0.8s ease-out'
                        }}
                        stepPrecision={0}
                        duration={this.prevState ? 400 : 1}
                        value={this.state.deaths}
                    />
                    <img height='30px' width='30px' src={death} alt={'death'}/>
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