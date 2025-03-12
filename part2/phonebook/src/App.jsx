import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

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
    };
    setPersons(persons.concat(personObject));
    setNewName("");
  };

  const handleInputChange = (event) => {
    setNewName(event.target.value);
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={AddPerson}>
        <div>
          Name: <input value={newName} onChange={handleInputChange} />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((p) => (
        <li key={p.name}>{p.name}</li>
      ))}
    </div>
  );
};

export default App;
