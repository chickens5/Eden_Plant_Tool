import React from 'react';
import '../styles/components.css'

export default function BackgroundVideo() {

    return (
        <div>
            <video loop autoPlay muted id="bg-video">
                <source src ={require('../styles/videos/bg-vid.mp4')} type="video/mp4" />
            </video>
        </div>
    )

}