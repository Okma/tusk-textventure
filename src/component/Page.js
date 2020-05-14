import React from "react";
import './Page.css';
import optionSound from '../audio/option.wav';
const Sound = require('react-sound').default;

export default class Page extends React.Component {

    constructor(props) {
        super(props);
        this.onOptionSelect = props.onOptionSelect;
        this.state = {
            soundStatus: Sound.status.STOPPED
        }
    }

    playOptionHoverSoundFx = () => {
        this.setState({soundStatus: Sound.status.PLAYING})
    };

    render() {
        return (
            <div className={'page container'}>
                <h1 className={'title'}>{this.props.data['title']}</h1>
                <div className={'body'}>
                    {this.props.data['body'].split('\n').map((item, i) =>
                        <p className={'paragraph'} key={i}>&#8195;{item}</p>)
                    }
                </div>
                <div className={'options'}>
                    {this.props.data['options'].map((option) =>
                        <p className={'option'} key={option['text']}
                           onMouseEnter={() => this.playOptionHoverSoundFx()}
                           onClick={() => this.onOptionSelect(option['target'])}>♦ {option['text']}</p>
                    )}
                    <Sound
                        url={optionSound}
                        playStatus={this.state.soundStatus}
                        volume={15}
                        autoLoad={true}
                        onFinishedPlaying={() => {
                            this.setState({soundStatus: Sound.status.STOPPED})
                        }}
                    />
                </div>
            </div>
        );
    }
}