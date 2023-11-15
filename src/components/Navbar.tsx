import Link from "next/link";

export default function Navbar() {
  return (
    <div className=" w-full h-16 lg:h-12 border-b-1 text-black text-base font-bold border-gray-300 mb-3">
      <ul className=" flex gap-5 items-center justify-center lg:justify-end h-full pr-0 lg:pr-12">
        <Link href="/">
          <li>Register</li>
        </Link>
        <Link href="/visits">
          <li>visits</li>
        </Link>

        <Link href="/patient-listing">
          <li>patient-listing</li>
        </Link>
      </ul>
    </div>
  );
}
