"use client";

import { useReducer } from "react";

import { useRouter } from "next/router";
import InputComponent from "@/components/InputComponent";
import Navbar from "@/components/Navbar";

export default function Home() {
  const router = useRouter();
  //Create an array for input filds to make code DRY
  const inputFields = [
    { label: "First Name", type: "text", field: "firstname" },
    { label: "Last Name", type: "text", field: "lastname" },
    { label: "DOB", type: "date", field: "dob" },
    {
      label: "Gender",
      type: "select",
      field: "gender",
      options: ["male", "female"],
    },
  ];

  //Collect inputs for patients information
  const [inputInfo, setInputinfo] = useReducer(
    (prev: any, next: any) => {
      const newInputinfo = { ...prev, ...next };
      return newInputinfo;
    },
    {
      firstname: "",
      lastname: "",
      date: "",
      gender: "male",
    }
  );

  //Send patients info to our api endpoint
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { firstname, lastname, date, gender } = inputInfo;
    //Ensure input fields are not empty
    if (!firstname || !lastname || !date || !gender) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const formattedDOB = new Date(date); // Convert string to Date object
      const response = await fetch("/api/patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          date: formattedDOB,
          gender,
        }),
      });

      if (response.ok) {
        const newPatient = await response.json();
        clearFields();
        //After creating a new patient, navigate to vitals page and pass patients id
        router.push({
          pathname: "/visits",
          query: { id: newPatient.id },
        });
      } else {
        throw new Error("Failed to add patient");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const clearFields = () => {
    setInputinfo({
      firstname: "",
      lastname: "",
      date: "",
      gender: "male",
    });
  };

  return (
    <main className="flex h-screen flex-col  items-center justify-center p-6  bg-white">
      <div className=" h-max  w-full border-1 text-lg md:font-bold md:text-lg lg:text-base border-black flex flex-col items-center p-2 md:w-3/4 md:h-full lg:w-2/5 lg:h-full">
        <Navbar />

        <div className=" bg-blue-200 border-1 rounded-2xl border-blue-500 w-full text-center p-3 md:p-5 lg:p-3  text-black">
          Registration Page
        </div>
        <form
          onSubmit={handleSubmit}
          className=" flex flex-col py-4 w-full   gap-8 mt-12 sm:overflow-scroll lg:overflow-hidden md:px-3 md:mt-12 lg:mt-8 ">
          {inputFields.map((inputField, index) => (
            <div
              key={index}
              className="flex w-full gap-1 text-black  justify-between items-center">
              <label>{inputField.label}</label>
              <div className="w-40 md:w-60 lg:w-56">
                <InputComponent
                  type={inputField.type}
                  setInputinfo={setInputinfo}
                  inputInfo={inputInfo}
                  field={inputField.field}
                  options={inputField.options}
                />
              </div>
            </div>
          ))}

          <div className=" w-full flex justify-between px-6 gap-2 lg:gap-8  mt-16 md:mt-12 lg:mt-6">
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
        </form>
      </div>
    </main>
  );
}
