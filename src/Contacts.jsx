import { useState, useEffect } from "react";

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [searchName, setSearchName] = useState(''); // State for search input
    const [searchedContact, setSearchedContact] = useState(null); // State for single contact result

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch("http://localhost:3000/contacts");
                if (!response.ok) {
                    throw new Error("Failed to fetch contacts");
                }
                const data = await response.json();
                setContacts(data);
            } catch (error) {
                alert("There was an Error loading contacts " + error.message);
            }
        };
        fetchContacts();
    }, []);

    const showOneContact = async () => {
        try {
            const encodedName = encodeURIComponent(searchName);
            const response = await fetch(`http://localhost:3000/contacts/${encodedName}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contactData = await response.json();
            setSearchedContact(contactData); // Update state with the retrieved contact
        } catch (error) {
            alert("Error retrieving contact: " + error.message);
            setSearchedContact(null); // Clear previous search
        }
    };

    return (
        <div className="container">
            <h2 className="text-center mt-4">Contacts List</h2>
            
            {/* Search Input and Button */}
            <div className="mb-3">
                <input 
                    type="text" 
                    className="form-control"
                    placeholder="Enter contact name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)} 
                />
                <button className="btn btn-primary mt-2" onClick={showOneContact}>Search Contact</button>
            </div>

            {/* Display Searched Contact */}
            {searchedContact && (
                <div className="card mb-3">
                    <img
                        src={searchedContact.image_url}
                        alt={searchedContact.contact_name}
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{searchedContact.contact_name}</h5>
                        <p className="card-text">{searchedContact.phone_number}</p>
                        <p className="card-text">{searchedContact.message}</p>
                    </div>
                </div>
            )}

            {/* Display Contacts List */}
            <ul className="list-group">
                {contacts.map((contact) => (
                    <li key={contact.id} className="list-group-item d-flex align-items-center">
                        {contact.image_url && (
                            <img
                                src={contact.image_url}
                                alt={contact.contact_name}
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    marginRight: "15px",
                                    objectFit: "cover",
                                }}
                            />
                        )}
                        <div>
                            <strong>{contact.contact_name}</strong> - {contact.phone_number}
                            <p>{contact.message}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Contacts;
