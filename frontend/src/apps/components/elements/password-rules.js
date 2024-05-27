import React, { Fragment } from "react";

const PasswordRule = () => {
    return (
        <Fragment>
            <ul className="text-priamry  bg-light mt-0 m-4 pt-3 p-4 ps-5 pb-2 rounded password-rule">
                <li className="pb-2">At least 8 characters long but 14 or more is better.</li>
                <li className="pb-2">A combination of uppercase letters, lowercase letters, numbers, and symbols.</li>
                <li className="pb-2">Not a word that can be found in a dictionary or the name of a person, character, product, or organization.</li>
                <li className="pb-2">Significantly different from your previous passwords.</li>
                <li className="pb-2">Easy for you to remember but difficult for others to guess like "P@$$w0rd".</li>
            </ul>
        </Fragment>
    )
}

export default PasswordRule;