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
                <div className={'body'}>
                    {this.props.data['body'].split('\n').map((item, i) =>
                        <p className={'paragraph'} key={i}>&#8195;{item}</p>)
                    }
                </div>
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