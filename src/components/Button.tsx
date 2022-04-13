import React, {ButtonHTMLAttributes, FC} from 'react';

import styled, { useTheme, css } from 'styled-components'

const ButtonStyle = styled.button<ButtonProps>`

${({theme: {colors}}) => {
    return css`
        color: ${colors.light};
        background-color: ${colors.dark};
        border: 1px solid ${colors.light};
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
    const theme = useTheme()
    return <ButtonStyle theme={theme} {...res}>{children}</ButtonStyle>
}

export default Button;