import { useSpring, animated, to as interpolate } from 'react-spring';
import { useEffect, useState } from 'react';
import { ReactComponent as EdenSVG } from '../styles/eden-logo.svg'; // update path if needed



export default function AnimatedBackground() {
    const [offset, setOffset] = useState([0, 0]);

    // Mouse parallax tracking
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setOffset([x, y]);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const animatedProps = useSpring({
        loop: true,
        from: { scale: 1, y: 0 },
        to: async (next) => {
            while (true) {
                await next({ y: -10, scale: 1.02 });
                await next({ y: 0, scale: 1 });
            }
        },
        config: { duration: 6000 }
    });

    const parallaxProps = useSpring({
        x: offset[0],
        y: offset[1],
        config: { mass: 5, tension: 350, friction: 40 }
    });

    return (
        <div>
            <animated.div
                style={{
                    transform: interpolate(
                        [animatedProps.y, animatedProps.scale, parallaxProps.x, parallaxProps.y],
                        (y, scale, x, yP) =>
                            `translate3d(${x}px, ${y + yP}px, 0) scale(${scale})`
                    ),
                    width: '100%',
                    height: '100%',
                    margin: 1,
                    opacity: 2.2,
                    filter: 'brightness(1.5) sepia(0.3) hue-rotate(10deg) saturate(1.9)'
                }}
            >
                <EdenSVG style={{ width: '100%', height: '200px', padding: '25px' }} />
            </animated.div>
        </div>
    );
}