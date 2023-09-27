import React, { useState } from "react";
import axios from "axios";

function SettingsPage() {
  const [file, setFile] = useState("");
  async function OpenAI() {
    const data =
      "{'Slab': [{'prop': {'L,W': (55.4, 68.3), 'Area': 2457.283}, 'quantity': 1}], 'Opening': [{'prop': {'L,W': (3.0, 4.9), 'Area': 14.7}, 'quantity': 1}, {'prop': {'L,W': (4.6, 2.2), 'Area': 10.12}, 'quantity': 1}, {'prop': {'L,W': (2.8, 2.8), 'Area': 7.84}, 'quantity': 1}], 'Columns': [{'prop': {'L,W': (0.6, 0.2), 'Area': 0.12}, 'quantity': 69}, {'prop': {'L,W': (0.2, 0.6), 'Area': 0.12}, 'quantity': 2}], 'Shear wall': [{'prop': {'length': 2.8}, 'quantity': 1}, {'prop': {'length': 5.5}, 'quantity': 1}, {'prop': {'length': 3.0}, 'quantity': 1}, {'prop': {'length': 5.0}, 'quantity': 1}, {'prop': {'length': 0.25}, 'quantity': 1}, {'prop': {'length': 3.2}, 'quantity': 3}, {'prop': {'length': 5.1}, 'quantity': 1}, {'prop': {'length': 2.4}, 'quantity': 1}, {'prop': {'length': 4.8}, 'quantity': 1}, {'prop': {'length': 3.5}, 'quantity': 1}, {'prop': {'length': 7.0}, 'quantity': 4}, {'prop': {'length': 1.6}, 'quantity': 1}, {'prop': {'length': 1.0}, 'quantity': 2}]}";

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/open_ai", {
        data: data,
      });
      const reponseai = await response.data;
      setFile(reponseai.data);
      console.log(reponseai.data);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div onClick={OpenAI}>
      <div className="btn">btton</div>
      {file}
    </div>
  );
}

export default SettingsPage;
