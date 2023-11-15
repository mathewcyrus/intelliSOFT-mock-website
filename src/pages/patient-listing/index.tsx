import Navbar from "@/components/Navbar";
import { GetServerSideProps } from "next";
import { useState } from "react";

interface Vital {
  bmi: number;
  date: Date;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  vitals: Vital[];
}

interface Props {
  patients: Patient[];
}

export default function PatientListing({ patients }: Props) {
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const calculateAge = (dob: string | number | Date): number => {
    const birthDate = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();

    if (
      now.getMonth() < birthDate.getMonth() ||
      (now.getMonth() === birthDate.getMonth() &&
        now.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const calculateBMIStatus = (bmi: number): string => {
    if (bmi < 18.5) {
      return "Underweight";
    } else if (bmi >= 18.5 && bmi < 25) {
      return "Normal";
    } else {
      return "Overweight";
    }
  };

  //Filter patients based on date selected
  const handleFiltering = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);

    const filteredPatients = patients.filter((patient) => {
      return (
        patient.vitals.length > 0 &&
        new Date(patient.vitals[0].date).toDateString() ===
          selectedDate.toDateString()
      );
    });

    setIsFiltering(true);
    setFilteredPatients(filteredPatients);
  };

  const displayedPatients = isFiltering ? filteredPatients : patients;

  return (
    <main className="flex h-screen text-black flex-col items-center p-6 bg-white">
      <div className=" w-full lg:w-2/3">
        <Navbar />
        <div className="h-16 rounded-2xl bg-gray-400 text-center  flex items-center font-bold justify-center w-full">
          Patient Report
        </div>
        <div className="flex justify-end w-full gap-2 items-center mt-3 font-bold">
          <p>Date</p>
          <input type="date" onChange={handleFiltering} />
        </div>

        <table className="w-full mt-6 border-collapse border border-gray-500">
          <thead>
            <tr className=" bg-lime-400 text-white">
              <th className="border border-gray-500 px-4 py-2">Full Names</th>
              <th className="border border-gray-500 px-4 py-2">Age</th>
              <th className="border border-gray-500 px-4 py-2">BMI Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedPatients.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center">
                  No patients found for this day
                </td>
              </tr>
            ) : (
              displayedPatients.map((patient, index) => (
                <tr
                  key={patient.id}
                  className={index % 2 !== 0 ? "bg-lime-200" : ""}>
                  <td className="border border-gray-500 px-4 py-2">
                    {`${patient.firstName} ${patient.lastName}`}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {calculateAge(patient.dob)}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {patient.vitals.length > 0
                      ? calculateBMIStatus(patient.vitals[0].bmi)
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    // Fetch patients data from an API endpoint
    const response = await fetch("http://localhost:3000/api/patient");
    const patients: Patient[] = await response.json();

    return {
      props: { patients },
    };
  } catch (error) {
    console.error("Error fetching patients:", error);
    return {
      props: { patients: [] },
    };
  }
};
