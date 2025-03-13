import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-1234567" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

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

  const HandleInputChange = (event, setValue) => {
    setValue(event.target.value);
  };

  const personsToShow =
    filter.length > 0
      ? persons.filter((p) => {
          let personNameTrimmed = p.name.slice(0, filter.length);
          if (personNameTrimmed.toLowerCase() === filter.toLowerCase()) {
            return true;
          }
        })
      : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        Filter shown with:
        <input
          value={filter}
          onChange={(event) => HandleInputChange(event, setFilter)}
        />
      </div>
      <h2>Add a new contact</h2>
      <form onSubmit={AddPerson}>
        <div>
          Name:{" "}
          <input
            value={newName}
            onChange={(event) => HandleInputChange(event, setNewName)}
          />
        </div>
        <div>
          Number:{" "}
          <input
            value={newNumber}
            onChange={(event) => HandleInputChange(event, setNewNumber)}
          />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map((p) => (
        <li key={p.name}>
          {p.name} ({p.number})
        </li>
      ))}
    </div>
  );
};

export default App;
