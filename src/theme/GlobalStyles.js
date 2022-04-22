import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    background: ${({ theme }) => theme.colors.light};
    color: ${({ theme }) => theme.colors.dark};
    font-family: ${({ theme }) => theme.font};
    transition: all 0.50s linear;
  }

  button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    padding:${({ theme }) => theme.fontSize.xs + theme.fontSize.sm}; 
    font-size: ${({ theme }) => theme.fontSize.md};
    font-family: ${({ theme }) => theme.font};
  }
`;
