import { useState } from 'react';
import "../../css/admin/Button.css";

export const Button = () => {
    const [active, setActive] = useState(true);

    const handleClick = (e) => {
        setActive(false)
        e.target.disabled = active;
        setTimeout(() => {
            setActive(true);
            e.target.disabled = !active;
        }, 3000);
    }

    return (
        <button
            className={active ? "update" : "updated"}
            onClick={(e) => handleClick(e)}
            disabled={!active}
        >
            {active ? "Update" : "Updated!"}
        </button>
    )
}
