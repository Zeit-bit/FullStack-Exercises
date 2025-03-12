import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-1234567" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const AddPerson = (event) => {
    event.preventDefault();

    const newNameAlreadyExists =
      persons.find((p) => p.name === newName) !== undefined;
    if (newNameAlreadyExists) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };
    setPersons(persons.concat(personObject));
    setNewName("");
    setNewNumber("");
  };

  const handleInputChange = (event, setValue) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={AddPerson}>
        <div>
          Name:{" "}
          <input
            value={newName}
            onChange={(event) => handleInputChange(event, setNewName)}
          />
        </div>
        <div>
          Number:{" "}
          <input
            value={newNumber}
            onChange={(event) => handleInputChange(event, setNewNumber)}
          />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((p) => (
        <li key={p.name}>
          {p.name} ({p.number})
        </li>
      ))}
    </div>
  );
};

export default App;
