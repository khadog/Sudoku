import { FC, HTMLAttributes } from "react";
import styled, { css } from "styled-components";
import { Cell_Size } from "../utils/game";

const NotesStyle = styled.div`
  ${({ theme: { colors } }) => {
    return css`
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      height: 100%;
      font-size: 1rem;
      opacity: 0.8;
    `;
  }}
`;

const ChildNoteStyle = styled.div`
  ${({ theme: { colors } }) => {
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc(${Cell_Size} / 4);
      height: calc(${Cell_Size} / 4);
    `;
  }}
`;

interface NotesProps extends HTMLAttributes<HTMLDivElement> {
  notes: { [key: number]: boolean };
}

const Notes: FC<NotesProps> = ({ notes }) => {
  console.log(notes);

  return (
    <NotesStyle>
      {Object.keys(notes).map((key) => (
        <ChildNoteStyle key={key}>{notes[+key] ? key : ""}</ChildNoteStyle>
      ))}
    </NotesStyle>
  );
};

export default Notes;
