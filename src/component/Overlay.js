import React from "react";
import './Overlay.css';

export default function Overlay(props) {
    let overlayClass;

    let key = props.current.health + props.current.credits;
    let effect = props.current.effect;
    if (effect != null) {
        if (effect === 'damage') {
            overlayClass = 'flash-overlay-health';
        } else if (effect === 'credits') {
            overlayClass = 'flash-overlay-credits';
        }
    } else {
        overlayClass = '';
    }

    return (
        <>
            <div key={key} className={'overlay'}
                 style={{animation: overlayClass + ' 1s ease-in-out'}}/>
        </>
    )
}