import React from "react";
import './Overlay.css';

function getKey(a, b) {
    return a * b + 32;
}

export default function Overlay(props) {

    let overlayClass;
    if (props.prev.credits !== props.current.credits) {
        overlayClass = 'flash-overlay-credits';
    }
    if (props.prev.health !== props.current.health) {
        overlayClass = 'flash-overlay-health';
    }

    let key = getKey(props.current.health, props.current.credits);
    return (
        <>
            <div key={key} className={'overlay'}
                 style={{animation: overlayClass + ' 1s ease-in-out'}}/>
        </>
    )
}