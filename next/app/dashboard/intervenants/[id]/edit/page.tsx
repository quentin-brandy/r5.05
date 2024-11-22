import React from 'react';

const EditIntervenant: React.FC = () => {
    return (
        <div>
            <h1>Edit Intervenant</h1>
            <form>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" />
                </div>
                <div>
                    <label htmlFor="phone">Phone:</label>
                    <input type="tel" id="phone" name="phone" />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditIntervenant;