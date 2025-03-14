import { useState, useEffect } from "react";
import contactService from "./services/contacts";

const Filter = ({ filter, setFilter, HandleInputChange }) => {
  return (
    <div>
      Filter shown with:{" "}
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

const Contacts = ({ personsToShow, persons, setPersons }) => {
  const deleteContact = (id) => {
    if (window.confirm(`Delete ${persons.find((p) => p.id === id).name} ?`)) {
      contactService.deleteContact(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
    }
  };

  return (
    <div>
      {personsToShow.map((p) => (
        <li key={p.id}>
          {p.name} ({p.number}){"  "}
          <button onClick={() => deleteContact(p.id)}>delete</button>
        </li>
      ))}
    </div>
  );
};

const Notification = ({ message }) => {
  if (message === null) return null;

  return <div className="notification">{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    contactService.getAll().then((persons) => setPersons(persons));
  }, []);

  const AddPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    const personFound = persons.find((p) => p.name === newName);
    const newNameAlreadyExists = personFound !== undefined;

    if (newNameAlreadyExists) {
      const confirmMessage = `${newName} is already added to phonebook, replace old number with a new one?`;

      if (window.confirm(confirmMessage)) {
        contactService
          .replaceNumber(personFound.id, personObject)
          .then((personModified) => {
            setNotification(`Changed number of ${personModified.name}`);
            setTimeout(() => setNotification(null), 5000);
            setPersons(
              persons.map((p) => (p.id !== personFound.id ? p : personModified))
            );
            setNewName("");
            setNewNumber("");
          });
      }

      return;
    }

    contactService.create(personObject).then((newPerson) => {
      setNotification(`Added ${personObject.name}`);
      setTimeout(() => setNotification(null), 5000);
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
      <Notification message={notification} />
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
      <Contacts
        personsToShow={personsToShow}
        persons={persons}
        setPersons={setPersons}
      />
    </div>
  );
};

export default App;
