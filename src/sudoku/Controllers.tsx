import { FC } from "react";
import styled, { css } from "styled-components";
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaArrowAltCircleUp,
} from "react-icons/fa";

const ControllersStyle = styled.div`
  ${({ theme: { colors } }) => {
    return css`
      display: flex;
      align-items: start;
      flex-direction: column;
      text-align: left;
      width: 100%;
      margin-top: 1rem;
      color: ${colors.light};
      font-size: ${({ theme }) => theme.fontSize.md};
    `;
  }}
`;

const ChildControllerStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.2rem;

  .title {
    display: flex;
    align-items: center;
    min-width: 150px;

    svg {
      margin-left: 1rem;
    }
  }
`;

type ControllerType = {
  title: string;
  description: string;
  icon?: any;
};

const ControllersList: ControllerType[] = [
  {
    title: "W",
    description: "Move up",
    icon: <FaArrowAltCircleUp />,
  },
  {
    title: "S",
    description: "Move down",
    icon: <FaArrowAltCircleDown />,
  },
  {
    title: "A",
    description: "Move left",
    icon: <FaArrowAltCircleLeft />,
  },
  {
    title: "D",
    description: "Move right",
    icon: <FaArrowAltCircleRight />,
  },
  {
    title: "Space",
    description: "Toggle notes mode",
  },
  {
    title: "Enter",
    description: "Hint",
  },
  {
    title: "Backspace",
    description: "Erase",
  },
];

const Controllers: FC = () => {
  return (
    <ControllersStyle>
      {ControllersList.map((item, key) => (
        <ChildController key={key} {...item}></ChildController>
      ))}
    </ControllersStyle>
  );
};

export default Controllers;

const ChildController: FC<ControllerType> = ({ title, description, icon }) => {
  return (
    <ChildControllerStyle>
      <span className="title">
        {title}
        {icon && icon}
      </span>
      <span>{description}</span>
    </ChildControllerStyle>
  );
};
