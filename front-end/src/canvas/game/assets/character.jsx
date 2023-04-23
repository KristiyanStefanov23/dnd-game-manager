import { Container, Graphics, Text } from '@pixi/react';
import { TextStyle } from 'pixi.js';
import { useCallback } from 'react';

function Character({ name, position }) {
    const draw = useCallback((g) => {
        g.beginFill(0xffffff);
        g.drawCircle(30, 30, 30);
        g.endFill();
    }, []);
    return (
        <Container position={position || [150, 30]}>
            <Text
                text={name || 'Name'}
                position={[30, 0]}
                anchor={0.5}
                style={new TextStyle({ fill: '#fff' })}
            />
            <Graphics position={[0, 20]} anchor={0.5} draw={draw} />
        </Container>
    );
}

export default Character;
