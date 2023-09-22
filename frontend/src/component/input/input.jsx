import React, { useState } from "react";
import "./input.css";

function Input({ onchange, label, name, type, value }) {
  const [showLabel, setShowLabel] = useState(false);

  const isEmpty = (e) => {
    if (e.target.value == "") {
      setShowLabel(false);
    } else {
      setShowLabel(true);
    }
  };

  return (
    <div className="flex column input ">
      <label
        htmlFor={name}
        className={
          showLabel || value ? " label label-class" : " label none-opacity"
        }>
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={value ? value : label}
        onChange={(e) => {
          onchange(e);
          isEmpty(e);
        }}
      />
    </div>
  );
}

export default Input;
