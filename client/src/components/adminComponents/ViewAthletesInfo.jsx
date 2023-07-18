import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { CSVLink } from "react-csv";
import "../../css/admin/ViewAthletesInfo.css";

export const ViewAthletesInfo = () => {

    const [athletes, setAthletes] = useState([]);
    const token = useSelector(state => state.token);

    useEffect(() => {
        const getAthletes = async () => {
            try {
                const res = await axios.get("/athlete/allAthletesInfo", {
                    headers: { Authorization: token }
                });

                setAthletes(res.data);
            } catch (error) {
                window.location.href = "/viewAthletesInfo";
            }
        }
        getAthletes();
        // eslint-disable-next-line
    }, []);

    const headers = [
        { label: "FullName", key: "fullName" },
        { label: "YearOfBirth", key: "yob" },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phone" },
        { label: "KoeCode", key: "koeCode" }
    ];

    const csvReport = {
        filename: "athletesInfo.csv",
        headers: headers,
        data: [...athletes],

    }

    return (
        <div className="table-container">
            <CSVLink {...csvReport} enclosingCharacter={""} separator={","}><button className="export">Export to CSV</button></CSVLink>
            {
                athletes.length !== 0 ?
                    <>
                        <table className="athlete-info">
                            <tr>
                                <th>No.</th>
                                <th>Fullname</th>
                                <th>YearOfBirth</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>KoeCode</th>
                            </tr>
                            {
                                athletes.map((athlete, i) =>
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{athlete.fullName}</td>
                                        <td>{athlete.yob}</td>
                                        <td>{athlete.email}</td>
                                        <td>{athlete.phone}</td>
                                        <td>{athlete.koeCode}</td>
                                    </tr>)
                            }
                        </table>
                    </>
                    :
                    <p className="mes">You have no athletes</p>
            }
        </div>
    )
}
