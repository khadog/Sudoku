import { FC, HTMLAttributes } from "react";
import styled from "styled-components";
import { Cell_Size } from "../utils/game";

const NotesStyle = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  font-size: 1rem;
  opacity: 0.8;
  line-height: 1.5rem;
`;

const ChildNoteStyle = styled.div`
  width: calc(${Cell_Size} / 3.1);
  height: calc(${Cell_Size} / 3.1);
`;

interface NotesProps extends HTMLAttributes<HTMLDivElement> {
  notes: { [key: number]: boolean };
}

const Notes: FC<NotesProps> = ({ notes }) => {
  return (
    <NotesStyle>
      {Object.keys(notes).map((key) => (
        <ChildNoteStyle key={key}>{notes[+key] ? key : ""}</ChildNoteStyle>
      ))}
    </NotesStyle>
  );
};

export default Notes;
