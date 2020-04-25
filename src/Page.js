import React from "react";
import './Page.css';

export default class Page extends React.Component {

    constructor(props) {
        super(props);
        this.onOptionSelect = props.onOptionSelect;
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.data['body'] !== this.props.data.body) {
            this.hasUpdated = false;
            return true;
        } else if (!this.hasUpdated) {
            return true;
        }

        return false
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let effects = this.props.data['effects'];
        if (effects != null && !this.hasUpdated) {
            // check for credit change
            let deltaCredits = effects['credits'];
            if (deltaCredits != null) {
                this.props.onCreditsChange(deltaCredits);
            }

            // check for health change
            let deltaHealth = effects['damage'];
            if (deltaHealth != null) {
                this.props.onHealthChange(deltaHealth);
            }

            this.hasUpdated = true;
        }
    }

    render() {
        return (
            <div className={'container'}>
                <h1>{this.props.data['title']}</h1>
                {this.props.data['body']}
                {this.props.data['options'].map((option) =>
                    <h3 key={option['text']}
                        onClick={() => this.onOptionSelect(option['target'])}>♦ {option['text']}</h3>
                )}
            </div>
        );
    }
}