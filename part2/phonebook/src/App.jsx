import { useState, useEffect } from "react";
import contactService from "./services/contacts";

const Filter = ({ filter, setFilter, HandleInputChange }) => {
  return (
    <div>
      Filter shown with:
      <input
        value={filter}
        onChange={(event) => HandleInputChange(event, setFilter)}
      />
    </div>
  );
};

const ContactForm = ({
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  AddPerson,
  HandleInputChange,
}) => {
  return (
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
  );
};

const Contacts = ({ personsToShow }) => {
  return (
    <div>
      {personsToShow.map((p) => (
        <li key={p.name}>
          {p.name} ({p.number})
        </li>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    contactService.getAll().then((persons) => setPersons(persons));
  }, []);

  const AddPerson = (event) => {
    event.preventDefault();

    const newNameAlreadyExists =
      persons.find((p) => p.name === newName) !== undefined;
    if (newNameAlreadyExists) {
      alert(`${newName} is already added to phonebook`);
      setNewName("");
      setNewNumber("");
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    contactService.create(personObject).then((newPerson) => {
      setPersons(persons.concat(newPerson));
      setNewName("");
      setNewNumber("");
    });
  };

  const HandleInputChange = (event, setValue) => setValue(event.target.value);

  const personsToShow =
    filter.length > 0
      ? persons.filter((p) => {
          let personNameSliced = p.name.slice(0, filter.length);
          if (personNameSliced.toLowerCase() === filter.toLowerCase()) {
            return true;
          }
        })
      : persons;

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter
        filter={filter}
        setFilter={setFilter}
        HandleInputChange={HandleInputChange}
      />

      <h2>Add a new contact</h2>
      <ContactForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        AddPerson={AddPerson}
        HandleInputChange={HandleInputChange}
      />

      <h2>Contacts</h2>
      <Contacts personsToShow={personsToShow} />
    </div>
  );
};

export default App;
