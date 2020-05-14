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
import coinSound from "./audio/coins.wav";
import damageSound from "./audio/damage.wav";

const Sound = require('react-sound').default;

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pages: data['pages'],
            current_page: 0,
            health: 100,
            credits: 0,
            deaths: 0,
            soundSrc: null,
            soundStatus: Sound.status.STOPPED
        };
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
        // death: reset to previous choice
        if (index === -1) {
            this.setState(update(this.state,
                {
                    current_page: {$set: this.deathState.current_page},
                    health: {$set: this.deathState.health},
                    credits: {$set: this.deathState.credits}
                }
            ));
            this.deathState = null;
        }
        // death: reset to beginning
        else if (index === -3) {
            this.setState(update(this.state,
                {
                    current_page: {$set: 2},
                    health: {$set: 100},
                    credits: {$set: 0}
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
                    nextState['soundSrc'] = {$set: coinSound};
                    nextState['soundStatus'] = {$set: Sound.status.PLAYING};
                }

                // check for health change
                if (effects['damage'] != null) {
                    nextState["health"] = {$set: this.state.health - effects['damage']};
                    nextState['effect'] = {$set: 'damage'};
                    nextState['soundSrc'] = {$set: damageSound};
                    nextState['soundStatus'] = {$set: Sound.status.PLAYING};
                }
            }
            // assign next state
            this.setState(update(this.state, nextState));
        }
    };

    onReset = () => {
        this.setState({
            pages: data['pages'],
            current_page: 2,
            health: 100,
            credits: 0,
            deaths: 0,
            soundSrc: null,
            soundStatus: Sound.status.STOPPED
        });
    };

    render() {
        const icons = [shield_icon, credits_icon, death_icon];
        return (
            <>
                <Overlay current={this.state}/>
                <Sound
                    url={this.state.soundSrc}
                    playStatus={this.state.soundStatus}
                    volume={30}
                    autoLoad={true}
                    onFinishedPlaying={() => {
                        this.setState(update(this.state, {$set: {soundStatus: Sound.status.STOPPED}}))
                    }}
                />
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
                    onReset={this.onReset}
                />}
            </>
        );
    }
}