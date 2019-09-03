import React from "react";

export default function Letter(props) {
  return (
    <div className="letter shadow mr-3">
      {props.letter.isOpened && <span className="pb-1">
        {props.letter.letter}
      </span>}
    </div>
  );
}
