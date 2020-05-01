import React from "react";
import './Overlay.css';

export default function Overlay(props) {
    let overlayClass;
    // console.log(props.prev);
    // console.log(props.current);
    if (props.prev.credits !== props.current.credits) {
        overlayClass = 'flash-overlay-credits';
    }
    if (props.prev.health !== props.current.health) {
        overlayClass = 'flash-overlay-health';
    }

    return (
        <>
            <div className={'overlay'}
                 style={{animation: overlayClass + ' 1s ease-in-out'}}/>
        </>
    )
}