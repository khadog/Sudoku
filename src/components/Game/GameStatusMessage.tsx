import { FC } from "react";
import styled, { css } from 'styled-components'
import { Cell_Size, GameStatus } from "../../utils/game";
import {FaSmileBeam, FaSkull} from 'react-icons/fa';

const GameStatusMessageStyle = styled.div`

`;

const GameOverStyle = styled.section`
    ${({theme: {colors}}) => {
        return css`
        margin: 1rem auto;
        display: flex;
        align-items: center;
        justify-content: space-around;
        text-transform: uppercase;
        letter-spacing: .1rem;
        height: 50px;
        width: calc(9 * ${Cell_Size});
        color: ${colors.white};
        background-color: ${colors.danger};
        `;
    }}
`;

const GameSuccessStyle = styled.section`
    ${({theme: {colors}}) => {
        return css`
        margin: 1rem auto;
        display: flex;
        align-items: center;
        justify-content: space-around;
        text-transform: uppercase;
        letter-spacing: .1rem;
        height: 50px;
        width: calc(9 * ${Cell_Size});
        color: ${colors.white};
        background-color: ${colors.success};
        `;
    }}
`;

type GameProgressProps = {
    status: string
}

const GameStatusMessage:FC<GameProgressProps> = ({status}) => {
    
    if (status === GameStatus.failed){
        return <GameOverStyle><FaSkull /> Game Over <FaSkull /></GameOverStyle>
    }

    if (status === GameStatus.success){
        return <GameSuccessStyle><FaSmileBeam /> Congurations <FaSmileBeam /></GameSuccessStyle>
    }

    return <GameStatusMessageStyle>
    </GameStatusMessageStyle>
}

export default GameStatusMessage;