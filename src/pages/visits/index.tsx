// "use client";
interface Vital {
  bmi: number;
  date: Date;
  // Add other vital fields as needed
}
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  vitals: Vital[];
}

import InputComponent from "@/components/InputComponent";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";

export default function visits() {
  const router = useRouter();
  const { id } = router.query;
  const [bmi, setBmi] = useState(0);
  const [patients, setPatients] = useState<Patient[]>();
  const [selectedPatient, setSelectedPatient] = useState("");

  console.log(id);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("/api/patient");
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          throw new Error("Failed to fetch patient data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPatients();
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPatient(event.target.value);
  };

  const inputFields = [
    { label: "Date", type: "date", field: "date" },
    { label: "Height(cm)", type: "text", field: "height" },
    { label: "Weight(kg)", type: "text", field: "weight" },
  ];

  //collect vitals input
  const [inputInfo, setInputinfo] = useReducer(
    (prev: any, next: any) => {
      const newInputinfo = { ...prev, ...next };
      return newInputinfo;
    },
    {
      date: "",
      height: "",
      weight: "",
      generalHealth: "",
      onDiet: "",
      onDrugs: "",
      comment: "",
    }
  );

  // Calculate BMI whenever height or weight changes
  useEffect(() => {
    const calculateBMI = () => {
      // Convert height to meters
      const heightInMeters = parseFloat(inputInfo.height) / 100;
      const weightInKg = parseFloat(inputInfo.weight);

      if (heightInMeters > 0 && weightInKg > 0) {
        const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
        return parseFloat(calculatedBMI.toFixed(2));
      }
      return 0;
    };

    const calculatedBMI = calculateBMI();
    setBmi(calculatedBMI);
  }, [inputInfo.height, inputInfo.weight]);

  // Send vitals information to the patients api endoint
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputInfo.date || !inputInfo.height || !inputInfo.weight) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const response = await fetch("/api/patient", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputInfo,
          bmi,
          id: id || selectedPatient,
        }),
      });

      if (response.ok) {
        clearFields();
      } else {
        throw new Error("Failed to update patients vitals");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const clearFields = () => {
    setInputinfo({
      date: "",
      height: "",
      weight: "",
      generalHealth: "",
      onDiet: "",
      onDrugs: "",
      comment: "",
    });
    setBmi(0);
  };

  return (
    <main className="flex  text-black   justify-center p-6  bg-white">
      <form
        onSubmit={handleSubmit}
        className=" flex h-3/4 lg:w-1/3 md:w-2/3 w-full flex-col border-1 border-black px-3 ">
        <Navbar />

        <div className="flex-1 flex flex-col items-center gap-4 text-lg">
          {!id && (
            <div className="w-full flex items-center justify-center">
              <select
                className=" w-1/2  lg:w-2/3 border-1"
                value={selectedPatient}
                onChange={handleSelectChange}>
                <option value="">Please select a patient</option>
                {patients?.map((patient: Patient) => (
                  <option
                    key={patient.id}
                    value={patient.id}
                    className=" w-1/4 text-base">
                    {`${patient.firstName} ${patient.lastName}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <h2 className=" text-xl lg:text-base font-bold">Vitals Section</h2>

          {inputFields.map((inputField, index) => (
            <div
              key={index}
              className="flex w-full text-black gap-1 justify-between items-center">
              <label>{inputField.label}</label>
              <div className="w-48 md:w-80 lg:w-56 ">
                <InputComponent
                  type={inputField.type}
                  setInputinfo={setInputinfo}
                  inputInfo={inputInfo}
                  field={inputField.field}
                />
              </div>
            </div>
          ))}

          <div className=" flex w-full text-black   gap-1 justify-between items-center ">
            <h2>BMI</h2>
            <div className=" w-48 md:w-80 lg:w-56 ">
              <div className="border-1 border-black w-full h-12 flex pl-3 items-center rounded-lg text-black text-base">
                {bmi}
              </div>
            </div>
          </div>
        </div>
        <div className=" flex-1 flex flex-col  items-center gap-4 text-lg mt-14   ">
          <h2 className=" text-xl font-bold lg:text-base">
            {bmi <= 25 ? "Section A" : "Section B"}
          </h2>
          <div className=" text-left w-full">
            <h2 className=" text-lg font-bold mb-3 lg:text-base">
              General Health ?
            </h2>
            <InputComponent
              type="radio"
              setInputinfo={setInputinfo}
              inputInfo={inputInfo}
              field="generalHealth"
              options={["Good", "Poor"]}
            />
          </div>

          {bmi > 25 ? (
            <div className="text-left w-full">
              <h2 className="text-lg font-bold mb-3 lg:text-base">
                Are you currently taking any drugs?
              </h2>
              <InputComponent
                type="radio"
                setInputinfo={setInputinfo}
                inputInfo={inputInfo}
                field="onDrugs"
                options={["Yes", "No"]}
              />
            </div>
          ) : (
            <div className=" text-left w-full">
              <h2 className=" text-lg font-bold mb-3 lg:text-base">
                Have you ever been on diet to loose weight?
              </h2>
              <InputComponent
                type="radio"
                setInputinfo={setInputinfo}
                inputInfo={inputInfo}
                field="onDiet"
                options={["Yes", "No"]}
              />
            </div>
          )}
          <div className=" flex w-full text-black flex-col   gap-1 justify-between  ">
            <label className="text-lg font-bold mb-3 lg:text-base">
              Comments
            </label>
            <div className=" w-full md:w-80 lg:w-full">
              <InputComponent
                type="text"
                setInputinfo={setInputinfo}
                inputInfo={inputInfo}
                field="comment"
              />
            </div>
          </div>
          <div className=" w-full flex justify-between px-6 gap-2 lg:gap-8  mt-16 md:mt-28 lg:mt-4 lg:mb-5">
            <button
              type="button"
              onClick={clearFields}
              className=" text-black bg-green-200 border-1 border-green-300 w-28 md:w-48 rounded-lg p-2 md:p-4 lg:p-2">
              Clear
            </button>
            <button
              type="submit"
              className=" text-black bg-green-200 border-1 border-green-300 w-28 md:w-48 rounded-lg p-2 md:p-4 lg:p-2">
              Save
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
