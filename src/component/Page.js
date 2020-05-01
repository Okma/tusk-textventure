import React from "react";
import './Page.css';

export default class Page extends React.Component {

    constructor(props) {
        super(props);
        this.onOptionSelect = props.onOptionSelect;
    }

    render() {
        return (
            <div className={'page container'}>
                <h1 className={'title'}>{this.props.data['title']}</h1>
                <p className={'body'}>{this.props.data['body']} </p>
                <div className={'options'}>
                    {this.props.data['options'].map((option) =>
                        <p className={'option'} key={option['text']}
                           onClick={() => this.onOptionSelect(option['target'])}>♦ {option['text']}</p>
                    )}
                </div>
            </div>
        );
    }
}