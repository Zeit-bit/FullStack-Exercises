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

const Contacts = ({ personsToShow, DeleteContact }) => {
  return (
    <div>
      {personsToShow.map((p) => (
        <li key={p.id}>
          {p.name} ({p.number}){"  "}
          <button onClick={() => DeleteContact(p.id)}>delete</button>
        </li>
      ))}
    </div>
  );
};

const Notification = ({ message, IsAnError }) => {
  const classSelection = IsAnError ? "error" : "success";
  if (message === null) return null;

  return <div className={classSelection}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState([null, null]);

  // Updates the persons state to the data fetched from the server
  useEffect(() => {
    contactService.getAll().then((persons) => setPersons(persons));
  }, []);

  // Function that handles the change of state in the inputs
  const HandleInputChange = (event, setValue) => setValue(event.target.value);

  // Function that updates the persons state and makes a post to the server with the new person
  const AddPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    const personFound = persons.find((p) => p.name === newName);
    const newNameAlreadyExists = personFound !== undefined;

    // If the person already exists, it will replace the object in the server with the one with updated number
    // using the put method, and update the persons state to match
    if (newNameAlreadyExists) {
      const confirmMessage = `${newName} is already added to phonebook, replace old number with a new one?`;

      if (window.confirm(confirmMessage)) {
        contactService
          .replaceNumber(personFound.id, personObject)
          .then((personModified) => {
            setNotification([
              `Changed number of ${personModified.name}`,
              false,
            ]);
            setTimeout(() => setNotification([null, null]), 5000);
            setPersons(
              persons.map((p) => (p.id !== personFound.id ? p : personModified))
            );
            setNewName("");
            setNewNumber("");
          });
      }

      return;
    }

    // If it gets here, then it makes a post to the server with the new person
    contactService
      .create(personObject)
      .then((newPerson) => {
        setNotification([`Added ${newPerson.name}`, false]);
        setTimeout(() => setNotification([null, null]), 5000);
        setPersons(persons.concat(newPerson));
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        setNotification([error.response.data.error, true]);
        setTimeout(() => setNotification([null, null]), 5000);
        setNewName("");
        setNewNumber("");
      });
  };

  // Function that deletes the contact from the server and updates persons state to match
  const DeleteContact = (id) => {
    const personToDelete = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      contactService
        .deleteContact(id)
        .then(() => {
          setNotification([`Deleted ${personToDelete.name}`, false]);
          setTimeout(() => setNotification([null, null]), 5000);
          setPersons(persons.filter((p) => p.id !== id));
        })
        .catch(() => {
          setNotification([
            `Information of ${personToDelete.name} has already been removed from server`,
            true,
          ]);
          setTimeout(() => setNotification([null, null]), 5000);
          setPersons(persons.filter((p) => p.id !== id));
        });
    }
  };

  // Creates a copy of the persons state but filtering it based on importance
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
      <Notification message={notification[0]} IsAnError={notification[1]} />
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
      <Contacts personsToShow={personsToShow} DeleteContact={DeleteContact} />
    </div>
  );
};

export default App;
