import React, {ButtonHTMLAttributes, FC} from 'react';
import styled, { css } from 'styled-components'

const ButtonStyle = styled.button<ButtonProps>`

${({theme: {colors}}) => {
    return css`
        color: ${colors.light};
        background-color: ${colors.dark};
        border: 1px solid ${colors.light};
        margin: ${({theme}) => theme.fontSize.md};
        &:hover, &.active {
            outline: unset;
            background-color: ${colors.light};
            color: ${colors.dark};
        }
    `;
  }}
`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
}

const Button:FC<ButtonProps> = ({children, ...res}) => {
    return <ButtonStyle {...res}>{children}</ButtonStyle>
}

export default Button;